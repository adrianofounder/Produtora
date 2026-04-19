'use server';

/**
 * consumption-tracker.ts
 * Story 3.1 — Cofre de Credenciais e Limites (EPIC-03)
 *
 * Utilitário para rastrear consumo de IA por Tenant (usuário).
 * Usa a métrica de "Unidades Genéricas" para permitir comparação entre
 * diferentes provedores com modelos de cobrança heterogêneos.
 *
 * ⚠️ DÍVIDA TÉCNICA (TD-01):
 * No futuro (EPIC Billing), este tracker deve ser expandido para:
 * - Gravar em tabela `usage_events` com tokens reais por modelo
 * - Consultar `provider_pricing_catalog` para calcular R$ real por usuário
 * - Suportar exportação para BigQuery via Vertex AI Usage Export
 * Referência: https://ai.google.dev/pricing
 */

import { createClient } from '@/lib/supabase/server';

// ============================================================
// Tabela de Pesos por Tipo de Operação
// Permite gestão de teto unificada entre provedores.
// ⚠️ TD-01: No EPIC Billing, remover esta tabela e usar pricing real.
// ============================================================
export const UNIT_WEIGHTS = {
  // 1 token LLM = 1 unidade (simplificado)
  llm_text: (tokens: number) => tokens,

  // 1.000 caracteres TTS = 2.000 unidades (TTS custa ~2x mais por volume)
  tts_audio: (characters: number) => characters * 2,

  // Geração de imagem = 5.000 unidades fixas por chamada
  image_gen: (_: number) => 5000,
} as const;

export type ProviderType = keyof typeof UNIT_WEIGHTS;

// ============================================================
// Verificar se o usuário ainda tem saldo disponível
// Retorna false se o teto estiver ativo E tiver sido atingido.
// ============================================================
export async function checkSpendLimit(
  userId: string,
  providerType: ProviderType
): Promise<{ allowed: boolean; remaining: number; message?: string }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('tenant_credentials')
    .select('is_limit_active, max_daily_limit, daily_spend_count, last_reset_at')
    .eq('user_id', userId)
    .eq('provider_type', providerType)
    .single();

  if (error || !data) {
    // Sem credencial cadastrada: bloquear por segurança
    return { allowed: false, remaining: 0, message: 'Credencial de IA não configurada.' };
  }

  // Se o teto estiver desativado, permite sempre
  if (!data.is_limit_active) {
    return { allowed: true, remaining: Infinity };
  }

  const maxLimit = data.max_daily_limit ?? 50000;
  const currentSpend = data.daily_spend_count ?? 0;

  // Verificar se o ciclo diário precisa ser resetado
  const lastReset = data.last_reset_at ? new Date(data.last_reset_at) : new Date(0);
  const now = new Date();
  const isNewDay =
    lastReset.toISOString().split('T')[0] !== now.toISOString().split('T')[0];

  if (isNewDay) {
    // Reset do contador diário (novo dia)
    await supabase
      .from('tenant_credentials')
      .update({ daily_spend_count: 0, last_reset_at: now.toISOString() })
      .eq('user_id', userId)
      .eq('provider_type', providerType);

    return { allowed: true, remaining: maxLimit };
  }

  const remaining = maxLimit - currentSpend;

  if (remaining <= 0) {
    return {
      allowed: false,
      remaining: 0,
      message: `Teto diário de ${maxLimit.toLocaleString()} unidades atingido. Aguarde o próximo ciclo ou aumente o limite em Configurações.`,
    };
  }

  return { allowed: true, remaining };
}

// ============================================================
// Incrementar o contador após uma operação bem-sucedida
// Deve ser chamado DEPOIS que a IA responder com sucesso.
// ============================================================
export async function incrementSpend(
  userId: string,
  providerType: ProviderType,
  unitsUsed: number
): Promise<void> {
  const supabase = await createClient();

  // Incremento manual: buscar valor atual + somar (evita dependência de RPC não tipado)
  // ⚠️ TD-01: Substituir por RPC atômico 'increment_tenant_spend' no EPIC Billing
  const { data: current } = await supabase
    .from('tenant_credentials')
    .select('daily_spend_count')
    .eq('user_id', userId)
    .eq('provider_type', providerType)
    .single();

  if (!current) return;

  const newCount = (current.daily_spend_count ?? 0) + unitsUsed;

  const { error } = await supabase
    .from('tenant_credentials')
    .update({ daily_spend_count: newCount })
    .eq('user_id', userId)
    .eq('provider_type', providerType);

  if (error) {
    console.error('[consumption-tracker] Falha ao incrementar spend:', error.message);
  }
}

// ============================================================
// Calcular unidades para uma chamada antes de executar
// Retorna 0 se o cálculo não for possível.
// ============================================================
export function calculateUnits(
  providerType: ProviderType,
  measure: number // tokens para LLM, caracteres para TTS, 1 para image
): number {
  const calculator = UNIT_WEIGHTS[providerType];
  if (!calculator) return 0;
  return calculator(measure);
}
