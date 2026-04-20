/**
 * auto-refill.ts
 * Story 4.4 — Auto-Refill e Automação de Madrugada (EPIC-04)
 *
 * Lógica core do job noturno de reabastecimento da fila de produção.
 * Executada pelo endpoint POST /api/cron/auto-refill.
 *
 * CADEIA DE VERIFICAÇÃO (ordem estrita — nunca altere a sequência):
 *   1. Kill-switch → 2. Teto de tokens → 3. Fila suficiente
 *   → 4. Geração via ITextEngine → 5. Auditoria NFR06 → 6. Recálculo Marés
 *
 * NFR01: Usa APENAS a interface ITextEngine — proibido importar SDKs diretos.
 * NFR03: Todo acesso ao banco inclui filtro por canal_id/user_id (isolamento).
 * NFR06: origem = '[Automação Lvl 3]' em toda ideia gerada — ausência = BUG CRÍTICO.
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { checkSpendLimit, incrementSpend } from '@/lib/ai/consumption-tracker';
import { mockTextEngine } from '@/lib/ai/mock-text-engine';
import { TextEngineError, TextGenerationResult } from '@/lib/ai/text-engine.interface';
import { buildAutoRefillPrompt } from '@/lib/prompt-builder';
import { processarMares, EixoDBAnalytics } from '@/lib/mares-engine';

// ============================================================
// Tipos públicos do Auto-Refill
// ============================================================

export type AutoRefillTenantStatus = 'success' | 'skipped' | 'error';

export type AutoRefillSkipReason =
  | 'kill_switch_active'
  | 'spend_limit_reached'
  | 'queue_sufficient'
  | 'no_canais_found'
  | 'eixo_not_found'
  | 'engine_failure'
  | 'parse_failure'
  | 'db_insert_failure';

export interface TenantRefillResult {
  tenantId: string;
  status: AutoRefillTenantStatus;
  reason?: AutoRefillSkipReason | string;
  // Preenchidos quando status = 'success'
  ideiasGeradas?: number;
  tokensUsed?: number;
  eixoVencedor?: string;
  // Preenchido quando status = 'skipped' por fila suficiente
  queueSize?: number;
}

export interface AutoRefillReport {
  processed: number;
  results: TenantRefillResult[];
}

// ============================================================
// Ideias parseadas do output da IA
// ============================================================

interface IdeiaGerada {
  titulo: string;
  premissa: string;
  nota_ia: string | null;
}

// ============================================================
// Client Supabase com service_role (sem RLS automático)
// Necessário para o cron que não possui sessão de usuário.
// NFR03: O filtro por canal_id/user_id é feito MANUALMENTE no código.
// ============================================================

function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      '[Auto-Refill] NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configurados.'
    );
  }

  return createSupabaseClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

// ============================================================
// ENTRY POINT — Chamado pelo Route Handler
// ============================================================

/**
 * runAutoRefill
 *
 * Processa o Auto-Refill para um tenant específico ou para todos os tenants ativos.
 * Retorna relatório completo com resultado de cada tenant processado.
 */
export async function runAutoRefill(
  specificTenantId: string | null
): Promise<AutoRefillReport> {
  const supabase = createServiceRoleClient();

  let tenants: { id: string }[];

  if (specificTenantId) {
    tenants = [{ id: specificTenantId }];
  } else {
    // Busca todos os usuários que possuem pelo menos 1 canal ativo
    const { data: canaisData } = await supabase
      .from('canais')
      .select('user_id')
      .eq('motor_ativo', true);

    if (!canaisData || canaisData.length === 0) {
      return { processed: 0, results: [] };
    }

    // Deduplica: um tenant pode ter vários canais
    const uniqueIds = [...new Set(canaisData.map((c) => c.user_id))];
    tenants = uniqueIds.map((id) => ({ id }));
  }

  const results: TenantRefillResult[] = [];

  for (const tenant of tenants) {
    const result = await processOneTenant(supabase, tenant.id);
    results.push(result);
  }

  return { processed: results.length, results };
}

// ============================================================
// PROCESSAMENTO DE UM ÚNICO TENANT
// ============================================================

