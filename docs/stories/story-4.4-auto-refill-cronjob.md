---
executor: "@dev + @devops"
quality_gate: "@architect"
quality_gate_tools: [security_scan, audit_trail_validation, token_limit_check, integration_test, rls_validation]
epic: "EPIC-04"
story: "4.4"
sprint: 9
depends_on: ["story-4.3", "story-3.1", "story-3.2"]
estimated_hours: 8
---

# Story 4.4 — Auto-Refill e Automação de Madrugada (Cronjob)

## 📖 User Story

**Como** Maestro (usuário da plataforma),
**Quero** que minha fila de produção seja reabastecida automaticamente de madrugada quando estiver vazia,
**Para que** eu acorde com novas ideias prontas para produção sem precisar acionar o Laboratório manualmente — mas com total controle de custo e um botão de emergência para pausar o sistema quando necessário.

---

## 🔍 Objetivo

Criar o endpoint seguro `POST /api/cron/auto-refill`, acionável por um scheduler externo (Vercel Cron Jobs ou Supabase Edge Functions). O job executa uma **cadeia de verificações em ordem estrita** antes de qualquer geração:

1. **Kill-switch** → Se desativado pelo usuário em `/configuracoes`, aborta.
2. **Teto de tokens** → Chama `checkSpendLimit()` do `consumption-tracker.ts`. Se esgotado, aborta com HTTP 200 e log informativo (nunca 4xx/5xx).
3. **Fila suficiente** → Se `COUNT(videos WHERE status = 'planejamento') >= 2`, aborta.
4. **Geração** → Chama `mockTextEngine.generate()` (via interface `ITextEngine`) com prompt estruturado do Eixo Vencedor.
5. **Auditoria** → Persiste ideias com `origem = '[Automação Lvl 3]'` e `origem_uuid = null` (NFR06 obrigatório).
6. **Recálculo** → Dispara `calcularScoreMare()` do Motor Marés (Story 4.3) para atualizar analytics.

---

## 🏗️ Contexto do Sistema Existente

### Contratos de Código Já Implementados (LEIA ANTES DE CODAR)

#### `ITextEngine` — Interface agnóstica de geração
**Arquivo:** `src/lib/ai/text-engine.interface.ts`

```ts
// Contrato de entrada
interface TextGenerationOptions {
  modelId: string;         // ex: 'mock-dev-v1'
  blueprintContext: string; // Contexto do canal/eixo
  videoTopic: string;       // Tema/título a gerar
  paragraphCount?: number;  // Nº de parágrafos (default: 5)
}

// Contrato de saída
interface TextGenerationResult {
  paragraphs: string[];  // Conteúdo gerado
  costUnits: number;     // Unidades genéricas consumidas (para tracker)
  providerId: string;    // ID do provedor executado
}

// Erros tipados (NUNCA throw genérico)
type TextEngineErrorCode =
  | 'SPEND_LIMIT_REACHED'
  | 'CREDENTIAL_NOT_FOUND'
  | 'PROVIDER_UNAVAILABLE'
  | 'INVALID_RESPONSE'
  | 'UNKNOWN';
```

**Implementação disponível em dev:** `mockTextEngine` → `src/lib/ai/mock-text-engine.ts`

> ⚠️ **NFR01 CRÍTICO:** O endpoint importa `mockTextEngine` (ou futuro `textEngineFactory`) — **NUNCA** importa `openai`, `@anthropic-ai/sdk` ou qualquer SDK de LLM diretamente.

---

#### `consumption-tracker.ts` — Teto de Gastos
**Arquivo:** `src/lib/ai/consumption-tracker.ts`

Funções disponíveis:

```ts
// Verificar limite ANTES de gerar (retorna { allowed: boolean, remaining: number })
checkSpendLimit(userId: string, providerType: ProviderType): Promise<{ allowed: boolean; remaining: number; message?: string }>

// Incrementar APÓS sucesso confirmado da IA
incrementSpend(userId: string, providerType: ProviderType, unitsUsed: number): Promise<void>

// Tipos de provedor
type ProviderType = 'llm_text' | 'tts_audio' | 'image_gen'
```

Tabela consultada: `tenant_credentials` (campos: `is_limit_active`, `max_daily_limit`, `daily_spend_count`, `last_reset_at`)

---

#### `mares-engine.ts` — Motor Marés (Story 4.3)
**Arquivo a ser criado nesta story ou já em:** `src/lib/mares-engine.ts`

