"use client";

import { useState } from "react";
import { Plus, Search, LayoutGrid, Activity, Filter } from "lucide-react";
import { VideoCard, VideoCardProps, VideoStatus } from "@/components/dashboard/video-card";

/* ── dados mock ─────────────────────────────────────────── */
const STEPS_BASE = ["Título", "Roteiro", "Áudio", "Imagens", "Montagem", "Thumb", "Agendado"];

const videos: VideoCardProps[] = [
  {
    titulo: "O chefe que não sabia de nada",
    eixo: "Relatos TRABALHO",
    dataPrevisao: "06/04",
    status: "producao",
    steps: [
      { label: "Título",   done: true  },
      { label: "Roteiro",  done: true  },
      { label: "Áudio",    done: false },
      { label: "Imagens",  done: false },
      { label: "Montagem", done: false },
      { label: "Thumb",    done: false },
      { label: "Agendado", done: false },
    ],
    acaoPrimaria: "Aprovar Áudio",
  },
  {
    titulo: "Fui demitida e olha no que deu",
    eixo: "Relatos TRABALHO",
    dataPrevisao: "07/04",
    status: "planejamento",
    steps: [
      { label: "Título",   done: true  },
      { label: "Roteiro",  done: false },
      { label: "Áudio",    done: false },
      { label: "Imagens",  done: false },
      { label: "Montagem", done: false },
      { label: "Thumb",    done: false },
      { label: "Agendado", done: false },
    ],
    acaoPrimaria: "Revisar Ideia",
  },
  {
    titulo: "O colega que roubava ideias",
    eixo: "Relatos TRABALHO",
    dataPrevisao: "05/04",
    status: "agendado",
    steps: STEPS_BASE.map((label) => ({ label, done: true })),
    acaoPrimaria: "Ver no Calendário",
  },
  {
    titulo: "Minha chefe me humilhava na frente de todos",
    eixo: "Relatos TRABALHO",
    dataPrevisao: "08/04",
    status: "planejamento",
    steps: [
      { label: "Título",   done: true  },
      { label: "Roteiro",  done: false },
      { label: "Áudio",    done: false },
      { label: "Imagens",  done: false },
      { label: "Montagem", done: false },
      { label: "Thumb",    done: false },
      { label: "Agendado", done: false },
    ],
  },
  {
    titulo: "O dia que pedi demissão ao vivo",
    eixo: "Relatos TRABALHO",
    dataPrevisao: "04/04",
    status: "publicado",
    steps: STEPS_BASE.map((label) => ({ label, done: true })),
  },
];

const filtros: { label: string; value: VideoStatus | "todos" }[] = [
  { label: "Todos",        value: "todos"      },
  { label: "Planejamento", value: "planejamento" },
  { label: "Em Produção",  value: "producao"   },
  { label: "Prontos",      value: "pronto"     },
  { label: "Agendados",    value: "agendado"   },
  { label: "Publicados",   value: "publicado"  },
];

const canais = [
  { nome: "Histórias Ocultas", ativa: false, stats: { plan:4, prod:2, pronto:1, agend:3, pub:12 } },
  { nome: "Jesus Reage",       ativa: true,  stats: { plan:0, prod:5, pronto:2, agend:6, pub:48 } },
  { nome: "Escola Drama",      ativa: false, stats: { plan:8, prod:1, pronto:2, agend:1, pub:5  } },
];

