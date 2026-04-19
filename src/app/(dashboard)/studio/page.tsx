"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { BlueprintSection } from "@/components/studio/blueprint-section";
import { MaestroVerdict, SaveStatus } from "@/components/studio/maestro-verdict";
import { TemplateSelector, TriggerGrid } from "@/components/studio/template-selector";

/* ─── Types ─────────────────────────────────────────────── */
interface CanalReal { id: string; nome: string; mare_status: string; }

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
  const [canaisReais, setCanaisReais] = useState<CanalReal[]>([]);
  const [canalId, setCanalId] = useState("");
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
  const [urlAnalise, setUrlAnalise] = useState("");
  const [loadingAnalise, setLoadingAnalise] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [historicoBp, setHistoricoBp] = useState<Array<{
    id: string; titulo_benchmark: string | null; veredito: string | null; quality_score: number | null; updated_at: string | null;
  }>>([]);

  // Carrega canais reais
  useEffect(() => {
    fetch('/api/canais')
      .then(r => r.ok ? r.json() : [])
      .then((data: CanalReal[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setCanaisReais(data);
          setCanalId(data[0].id);
        }
      })
      .catch(() => {});
  }, []);

  // Carrega blueprint do canal selecionado e histórico
  useEffect(() => {
    if (!canalId) return;

    // Fetch blueprint atual
    fetch(`/api/blueprints/${canalId}`)
      .then(r => r.ok ? r.json() : null)
      .then((bp) => {
        if (bp) {
          if (bp.hook) setHook(bp.hook);
          if (bp.tipo_narrativa) setDesenvolvimento(bp.tipo_narrativa);
          if (bp.estrutura_emocional) setCta(bp.estrutura_emocional);
          if (bp.emocao_dominante) setEmocao(bp.emocao_dominante);
          if (bp.voz_narrador) setVoz(bp.voz_narrador);
        } else {
          // Defaults or empty
          setHook("Iniciar narrando pelo ponto mais crítico e injusto da história e pausar dramaticamente — deixando a pergunta no ar.");
          setDesenvolvimento("Apresentar 3 camadas de contexto: o contexto histórico, os personagens-chave e o ponto de virada inesperado.");
          setCta("Encerrar com uma pergunta aberta ao espectador e convite para comentar a opinião. Link para próximo vídeo aparecer.");
        }
      })
      .catch((err) => console.error(err));

    // Fetch histórico
    fetch(`/api/blueprints?canal_id=${canalId}`)
      .then(r => r.ok ? r.json() : [])
      .then((data) => {
        if (Array.isArray(data)) setHistoricoBp(data.slice(0, 3));
      })
      .catch((err) => console.error(err));
  }, [canalId]);

  async function analisarUrl() {
    if (!urlAnalise) return;
    setLoadingAnalise(true);
    try {
      const res = await fetch('/api/ia/analisar-canal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlAnalise, canal_id: canalId }),
      });
      const bp = await res.json();
      if (bp.hook) setHook(bp.hook);
      if (bp.emocao_dominante) setEmocao(bp.emocao_dominante);
      if (bp.tipo_narrativa) setDesenvolvimento(bp.tipo_narrativa);
      if (bp.voz_narrador) setVoz(bp.voz_narrador);
    } finally {
      setLoadingAnalise(false);
    }
  }

  async function salvarBlueprint() {
    if (!canalId) return;
    setSaveStatus('saving');
    try {
      const res = await fetch(`/api/blueprints/${canalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          hook, 
          tipo_narrativa: desenvolvimento, 
          estrutura_emocional: cta,
          emocao_dominante: emocao, 
          voz_narrador: voz,
          veredito: 'ativo',
          quality_score: 8.5
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      setSaveStatus('saved');
      
      // Update history
      fetch(`/api/blueprints?canal_id=${canalId}`)
        .then(r => r.ok ? r.json() : [])
        .then((data) => {
          if (Array.isArray(data)) setHistoricoBp(data.slice(0, 3));
        });

      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error('[Studio Save Error]:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }

  const canalAtivo = canaisReais.find((c) => c.id === canalId) ?? canaisReais[0];

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
          <div className="flex flex-col">
            <p className="text-[11px]" style={{ color: "var(--color-text-3)" }}>Canal Alvo</p>
            <select
              value={canalId}
              onChange={(e) => setCanalId(e.target.value)}
              className="text-[13px] font-bold bg-transparent border-none outline-none cursor-pointer"
              style={{ color: "var(--color-text-1)" }}
            >
              {canaisReais.length === 0
                ? <option value="">Carregando...</option>
                : canaisReais.map((c) => (
                    <option key={c.id} value={c.id} style={{ background: "#121214" }}>
                      {c.nome}
                    </option>
                  ))
              }
            </select>
          </div>
          {canalAtivo && <span className="badge badge-accent ml-2">{canalAtivo.mare_status}</span>}
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
          placeholder="Cole a URL do benchmark para engenharia reversa com IA"
          value={urlAnalise}
          onChange={(e) => setUrlAnalise(e.target.value)}
          className="input flex-1 h-8 px-3 text-[12px]"
        />
        <button onClick={analisarUrl} disabled={loadingAnalise || !urlAnalise} className="btn-primary h-8 px-4 text-[12px] flex-shrink-0">
          {loadingAnalise ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          {loadingAnalise ? 'Analisando...' : 'Analisar com Extrator IA'}
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
            onInject={salvarBlueprint}
            saveStatus={saveStatus}
          />

          {/* Histórico de Blueprints */}
          <div className="card p-5 flex flex-col gap-3">
            {historicoBp.length === 0 ? (
              <p className="text-[12px] text-center py-2 italic" style={{ color: "var(--color-text-3)" }}>
                Nenhum blueprint salvo ainda.
              </p>
            ) : (
              historicoBp.map((b) => {
                const tituloDisplay = b.titulo_benchmark || "Blueprint Engine";
                const statusDisplay = b.veredito || "ativo";
                const scoreDisplay = b.quality_score || 8.5;

                const color =
                  statusDisplay === "publicado" ? "var(--color-text-3)" :
                  statusDisplay === "producao"  ? "#60A5FA" :
                  "var(--color-accent)";
                  
                const scoreColor =
                  scoreDisplay >= 8.5 ? "var(--color-success)" :
                  scoreDisplay >= 7   ? "var(--color-warning)" :
                  "var(--color-error)";

                return (
                  <button
                    key={b.id}
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
                        {tituloDisplay}
                      </p>
                      <p className="text-[10px]" style={{ color: "var(--color-text-3)" }}>
                        {statusDisplay.charAt(0).toUpperCase() + statusDisplay.slice(1)}
                      </p>
                    </div>
                    <span
                      className="text-[12px] font-black font-mono flex-shrink-0"
                      style={{ color: scoreColor }}
                    >
                      {scoreDisplay.toFixed(1)}
                    </span>
                  </button>
                );
              })
            )}
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