Função esperada:
```ts
// Pura (sem I/O). Recalcula scores e retorna os eixos com score_mare atualizado.
calcularScoreMare(eixos: Eixo[]): Eixo[]
```

O Auto-Refill deve chamar esta função APÓS inserir as novas ideias e persistir os scores no banco.

---

#### Padrão de Server Action (referência: `gaveta-actions.ts`)

O fluxo padrão Anti-Happy-Path já estabelecido no projeto:
```ts
// 1. Auth guard
// 2. checkSpendLimit → retorna se não permitido (sem throw)
// 3. Chama engine
// 4. incrementSpend SOMENTE após sucesso
// 5. Persiste dados
// 6. Retorna resultado tipado (union discriminada)
```

---

## ✅ Critérios de Aceitação

### AC1 — Endpoint criado, seguro e documentado

**Rota:** `POST /api/cron/auto-refill`

Segurança via Bearer Token no header `Authorization`:

```ts
// src/app/api/cron/auto-refill/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // 1. Valida CRON_SECRET — PRIMEIRA instrução, antes de qualquer lógica
  const authHeader = req.headers.get('Authorization');
  const expectedToken = `Bearer ${process.env.CRON_SECRET}`;

  if (!authHeader || authHeader !== expectedToken) {
    return NextResponse.json(
      { error: 'Unauthorized — token inválido ou ausente' },
      { status: 401 }
    );
  }

  // 2. Lê tenant_id opcional do body (modo single-tenant ou multi-tenant)
  const body = await req.json().catch(() => ({}));
  const tenantId: string | null = body.tenant_id ?? null;

  // 3. Delega para a lógica core (testável de forma isolada)
  const result = await runAutoRefill(tenantId);

  return NextResponse.json(result, { status: 200 });
}
```

Regras:
- `CRON_SECRET` é uma variável de ambiente **exclusivamente server-side** — nunca exposta no client (sem prefixo `NEXT_PUBLIC_`).
- Valor gerado via `openssl rand -base64 32` — **nunca commitar o valor real**, apenas o placeholder em `.env.example`.
- Retorna sempre HTTP 200 para aborts por kill-switch, teto esgotado ou fila suficiente (evitar alarmes falsos na infra).
- Retorna HTTP 401 apenas para token inválido/ausente.
- Retorna HTTP 500 apenas para erros de sistema não esperados.

---

### AC2 — Kill-switch verificado como PRIMEIRA instrução da lógica core

```ts
// src/lib/auto-refill.ts

export async function runAutoRefill(
  specificTenantId: string | null
): Promise<AutoRefillReport> {
  const supabase = createServiceClient(); // service_role, sem RLS para leitura de settings

  // Busca tenants ativos (ou usa o específico se fornecido)
  const tenants = specificTenantId
    ? [{ id: specificTenantId }]
    : await getActiveTenants(supabase);

  const reports: TenantRefillResult[] = [];

  for (const tenant of tenants) {
    const tenantResult = await processOneTenant(supabase, tenant.id);
    reports.push(tenantResult);
  }

  return { processed: reports.length, results: reports };
}

async function processOneTenant(supabase: any, tenantId: string): Promise<TenantRefillResult> {
  // ── PASSO 1: Kill-switch ────────────────────────────────────────────
  const settings = await getTenantAutoRefillSettings(supabase, tenantId);

  if (!settings.auto_refill_enabled) {
    console.log(`[Auto-Refill] Tenant ${tenantId}: Kill-switch ativo. Pulando.`);
    return { tenantId, status: 'skipped', reason: 'kill_switch_active' };
  }

  // ── PASSO 2: Teto de tokens ─────────────────────────────────────────
  const spendCheck = await checkSpendLimit(tenantId, 'llm_text');

  if (!spendCheck.allowed) {
    console.log(`[Auto-Refill] Tenant ${tenantId}: ${spendCheck.message}. Abortando.`);
    return { tenantId, status: 'skipped', reason: 'spend_limit_reached' };
  }

  // ── PASSO 3: Verificar fila ─────────────────────────────────────────
  const { count } = await supabase
    .from('videos')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', tenantId)      // NFR03: isolamento obrigatório
    .eq('status', 'planejamento');

  if ((count ?? 0) >= 2) {
    console.log(`[Auto-Refill] Tenant ${tenantId}: Fila suficiente (${count} vídeos). Pulando.`);
    return { tenantId, status: 'skipped', reason: 'queue_sufficient', queueSize: count };
  }

  // ── PASSO 4: Geração via ITextEngine ───────────────────────────────
  return await generateAndPersist(supabase, tenantId);
}
```

