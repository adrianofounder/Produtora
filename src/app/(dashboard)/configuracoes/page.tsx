import { Plus, Settings } from 'lucide-react';
import { AccountCard, AccountData } from '@/components/configuracoes/account-card';
import { ApiKeyCard, ApiData } from '@/components/configuracoes/api-key-card';

const CONTAS: AccountData[] = [
  { id: 1, plataforma: 'YouTube', canal: 'Histórias Ocultas',  status: 'ativa',    cor: 'var(--color-error)'  },
  { id: 2, plataforma: 'YouTube', canal: 'Jesus Reage',         status: 'ativa',    cor: 'var(--color-error)'  },
  { id: 3, plataforma: 'TikTok',  canal: '@historiasocultas',   status: 'pendente', cor: 'var(--color-accent)' },
];

const APIS: ApiData[] = [
  { id: 1, provider: 'OpenAI (GPT-4o)', tipo: 'Texto/Roteiros', status: 'on',       data: '03/04/2026' },
  { id: 2, provider: 'ElevenLabs',      tipo: 'TTS/Áudios',     status: 'faltando', data: '--/--/----' },
  { id: 3, provider: 'Fal.ai',          tipo: 'Imagens/Flux',   status: 'on',       data: '01/04/2026' },
  { id: 4, provider: 'Supabase',        tipo: 'Backend Auth',   status: 'on',       data: 'Integrado'  },
];

export default function Configuracoes() {
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
          Integrações de API e conexão de contas sociais
        </p>
      </header>

      {/* Seção: Contas Conectadas */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-1)' }}>
            📺 Contas & Canais Conectados
          </h2>
          <button className="btn-ghost h-8 text-xs">
            <Plus size={12} />
            Nova Conta
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {CONTAS.map((conta) => (
            <AccountCard key={conta.id} account={conta} />
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* Seção: Chaves de API */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-1)' }}>
          🧠 Chaves de API (Inteligência)
        </h2>
        <ApiKeyCard apis={APIS} />
      </section>

    </div>
  );
}
