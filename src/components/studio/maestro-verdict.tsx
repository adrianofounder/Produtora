"use client";

export type VerdictLevel = "alto" | "medio" | "baixo";

export interface VerdictItem {
  label: string;
  value: string;
  level?: VerdictLevel;
}

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface MaestroVerdictProps {
  score: number;          // 0–10
  verdict: VerdictItem[];
  onInject?: () => void;
  saveStatus?: SaveStatus;
}

const verdictColors: Record<VerdictLevel, string> = {
  alto:  "var(--color-error)",
  medio: "var(--color-warning)",
  baixo: "var(--color-success)",
};

function ScoreRing({ score }: { score: number }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const fill = (score / 10) * circ;

  const ringColor =
    score >= 8 ? "var(--color-success)" :
    score >= 6 ? "var(--color-warning)" :
    "var(--color-error)";

  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg width="56" height="56" className="absolute inset-0 -rotate-90">
        <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
        <circle
          cx="28" cy="28" r={r}
          fill="none"
          stroke={ringColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ - fill}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
      <span
        className="text-[15px] font-black font-mono relative z-10"
        style={{ color: ringColor }}
      >
        {score.toFixed(1)}
      </span>
    </div>
  );
}

export function MaestroVerdict({ score, verdict, onInject, saveStatus = 'idle' }: MaestroVerdictProps) {
  const scoreColor =
    score >= 8 ? "var(--color-success)" :
    score >= 6 ? "var(--color-warning)" :
    "var(--color-error)";

  const topBorderColor =
    score >= 8 ? "var(--color-success)" :
    score >= 6 ? "var(--color-warning)" :
    "var(--color-error)";

  return (
    <div
      className="card flex flex-col gap-5 p-5"
      style={{ borderTop: `3px solid ${topBorderColor}` }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <ScoreRing score={score} />
        <div>
          <p className="section-label mb-0.5">Veredito do Maestro</p>
          <p
            className="text-[13px] font-bold leading-tight"
            style={{ color: scoreColor }}
          >
            {score >= 8
              ? "Blueprint Aprovado"
              : score >= 6
              ? "Refinamento Necessário"
              : "Risco de Falha"}
          </p>
        </div>
      </div>

      {/* Métricas */}
      <div className="flex flex-col gap-2">
        {verdict.map((item) => (
          <div key={item.label} className="flex justify-between items-center py-1.5 border-b" style={{ borderColor: "var(--color-border)" }}>
            <span className="text-[12px]" style={{ color: "var(--color-text-3)" }}>
              {item.label}
            </span>
            <span
              className="text-[12px] font-bold"
              style={{
                color: item.level ? verdictColors[item.level] : "var(--color-text-1)",
              }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={onInject}
        disabled={saveStatus === 'saving'}
        className="btn-primary w-full h-9 justify-center disabled:opacity-50"
      >
        {saveStatus === 'saving' ? "⚡ Salvando..." :
         saveStatus === 'saved' ? "✅ Salvo!" :
         saveStatus === 'error' ? "❌ Erro ao salvar" :
         "⚡ Injetar no Motor"}
      </button>

      {/* Ghost btn */}
      <button className="btn-ghost w-full h-8 justify-center text-[12px] opacity-70 cursor-not-allowed">
        Salvar Rascunho
      </button>
    </div>
  );
}