---

### AC3 — `tenant_settings` — Migração SQL e leitura do kill-switch

**Arquivo:** `supabase/migrations/YYYYMMDD_add_auto_refill_settings.sql`

```sql
-- Adiciona coluna de configuração do Auto-Refill na tabela existente (se houver)
-- OU cria a tabela tenant_settings se ainda não existir.

-- Opção A: Se já existe tenant_settings
ALTER TABLE public.tenant_settings
  ADD COLUMN IF NOT EXISTS auto_refill_enabled BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS auto_refill_last_run_at TIMESTAMPTZ NULL,
  ADD COLUMN IF NOT EXISTS auto_refill_last_run_status TEXT NULL; -- 'success' | 'skipped' | 'error'

-- Opção B: Criar do zero (use a que se aplica ao schema atual)
CREATE TABLE IF NOT EXISTS public.tenant_settings (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  auto_refill_enabled         BOOLEAN NOT NULL DEFAULT true,
  auto_refill_last_run_at     TIMESTAMPTZ NULL,
  auto_refill_last_run_status TEXT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id)
);

ALTER TABLE public.tenant_settings ENABLE ROW LEVEL SECURITY;

-- RLS: cada tenant vê apenas suas próprias configurações
CREATE POLICY "tenant_settings_owner_only"
  ON public.tenant_settings
  FOR ALL
  USING (auth.uid() = tenant_id);

-- Trigger de updated_at
CREATE OR REPLACE FUNCTION update_tenant_settings_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_tenant_settings_updated_at
  BEFORE UPDATE ON public.tenant_settings
  FOR EACH ROW EXECUTE FUNCTION update_tenant_settings_updated_at();
```

> **Nota para @dev:** Verifique se `tenant_settings` já existe no schema (`supabase/migrations/`) antes de escolher Opção A ou B. Nunca criar tabela duplicada.

Leitura do setting:

```ts
async function getTenantAutoRefillSettings(supabase: any, tenantId: string) {
  const { data } = await supabase
    .from('tenant_settings')
    .select('auto_refill_enabled')
    .eq('tenant_id', tenantId)
    .maybeSingle();

  // Se não há settings (tenant novo), default = enabled (Favor do usuário)
  return { auto_refill_enabled: data?.auto_refill_enabled ?? true };
}
```

---

### AC4 — Geração via `ITextEngine` com prompt estruturado (NFR01)

