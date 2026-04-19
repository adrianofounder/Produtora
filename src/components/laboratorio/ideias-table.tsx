'use client';

import { Zap, Send, Star } from 'lucide-react';

export interface IdeiaData {
  id: string | number;
  titulo: string;
  premissa: string;
  notaIA: number; // 0–10
  tags: string[];
  status: 'pendente' | 'fabrica' | 'publicado';
}

const SCORE_COLOR = (nota: number) => {
  if (nota >= 9) return 'var(--color-success)';
  if (nota >= 7) return 'var(--color-accent)';
  if (nota >= 5) return 'var(--color-warning)';
  return 'var(--color-error)';
};

const SCORE_LABEL = (nota: number) => {
  if (nota >= 9) return 'Excelente';
  if (nota >= 7) return 'Bom';
  if (nota >= 5) return 'Regular';
  return 'Fraco';
};

interface IdeiasTableProps {
  ideias: IdeiaData[];
  onSendToFabrica?: (id: string | number) => void;
}

export function IdeiasTable({ ideias, onSendToFabrica }: IdeiasTableProps) {
  return (
    <div className="card overflow-hidden">
      {/* Cabeçalho da tabela */}
      <div
        className="grid items-center px-5 py-3 border-b"
        style={{
          gridTemplateColumns: '1fr 80px 100px 120px',
          borderColor: 'var(--color-border)',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        {(['Ideia / Premissa', 'Nota IA', 'Tags', 'Ação'] as const).map((h) => (
          <span key={h} className="section-label">{h}</span>
        ))}
      </div>

      {/* Linhas */}
      {ideias.map((ideia) => (
        <div
          key={ideia.id}
          className="grid items-center px-5 py-3.5 border-b transition-colors cursor-default"
          style={{
            gridTemplateColumns: '1fr 80px 100px 120px',
            borderColor: 'var(--color-border)',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = 'transparent')
          }
        >
          {/* Título + premissa */}
          <div className="flex flex-col gap-0.5 pr-4">
            <span
              className="text-sm font-semibold"
              style={{ color: 'var(--color-text-1)' }}
            >
              {ideia.titulo}
            </span>
            <span
              className="text-xs leading-relaxed"
              style={{ color: 'var(--color-text-3)' }}
            >
              {ideia.premissa}
            </span>
          </div>

          {/* Nota IA */}
          <div className="flex items-center gap-1.5">
            <span
              className="icon-box icon-box-sm"
              style={{
                background: `${SCORE_COLOR(ideia.notaIA)}18`,
                border: `1px solid ${SCORE_COLOR(ideia.notaIA)}30`,
              }}
            >
              <Star size={10} style={{ color: SCORE_COLOR(ideia.notaIA) }} />
            </span>
            <div className="flex flex-col">
              <span
                className="text-sm font-bold font-mono leading-none"
                style={{ color: SCORE_COLOR(ideia.notaIA) }}
              >
                {ideia.notaIA}/10
              </span>
              <span
                className="text-[10px]"
                style={{ color: 'var(--color-text-3)' }}
              >
                {SCORE_LABEL(ideia.notaIA)}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {ideia.tags.map((tag) => (
              <span key={tag} className="badge badge-muted">{tag}</span>
            ))}
          </div>

          {/* Ação */}
          <div>
            {ideia.status === 'pendente' ? (
              <button
                className="btn-primary h-8 text-xs gap-1.5"
                onClick={() => onSendToFabrica?.(ideia.id)}
              >
                <Send size={11} />
                P/ Fábrica
              </button>
            ) : ideia.status === 'fabrica' ? (
              <span className="badge badge-accent gap-1">
                <Zap size={9} />
                Na Fábrica
              </span>
            ) : (
              <span className="badge badge-success">Publicado</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
