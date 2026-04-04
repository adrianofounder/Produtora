"use client";

import { useState } from "react";
import { BlueprintSection } from "@/components/studio/blueprint-section";
import { MaestroVerdict } from "@/components/studio/maestro-verdict";
import { TemplateSelector, TriggerGrid } from "@/components/studio/template-selector";

/* ─── Mock Data ─────────────────────────────────────────── */

const CANAIS = [
  { id: "c1", nome: "Histórias Ocultas", avatar: "🏛️", niche: "Mistério" },
  { id: "c2", nome: "Crimes Reais BR",   avatar: "🔍", niche: "True Crime" },
  { id: "c3", nome: "Fronteiras do Tempo", avatar: "⏳", niche: "História" },
];

const VOZES = [
  "Marcus (Drama Hushed)",
  "Sophia (Authoritative)",
  "Rafael (Storyteller)",
  "Luna (Suspense)",
];

const EMOCOES = [
  "Choque Moral",
  "Curiosidade Intensa",
  "Medo Controlado",
  "Revolta Justa",
  "Empatia Profunda",
];

const TEMPLATES = [
  { id: "t1", name: "Crime & Justiça",     emoji: "⚖️", category: "True Crime" },
  { id: "t2", name: "Mistério Histórico",   emoji: "🏛️", category: "Investigação" },
  { id: "t3", name: "Revelação Chocante",   emoji: "💥", category: "Hook Direto"  },
  { id: "t4", name: "Jornada do Herói",     emoji: "🔥", category: "Narrativa"    },
];

const TRIGGERS_INICIAL = [
  { id: "tr1", label: "Curiosity Gap",      active: false },
  { id: "tr2", label: "Choque Moral",       active: true  },
  { id: "tr3", label: "Prova Social",       active: false },
  { id: "tr4", label: "Urgência",           active: false },
  { id: "tr5", label: "FOMO",               active: false },
  { id: "tr6", label: "Identidade Tribal",  active: true  },
  { id: "tr7", label: "Authority Bias",     active: false },
  { id: "tr8", label: "Pattern Interrupt",  active: true  },
];

const VERDICT_ITEMS = [
  { label: "Quality Score",      value: "8.5 / 10", level: "baixo"  as const },
  { label: "Gatilho Escapado",   value: "Curiosity Gap", },
  { label: "Risco de Drop-off",  value: "Baixo",     level: "baixo"  as const },
  { label: "Aderência ao Eixo",  value: "Alta",      level: "baixo"  as const },
  { label: "Viralidade Est.",    value: "~340K views" },
];

/* ─── Page ────────────────────────────────────────────────── */