```ts
// src/lib/auto-refill.ts

async function generateAndPersist(supabase: any, tenantId: string): Promise<TenantRefillResult> {
  // 1. Busca o Eixo Vencedor (maior score_mare, com Master Override respeitado)
  const { data: eixoVencedor, error: eixoError } = await supabase
    .from('eixos')
    .select('id, nome, premissa, gancho, publico_alvo, score_mare, master_override')
    .eq('tenant_id', tenantId)        // NFR03 obrigatório
    .order('master_override', { ascending: false }) // Override manual tem precedência
    .order('score_mare', { ascending: false })
    .limit(1)
    .single();

  if (eixoError || !eixoVencedor) {
    console.error(`[Auto-Refill] Eixo vencedor não encontrado para tenant ${tenantId}:`, eixoError);
    return { tenantId, status: 'error', reason: 'eixo_not_found' };
  }

  // 2. Constrói prompt agnóstico
  const prompt = buildAutoRefillPrompt(eixoVencedor);

  // 3. Chama ITextEngine (NUNCA SDK direto — NFR01)
  let engineResult: TextGenerationResult;
  try {
    engineResult = await mockTextEngine.generate({
      modelId: 'mock-dev-v1',
      blueprintContext: prompt,
      videoTopic: `Auto-Refill: 5 novas ideias para o eixo "${eixoVencedor.nome}"`,
      paragraphCount: 5,
    });
  } catch (err) {
    const engineErr = err instanceof TextEngineError ? err : null;
    console.error(`[Auto-Refill] Falha na geração para tenant ${tenantId}:`, err);
    return {
      tenantId,
      status: 'error',
      reason: engineErr?.code ?? 'engine_failure',
    };
  }

  // 4. Parse das 5 ideias do output
  const novasIdeias = parseIdeiasFromText(engineResult.paragraphs);

  if (novasIdeias.length === 0) {
    console.warn(`[Auto-Refill] Tenant ${tenantId}: output da IA malformado. Nenhuma ideia persistida.`);
    return { tenantId, status: 'error', reason: 'parse_failure' };
  }

  // 5. Persiste com auditoria NFR06 obrigatória
  const inserts = novasIdeias.map((ideia) => ({
    tenant_id: tenantId,
    eixo_id: eixoVencedor.id,
    titulo: ideia.titulo,
    premissa: ideia.premissa ?? '',
    nota_ia: ideia.nota_ia ?? null,
    status: 'pendente',
    origem: '[Automação Lvl 3]',  // ← NFR06: CAMPO OBRIGATÓRIO — ausência = BUG CRÍTICO
    origem_uuid: null,             // null = geração não-humana
  }));

  const { error: insertError } = await supabase.from('ideias').insert(inserts);

  if (insertError) {
    console.error(`[Auto-Refill] Falha ao persistir ideias para tenant ${tenantId}:`, insertError);
    return { tenantId, status: 'error', reason: 'db_insert_failure' };
  }

  // 6. Incrementa consumo APENAS após persistência bem-sucedida
  await incrementSpend(tenantId, 'llm_text', engineResult.costUnits);

  // 7. Recalcula Motor Marés (Score atualizado ao acordar)
  await recalcularEDispararMares(supabase, tenantId);

  // 8. Atualiza status da última execução
  await supabase
    .from('tenant_settings')
    .upsert({
      tenant_id: tenantId,
      auto_refill_last_run_at: new Date().toISOString(),
      auto_refill_last_run_status: 'success',
    }, { onConflict: 'tenant_id' });

  return {
    tenantId,
    status: 'success',
    ideiasGeradas: novasIdeias.length,
    tokensUsed: engineResult.costUnits,
    eixoVencedor: eixoVencedor.nome,
  };
}
```

---

### AC5 — `buildAutoRefillPrompt()` — Prompt agnóstico e estruturado

**Arquivo:** `src/lib/prompt-builder.ts`

```ts
// src/lib/prompt-builder.ts

interface EixoVencedorData {
  nome: string;
  premissa: string;
  gancho?: string;
  publico_alvo?: string;
}

/**
 * Constrói o prompt de geração automática para o Auto-Refill.
 * Agnóstico de provedor: funciona com qualquer LLM que respeite ITextEngine.
 * Output esperado: JSON array de 5 objetos { titulo, premissa, nota_ia }
 */
export function buildAutoRefillPrompt(eixo: EixoVencedorData): string {
  return `
Você é um estrategista de conteúdo digital especializado em YouTube e vídeo curto.

Eixo Temático do Canal:
- Nome: ${eixo.nome}
- Premissa: ${eixo.premissa}
${eixo.gancho ? `- Gancho Principal: ${eixo.gancho}` : ''}
${eixo.publico_alvo ? `- Público-Alvo: ${eixo.publico_alvo}` : ''}

Tarefa: Gera exatamente 5 (cinco) novas ideias de vídeo para este eixo, no formato JSON abaixo.
Cada ideia deve ser original, provocativa e provocar curiosidade no público-alvo.

Formato de resposta OBRIGATÓRIO (array JSON, sem texto extra fora do JSON):
[
  {
    "titulo": "Título curto e impactante do vídeo (máx. 80 chars)",
    "premissa": "Descrição de 1-2 frases do conceito e abordagem",
    "nota_ia": "Justificativa em 1 frase do potencial viral/engajamento"
  }
]

IMPORTANTE: Retorne APENAS o array JSON. Sem introdução, sem conclusão, sem markdown.
`.trim();
}
```

---

### AC6 — `parseIdeiasFromText()` — Resiliente a output malformado

