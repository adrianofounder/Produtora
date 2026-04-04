"use client";

interface Metrica {
  label: string;
  cor: string;
  bg: string | null;
}

const metricasPadrao: Metrica[] = [
  { label: "Em Planejamento", cor: "var(--color-text-1)", bg: null },
  { label: "Em Produção", cor: "var(--color-accent)", bg: "rgba(124,58,237,.07)" },
  { label: "Prontos", cor: "var(--color-success)", bg: "rgba(16,185,129,.07)" },
  { label: "Agendados", cor: "#60A5FA", bg: "rgba(96,165,250,.07)" },
  { label: "Atrasados", cor: "var(--color-error)", bg: "rgba(239,68,68,.07)" },
];

export interface ChannelCardProps {
  nome: string;
  mare: string;
  ativa: boolean;
  dados: {
    plan: number;
    prod: number;
    pronto: number;
    agend: number;
    atras: number;
    pub: number;
  };
}

export function ChannelCard({ nome, mare, ativa, dados }: ChannelCardProps) {
  const vals = [dados.plan, dados.prod, dados.pronto, dados.agend, dados.atras];

  return (
    <div
      className={ativa ? "card-accent" : "card"}
      style={{ padding: "20px", cursor: "pointer", display: "flex", flexDirection: "column", gap: 16 }}
    >
      {/* Nome + Badge Maré */}
      <div className="flex flex-col gap-2">
        <span
          className="text-[15px] font-bold tracking-tight"
          style={{ color: ativa ? "var(--color-accent)" : "var(--color-text-1)" }}
        >
          {nome}
        </span>
        <span className={`badge self-start ${ativa ? "badge-accent" : "badge-muted"}`}>
          🌊 {mare}
        </span>
      </div>

      {/* Métricas por linha */}
      <div className="flex flex-col gap-1.5">
        {metricasPadrao.map((m, i) => (
          <div
            key={m.label}
            className="flex items-center justify-between px-3 py-2 rounded-lg"
            style={{ background: m.bg ?? "var(--color-surface-2)" }}
          >
            <span className="text-[12px]" style={{ color: "var(--color-text-3)" }}>
              {m.label}
            </span>
            <span className="font-mono text-[14px] font-bold" style={{ color: m.cor }}>
              {vals[i]}
            </span>
          </div>
        ))}

        {/* Publicados em Destaque */}
        <div
          className="flex items-center justify-between px-3 py-2.5 rounded-lg mt-0.5"
          style={{
            background: ativa ? "rgba(124,58,237,0.07)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${ativa ? "rgba(124,58,237,0.22)" : "rgba(255,255,255,0.07)"}`,
          }}
        >
          <span
            className="text-[11px] font-bold uppercase tracking-widest"
            style={{ color: "var(--color-text-3)" }}
          >
            Publicados
          </span>
          <span
            className="font-mono text-[17px] font-bold"
            style={{ color: ativa ? "var(--color-accent)" : "var(--color-text-1)" }}
          >
            {dados.pub}
          </span>
        </div>
      </div>
    </div>
  );
}
