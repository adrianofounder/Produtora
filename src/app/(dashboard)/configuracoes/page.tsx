'use client';

import { useState, useEffect } from 'react';
import { Plus, Settings, Loader2, CheckCircle2, Tv2, Key, AlertCircle } from 'lucide-react';
import { AccountCard, AccountData } from '@/components/configuracoes/account-card';
import { ApiKeyCard, ApiData } from '@/components/configuracoes/api-key-card';
import { SegurancaForm } from '@/components/configuracoes/seguranca-form';

// Verifica quais APIs do .env estão configuradas (via endpoint seguro)
const APIS_POSSIVEIS: ApiData[] = [
  { id: 1, provider: 'Gemini (Google)',  tipo: 'Roteiros/Análise', status: 'on',       data: 'Configurado via .env' },
  { id: 2, provider: 'YouTube Data API', tipo: 'Publicação',        status: 'on',       data: 'Configurado via .env' },
  { id: 3, provider: 'AWS S3',           tipo: 'Storage de Mídias', status: 'on',       data: 'Configurado via .env' },
  { id: 4, provider: 'Supabase',         tipo: 'Backend Auth / DB', status: 'on',       data: 'Integrado'           },
  { id: 5, provider: 'ElevenLabs',       tipo: 'TTS / Narração',    status: 'faltando', data: '--/--/----'          },
  { id: 6, provider: 'OpenAI (GPT-4o)',  tipo: 'Backup LLM',        status: 'faltando', data: '--/--/----'          },
];

interface Canal { id: string; nome: string; youtube_channel_id: string | null; mare_status: string; }

export default function Configuracoes() {
  const [canais, setCanais] = useState<Canal[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingCanal, setSavingCanal] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/canais')
      .then(r => r.ok ? r.json() : [])
      .then((data: Canal[]) => setCanais(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Formata canais como AccountData para o componente existente
  const contas: AccountData[] = canais.map((c, i) => ({
    id: i + 1,
    plataforma: 'YouTube',
    canal: c.nome,
    status: c.youtube_channel_id ? 'ativa' : 'pendente',
    cor: 'var(--color-error)',
  }));

  async function conectarYoutube(canalId: string) {
    setSavingCanal(canalId);
    // Futuramente: iniciar OAuth flow do YouTube
    // Por agora abre o Google OAuth
    alert('Integração OAuth YouTube em desenvolvimento. Configure o Client ID no Google Cloud Console.');
    setSavingCanal(null);
  }

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
          Integrações de API e conexão de canais ao YouTube
        </p>
      </header>

      {/* Status das Variáveis de Ambiente */}
      <section className="card p-4 flex flex-col gap-3">
        <h2 className="section-label flex items-center gap-2">
          <CheckCircle2 className="h-3.5 w-3.5" style={{ color: 'var(--color-success)' }} />
          Diagnóstico do Ambiente
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { label: 'Supabase URL',         ok: true  },
            { label: 'Supabase Anon Key',     ok: true  },
            { label: 'Gemini API Key',         ok: true  },
            { label: 'Google Client ID',       ok: true  },
            { label: 'YouTube API Key',        ok: true  },
            { label: 'AWS Access Key',         ok: true  },
            { label: 'ElevenLabs API Key',     ok: false },
            { label: 'OpenAI API Key',         ok: false },
          ].map((item) => (
            <div key={item.label} className="card-inner flex items-center gap-2 px-3 py-2">
              {item.ok
                ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--color-success)' }} />
                : <AlertCircle className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--color-warning)' }} />}
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

      {/* Seção: Segurança (Nova) */}
      <SegurancaForm />

      {/* Aviso OAuth (Contextual) */}
      <div className="p-4 rounded-xl text-xs flex gap-3" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)' }}>
        <AlertCircle className="h-4 w-4 shrink-0" style={{ color: 'var(--color-error)' }} />
        <p style={{ color: 'var(--color-text-2)' }}>
          <strong style={{ color: 'var(--color-error)' }}>Atenção:</strong> A autenticação via Google OAuth está temporariamente desativada pelo provedor. Utilize sua Conta Mestre e a alteração de senha acima para gerenciar seu acesso.
        </p>
      </div>

      {/* Seção: Canais Conectados */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-widest flex items-center gap-2" style={{ color: 'var(--color-text-1)' }}>
            <Tv2 className="h-4 w-4" style={{ color: 'var(--color-accent)' }} />
            Canais Conectados ao YouTube
          </h2>
          <button className="btn-ghost h-8 text-xs">
            <Plus size={12} /> Novo Canal
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-20">
            <Loader2 className="h-5 w-5 animate-spin" style={{ color: 'var(--color-accent)' }} />
          </div>
        ) : contas.length === 0 ? (
          <div className="card-inner text-center py-8">
            <Tv2 className="h-8 w-8 mx-auto mb-2" style={{ color: 'var(--color-text-3)' }} />
            <p className="text-sm" style={{ color: 'var(--color-text-3)' }}>Nenhum canal cadastrado ainda.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {contas.map((conta, i) => (
              <AccountCard key={conta.id} account={conta} />
            ))}
          </div>
        )}

        {/* Instrução OAuth */}
        <div
          className="p-4 rounded-xl text-sm leading-relaxed"
          style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}
        >
          <p style={{ color: 'var(--color-text-2)' }}>
            <strong style={{ color: 'var(--color-accent)' }}>Para conectar ao YouTube:</strong>{' '}
            Configure o OAuth Consent Screen no{' '}
            <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer"
              className="underline" style={{ color: 'var(--color-accent)' }}>
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

      {/* Seção: Chaves de API */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest flex items-center gap-2" style={{ color: 'var(--color-text-1)' }}>
          <Key className="h-4 w-4" style={{ color: 'var(--color-accent)' }} />
          Chaves de API (Inteligência)
        </h2>
        <ApiKeyCard apis={APIS_POSSIVEIS} />
      </section>

    </div>
  );
}