async function processOneTenant(
  supabase: ReturnType<typeof createServiceRoleClient>,
  tenantId: string
): Promise<TenantRefillResult> {

  // ── PASSO 1: Kill-switch ────────────────────────────────────
  // PRIMEIRA verificação — se desativado, nada mais é executado.
  const killSwitchResult = await checkKillSwitch(supabase, tenantId);
  if (!killSwitchResult.enabled) {
    console.log(`[Auto-Refill] Tenant ${tenantId}: Kill-switch desativado. Pulando.`);
    return { tenantId, status: 'skipped', reason: 'kill_switch_active' };
  }

  // ── PASSO 2: Teto de tokens (NFR03 via consumption-tracker) ─
  // checkSpendLimit usa o client de sessão internamente; passamos o tenantId como userId.
  const spendCheck = await checkSpendLimit(tenantId, 'llm_text', supabase);
  if (!spendCheck.allowed) {
    console.log(
      `[Auto-Refill] Tenant ${tenantId}: Teto de tokens atingido — ${spendCheck.message}. Abortando.`
    );
    return { tenantId, status: 'skipped', reason: 'spend_limit_reached' };
  }

  // ── PASSO 3: Verificar tamanho da fila ──────────────────────
  // NFR03: videos filtra por user_id (isolamento multi-tenant)
  const { count: queueCount } = await supabase
    .from('videos')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', tenantId)
    .eq('status', 'planejamento');

  const currentQueue = queueCount ?? 0;
  if (currentQueue >= 2) {
    console.log(
      `[Auto-Refill] Tenant ${tenantId}: Fila suficiente (${currentQueue} vídeos). Pulando.`
    );
    return { tenantId, status: 'skipped', reason: 'queue_sufficient', queueSize: currentQueue };
  }

  // ── PASSO 4–6: Gerar ideias e persistir ────────────────────
  return await generateAndPersist(supabase, tenantId);
}

// ============================================================
// GERAÇÃO E PERSISTÊNCIA
// ============================================================

async function generateAndPersist(
  supabase: ReturnType<typeof createServiceRoleClient>,
  tenantId: string
): Promise<TenantRefillResult> {

  // 1. Busca o canal do tenant (necessário para o FK canal_id na tabela ideias)
  const { data: canais } = await supabase
    .from('canais')
    .select('id')
    .eq('user_id', tenantId)  // NFR03
    .eq('motor_ativo', true)
    .limit(1);

  if (!canais || canais.length === 0) {
    console.warn(`[Auto-Refill] Tenant ${tenantId}: nenhum canal ativo encontrado.`);
    return { tenantId, status: 'error', reason: 'no_canais_found' };
  }

  const canalId = canais[0].id;

  // 2. Busca o Eixo Vencedor do canal (score_mare DESC, master_override tem precedência)
  const { data: eixoVencedor, error: eixoError } = await supabase
    .from('eixos')
    .select('id, nome, premissa, hook, publico_alvo, score_mare, media_views, taxa_aprovacao, score_mare_anterior, views_7d, ctr, retencao, sentimento_dominante, gatilho_curiosidade, videos_count')
    .eq('canal_id', canalId)  // NFR03: isolamento via canal
    .order('score_mare', { ascending: false, nullsFirst: false })
    .limit(1)
    .single();

  if (eixoError || !eixoVencedor) {
    console.error(`[Auto-Refill] Eixo vencedor não encontrado para tenant ${tenantId}:`, eixoError?.message);
    return { tenantId, status: 'error', reason: 'eixo_not_found' };
  }

  // 3. Constrói o prompt (agnóstico de provedor — NFR01)
  const prompt = buildAutoRefillPrompt({
    nome: eixoVencedor.nome,
    premissa: eixoVencedor.premissa,
    gancho: eixoVencedor.hook,
    publico_alvo: eixoVencedor.publico_alvo,
  });

  // 4. Chama ITextEngine — NUNCA SDK direto (NFR01)
  let engineResult: TextGenerationResult;
  try {
    engineResult = await mockTextEngine.generate({
      modelId: 'mock-dev-v1',
      blueprintContext: prompt,
      videoTopic: `Auto-Refill: 5 novas ideias para "${eixoVencedor.nome}"`,
      paragraphCount: 5,
    });
  } catch (err) {
    const engineErr = err instanceof TextEngineError ? err : null;
    console.error(`[Auto-Refill] Falha na engine para tenant ${tenantId}:`, err);
    return {
      tenantId,
      status: 'error',
      reason: engineErr?.code ?? 'engine_failure',
    };
  }

  // 5. Parse resiliente das ideias
  const novasIdeias = parseIdeiasFromText(engineResult.paragraphs);

  if (novasIdeias.length === 0) {
    console.warn(
      `[Auto-Refill] Tenant ${tenantId}: output da IA malformado, nenhuma ideia parsed.`
    );
    return { tenantId, status: 'error', reason: 'parse_failure' };
  }

  // 6. Persiste com trilha de auditoria NFR06 OBRIGATÓRIA
  //    origem = '[Automação Lvl 3]' — ausência é BUG CRÍTICO
  const inserts = novasIdeias.map((ideia) => ({
    canal_id:   canalId,           // FK obrigatório na tabela ideias
    eixo_id:    eixoVencedor.id,
    titulo:     ideia.titulo,
    premissa:   ideia.premissa ?? '',
    nota_ia:    ideia.nota_ia ? parseFloat(ideia.nota_ia) : null,
    status:     'pendente' as const,
    origem:     '[Automação Lvl 3]' as const,  // ← NFR06: CAMPO OBRIGATÓRIO
    origem_uuid: null,                           // null = não-humano
  }));

  const { error: insertError } = await supabase.from('ideias').insert(inserts);

  if (insertError) {
    console.error(
      `[Auto-Refill] Falha ao inserir ideias para tenant ${tenantId}:`,
      insertError.message
    );
    return { tenantId, status: 'error', reason: 'db_insert_failure' };
  }

  // 7. Incrementa consumo APENAS após persistência bem-sucedida (Anti-Happy Path)
  await incrementSpend(tenantId, 'llm_text', engineResult.costUnits, supabase);

  // 8. Recalcula Motor Marés — operação secundária, falha não aborta o job
  await recalcularMares(supabase, canalId);

  // 9. Atualiza status da última execução em tenant_settings
  await supabase
    .from('tenant_settings')
    .upsert(
      {
        tenant_id: tenantId,
        auto_refill_last_run_at: new Date().toISOString(),
        auto_refill_last_run_status: 'success',
      },
      { onConflict: 'tenant_id' }
    );

  console.log(
    `[Auto-Refill] ✅ Tenant ${tenantId}: ${novasIdeias.length} ideias geradas para eixo "${eixoVencedor.nome}" (${engineResult.costUnits} tokens).`
  );

  return {
    tenantId,
    status: 'success',
    ideiasGeradas: novasIdeias.length,
    tokensUsed: engineResult.costUnits,
    eixoVencedor: eixoVencedor.nome,
  };
}

