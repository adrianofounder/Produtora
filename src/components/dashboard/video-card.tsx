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
}

const statusConfig: Record<VideoStatus, { label: string; color: string; bg: string; border: string; barColor: string }> = {
  planejamento: {
    label: "Planejamento",
    color: "var(--color-text-2)",
    bg: "rgba(255,255,255,0.04)",
    border: "rgba(255,255,255,0.10)",
    barColor: "rgba(255,255,255,0.20)",
  },
  producao: {
    label: "Em Produção",
    color: "var(--color-accent)",
    bg: "rgba(124,58,237,0.06)",
    border: "rgba(124,58,237,0.22)",
    barColor: "rgba(124,58,237,1)",
  },
  pronto: {
    label: "Pronto",
    color: "#60A5FA",
    bg: "rgba(96,165,250,0.06)",
    border: "rgba(96,165,250,0.18)",
    barColor: "rgba(96,165,250,1)",
  },
  agendado: {
    label: "Agendado",
    color: "var(--color-success)",
    bg: "rgba(16,185,129,0.05)",
    border: "rgba(16,185,129,0.18)",
    barColor: "rgba(16,185,129,1)",
  },
  publicado: {
    label: "Publicado",
    color: "var(--color-text-3)",
    bg: "transparent",
    border: "rgba(255,255,255,0.06)",
    barColor: "rgba(255,255,255,0.15)",
  },
  erro: {
    label: "Com Erro",
    color: "var(--color-error)",
    bg: "rgba(239,68,68,0.06)",
    border: "rgba(239,68,68,0.22)",
    barColor: "rgba(239,68,68,1)",
  },
};

const doneCount = (steps: VideoStep[]) => steps.filter((s) => s.done).length;

export function VideoCard({ titulo, eixo, dataPrevisao, status, steps, acaoPrimaria }: VideoCardProps) {
  const cfg = statusConfig[status];
  const pct = Math.round((doneCount(steps) / steps.length) * 100);

  const badgeClass = status === 'producao' ? 'badge-accent' : 
                     status === 'agendado' || status === 'publicado' ? 'badge-success' :
                     status === 'erro' ? 'badge-error' : 'badge-muted';

  return (
    <div
      className="group relative flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 card-inner backdrop-blur-sm"
      style={{
        background: status === 'producao' ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.03)',
      }}
    >
      {/* Barra lateral de status */}
      <div
        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full transition-all duration-300 group-hover:w-[4px]"
        style={{ background: cfg.barColor, boxShadow: `0 0 10px ${cfg.barColor}40` }}
      />

      {/* Conteúdo principal */}
      <div className="pl-3 flex-1 flex flex-col gap-2.5 min-w-0">
        {/* Meta row: status + data + eixo */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className={`badge ${badgeClass} text-[9px]`}>
             {status === 'producao' && <div className="dot-live mr-1" />}
             {cfg.label}
          </span>
          <span className="text-[11px] font-medium" style={{ color: "var(--color-text-3)" }}>
            {dataPrevisao}
          </span>
          <span className="section-label lowercase text-[10px] bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
            eixo: <span style={{ color: 'var(--color-text-2)' }}>{eixo}</span>
          </span>
        </div>

        {/* Título */}
        <h3
          className="text-[15px] font-bold tracking-tight leading-snug group-hover:text-[var(--color-accent)] transition-colors"
          style={{ color: "var(--color-text-1)" }}
        >
          {titulo}
        </h3>

        {/* Pipeline de steps */}
        <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
          {steps.map((s) => (
            <span
              key={s.label}
              className="text-[10px] font-semibold flex items-center gap-1"
              style={{
                color: s.done ? "var(--color-success)" : "var(--color-text-3)",
              }}
            >
              <span className={`w-1 h-1 rounded-full ${s.done ? 'bg-[var(--color-success)]' : 'bg-white/20'}`} />
              {s.label}
            </span>
          ))}
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mt-0.5">
          <div
            className="flex-1 h-[3px] rounded-full overflow-hidden bg-white/5"
          >
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ 
                width: `${pct}%`, 
                background: cfg.barColor,
                boxShadow: `0 0 8px ${cfg.barColor}60`
              }}
            />
          </div>
          <span className="text-[10px] font-mono font-bold shrink-0" style={{ color: "var(--color-text-2)" }}>
            {pct}%
          </span>
        </div>
      </div>

      {/* Ações (aparecem no hover) */}
      <div className="flex flex-col items-end gap-2 shrink-0 self-center">
        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          <button className="btn-ghost h-7 px-2.5 text-[10px]">
            Editar
          </button>
          <button
            className="text-[10px] px-2.5 h-7 rounded-lg font-semibold transition-all bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
          >
            Excluir
          </button>
        </div>
        {acaoPrimaria && (
          <button className="btn-primary h-8 px-4 text-[11px] mt-1 shadow-lg shadow-purple-500/10">
            {acaoPrimaria}
          </button>
        )}
      </div>
    </div>
  );
}