/* ── Componente principal ─── */
export default function Canais() {
  const [filtroAtivo, setFiltroAtivo] = useState<VideoStatus | "todos">("todos");
  const [busca, setBusca] = useState("");
  const [canalAtivo, setCanalAtivo] = useState(0);

  const canal = canais[canalAtivo];

  const videosFiltrados = videos.filter((v) => {
    const matchFiltro = filtroAtivo === "todos" || v.status === filtroAtivo;
    const matchBusca  = v.titulo.toLowerCase().includes(busca.toLowerCase());
    return matchFiltro && matchBusca;
  });

  const countPorStatus = (s: VideoStatus | "todos") =>
    s === "todos" ? videos.length : videos.filter((v) => v.status === s).length;

  return (
    <div className="p-6 max-w-[1280px] mx-auto flex flex-col gap-5">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-[20px] font-bold tracking-tight" style={{ color: "var(--color-text-1)" }}>
            Gestão de Canais
          </h1>
          <p className="text-[13px] mt-0.5" style={{ color: "var(--color-text-3)" }}>
            Pipeline de produção e status dos vídeos
          </p>
        </div>
        <button className="btn-primary h-9">
          <Plus className="w-4 h-4" />
          Novo Canal
        </button>
      </div>

      {/* ── Seletor de Canal ────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {canais.map((c, i) => (
          <button
            key={c.nome}
            onClick={() => setCanalAtivo(i)}
            className="text-left p-4 rounded-xl transition-all duration-300"
            style={{
              background: canalAtivo === i
                ? (c.ativa ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.07)")
                : "rgba(255,255,255,0.02)",
              border: canalAtivo === i
                ? (c.ativa ? "1px solid rgba(124,58,237,0.35)" : "1px solid rgba(255,255,255,0.15)")
                : "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-[13px] font-bold"
                style={{ color: c.ativa ? "var(--color-accent)" : "var(--color-text-1)" }}
              >
                {c.nome}
              </span>
              {c.ativa && (
                <span className="badge badge-accent">
                  <Activity className="w-2.5 h-2.5" />
                  Maré Ativa
                </span>
              )}
            </div>
            <div className="flex gap-3 text-[11px]" style={{ color: "var(--color-text-3)" }}>
              <span>Plan: <strong style={{ color: "var(--color-text-2)" }}>{c.stats.plan}</strong></span>
              <span>Prod: <strong style={{ color: "var(--color-accent)" }}>{c.stats.prod}</strong></span>
              <span>OK: <strong style={{ color: "var(--color-success)" }}>{c.stats.pronto}</strong></span>
              <span>Pub: <strong style={{ color: "var(--color-text-1)" }}>{c.stats.pub}</strong></span>
            </div>
          </button>
        ))}
      </div>

      {/* ── Info do Canal Selecionado ───────────────────────── */}
      <div
        className="p-5 rounded-xl flex flex-wrap items-center gap-x-6 gap-y-2"
        style={{
          background: canal.ativa ? "rgba(124,58,237,0.06)" : "rgba(255,255,255,0.02)",
          border: canal.ativa ? "1px solid rgba(124,58,237,0.20)" : "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex-1 min-w-[200px]">
          <p className="text-[12px] font-bold uppercase tracking-wider" style={{ color: "var(--color-text-3)" }}>
            Canal Ativo
          </p>
          <p className="text-[17px] font-bold mt-0.5" style={{ color: "var(--color-text-1)" }}>
            {canal.nome}
          </p>
        </div>
        <div className="flex gap-5 text-[12px]">
          {[
            { l: "Idioma",      v: "PT-BR"            },
            { l: "Frequência",  v: "1/dia"             },
            { l: "Horário",     v: "18h00"             },
          ].map(({ l, v }) => (
            <div key={l} className="flex flex-col gap-0.5">
              <span style={{ color: "var(--color-text-3)" }}>{l}</span>
              <span className="font-semibold" style={{ color: "var(--color-text-1)" }}>{v}</span>
            </div>
          ))}
        </div>
        <button className="btn-ghost h-8 text-[12px]">
          <LayoutGrid className="w-3.5 h-3.5" />
          Analytics & X-Ray
        </button>
      </div>

      {/* ── Abas / Filtros ─────────────────────────────────── */}
      <div
        className="flex items-center justify-between p-3 rounded-xl gap-3 flex-wrap"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Filtros de status */}
        <div className="flex gap-1.5 flex-wrap">
          {filtros.map((f) => {
            const ativo = filtroAtivo === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setFiltroAtivo(f.value)}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all duration-200"
                style={{
                  background: ativo ? "rgba(124,58,237,0.15)" : "transparent",
                  border: ativo ? "1px solid rgba(124,58,237,0.30)" : "1px solid transparent",
                  color: ativo ? "var(--color-accent)" : "var(--color-text-3)",
                }}
              >
                {f.label}
                <span className="ml-1.5 opacity-60">({countPorStatus(f.value)})</span>
              </button>
            );
          })}
        </div>

        {/* Busca + CTA */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center">
            <Search
              className="absolute left-2.5 w-3.5 h-3.5 pointer-events-none"
              style={{ color: "var(--color-text-3)" }}
            />
            <input
              type="text"
              placeholder="Buscar títulos..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="input pl-8 pr-3 h-8 text-[12px] w-44"
            />
          </div>
          <button className="btn-ghost h-8 text-[11px]">
            <Filter className="w-3.5 h-3.5" />
            Filtrar
          </button>
          <button className="btn-primary h-8 text-[11px]">
            <Plus className="w-3.5 h-3.5" />
            Novo Vídeo
          </button>
        </div>
      </div>

      {/* ── Lista de Vídeos (Kanban vertical) ──────────────── */}
      <div className="flex flex-col gap-2.5 pb-6">
        {videosFiltrados.length === 0 ? (
          <div
            className="text-center py-16 rounded-xl"
            style={{
              border: "1px dashed rgba(255,255,255,0.08)",
              color: "var(--color-text-3)",
            }}
          >
            <p className="text-[14px]">Nenhum vídeo encontrado para este filtro.</p>
          </div>
        ) : (
          videosFiltrados.map((v, i) => <VideoCard key={i} {...v} />)
        )}
      </div>

    </div>
  );
}