export default function StudioPage() {
  const [canalId, setCanalId] = useState("c1");
  const [templateId, setTemplateId] = useState("t1");
  const [triggers, setTriggers] = useState(TRIGGERS_INICIAL);
  const [voz, setVoz] = useState(VOZES[0]);
  const [emocao, setEmocao] = useState(EMOCOES[0]);
  const [hook, setHook] = useState(
    "Iniciar narrando pelo ponto mais crítico e injusto da história e pausar dramaticamente — deixando a pergunta no ar."
  );
  const [desenvolvimento, setDesenvolvimento] = useState(
    "Apresentar 3 camadas de contexto: o contexto histórico, os personagens-chave e o ponto de virada inesperado."
  );
  const [cta, setCta] = useState(
    "Encerrar com uma pergunta aberta ao espectador e convite para comentar a opinião. Link para próximo vídeo aparecer."
  );

  const canalAtivo = CANAIS.find((c) => c.id === canalId) ?? CANAIS[0];

  function toggleTrigger(id: string) {
    setTriggers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t))
    );
  }

  return (
    <div className="relative flex flex-col gap-6 min-h-full">

      {/* ── Mesh BG ── */}
      <div
        className="pointer-events-none absolute right-0 top-0 w-[45vw] h-[45vh] z-[-1]"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.10) 0%, rgba(37,99,235,0.04) 50%, transparent 80%)",
          filter: "blur(100px)",
        }}
      />

      {/* ── Header ── */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="section-label mb-1">Epic 3</p>
          <h1
            className="text-2xl font-black tracking-tight leading-none"
            style={{ color: "var(--color-text-1)" }}
          >
            Studio&nbsp;
            <span
              style={{
                background: "linear-gradient(90deg, #7C3AED, #3B82F6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Blueprint
            </span>
          </h1>
          <p className="text-[13px] mt-1" style={{ color: "var(--color-text-3)" }}>
            Engenharia de Retenção e Receita — montagem inteligente de roteiros
          </p>
        </div>

        {/* Canal Selector */}
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span className="text-lg leading-none">{canalAtivo.avatar}</span>
          <div className="flex flex-col">
            <p className="text-[11px]" style={{ color: "var(--color-text-3)" }}>Canal Alvo</p>
            <select
              value={canalId}
              onChange={(e) => setCanalId(e.target.value)}
              className="text-[13px] font-bold bg-transparent border-none outline-none cursor-pointer"
              style={{ color: "var(--color-text-1)" }}
            >
              {CANAIS.map((c) => (
                <option key={c.id} value={c.id} style={{ background: "#121214" }}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>
          <span className="badge badge-accent ml-2">{canalAtivo.niche}</span>
        </div>
      </header>

      {/* ── URL Extractor Bar ── */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl"
        style={{
          background: "rgba(124,58,237,0.05)",
          border: "1px solid rgba(124,58,237,0.18)",
        }}
      >
        <span className="icon-box icon-box-accent flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </span>
        <input
          type="url"
          placeholder="Cole a URL do vídeo viral para análise (ex: https://youtube.com/watch?v=...)"
          defaultValue="https://youtube.com/watch?v=dQw4w9WgXcQ"
          className="input flex-1 h-8 px-3 text-[12px]"
        />
        <button className="btn-primary h-8 px-4 text-[12px] flex-shrink-0">
          ⚡ Analisar com Extrator IA
        </button>
      </div>

      {/* ── Main Layout ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">

        {/* ── Editor Column ── */}
        <div className="flex flex-col gap-5">

          {/* Template + Triggers */}
          <div
            className="card p-5 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <TemplateSelector
              templates={TEMPLATES}
              activeId={templateId}
              onSelect={setTemplateId}
            />

            <TriggerGrid triggers={triggers} onToggle={toggleTrigger} />
          </div>

          {/* Voz + Emoção */}
          <div className="card p-5 flex flex-col gap-4">
            <p
              className="text-[13px] font-bold"
              style={{ color: "var(--color-text-1)" }}
            >
              Parâmetros de Narração
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="section-label">Voz do Narrador</label>
                <select
                  value={voz}
                  onChange={(e) => setVoz(e.target.value)}
                  className="input h-9 px-3 text-[13px]"
                >
                  {VOZES.map((v) => (
                    <option key={v} value={v} style={{ background: "#121214" }}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="section-label">Emoção Dominante</label>
                <select
                  value={emocao}
                  onChange={(e) => setEmocao(e.target.value)}
                  className="input h-9 px-3 text-[13px]"
                >
                  {EMOCOES.map((e) => (
                    <option key={e} value={e} style={{ background: "#121214" }}>
                      {e}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Estrutura de Engajamento */}
          <div className="card p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p
                className="text-[13px] font-bold"
                style={{ color: "var(--color-text-1)" }}
              >
                Estrutura de Engajamento
              </p>
              <span className="badge badge-accent">Blueprint Ativo</span>
            </div>

            <div className="flex flex-col gap-3">
              {/* A — Hook */}
              <BlueprintSection
                index="A"
                title="Hook Inquebrável (0–5s)"
                description="Primeira impressão que captura antes do swipe"
              >
                <textarea
                  value={hook}
                  onChange={(e) => setHook(e.target.value)}
                  rows={3}
                  className="input w-full px-3 py-2 text-[13px] leading-relaxed resize-none"
                  style={{ minHeight: "72px" }}
                />
              </BlueprintSection>

              {/* B — Desenvolvimento */}
              <BlueprintSection
                index="B"
                title="Desenvolvimento Narrativo (0:05–8:00)"
                description="Layers de contexto, personagens e virada"
              >
                <textarea
                  value={desenvolvimento}
                  onChange={(e) => setDesenvolvimento(e.target.value)}
                  rows={3}
                  className="input w-full px-3 py-2 text-[13px] leading-relaxed resize-none"
                  style={{ minHeight: "72px" }}
                />
              </BlueprintSection>

              {/* C — CTA */}
              <BlueprintSection
                index="C"
                title="CTA de Conversão Final"
                description="Engate para engajamento e retenção de subscriber"
              >
                <textarea
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  rows={3}
                  className="input w-full px-3 py-2 text-[13px] leading-relaxed resize-none"
                  style={{ minHeight: "72px" }}
                />
              </BlueprintSection>
            </div>
          </div>

          {/* Bento de Métricas Estimadas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Retenção Est.",   value: "68%",    color: "var(--color-success)", icon: "📈" },
              { label: "CTR Previsto",    value: "7.2%",   color: "var(--color-accent)",  icon: "🎯" },
              { label: "Virabilidade",    value: "Alta",   color: "var(--color-success)", icon: "🔥" },
              { label: "Tempo Produção",  value: "~4h",    color: "var(--color-text-2)",  icon: "⏱️" },
            ].map((m) => (
              <div key={m.label} className="card-inner p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-base leading-none">{m.icon}</span>
                  <span className="section-label">{m.label}</span>
                </div>
                <p
                  className="text-xl font-black font-mono tracking-tight"
                  style={{ color: m.color }}
                >
                  {m.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Verdict Sidebar ── */}
        <div className="flex flex-col gap-4">
          <MaestroVerdict
            score={8.5}
            verdict={VERDICT_ITEMS}
            onInject={() => alert("Blueprint injetado no motor de produção!")}
          />

          {/* Histórico de Blueprints */}
          <div className="card p-5 flex flex-col gap-3">
            <p className="section-label">Histórico de Blueprints</p>
            {[
              { titulo: "O Assassinato de Eliza Sims", score: 9.1, status: "publicado" },
              { titulo: "A Queda do Imperador",        score: 7.4, status: "producao" },
              { titulo: "Caso JBS — A Fita Perdida",   score: 8.8, status: "pronto"  },
            ].map((b) => {
              const color =
                b.status === "publicado" ? "var(--color-text-3)" :
                b.status === "pronto"    ? "#60A5FA" :
                "var(--color-accent)";
              const scoreColor =
                b.score >= 8.5 ? "var(--color-success)" :
                b.score >= 7   ? "var(--color-warning)" :
                "var(--color-error)";

              return (
                <button
                  key={b.titulo}
                  className="card-inner flex items-center gap-3 p-3 text-left w-full cursor-pointer"
                >
                  <div
                    className="w-1.5 h-8 rounded-full flex-shrink-0"
                    style={{ background: color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[12px] font-semibold truncate"
                      style={{ color: "var(--color-text-2)" }}
                    >
                      {b.titulo}
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--color-text-3)" }}>
                      {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                    </p>
                  </div>
                  <span
                    className="text-[12px] font-black font-mono flex-shrink-0"
                    style={{ color: scoreColor }}
                  >
                    {b.score}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Dicas do Sistema */}
          <div
            className="p-4 rounded-xl flex flex-col gap-2"
            style={{
              background: "rgba(234,179,8,0.05)",
              border: "1px solid rgba(234,179,8,0.15)",
            }}
          >
            <p
              className="section-label"
              style={{ color: "var(--color-premium)" }}
            >
              💡 Insight do Maestro
            </p>
            <p className="text-[12px] leading-relaxed" style={{ color: "var(--color-text-2)" }}>
              Adicionar o gatilho <strong style={{ color: "var(--color-text-1)" }}>Curiosity Gap</strong> pode
              aumentar o CTR em até <strong style={{ color: "var(--color-premium)" }}>+1.8%</strong> para o
              nicho de True Crime com base nos últimos 30 blueprints aprovados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