```ts
// src/lib/auto-refill.ts

interface IdeiaGerada {
  titulo: string;
  premissa: string;
  nota_ia: string | null;
}

/**
 * Tenta parsear o output da IA como array JSON de ideias.
 * Nunca lança exceção — retorna [] se o output for inválido.
 * O Auto-Refill trata [] como falha de parse (sem crash do job).
 */
function parseIdeiasFromText(paragraphs: string[]): IdeiaGerada[] {
  // O MockTextEngine retorna paragraphs como array de strings.
  // Juntamos e tentamos parsear como JSON.
  const rawText = paragraphs.join('\n').trim();

  try {
    // Extrai só o JSON do output (caso haja texto ao redor)
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

    // Valida e sanitiza cada ideia
    return parsed
      .filter((item: any) => typeof item?.titulo === 'string' && item.titulo.length > 0)
      .map((item: any) => ({
        titulo: String(item.titulo).trim().slice(0, 80),
        premissa: String(item.premissa ?? '').trim(),
        nota_ia: item.nota_ia ? String(item.nota_ia).trim() : null,
      }));
  } catch (err) {
    console.warn('[Auto-Refill] Falha ao parsear JSON do output da IA:', err);
    return [];
  }
}
```

---

### AC7 — Auditoria NFR06 — Trilha rastreável e obrigatória

Regras absolutas de auditoria (validadas pelo @qa em todo insert):

| Campo | Geração Automática (Auto-Refill) | Geração Humana (Manual) |
|-------|----------------------------------|-------------------------|
| `origem` | `'[Automação Lvl 3]'` | UUID do usuário autenticado |
| `origem_uuid` | `null` | UUID do usuário (`user.id`) |
| `status` | `'pendente'` | `'pendente'` |

> **Bug Crítico:** A ausência de `origem = '[Automação Lvl 3]'` em qualquer ideia gerada pelo Auto-Refill viola diretamente o NFR06 e invalida a trilha de auditoria. O @qa DEVE verificar este campo em TODA ideia inserida pelo job.

---

### AC8 — Recálculo do Motor Marés pós-geração

```ts
// src/lib/auto-refill.ts

async function recalcularEDispararMares(supabase: any, tenantId: string): Promise<void> {
  try {
    // Busca todos os eixos do tenant
    const { data: eixos } = await supabase
      .from('eixos')
      .select('id, nome, media_views, taxa_aprovacao, score_mare, score_mare_anterior')
      .eq('tenant_id', tenantId); // NFR03

    if (!eixos || eixos.length === 0) return;

    // Chama o Motor Marés (função pura — sem I/O)
    const { calcularScoreMare } = await import('./mares-engine');
    const eixosAtualizados = calcularScoreMare(eixos);

    // Persiste os novos scores no banco
    for (const eixo of eixosAtualizados) {
      await supabase
        .from('eixos')
        .update({
          score_mare: eixo.score_mare,
          score_mare_anterior: eixo.score_mare, // Snapshot para cálculo futuro de direção
          score_calculado_em: new Date().toISOString(),
        })
        .eq('id', eixo.id)
        .eq('tenant_id', tenantId); // NFR03
    }

    console.log(`[Auto-Refill] Motor Marés recalculado para tenant ${tenantId}.`);
  } catch (err) {
    // Falha no recálculo não aborta o job — é operação secundária
    console.warn('[Auto-Refill] Falha não-crítica no recálculo do Motor Marés:', err);
  }
}
```

---

### AC9 — Toggle de Kill-switch na UI de `/configuracoes`

**Arquivo:** `src/app/(dashboard)/configuracoes/page.tsx` (MODIFICAR)

Nova seção a adicionar na página de Configurações:

```tsx
{/* ════════════════════════════════════════════════════════════
    SEÇÃO: Automação de Conteúdo
    Controla o Auto-Refill noturno por tenant
    ════════════════════════════════════════════════════════════ */}
<section className="config-section" aria-labelledby="automation-section-title">
  <h2 id="automation-section-title" className="section-title">
    🤖 Automação de Conteúdo
  </h2>

  <div className="automation-card">
    <div className="automation-card__header">
      <div>
        <h3 className="automation-card__title">Auto-Refill Noturno</h3>
        <p className="automation-card__description">
          Quando a fila de produção tiver menos de 2 vídeos, o sistema gera automaticamente
          5 novas ideias do Eixo Vencedor durante a madrugada.
        </p>
      </div>

      {/* Toggle Switch de Kill-switch */}
      <AutoRefillToggle
        enabled={settings.auto_refill_enabled}
        onToggle={toggleAutoRefillAction}
      />
    </div>

    <div className="automation-card__stats">
      <span className="automation-stat">
        🕐 Última execução:{' '}
        {settings.auto_refill_last_run_at
          ? new Date(settings.auto_refill_last_run_at).toLocaleString('pt-BR')
          : 'Nunca executado'}
      </span>

      <span
        className={`automation-stat badge ${
          settings.auto_refill_last_run_status === 'success'
            ? 'badge-success'
            : settings.auto_refill_last_run_status === 'error'
            ? 'badge-error'
            : ''
        }`}
      >
        {settings.auto_refill_last_run_status === 'success' && '✅ Sucesso'}
        {settings.auto_refill_last_run_status === 'error' && '❌ Erro'}
        {settings.auto_refill_last_run_status === 'skipped' && '⏭️ Ignorado'}
        {!settings.auto_refill_last_run_status && '—'}
      </span>

      <span className="automation-stat">
        🔋 Tokens usados hoje:{' '}
        {spendData.daily_spend_count?.toLocaleString('pt-BR') ?? '0'} /{' '}
        {spendData.max_daily_limit?.toLocaleString('pt-BR') ?? '50.000'}
      </span>
    </div>
  </div>
</section>
```

