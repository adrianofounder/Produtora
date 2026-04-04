import { Play, Music2, Unplug } from 'lucide-react';

export type AccountStatus = 'ativa' | 'pendente' | 'expirada';

export interface AccountData {
  id: number;
  plataforma: string;
  canal: string;
  status: AccountStatus;
  cor: string;
}

const STATUS_CONFIG: Record<AccountStatus, { badge: string; label: string }> = {
  ativa:    { badge: 'badge-success', label: 'Ativa' },
  pendente: { badge: 'badge-warning', label: 'Pendente' },
  expirada: { badge: 'badge-error',   label: 'Expirada' },
};

const PLATAFORMA_ICON: Record<string, React.ReactNode> = {
  YouTube: <Play size={14} />,
  TikTok:  <Music2 size={14} />,
};

interface AccountCardProps {
  account: AccountData;
}

export function AccountCard({ account }: AccountCardProps) {
  const cfg = STATUS_CONFIG[account.status];

  return (
    <div className="card-inner flex items-center gap-4 p-4">
      {/* Avatar da plataforma */}
      <div
        className="flex items-center justify-center rounded-lg shrink-0 text-white"
        style={{
          width: 36,
          height: 36,
          background: `${account.cor}22`,
          border: `1px solid ${account.cor}40`,
          color: account.cor,
        }}
      >
        {PLATAFORMA_ICON[account.plataforma] ?? <Play size={14} />}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span className="text-[13px] font-semibold truncate" style={{ color: 'var(--color-text-1)' }}>
          {account.canal}
        </span>
        <span className="text-[11px]" style={{ color: 'var(--color-text-3)' }}>
          {account.plataforma}
        </span>
      </div>

      {/* Status + Ação */}
      <div className="flex items-center gap-3 shrink-0">
        <span className={`badge ${cfg.badge}`}>{cfg.label}</span>
        <button className="btn-ghost h-7 px-2.5 text-[11px]">
          <Unplug size={11} />
          Desconectar
        </button>
      </div>
    </div>
  );
}
