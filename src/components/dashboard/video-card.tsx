"use client";

export type VideoStatus = "planejamento" | "producao" | "pronto" | "agendado" | "publicado" | "erro";

export interface VideoStep {
  label: string;
  done: boolean;
}

export interface VideoCardProps {
  titulo: string;
  eixo: string;
  dataPrevisao: string;
  status: VideoStatus;
  steps: VideoStep[];
  acaoPrimaria?: string;
  onMoveForward?: () => void;
  onMoveBackward?: () => void;
  isMoving?: boolean;
  /** Abre a Gaveta de Produção para este vídeo */
  onOpenGaveta?: () => void;
}

const statusConfig: Record<VideoStatus, { label: string }> = {
  planejamento: { label: "Planejamento" },
  producao: { label: "Em Produção" },
  pronto: { label: "Pronto" },
  agendado: { label: "Agendado" },
  publicado: { label: "Publicado" },
  erro: { label: "Com Erro" },
};

const doneCount = (steps: VideoStep[]) => steps.filter((s) => s.done).length;

export function VideoCard({ 
  titulo, 
  eixo, 
  dataPrevisao, 
  status, 
  steps, 
  acaoPrimaria,
  onMoveForward,
  onMoveBackward,
  isMoving = false,
  onOpenGaveta,
}: VideoCardProps) {
  const cfg = statusConfig[status];
  const pct = Math.round((doneCount(steps) / steps.length) * 100);

  const badgeClass = status === 'producao' ? 'badge-accent' : 
                     status === 'agendado' || status === 'publicado' ? 'badge-success' :
                     status === 'erro' ? 'badge-error' : 'badge-muted';

  // Classe de glow dinâmica baseada no status
  const glowClass = `glow-${status}`;

  return (
    <div
      className={`group relative flex items-start gap-4 p-4 rounded-xl transition-all duration-300 card-inner depth-card ${glowClass} ${isMoving ? 'opacity-50 pointer-events-none' : ''}`}
    >
      {/* Barra lateral de status (Neon Indicator) */}
      <div
        className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full transition-all duration-300 group-hover:w-[4px] group-hover:shadow-[0_0_15px_rgba(124,58,237,0.5)]"
        style={{ 
          background: 'var(--status-color)',
          boxShadow: `0 0 12px var(--status-color)` 
        }}
      />

      {/* Conteúdo principal */}
      <div className="pl-2 flex-1 flex flex-col gap-2.5 min-w-0">
        {/* Meta row: status + data + eixo */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className={`badge ${badgeClass} text-[9px] font-bold tracking-widest`}>
             {status === 'producao' && <div className="dot-live mr-1.5 scale-75" />}
             {cfg.label}
          </span>
          <span className="text-[11px] font-medium text-[var(--color-text-3)]">
            {dataPrevisao}
          </span>
          <span className="section-label lowercase text-[9px] bg-white/5 px-2 py-0.5 rounded-md border border-white/5 opacity-80">
            eixo: <span className="text-[var(--color-text-2)]">{eixo}</span>
          </span>
        </div>

        {/* Título */}
        <h3
          className="text-[15px] font-bold tracking-tight leading-snug text-[var(--color-text-1)] group-hover:text-[var(--color-accent)] transition-colors duration-300 cursor-pointer"
        >
          {titulo}
        </h3>

        {/* Pipeline de steps */}
        <div className="flex items-center gap-2 flex-wrap mt-0.5">
          {steps.map((s) => (
            <span
              key={s.label}
              className={`text-[10px] font-bold flex items-center gap-1.5 transition-opacity duration-300 ${s.done ? 'opacity-100' : 'opacity-80'}`}
              style={{ color: s.done ? "var(--color-success)" : "var(--color-text-2)" }}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${s.done ? 'bg-[var(--color-success)] shadow-[0_0_6px_rgba(16,185,129,0.5)]' : 'bg-white/20'}`} />
              {s.label}
            </span>
          ))}
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2.5 mt-0.5">
          <div className="flex-1 h-[2px] rounded-full overflow-hidden bg-white/5">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{ 
                width: `${pct}%`, 
                background: 'var(--status-color)',
                boxShadow: `0 0 10px var(--status-color)`
              }}
            />
          </div>
          <span className="text-[10px] font-mono font-bold text-[var(--color-text-2)] tabular-nums">
            {pct}%
          </span>
        </div>
      </div>

      {/* Ações (aparecem no hover + botoes de pipeline sempre visíveis ou semi-visíveis) */}
      <div className="flex flex-col items-end gap-2 shrink-0 self-center">
        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
          {onOpenGaveta && (
            <button
              id={`btn-gaveta-${titulo.slice(0, 10).replace(/\s/g, '-').toLowerCase()}`}
              onClick={onOpenGaveta}
              className="btn-primary h-7 px-3 text-[10px] shadow-md shadow-purple-500/20"
              title="Abrir Linha de Montagem"
            >
              ✦ Produzir
            </button>
          )}
          <button className="btn-ghost h-7 px-3 text-[10px] glass">
            Editar
          </button>
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          {onMoveBackward && (
            <button 
              onClick={onMoveBackward}
              disabled={isMoving}
              className="btn-ghost h-8 w-8 p-0 flex items-center justify-center rounded-md border border-white/10 hover:border-white/30 text-white/60 hover:text-white transition-all disabled:opacity-50"
              title="Voltar Etapa"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
          )}
          {acaoPrimaria && (
            <button className="btn-primary h-8 px-5 text-[11px] shadow-xl shadow-purple-500/20 active:scale-95 transition-all">
              {isMoving ? (
                 <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              ) : acaoPrimaria}
            </button>
          )}
          {onMoveForward && (
            <button 
              onClick={onMoveForward}
              disabled={isMoving}
              className="btn-ghost h-8 w-8 p-0 flex items-center justify-center rounded-md border border-white/10 hover:border-white/30 text-white/60 hover:text-white transition-all disabled:opacity-50"
              title="Avançar Etapa"
            >
               {isMoving ? (
                 <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
               ) : (
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
               )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