**Server Action para o toggle:**

```ts
// src/app/(dashboard)/configuracoes/actions.ts (ADICIONAR)

export async function toggleAutoRefillAction(enabled: boolean) {
  'use server';
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Não autenticado' };

  const { error } = await supabase
    .from('tenant_settings')
    .upsert(
      { tenant_id: user.id, auto_refill_enabled: enabled },
      { onConflict: 'tenant_id' }
    );

  if (error) {
    console.error('[toggleAutoRefill] Erro ao atualizar:', error);
    return { success: false, error: 'Falha ao salvar configuração' };
  }

  revalidatePath('/configuracoes');
  return { success: true };
}
```

---

## 📁 Arquivos a Criar / Modificar

| Arquivo | Ação | Responsável |
|---------|------|-------------|
| `src/app/api/cron/auto-refill/route.ts` | **CRIAR** — Endpoint POST com validação de Bearer Token | @dev |
| `src/lib/auto-refill.ts` | **CRIAR** — Lógica core do job (pura, testável, isolada) | @dev |
| `src/lib/prompt-builder.ts` | **CRIAR** — `buildAutoRefillPrompt()` agnóstico | @dev |
| `src/app/(dashboard)/configuracoes/page.tsx` | **MODIFICAR** — Seção "Automação de Conteúdo" + toggle | @dev |
| `src/app/(dashboard)/configuracoes/actions.ts` | **MODIFICAR** — `toggleAutoRefillAction()` | @dev |
| `src/components/configuracoes/auto-refill-toggle.tsx` | **CRIAR** — Componente Client do toggle switch | @dev |
| `supabase/migrations/YYYYMMDD_add_auto_refill_settings.sql` | **CRIAR** — Tabela/colunas `tenant_settings` | @dev / @devops |
| `.env.example` | **MODIFICAR** — Adicionar `CRON_SECRET=openssl-rand-base64-32` | @devops |
| `vercel.json` (ou `vercel-cron.json`) | **CRIAR/MODIFICAR** — Configuração do Vercel Cron job | @devops |

---

## ⚙️ Configuração do Scheduler Externo

### Opção A — Vercel Cron Jobs (Recomendada para produção)

**Arquivo:** `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/auto-refill",
      "schedule": "0 3 * * *"
    }
  ]
}
```

> Executa todo dia às **03:00 UTC** (00:00 BRT). Requer que o Vercel chame o endpoint com o header `Authorization: Bearer {CRON_SECRET}` — configurado via Environment Variable no painel da Vercel.

### Opção B — Supabase Edge Function Scheduler (Alternativa)

Caso o projeto prefira manter tudo no Supabase:

```sql
-- Via pg_cron no Supabase (requer extensão habilitada)
SELECT cron.schedule(
  'auto-refill-noturno',
  '0 3 * * *', -- 03:00 UTC diariamente
  $$
  SELECT net.http_post(
    url := 'https://seu-dominio.vercel.app/api/cron/auto-refill',
    headers := '{"Authorization": "Bearer ' || current_setting('app.cron_secret') || '", "Content-Type": "application/json"}',
    body := '{}'
  );
  $$
);
```

---

## 🔒 Notas de Segurança Críticas

> **NFR01 — Agnosticidade Absoluta:** `auto-refill.ts` importa `mockTextEngine` (ou futuro factory). A mudança de provedor LLM no EPIC-05 exige alteração **apenas** no factory — sem tocar na lógica do Auto-Refill.

