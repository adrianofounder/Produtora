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
  taxaAprovacao: number;
  colorStyle?: string;
}

const STATUS_CONFIG: Record<EixoStatus, {
  label: string;
  icon: React.ReactNode;
  badgeClass: string;
}> = {
  testando: {
    label: 'Testando',
    icon: <FlaskConical size={10} />,
    badgeClass: 'badge badge-accent',
  },
  aguardando: {
    label: 'Aguardando',
    icon: <Clock size={10} />,
    badgeClass: 'badge badge-muted',
  },
  venceu: {
    label: 'Venceu 👑',
    icon: <Trophy size={10} />,
    badgeClass: 'badge badge-success',
  },
};

interface EixoCardProps {
  eixo: EixoData;
  isActive?: boolean;
  onClick?: () => void;
  onMasterOverride?: () => void;
}

export function EixoCard({ eixo, isActive, onClick, onMasterOverride }: EixoCardProps) {
  const cfg = STATUS_CONFIG[eixo.status];
  const isWinner = eixo.status === 'venceu';

  return (
    <div
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
      <div className="flex items-start justify-between gap-2">
        <div className={`icon-box ${isWinner ? 'border-yellow-500/20 text-yellow-500 bg-yellow-500/10' : 'icon-box-accent'}`}>
          {isWinner ? <Trophy size={14} className="animate-pulse" /> : <FlaskConical size={14} />}
        </div>
        <span className={`${cfg.badgeClass} ${isWinner ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : ''}`}>
          {cfg.icon}
          {cfg.label}
        </span>
      </div>

      <div>
        <p className="text-[10px] section-label mb-0.5 opacity-60">Eixo {eixo.id}</p>
        <h3 className="text-[15px] font-bold tracking-tight leading-tight group-hover:text-[var(--color-accent)] transition-colors text-white">
          {eixo.nome}
        </h3>
        <p className="text-[12px] mt-0.5 font-medium text-[var(--color-text-3)]">
          {eixo.nicho}
        </p>
      </div>

      <div className="flex gap-3 pt-3 border-t border-white/5">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-wider font-bold opacity-40">Vídeos</span>
          <span className="text-sm font-bold font-mono text-white">{eixo.videos}</span>
        </div>
        <div className="flex flex-col gap-0.5 flex-1">
          <span className="text-[10px] uppercase tracking-wider font-bold opacity-40">Taxa Aprovação</span>
          <div className="h-1 rounded-full mt-1.5 overflow-hidden bg-white/5">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-in-out"
              style={{
                width: `${eixo.taxaAprovacao}%`,
                background: isWinner ? 'var(--color-premium)' : (eixo.colorStyle || 'var(--color-accent)'),
              }}
            />
          </div>
        </div>
      </div>

      {/* Master Override Trigger (Span with onClick to avoid nested buttons) */}
      {!isWinner && onMasterOverride && (
        <span
          role="button"
          onClick={(e) => {
            e.stopPropagation();
            onMasterOverride();
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold 
                     uppercase tracking-wider text-yellow-500/80 hover:text-yellow-400
                     border border-yellow-500/20 rounded px-2 py-1 mt-2 text-center"
        >
          👑 Definir Vencedor
        </span>
      )}
    </div>
  );
}