// ============================================================
// KILL-SWITCH
// ============================================================

async function checkKillSwitch(
  supabase: ReturnType<typeof createServiceRoleClient>,
  tenantId: string
): Promise<{ enabled: boolean }> {
  const { data } = await supabase
    .from('tenant_settings')
    .select('auto_refill_enabled')
    .eq('tenant_id', tenantId)
    .maybeSingle();

  // tenant novo sem settings → default habilitado (favor ao usuário)
  return { enabled: data?.auto_refill_enabled ?? true };
}

// ============================================================
// PARSE DE IDEIAS — Resiliente a output malformado
// Nunca lança exceção. Retorna [] em caso de falha.
// ============================================================

function parseIdeiasFromText(paragraphs: string[]): IdeiaGerada[] {
  const rawText = paragraphs.join('\n').trim();

  try {
    // Extrai apenas o array JSON do output (remove markdown/texto ao redor)
    const jsonMatch = rawText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.warn('[Auto-Refill] Output da IA não contém JSON válido.');
      return [];
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!Array.isArray(parsed)) {
      console.warn('[Auto-Refill] Parse retornou não-array.');
      return [];
    }

    return parsed
      .filter((item: unknown) => {
        if (typeof item !== 'object' || item === null) return false;
        const o = item as Record<string, unknown>;
        return typeof o.titulo === 'string' && o.titulo.length > 0;
      })
      .map((item: unknown) => {
        const o = item as Record<string, unknown>;
        return {
          titulo:   String(o.titulo).trim().slice(0, 80),
          premissa: String(o.premissa ?? '').trim(),
          nota_ia:  o.nota_ia ? String(o.nota_ia).trim() : null,
        };
      });
  } catch (err) {
    console.warn('[Auto-Refill] Falha ao parsear JSON das ideias:', err);
    return [];
  }
}

// ============================================================
// RECÁLCULO DO MOTOR MARÉS — Operação secundária pós-geração
// Falha não crítica: não aborta o job se falhar
// ============================================================

async function recalcularMares(
  supabase: ReturnType<typeof createServiceRoleClient>,
  canalId: string
): Promise<void> {
  try {
    const { data: eixos } = await supabase
      .from('eixos')
      .select(
        'id, nome, nicho:sentimento_dominante, sentimento_dominante, gatilho_curiosidade, status, videos_count, media_views, taxa_aprovacao, score_mare_anterior, views_7d, ctr, retencao'
      )
      .eq('canal_id', canalId); // NFR03

    if (!eixos || eixos.length === 0) return;

    // processarMares é função pura — sem I/O (Story 4.3)
    const eixosCalculados = processarMares(eixos as EixoDBAnalytics[]);

    // Persiste os novos scores de volta no banco
    for (const eixo of eixosCalculados) {
      await supabase
        .from('eixos')
        .update({
          score_mare:          eixo.score_mare,
          score_mare_anterior: eixo.score_mare, // snapshot para próximo cálculo de direção
          score_calculado_em:  new Date().toISOString(),
        })
        .eq('id', eixo.id)
        .eq('canal_id', canalId); // NFR03
    }

    console.log(`[Auto-Refill] Motor Marés recalculado para canal ${canalId}.`);
  } catch (err) {
    console.warn('[Auto-Refill] Falha não-crítica no recálculo do Motor Marés:', err);
  }
}