> **NFR03 — RLS em todo acesso:** Todo `SELECT`, `INSERT` ou `UPDATE` nas tabelas `eixos`, `ideias`, `videos` e `tenant_settings` **obrigatoriamente** inclui `.eq('tenant_id', tenantId)`. O cliente `service_role` utilizado no cron não tem RLS automático — o filtro no código é a única proteção.

> **NFR06 — Auditoria:** A ausência de `origem = '[Automação Lvl 3]'` é um **BUG CRÍTICO**. O @qa deve verificar via query SQL em todo resultado do job.

> **Segurança do CRON_SECRET:** Gerado com `openssl rand -base64 32`. Deve ser rotacionável sem deploy (apenas via variável de ambiente). Nunca incluído em logs.

> **Erro silencioso permitido (Anti-Happy Path):** Kill-switch ativo, teto esgotado e fila suficiente retornam HTTP 200 com `{ skipped: true }`. Um 4xx/5xx causaria retry automático pela infra e potencial loop de geração não-intencional.

---

## 🧪 Plano de QA — Cenários Obrigatórios

### Cenário 1 — Segurança do Endpoint
```bash
# DEVE retornar 401
POST /api/cron/auto-refill
# Sem header Authorization

# DEVE retornar 401
POST /api/cron/auto-refill
Authorization: Bearer token-errado

# DEVE retornar 200 (com logic de skip ou success)
POST /api/cron/auto-refill
Authorization: Bearer {CRON_SECRET correto}
```

### Cenário 2 — Kill-switch Bloqueando o Job
```sql
-- Prep: Desativar Auto-Refill para o tenant
UPDATE tenant_settings SET auto_refill_enabled = false WHERE tenant_id = '<tenant_id>';
```
```bash
# Chamar o endpoint com body { "tenant_id": "<tenant_id>" }
# ESPERADO: { "status": "skipped", "reason": "kill_switch_active" }
# VERIFICAR: Nenhuma ideia foi inserida em `ideias`
```

### Cenário 3 — Teto de Tokens Esgotado
```sql
-- Prep: Simular teto atingido
UPDATE tenant_credentials
SET daily_spend_count = max_daily_limit
WHERE user_id = '<tenant_id>' AND provider_type = 'llm_text';
```
```bash
# ESPERADO: HTTP 200 com { "status": "skipped", "reason": "spend_limit_reached" }
# VERIFICAR: Log no servidor contém mensagem informativa, não stack trace de erro
# VERIFICAR: Nenhuma ideia inserida, nenhum token debitado adicionalmente
```

### Cenário 4 — Fila Suficiente (>= 2 vídeos)
```sql
-- Prep: Garantir 3 vídeos em planejamento
INSERT INTO videos (tenant_id, status, titulo, ...) VALUES
  ('<tenant_id>', 'planejamento', 'Vídeo A', ...),
  ('<tenant_id>', 'planejamento', 'Vídeo B', ...),
  ('<tenant_id>', 'planejamento', 'Vídeo C', ...);
```
```bash
# ESPERADO: { "status": "skipped", "reason": "queue_sufficient", "queueSize": 3 }
```

### Cenário 5 — Geração bem-sucedida e auditoria NFR06
```sql
-- Prep: Fila vazia, teto com saldo, kill-switch ativo
UPDATE tenant_settings SET auto_refill_enabled = true WHERE tenant_id = '<tenant_id>';
DELETE FROM videos WHERE tenant_id = '<tenant_id>' AND status = 'planejamento';
```
```bash
# Chamar endpoint → ESPERADO: { "status": "success", "ideiasGeradas": 5 }
```
```sql
-- Verificar auditoria NFR06 (CAMPO OBRIGATÓRIO):
SELECT id, titulo, origem, origem_uuid
FROM ideias
WHERE tenant_id = '<tenant_id>'
ORDER BY created_at DESC
LIMIT 5;

-- TODOS devem ter: origem = '[Automação Lvl 3]'  E  origem_uuid IS NULL
-- Qualquer linha com origem != '[Automação Lvl 3]' = BUG CRÍTICO → bloquear PR
```

### Cenário 6 — Toggle de Kill-switch na UI funciona
1. Acessar `/configuracoes`
2. Localizar seção "Automação de Conteúdo"
3. Alternar toggle para OFF → Verificar que `tenant_settings.auto_refill_enabled = false` no banco
4. Alternar toggle para ON → Verificar que `tenant_settings.auto_refill_enabled = true`
5. Verificar que "Última execução" e status da última run são exibidos corretamente

