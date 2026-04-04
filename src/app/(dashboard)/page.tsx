"use client";

import {
  AlertOctagon, Activity, Unplug, Clock, Plus,
  LayoutGrid, Tv2, CheckCircle2, CalendarClock, AlertCircle,
} from "lucide-react";

/* ── dados mock ─────────────────────────────────────────── */
const canais = [
  { nome: "Histórias Ocultas", mare: "Aguardando",         ativa: false, plan:4, prod:2, pronto:1, agend:3, atras:0, pub:12 },
  { nome: "Jesus Reage",       mare: "Ativada no Eixo 05!", ativa: true,  plan:0, prod:5, pronto:2, agend:6, atras:2, pub:48 },
  { nome: "Escola Drama",      mare: "Testes rodando",     ativa: false, plan:8, prod:1, pronto:2, agend:1, atras:0, pub:5  },
];

const kpis = [
  { label: "Total Canais",    value: "3",  icon: LayoutGrid,   box: "icon-box-muted",    num: "var(--color-text-1)" },
  { label: "Planejamento",    value: "12", icon: Tv2,          box: "icon-box-muted",    num: "var(--color-text-1)" },
  { label: "Em Produção",     value: "8",  icon: Activity,     box: "icon-box-accent",   num: "var(--color-accent)" },
  { label: "Prontos",         value: "5",  icon: CheckCircle2, box: "icon-box-success",  num: "var(--color-success)" },
  { label: "Agendados",       value: "10", icon: CalendarClock,box: "icon-box-accent",   num: "#60A5FA" },
  { label: "Atrasados",       value: "2",  icon: AlertCircle,  box: "icon-box-error",    num: "var(--color-error)" },
];

const alertas = [
  { icon: AlertOctagon, box: "icon-box-error",   text: 'Canal "Jesus" tem 2 vídeos atrasados' },
  { icon: Activity,     box: "icon-box-accent",  text: "EIXO 05 bateu meta! Escalar canal.", badge: "EIXO 05" },
  { icon: Unplug,       box: "icon-box-warning", text: "Conta YouTube XYZ precisa reconectar" },
];

const publicacoes = [
  { titulo: "Jesus Reage #15",       quando: "Hoje, 18:00" },
  { titulo: "Relatos de Escola #02", quando: "Amanhã, 12:00" },
  { titulo: "Histórias Ocultas #08", quando: "Sábado, 19:00" },
];

const metricas = [
  { label: "Em Planejamento", cor: "var(--color-text-1)",    bg: null },
  { label: "Em Produção",     cor: "var(--color-accent)",    bg: "rgba(94,106,210,.07)" },
  { label: "Prontos",         cor: "var(--color-success)",   bg: "rgba(16,185,129,.07)" },
  { label: "Agendados",       cor: "#60A5FA",                bg: "rgba(96,165,250,.07)" },
  { label: "Atrasados",       cor: "var(--color-error)",     bg: "rgba(239,68,68,.07)" },
];

