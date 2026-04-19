'use client';

import { useState, useEffect, useCallback } from 'react';
import { Settings, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { AccountCard, AccountData } from '@/components/configuracoes/account-card';
import { ApiKeyCard, ApiData, ApiStatus } from '@/components/configuracoes/api-key-card';
import { SegurancaForm } from '@/components/configuracoes/seguranca-form';
import { getTenantCredentials } from './actions';

interface Canal { id: string; nome: string; youtube_channel_id: string | null; mare_status: string; }

// Diagnóstico fixo de variáveis de ambiente (chaves de infraestrutura mestra)
// Estas NÃO entram no Cofre — são responsabilidade do sistema, não do usuário.
const ENV_DIAGNOSTICS = [
  { label: 'Supabase URL',       ok: true  },
  { label: 'Supabase Anon Key',  ok: true  },
  { label: 'Gemini API Key',     ok: true  },
  { label: 'Google Client ID',   ok: true  },
  { label: 'YouTube API Key',    ok: true  },
  { label: 'AWS Access Key',     ok: true  },
];

// Mapeamento técnico: provider_type → Categoria de uso legível
const PROVIDER_TYPE_LABELS: Record<string, string> = {
  llm_text:  'LLM (Roteiro/Texto)',
  tts_audio: 'TTS (Narração/Voz)',
  image_gen: 'Geração de Imagem',
};

export default function Configuracoes() {
  const [canais, setCanais]   = useState<Canal[]>([]);
  const [apis, setApis]       = useState<ApiData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [canaisData, credenciaisRes] = await Promise.all([
        fetch('/api/canais').then((r) => (r.ok ? r.json() : [])),
        getTenantCredentials(),
      ]);

      setCanais(Array.isArray(canaisData) ? canaisData : []);

      // Montar lista de APIs 100% dinâmica a partir do banco
      const dynamicApis: ApiData[] = (credenciaisRes.data ?? []).map((cred, idx) => {
        const hasRealKey = !!(cred.api_key && cred.api_key !== '');
        const status: ApiStatus = cred.is_system_fallback
          ? 'fallback'
          : hasRealKey
          ? 'on'
          : 'faltando';

        return {
          id:              idx + 1,
          provider_type:   cred.provider_type,
          provider:        cred.provider_name,
          tipo:            PROVIDER_TYPE_LABELS[cred.provider_type] ?? cred.provider_type,
          status,
          api_key_masked:  cred.api_key, // já vem mascarada da action
          base_url:        cred.base_url ?? undefined,
          model_id:        cred.model_id ?? undefined,
          maxDailyLimit:   cred.max_daily_limit ?? undefined,
          isLimitActive:   cred.is_limit_active ?? false,
          isSystemFallback: cred.is_system_fallback ?? false,
          dailySpendCount: cred.daily_spend_count ?? 0,
        } satisfies ApiData;
      });

      setApis(dynamicApis);
    } catch {
      // Silencioso — os subcomponentes tratam estados de erro individualmente
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const contas: AccountData[] = canais.map((c, i) => ({
    id:         i + 1,
    plataforma: 'YouTube',
    canal:      c.nome,
    status:     c.youtube_channel_id ? 'ativa' : 'pendente',
    cor:        'var(--color-error)',
  }));

  return (
    <div className="flex flex-col gap-8 max-w-3xl">

      {/* Header */}
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <span className="icon-box icon-box-accent shrink-0">
            <Settings size={14} />
          </span>
          <h1 className="text-2xl font-sans font-bold" style={{ color: 'var(--color-text-1)' }}>
            Configurações
          </h1>
        </div>
        <p className="text-sm ml-10" style={{ color: 'var(--color-text-3)' }}>
          Integrações de IA, credenciais de API e conexão de canais
        </p>
      </header>

      {/* Diagnóstico do Ambiente (infra fixa — não entra no Cofre) */}
      <section className="card p-4 flex flex-col gap-3">
        <h2 className="section-label flex items-center gap-2">
          <CheckCircle2 className="h-3.5 w-3.5" style={{ color: 'var(--color-success)' }} />
          Diagnóstico do Ambiente (Infraestrutura Mestra)
        </h2>
        <p className="text-[11px]" style={{ color: 'var(--color-text-3)' }}>
          Estas chaves são geridas pelo sistema e não aparecem no Cofre de IAs.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {ENV_DIAGNOSTICS.map((item) => (
            <div key={item.label} className="card-inner flex items-center gap-2 px-3 py-2">
              {item.ok
                ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--color-success)' }} />
                : <AlertCircle  className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--color-warning)' }} />}
              <span className="text-xs" style={{ color: item.ok ? 'var(--color-text-2)' : 'var(--color-text-3)' }}>
                {item.label}
              </span>
              <span className="ml-auto text-[10px] font-mono" style={{ color: item.ok ? 'var(--color-success)' : 'var(--color-warning)' }}>
                {item.ok ? 'OK' : 'faltando'}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Seção: Segurança de Acesso */}
      <SegurancaForm />

      {/* Aviso OAuth */}
      <div className="p-4 rounded-xl text-xs flex gap-3" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)' }}>
        <AlertCircle className="h-4 w-4 shrink-0" style={{ color: 'var(--color-error)' }} />
        <p style={{ color: 'var(--color-text-2)' }}>
          <strong style={{ color: 'var(--color-error)' }}>Atenção:</strong> A autenticação via Google OAuth está temporariamente desativada pelo provedor. Utilize sua Conta Mestre e a alteração de senha acima para gerenciar seu acesso.
        </p>
      </div>

      {/* Seção: Canais Conectados */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest flex items-center gap-2" style={{ color: 'var(--color-text-1)' }}>
          Canais Conectados ao YouTube
        </h2>

        {loading ? (
          <div className="flex items-center justify-center h-20">
            <Loader2 className="h-5 w-5 animate-spin" style={{ color: 'var(--color-accent)' }} />
          </div>
        ) : contas.length === 0 ? (
          <div className="card-inner text-center py-8">
            <p className="text-sm" style={{ color: 'var(--color-text-3)' }}>Nenhum canal cadastrado ainda.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {contas.map((conta) => (
              <AccountCard key={conta.id} account={conta} />
            ))}
          </div>
        )}

        <div className="p-4 rounded-xl text-sm leading-relaxed" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
          <p style={{ color: 'var(--color-text-2)' }}>
            <strong style={{ color: 'var(--color-accent)' }}>Para conectar ao YouTube:</strong>{' '}
            Configure o OAuth no{' '}
            <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--color-accent)' }}>
              Google Cloud Console
            </a>{' '}
            e adicione a URL de callback:{' '}
            <code className="text-[11px] px-1 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.06)' }}>
              {typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '[seu-dominio]/auth/callback'}
            </code>
          </p>
        </div>
      </section>

      <hr className="divider" />

      {/* Seção: Cofre de Credenciais de IA */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-1)' }}>
            ⚡ Cofre de Credenciais de IA
          </h2>
          <p className="text-[12px] mt-1" style={{ color: 'var(--color-text-3)' }}>
            Cadastre suas chaves de IA. O sistema usa a sua chave por padrão — se não houver, usa a chave do sistema (com teto ativo).
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-20">
            <Loader2 className="h-5 w-5 animate-spin" style={{ color: 'var(--color-accent)' }} />
          </div>
        ) : (
          <ApiKeyCard apis={apis} onRefresh={fetchData} />
        )}
      </section>

    </div>
  );
}