### Cenário 7 — Isolamento Multi-Tenant NFR03
```sql
-- Criar dois tenants: Alpha e Beta
-- Auto-Refill roda para Alpha
-- Verificar que NENHUMA ideia de Alpha aparece em query filtrada para Beta:
SELECT * FROM ideias WHERE tenant_id = '<beta_id>';
-- DEVE retornar 0 linhas relacionadas ao job do Alpha
```

---

## 📋 Tipos TypeScript da Story

```ts
// src/lib/auto-refill.ts — Tipos públicos

export type AutoRefillTenantStatus =
  | 'success'
  | 'skipped'
  | 'error';

export type AutoRefillSkipReason =
  | 'kill_switch_active'
  | 'spend_limit_reached'
  | 'queue_sufficient'
  | 'eixo_not_found'
  | 'engine_failure'
  | 'parse_failure'
  | 'db_insert_failure';

export interface TenantRefillResult {
  tenantId: string;
  status: AutoRefillTenantStatus;
  reason?: AutoRefillSkipReason;
  // Campos preenchidos apenas quando status = 'success'
  ideiasGeradas?: number;
  tokensUsed?: number;
  eixoVencedor?: string;
  // Campos preenchidos quando status = 'skipped'
  queueSize?: number;
}

export interface AutoRefillReport {
  processed: number;
  results: TenantRefillResult[];
}
```

---

## ✅ Definition of Done

- [ ] `POST /api/cron/auto-refill` retorna 401 quando `Authorization` está ausente ou é incorreto
- [ ] `POST /api/cron/auto-refill` retorna 200 com `CRON_SECRET` correto
- [ ] Kill-switch `auto_refill_enabled = false` encerra job com `{ status: 'skipped', reason: 'kill_switch_active' }` — nenhuma ideia inserida
- [ ] `checkSpendLimit()` retornando `{ allowed: false }` encerra job com HTTP 200 e log informativo (sem throw, sem 4xx/5xx)
- [ ] Fila com `>= 2` vídeos em `'planejamento'` encerra job com `{ status: 'skipped', reason: 'queue_sufficient' }`
- [ ] Toda ideia gerada automaticamente tem `origem = '[Automação Lvl 3]'` e `origem_uuid = null` (verificado via SQL)
- [ ] Nenhuma ideia tem `origem` diferente de `'[Automação Lvl 3]'` quando gerada pelo Auto-Refill
- [ ] `ITextEngine` (via `mockTextEngine`) é o único ponto de chamada IA — proibido qualquer `import` de SDK direto
- [ ] `incrementSpend()` é chamado SOMENTE após persistência bem-sucedida no banco
- [ ] Motor Marés é recalculado e os novos scores são persistidos no banco após geração
- [ ] Toggle de kill-switch em `/configuracoes` persiste `auto_refill_enabled` no banco e revalidate ocorre
- [ ] "Última execução" e status são exibidos corretamente na UI de Configurações
- [ ] NFR03: Toda query SQL inclui `.eq('tenant_id', tenantId)` — verificado por @architect
- [ ] `CRON_SECRET` NÃO aparece em nenhum log de servidor ou resposta de API
- [ ] `.env.example` atualizado com placeholder de `CRON_SECRET`
- [ ] Migration SQL executada e `tenant_settings` funcional no Supabase
- [ ] @architect aprova o design de segurança em camadas do endpoint

---

## 🏁 Handoff para @dev

```
@[.agent/workflows/dev.md] implemente a story-4.4 criando o endpoint /api/cron/auto-refill com a cadeia de verificações em ordem estrita (kill-switch → teto de tokens → tamanho da fila → geração via ITextEngine → auditoria NFR06 [Automacao Lvl 3] → recálculo Motor Marés), o toggle de kill-switch em /configuracoes, e a migração SQL para tenant_settings.
```

```
@[.agent/workflows/devops.md] configure o Vercel Cron Job para chamar /api/cron/auto-refill às 03:00 UTC via vercel.json, adicione CRON_SECRET como Environment Variable segura no painel Vercel e documente o procedimento de rotação do secret.
```

---
*Story refinada por River (@sm) — Sprint 9 — EPIC-04 — 2026-04-20*
