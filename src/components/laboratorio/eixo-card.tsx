'use client';

import { FlaskConical, Clock, Trophy } from 'lucide-react';

export type EixoStatus = 'testando' | 'aguardando' | 'venceu';

export interface EixoData {
  id: string | number;
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
        p-5 flex flex-col gap-3 text-left w-full cursor-pointer group transition-all duration-300
        ${isActive ? 'ring-2 ring-[var(--color-accent)]/40 -translate-y-1' : ''}
      `}
      style={{ 
        outline: 'none',
        background: isWinner 
          ? 'linear-gradient(160deg, rgba(234,179,8,0.05) 0%, rgba(17,13,24,1) 100%)' 
          : undefined,
        borderColor: isWinner ? 'rgba(234,179,8,0.3)' : undefined,
        boxShadow: isWinner ? '0 0 30px rgba(234,179,8,0.1)' : undefined
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div
          className={`icon-box ${isWinner ? 'border-yellow-500/20 text-yellow-500 bg-yellow-500/10' : 'icon-box-accent'}`}
        >
          {isWinner ? <Trophy size={14} className="animate-pulse" /> : <FlaskConical size={14} />}
        </div>
        <span className={`${cfg.badgeClass} ${isWinner ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : ''}`}>
          {cfg.icon}
          {cfg.label}
        </span>
      </div>

      {/* Nome */}
      <div>
        <p className="text-[10px] section-label mb-0.5 opacity-60">Eixo {eixo.id}</p>
        <h3
          className="text-[15px] font-bold tracking-tight leading-tight group-hover:text-[var(--color-accent)] transition-colors"
          style={{ color: isWinner ? 'var(--color-premium)' : 'var(--color-text-1)' }}
        >
          {eixo.nome}
        </h3>
        <p className="text-[12px] mt-0.5 font-medium" style={{ color: 'var(--color-text-3)' }}>
          {eixo.nicho}
        </p>
      </div>

      {/* Métricas */}
      <div className="flex gap-3 pt-3 border-t border-white/5">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-wider font-bold opacity-40">Vídeos</span>
          <span
            className="text-sm font-bold font-mono"
            style={{ color: 'var(--color-text-1)' }}
          >
            {eixo.videos}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-wider font-bold opacity-40">Média Views</span>
          <span
            className="text-sm font-bold font-mono"
            style={{ color: isWinner ? 'var(--color-premium)' : 'var(--color-text-1)' }}
          >
            {eixo.mediaViews}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 flex-1">
          <span className="text-[10px] uppercase tracking-wider font-bold opacity-40">Taxa Aprovação</span>
          {/* Mini progress bar */}
          <div
            className="h-1 rounded-full mt-1.5 overflow-hidden bg-white/5"
          >
            <div
              className="h-full rounded-full transition-all duration-1000 ease-in-out"
              style={{
                width: `${eixo.taxaAprovacao}%`,
                background: isWinner
                  ? 'var(--color-premium)'
                  : 'var(--color-accent)',
                boxShadow: isWinner ? '0 0 8px rgba(234,179,8,0.5)' : '0 0 8px rgba(124,58,237,0.4)'
              }}
            />
          </div>
          <span
            className="text-[10px] font-mono font-bold mt-0.5"
            style={{ color: isWinner ? 'var(--color-premium)' : 'var(--color-text-2)' }}
          >
            {eixo.taxaAprovacao}%
          </span>
        </div>
      </div>
    </button>
  );
}
