'use client';

import { FlaskConical, Clock, Trophy } from 'lucide-react';

export type EixoStatus = 'testando' | 'aguardando' | 'venceu';

export interface EixoData {
  id: number;
  nome: string;
  nicho: string;
  status: EixoStatus;
  videos: number;
  mediaViews: string;
  taxaAprovacao: number; // 0–100
}

const STATUS_CONFIG: Record<EixoStatus, {
  label: string;
  icon: React.ReactNode;
  badgeClass: string;
  dotClass: string;
}> = {
  testando: {
    label: 'Testando',
    icon: <FlaskConical size={10} />,
    badgeClass: 'badge badge-accent',
    dotClass: 'dot-warn',
  },
  aguardando: {
    label: 'Aguardando',
    icon: <Clock size={10} />,
    badgeClass: 'badge badge-muted',
    dotClass: '',
  },
  venceu: {
    label: 'Venceu 👑',
    icon: <Trophy size={10} />,
    badgeClass: 'badge badge-success',
    dotClass: 'dot-live',
  },
};

interface EixoCardProps {
  eixo: EixoData;
  isActive?: boolean;
  onClick?: () => void;
}

export function EixoCard({ eixo, isActive, onClick }: EixoCardProps) {
  const cfg = STATUS_CONFIG[eixo.status];
  const isWinner = eixo.status === 'venceu';

  return (
    <button
      onClick={onClick}
      className={`
        ${isWinner ? 'card-accent' : 'card'}
        p-5 flex flex-col gap-3 text-left w-full cursor-pointer
        ${isActive ? 'ring-2 ring-[var(--color-accent)]/40' : ''}
      `}
      style={{ outline: 'none' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div
          className={`icon-box ${isWinner ? 'icon-box-success' : 'icon-box-accent'}`}
        >
          {isWinner ? <Trophy size={14} /> : <FlaskConical size={14} />}
        </div>
        <span className={cfg.badgeClass}>
          {cfg.icon}
          {cfg.label}
        </span>
      </div>

      {/* Nome */}
      <div>
        <p className="text-xs section-label mb-0.5">Eixo {eixo.id}</p>
        <h3
          className="text-sm font-semibold leading-tight"
          style={{ color: 'var(--color-text-1)' }}
        >
          {eixo.nome}
        </h3>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-3)' }}>
          {eixo.nicho}
        </p>
      </div>

      {/* Métricas */}
      <div className="flex gap-3 pt-1 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px]" style={{ color: 'var(--color-text-3)' }}>Vídeos</span>
          <span
            className="text-sm font-bold font-mono"
            style={{ color: 'var(--color-text-1)' }}
          >
            {eixo.videos}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px]" style={{ color: 'var(--color-text-3)' }}>Média views</span>
          <span
            className="text-sm font-bold font-mono"
            style={{ color: isWinner ? 'var(--color-success)' : 'var(--color-text-1)' }}
          >
            {eixo.mediaViews}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 flex-1">
          <span className="text-[10px]" style={{ color: 'var(--color-text-3)' }}>Taxa aprovação</span>
          {/* Mini progress bar */}
          <div
            className="h-1.5 rounded-full mt-1 overflow-hidden"
            style={{ background: 'var(--color-border-2)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${eixo.taxaAprovacao}%`,
                background: isWinner
                  ? 'var(--color-success)'
                  : 'var(--color-accent)',
              }}
            />
          </div>
          <span
            className="text-[10px] font-mono"
            style={{ color: 'var(--color-text-2)' }}
          >
            {eixo.taxaAprovacao}%
          </span>
        </div>
      </div>
    </button>
  );
}
