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

  return (
    <div
      className="group relative flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300"
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
      }}
    >
      {/* Barra lateral de status */}
      <div
        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full"
        style={{ background: cfg.barColor }}
      />

      {/* Conteúdo principal */}
      <div className="pl-3 flex-1 flex flex-col gap-2.5 min-w-0">
        {/* Meta row: status + data + eixo */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
            style={{
              color: cfg.color,
              background: cfg.bg,
              border: `1px solid ${cfg.border}`,
            }}
          >
            {cfg.label}
          </span>
          <span className="text-[11px]" style={{ color: "var(--color-text-3)" }}>
            {dataPrevisao}
          </span>
          <span
            className="text-[11px] font-medium px-2 py-0.5 rounded-md"
            style={{
              color: "var(--color-text-3)",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            Eixo: {eixo}
          </span>
        </div>

        {/* Título */}
        <h3
          className="text-[15px] font-bold tracking-tight leading-snug"
          style={{ color: "var(--color-text-1)" }}
        >
          {titulo}
        </h3>

        {/* Pipeline de steps */}
        <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
          {steps.map((s) => (
            <span
              key={s.label}
              className="text-[10px] font-semibold"
              style={{
                color: s.done ? "var(--color-success)" : "var(--color-text-3)",
              }}
            >
              {s.done ? "✓" : "·"} {s.label}
            </span>
          ))}
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mt-0.5">
          <div
            className="flex-1 h-[3px] rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, background: cfg.barColor }}
            />
          </div>
          <span className="text-[10px] font-mono shrink-0" style={{ color: "var(--color-text-3)" }}>
            {pct}%
          </span>
        </div>
      </div>

      {/* Ações (aparecem no hover) */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            className="text-[11px] px-2.5 py-1 rounded-md font-medium transition-colors"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.10)",
              color: "var(--color-text-2)",
            }}
          >
            Editar
          </button>
          <button
            className="text-[11px] px-2.5 py-1 rounded-md font-medium transition-colors"
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.15)",
              color: "var(--color-error)",
            }}
          >
            Excluir
          </button>
        </div>
        {acaoPrimaria && (
          <button className="btn-primary h-8 text-[11px] mt-1">
            {acaoPrimaria}
          </button>
        )}
      </div>
    </div>
  );
}
