'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// ============================================================
// Tipos agnósticos — suporta qualquer provedor de IA
// ============================================================
export interface ICredentialPayload {
  provider_type: string;    // Chave técnica: 'llm_text', 'tts_audio', 'image_gen'
  provider_name: string;    // Nome amigável: 'OpenAI GPT-4o', 'ElevenLabs'
  api_key: string;          // Vazio se is_system_fallback = true
  base_url?: string;        // Opcional: URL customizada para proxies/IA local
  model_id?: string;        // Opcional: 'gpt-4o', 'gemini-1.5-flash'
  max_daily_limit: number;  // Teto em Unidades Genéricas
  is_limit_active: boolean; // Liga/desliga a trava de segurança
  is_system_fallback: boolean; // Se true, usa chave do .env quando api_key estiver vazia
}

// ============================================================
// BUSCAR credenciais do tenant logado (mascaradas para o client)
// ============================================================
export async function getTenantCredentials() {
  const supabase = await createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();

  if (authError || !userData?.user) {
    return { error: 'Não autorizado' };
  }

  const { data, error } = await supabase
    .from('tenant_credentials')
    .select(
      'id, provider_type, provider_name, api_key, base_url, model_id, max_daily_limit, is_limit_active, is_system_fallback, daily_spend_count'
    )
    .eq('user_id', userData.user.id)
    .order('provider_name');

  if (error) {
    console.error('[actions] Erro ao buscar credenciais:', error.message);
    return { error: 'Falha ao buscar configurações.' };
  }

  // Mascarar chaves para o client: nunca expor a key real
  const maskedData = data?.map((cred) => ({
    ...cred,
    api_key: cred.api_key
      ? `sk-••••••••${cred.api_key.slice(-4)}`
      : cred.is_system_fallback
      ? '[Usando Chave do Sistema]'
      : '',
  })) ?? [];

  return { data: maskedData };
}

// ============================================================
// UPSERT — Salvar ou atualizar uma credencial de IA
// Protege contra gravação de chave mascarada no banco.
// ============================================================
export async function upsertCredential(payload: ICredentialPayload) {
  try {
    const supabase = await createClient();
    const { data: userData, error: authError } = await supabase.auth.getUser();

    if (authError || !userData?.user) {
      return { success: false, error: 'Não autorizado' };
    }

    const userId = userData.user.id;

    // Montar o registro final com tipo explícito
    type CredentialUpsert = {
      user_id: string
      provider_type: string
      provider_name: string
      base_url: string | null
      model_id: string | null
      max_daily_limit: number
      is_limit_active: boolean
      is_system_fallback: boolean
      updated_at: string
      api_key: string
    }

    // Resolver a api_key antes de montar o payload final
    const keyContainsMask = payload.api_key.includes('\u2022\u2022\u2022\u2022') || payload.api_key === '[Usando Chave do Sistema]';
    let resolvedKey: string

    if (payload.is_system_fallback && !payload.api_key) {
      resolvedKey = ''
    } else if (keyContainsMask) {
      const { data: existing } = await supabase
        .from('tenant_credentials')
        .select('api_key')
        .eq('user_id', userId)
        .eq('provider_type', payload.provider_type)
        .single();

      if (existing?.api_key) {
        resolvedKey = existing.api_key;
      } else {
        return { success: false, error: 'Nenhuma chave salva anteriormente. Digite a API Key completa.' };
      }
    } else {
      if (!payload.api_key.trim()) {
        return { success: false, error: 'API Key não pode ser vazia. Ative o Fallback do Sistema ou insira uma chave.' };
      }
      resolvedKey = payload.api_key.trim()
    }

    const upsertPayload: CredentialUpsert = {
      user_id:            userId,
      provider_type:      payload.provider_type,
      provider_name:      payload.provider_name,
      base_url:           payload.base_url || null,
      model_id:           payload.model_id || null,
      max_daily_limit:    payload.max_daily_limit,
      is_limit_active:    payload.is_limit_active,
      is_system_fallback: payload.is_system_fallback,
      updated_at:         new Date().toISOString(),
      api_key:            resolvedKey,
    }

    const { error } = await supabase
      .from('tenant_credentials')
      .upsert(upsertPayload, { onConflict: 'user_id, provider_type' });

    if (error) {
      console.error('[actions] Erro ao salvar credencial:', error.message);
      return { success: false, error: 'Falha ao salvar no banco.' };
    }

    revalidatePath('/configuracoes');
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('[actions] Catch erro upsertCredential:', message);
    return { success: false, error: message };
  }
}

// ============================================================
// AUTO-REFILL KILL-SWITCH (Story 4.4)
// ============================================================

export interface AutoRefillSettings {
  auto_refill_enabled: boolean;
  auto_refill_last_run_at: string | null;
  auto_refill_last_run_status: 'success' | 'skipped' | 'error' | null;
}

/**
 * Busca as configurações de Auto-Refill do tenant logado.
 * Retorna defaults seguros se ainda não houver registro em tenant_settings.
 */
export async function getAutoRefillSettings(): Promise<{
  data: AutoRefillSettings | null;
  error?: string;
}> {
  const supabase = await createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();

  if (authError || !userData?.user) {
    return { data: null, error: 'Não autorizado' };
  }

  const { data, error } = await supabase
    .from('tenant_settings')
    .select('auto_refill_enabled, auto_refill_last_run_at, auto_refill_last_run_status')
    .eq('tenant_id', userData.user.id)
    .maybeSingle();

  if (error) {
    console.error('[actions] Erro ao buscar tenant_settings:', error.message);
    return { data: null, error: 'Falha ao buscar configurações de automação.' };
  }

  // Tenant novo sem settings → defaults
  const settings: AutoRefillSettings = {
    auto_refill_enabled:         data?.auto_refill_enabled ?? true,
    auto_refill_last_run_at:     data?.auto_refill_last_run_at ?? null,
    auto_refill_last_run_status: (data?.auto_refill_last_run_status as AutoRefillSettings['auto_refill_last_run_status']) ?? null,
  };

  return { data: settings };
}

/**
 * Liga ou desliga o Auto-Refill para o tenant logado.
 * Persistido na tabela tenant_settings com upsert.
 */
export async function toggleAutoRefillAction(
  enabled: boolean
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();

  if (authError || !userData?.user) {
    return { success: false, error: 'Não autorizado' };
  }

  const { error } = await supabase
    .from('tenant_settings')
    .upsert(
      {
        tenant_id:          userData.user.id,
        auto_refill_enabled: enabled,
      },
      { onConflict: 'tenant_id' }
    );

  if (error) {
    console.error('[actions] Erro ao atualizar kill-switch do Auto-Refill:', error.message);
    return { success: false, error: 'Falha ao salvar configuração de automação.' };
  }

  revalidatePath('/configuracoes');
  return { success: true };
}

// ============================================================
// DELETAR uma credencial de IA (com verificação de propriedade)
// ============================================================
export async function deleteCredential(providerType: string) {
  try {
    const supabase = await createClient();
    const { data: userData, error: authError } = await supabase.auth.getUser();

    if (authError || !userData?.user) {
      return { success: false, error: 'Não autorizado' };
    }

    const { error } = await supabase
      .from('tenant_credentials')
      .delete()
      .eq('user_id', userData.user.id)
      .eq('provider_type', providerType);

    if (error) {
      console.error('[actions] Erro ao deletar credencial:', error.message);
      return { success: false, error: 'Falha ao remover credencial.' };
    }

    revalidatePath('/configuracoes');
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    return { success: false, error: message };
  }
}
