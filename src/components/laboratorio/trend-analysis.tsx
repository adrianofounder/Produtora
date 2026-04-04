'use client';

import { TrendingUp, Eye, ThumbsUp, Clock } from 'lucide-react';

export interface TrendMetrica {
  eixo: string;
  score: number; // 0–100
  views7d: string;
  ctr: string;
  retencao: string;
  direcao: 'up' | 'stable' | 'down';
}

const DIRECAO_CONFIG = {
  up:     { label: '▲ Subindo',  color: 'var(--color-success)' },
  stable: { label: '→ Estável',  color: 'var(--color-warning)' },
  down:   { label: '▼ Caindo',   color: 'var(--color-error)'   },
};

interface TrendAnalysisProps {
  metricas: TrendMetrica[];
}

export function TrendAnalysis({ metricas }: TrendAnalysisProps) {
  const max = Math.max(...metricas.map((m) => m.score));

  return (
    <div className="card p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="icon-box icon-box-accent">
          <TrendingUp size={14} />
        </div>
        <div>
          <h3
            className="text-sm font-semibold"
            style={{ color: 'var(--color-text-1)' }}
          >
            Motor de Tendências
          </h3>
          <p className="text-xs" style={{ color: 'var(--color-text-3)' }}>
            Análise dos últimos 7 dias por eixo temático
          </p>
        </div>
      </div>

      <hr className="divider" />

      {/* Métricas por eixo */}
      <div className="flex flex-col gap-4">
        {metricas.map((m) => {
          const isLeader = m.score === max;
          const dir = DIRECAO_CONFIG[m.direcao];

          return (
            <div key={m.eixo} className="flex flex-col gap-2">
              {/* Row principal */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  {isLeader && (
                    <span className="badge badge-success shrink-0">
                      👑 LÍDER
                    </span>
                  )}
                  <span
                    className="text-sm font-medium truncate"
                    style={{ color: isLeader ? 'var(--color-text-1)' : 'var(--color-text-2)' }}
                  >
                    {m.eixo}
                  </span>
                </div>
                <span
                  className="text-xs font-semibold shrink-0"
                  style={{ color: dir.color }}
                >
                  {dir.label}
                </span>
              </div>

              {/* Barra de score com label */}
              <div className="flex items-center gap-3">
                <div
                  className="flex-1 h-2 rounded-full overflow-hidden"
                  style={{ background: 'var(--color-border-2)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${m.score}%`,
                      background: isLeader
                        ? 'var(--color-success)'
                        : 'linear-gradient(90deg, var(--color-accent), #A78BFA)',
                    }}
                  />
                </div>
                <span
                  className="text-xs font-bold font-mono w-8 text-right shrink-0"
                  style={{ color: isLeader ? 'var(--color-success)' : 'var(--color-text-2)' }}
                >
                  {m.score}
                </span>
              </div>

              {/* Mini KPIs inline */}
              <div className="flex gap-4">
                <div className="flex items-center gap-1">
                  <Eye size={10} style={{ color: 'var(--color-text-3)' }} />
                  <span className="text-[11px] font-mono" style={{ color: 'var(--color-text-2)' }}>
                    {m.views7d}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp size={10} style={{ color: 'var(--color-text-3)' }} />
                  <span className="text-[11px] font-mono" style={{ color: 'var(--color-text-2)' }}>
                    CTR {m.ctr}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={10} style={{ color: 'var(--color-text-3)' }} />
                  <span className="text-[11px] font-mono" style={{ color: 'var(--color-text-2)' }}>
                    Ret. {m.retencao}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