/* ═══════════════════════════════════════════════════════════
   PÁGINA
═══════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <div className="p-6 max-w-[1280px] mx-auto flex flex-col gap-5">

      {/* ── Header ───────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-[20px] font-bold tracking-tight" style={{ color: "var(--color-text-1)" }}>
            Estado Geral da Fábrica
          </h1>
          <p className="text-[13px] mt-0.5" style={{ color: "var(--color-text-3)" }}>
            Visão macro da operação — todos os canais
          </p>
        </div>
        <button className="btn-primary h-9">
          <Plus className="w-4 h-4" />
          Novo Canal
        </button>
      </div>

      {/* ── KPIs ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="card p-4 flex flex-col gap-3 cursor-default group">
              {/* Icon container */}
              <span className={`icon-box ${k.box}`}>
                <Icon className="w-4 h-4" />
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="section-label">{k.label}</span>
                <span
                  className="text-[28px] font-mono font-bold leading-none mt-1"
                  style={{ color: k.num }}
                >
                  {k.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Maré Banner ──────────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl"
        style={{
          background: "rgba(94,106,210,0.07)",
          border: "1px solid rgba(94,106,210,0.22)",
          boxShadow: "inset 0 1px 0 rgba(94,106,210,0.12)",
        }}
      >
        <span className="icon-box icon-box-accent">
          <Activity className="w-4 h-4" />
        </span>
        <span className="text-[13px] font-bold uppercase tracking-wider" style={{ color: "var(--color-accent)" }}>
          MARÉS ATIVAS: 1
        </span>
        <span className="text-[13px]" style={{ color: "var(--color-text-3)" }}>
          — Eixo 05 explodiu! Canal Jesus Reage.
        </span>
      </div>

      {/* ── Alertas + Publicações ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Alertas */}
        <div className="card p-5 flex flex-col gap-3">
          <h2 className="section-label mb-1">Alertas Imediatos</h2>
          {alertas.map((a, i) => {
            const Icon = a.icon;
            return (
              <div key={i} className="card-inner flex items-start gap-3 px-3 py-3 cursor-pointer hover:border-white/10 transition-colors">
                <span className={`icon-box-sm ${a.box}`} style={{ width: 26, height: 26, borderRadius: 6, flexShrink: 0 }}>
                  <Icon className="w-3.5 h-3.5" />
                </span>
                <p className="text-[13px] leading-snug pt-0.5" style={{ color: "var(--color-text-2)" }}>
                  {a.badge && (
                    <span className="badge badge-accent mr-2">{a.badge}</span>
                  )}
                  {a.text}
                </p>
              </div>
            );
          })}
        </div>

        {/* Próximas Publicações */}
        <div className="card p-5 flex flex-col gap-3">
          <h2 className="section-label mb-1">Próximas Publicações</h2>
          <div className="flex flex-col gap-2">
            {publicacoes.map((p, i) => (
              <div
                key={i}
                className="card-inner flex items-center gap-3 px-3 py-3 cursor-pointer"
              >
                <span className="icon-box-sm icon-box-muted" style={{ width: 26, height: 26, borderRadius: 6 }}>
                  <Clock className="w-3.5 h-3.5" />
                </span>
                <span className="text-[13px] font-medium" style={{ color: "var(--color-text-2)" }}>
                  {p.titulo}
                </span>
                <span className="ml-auto font-mono text-[12px] shrink-0" style={{ color: "var(--color-text-3)" }}>
                  {p.quando}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── A Tropa ───────────────────────────────────────── */}
      <div>
        <h2 className="section-label mb-3">A Tropa — Grid de Canais</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {canais.map((c) => (
            <div
              key={c.nome}
              className={c.ativa ? "card-accent" : "card"}
              style={{ padding: "20px", cursor: "pointer", display: "flex", flexDirection: "column", gap: 16 }}
            >
              {/* Nome + Badge Maré */}
              <div className="flex flex-col gap-2">
                <span
                  className="text-[15px] font-bold tracking-tight"
                  style={{ color: c.ativa ? "var(--color-accent)" : "var(--color-text-1)" }}
                >
                  {c.nome}
                </span>
                <span className={`badge self-start ${c.ativa ? "badge-accent" : "badge-muted"}`}>
                  🌊 {c.mare}
                </span>
              </div>

              {/* Métricas por linha */}
              <div className="flex flex-col gap-1.5">
                {metricas.map((m, i) => {
                  const vals = [c.plan, c.prod, c.pronto, c.agend, c.atras];
                  return (
                    <div
                      key={m.label}
                      className="flex items-center justify-between px-3 py-2 rounded-lg"
                      style={{ background: m.bg ?? "var(--color-surface-2)" }}
                    >
                      <span className="text-[12px]" style={{ color: "var(--color-text-3)" }}>
                        {m.label}
                      </span>
                      <span
                        className="font-mono text-[14px] font-bold"
                        style={{ color: m.cor }}
                      >
                        {vals[i]}
                      </span>
                    </div>
                  );
                })}

                {/* Publicados */}
                <div
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg mt-0.5"
                  style={{
                    background: c.ativa ? "rgba(94,106,210,0.07)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${c.ativa ? "rgba(94,106,210,0.18)" : "rgba(255,255,255,0.07)"}`,
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
                    style={{ color: c.ativa ? "var(--color-accent)" : "var(--color-text-1)" }}
                  >
                    {c.pub}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
