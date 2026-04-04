'use client';

import { useState, useRef, useEffect } from 'react';
import {
  X, Loader2, Sparkles, RotateCcw, CheckCircle2,
  ChevronRight, FileText, Mic, Image, Package, Lightbulb,
  RefreshCw, Scissors, MessageSquare, ArrowRight,
} from 'lucide-react';

/* ─── Tipos ─────────────────────────────────────────────── */
interface VideoDrawerProps {
  videoId: string;
  titulo: string;
  eixo: string;
  canalId: string;
  onClose: () => void;
  onUpdate?: () => void;
}

type Aba = 'ideia' | 'roteiro' | 'narracao' | 'thumb' | 'pacote';

const ABAS: { id: Aba; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'ideia',    label: '1. Ideia/Título',  icon: Lightbulb   },
  { id: 'roteiro',  label: '2. Roteiro',        icon: FileText    },
  { id: 'narracao', label: '3. Narração',        icon: Mic         },
  { id: 'thumb',    label: '4. Thumbnails',      icon: Image       },
  { id: 'pacote',   label: '5. Exportar',        icon: Package     },
];

/* ─── Componente Principal ─────────────────────────────── */
export function VideoDrawer({ videoId, titulo, eixo, canalId, onClose, onUpdate }: VideoDrawerProps) {
  const [abaAtiva, setAbaAtiva] = useState<Aba>('roteiro');
  const [roteiro, setRoteiro] = useState('');
  const [titulos, setTitulos] = useState<string[]>([]);
  const [tituloSelecionado, setTituloSelecionado] = useState('');
  const [loadingRoteiro, setLoadingRoteiro] = useState(false);
  const [loadingTitulos, setLoadingTitulos] = useState(false);
  const [aprovado, setAprovado] = useState({ roteiro: false, audio: false, thumb: false });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [roteiro]);

  async function gerarRoteiro(instrucao?: string) {
    setLoadingRoteiro(true);
    try {
      const res = await fetch('/api/ia/gerar-roteiro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_id: videoId,
          canal_id: canalId,
          titulo,
          tom: instrucao,
        }),
      });
      const data = await res.json();
      if (data.roteiro) setRoteiro(data.roteiro);
    } finally {
      setLoadingRoteiro(false);
    }
  }

  async function gerarTitulos() {
    setLoadingTitulos(true);
    try {
      const res = await fetch('/api/ia/gerar-titulos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ canal_id: canalId, eixo, premissa: titulo }),
      });
      const data = await res.json();
      if (data.titulos) {
        setTitulos(data.titulos);
        setTituloSelecionado(data.titulos[0] ?? '');
      }
    } finally {
      setLoadingTitulos(false);
    }
  }

  async function aprovarRoteiro() {
    await fetch(`/api/videos/${videoId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roteiro, roteiro_aprovado: true, step_roteiro: true }),
    });
    setAprovado((p) => ({ ...p, roteiro: true }));
    setAbaAtiva('narracao');
    onUpdate?.();
  }

  const progresso = Object.values(aprovado).filter(Boolean).length;

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex justify-end"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Drawer */}
      <div
        className="h-full w-full max-w-2xl flex flex-col overflow-hidden"
        style={{
          background: 'var(--color-surface)',
          borderLeft: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-accent text-[10px]">LINHA DE MONTAGEM</span>
              <span className="text-xs" style={{ color: 'var(--color-text-3)' }}>{eixo}</span>
            </div>
            <h2 className="text-[15px] font-bold leading-tight truncate" style={{ color: 'var(--color-text-1)' }}>
              {titulo}
            </h2>
            {/* Barra de progresso */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div
                  className="h-1 rounded-full transition-all duration-500"
                  style={{ width: `${(progresso / 3) * 100}%`, background: 'var(--color-accent)' }}
                />
              </div>
              <span className="text-[10px]" style={{ color: 'var(--color-text-3)' }}>{progresso}/3 etapas</span>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost h-8 w-8 ml-3 shrink-0" style={{ padding: 0 }}>
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Abas */}
        <div className="flex border-b overflow-x-auto" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          {ABAS.map((aba, i) => {
            const isActive = abaAtiva === aba.id;
            const isAprovado =
              (aba.id === 'roteiro' && aprovado.roteiro) ||
              (aba.id === 'narracao' && aprovado.audio) ||
              (aba.id === 'thumb' && aprovado.thumb);
            const Icon = aba.icon;
            return (
              <button
                key={aba.id}
                onClick={() => setAbaAtiva(aba.id)}
                className="flex items-center gap-1.5 px-4 py-3 text-[11px] font-medium shrink-0 border-b-2 transition-all"
                style={{
                  borderBottomColor: isActive ? 'var(--color-accent)' : 'transparent',
                  color: isActive ? 'var(--color-accent)' : isAprovado ? 'var(--color-success)' : 'var(--color-text-3)',
                }}
              >
                {isAprovado ? (
                  <CheckCircle2 className="h-3.5 w-3.5" style={{ color: 'var(--color-success)' }} />
                ) : (
                  <Icon className="h-3.5 w-3.5" />
                )}
                {aba.label}
              </button>
            );
          })}
        </div>

        {/* Conteúdo das Abas */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* ABA: IDEIA/TÍTULO */}
          {abaAtiva === 'ideia' && (
            <div className="space-y-4">
              <div>
                <h3 className="section-label mb-3">Gerar Títulos Magnéticos</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--color-text-3)' }}>
                  A IA vai criar 5 variações de título para o eixo <strong style={{ color: 'var(--color-text-1)' }}>{eixo}</strong>.
                </p>
                <button onClick={gerarTitulos} disabled={loadingTitulos} className="btn-primary">
                  {loadingTitulos ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {loadingTitulos ? 'Gerando títulos...' : 'Gerar 5 Títulos com IA'}
                </button>
              </div>

              {titulos.length > 0 && (
                <div className="space-y-2">
                  {titulos.map((t, i) => (
                    <button
                      key={i}
                      onClick={() => setTituloSelecionado(t)}
                      className="w-full text-left p-3 rounded-lg transition-all"
                      style={{
                        background: tituloSelecionado === t ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.03)',
                        border: tituloSelecionado === t ? '1px solid rgba(124,58,237,0.35)' : '1px solid rgba(255,255,255,0.06)',
                        color: tituloSelecionado === t ? 'var(--color-text-1)' : 'var(--color-text-2)',
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-mono mt-0.5 shrink-0" style={{ color: 'var(--color-text-3)' }}>
                          #{i + 1}
                        </span>
                        <span className="text-sm">{t}</span>
                      </div>
                    </button>
                  ))}

                  {tituloSelecionado && (
                    <button
                      onClick={() => {
                        setAbaAtiva('roteiro');
                        gerarRoteiro();
                      }}
                      className="btn-primary w-full mt-2"
                    >
                      Usar este título e gerar Roteiro
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ABA: ROTEIRO */}
          {abaAtiva === 'roteiro' && (
            <div className="space-y-4">
              <div className="card-inner p-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 shrink-0" style={{ color: 'var(--color-accent)' }} />
                <p className="text-xs" style={{ color: 'var(--color-text-3)' }}>
                  A IA injeta automaticamente a receita do Blueprint do canal antes de gerar.
                </p>
              </div>

              <button onClick={() => gerarRoteiro()} disabled={loadingRoteiro} className="btn-primary w-full">
                {loadingRoteiro ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {loadingRoteiro ? 'Gerando roteiro completo...' : 'Gerar Roteiro Completo com IA'}
              </button>

              {(roteiro || loadingRoteiro) && (
                <div className="space-y-3">
                  <textarea
                    ref={textareaRef}
                    value={roteiro}
                    onChange={(e) => setRoteiro(e.target.value)}
                    disabled={loadingRoteiro}
                    placeholder="O roteiro aparecerá aqui..."
                    className="input w-full min-h-[300px] text-sm leading-relaxed resize-none font-mono"
                    style={{ opacity: loadingRoteiro ? 0.5 : 1 }}
                  />

                  {/* Ações de refinamento */}
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => gerarRoteiro('Refazer completamente com mais tensão')} className="btn-ghost text-xs h-8">
                      <RotateCcw className="h-3 w-3" /> Refazer
                    </button>
                    <button onClick={() => gerarRoteiro('Refazer só o gancho de abertura, mais impactante')} className="btn-ghost text-xs h-8">
                      <RefreshCw className="h-3 w-3" /> Novo Gancho
                    </button>
                    <button onClick={() => gerarRoteiro('Deixar linguagem mais informal e coloquial')} className="btn-ghost text-xs h-8">
                      <MessageSquare className="h-3 w-3" /> + Informal
                    </button>
                    <button onClick={() => gerarRoteiro('Encurtar para formato Shorts/TikTok, máximo 300 palavras')} className="btn-ghost text-xs h-8">
                      <Scissors className="h-3 w-3" /> Versão Shorts
                    </button>
                  </div>

                  {roteiro && !loadingRoteiro && (
                    <button onClick={aprovarRoteiro} className="btn-primary w-full">
                      <CheckCircle2 className="h-4 w-4" />
                      Aprovar Roteiro
                      <ArrowRight className="h-4 w-4" />
                      Ir para Narração
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ABA: NARRAÇÃO */}
          {abaAtiva === 'narracao' && (
            <div className="space-y-4">
              {!aprovado.roteiro ? (
                <div className="card-inner p-6 text-center">
                  <FileText className="h-8 w-8 mx-auto mb-2" style={{ color: 'var(--color-text-3)' }} />
                  <p className="text-sm" style={{ color: 'var(--color-text-3)' }}>Aprove o roteiro primeiro para habilitar a narração.</p>
                  <button onClick={() => setAbaAtiva('roteiro')} className="btn-ghost text-xs mt-3">
                    Ir para Roteiro
                  </button>
                </div>
              ) : (
                <>
                  <div className="card-inner p-3 flex items-center gap-2">
                    <Mic className="h-4 w-4" style={{ color: 'var(--color-accent)' }} />
                    <p className="text-xs" style={{ color: 'var(--color-text-3)' }}>
                      Integração com ElevenLabs será ativada após cadastrar a API Key em Configurações.
                    </p>
                  </div>

                  {/* Voz selecionada */}
                  <div className="space-y-2">
                    <label className="section-label">Voz do Blueprint</label>
                    <select className="input w-full">
                      <option>Marcus — Drama Hushed (Padrão do Blueprint)</option>
                      <option>Sarah — Angry Voice</option>
                      <option>Kid — Criança Inocente</option>
                    </select>
                  </div>

                  <button
                    onClick={async () => {
                      await fetch(`/api/videos/${videoId}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ audio_aprovado: true, step_audio: true }),
                      });
                      setAprovado((p) => ({ ...p, audio: true }));
                      setAbaAtiva('thumb');
                      onUpdate?.();
                    }}
                    className="btn-primary w-full"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Aprovar Narração
                    <ArrowRight className="h-4 w-4" /> Ir para Thumb
                  </button>
                </>
              )}
            </div>
          )}

          {/* ABA: THUMBNAIL */}
          {abaAtiva === 'thumb' && (
            <div className="space-y-4">
              {!aprovado.audio ? (
                <div className="card-inner p-6 text-center">
                  <Mic className="h-8 w-8 mx-auto mb-2" style={{ color: 'var(--color-text-3)' }} />
                  <p className="text-sm" style={{ color: 'var(--color-text-3)' }}>Aprove a narração primeiro.</p>
                  <button onClick={() => setAbaAtiva('narracao')} className="btn-ghost text-xs mt-3">
                    Ir para Narração
                  </button>
                </div>
              ) : (
                <>
                  <div className="card-inner p-3 flex items-center gap-2">
                    <Image className="h-4 w-4" style={{ color: 'var(--color-accent)' }} />
                    <p className="text-xs" style={{ color: 'var(--color-text-3)' }}>
                      Geração de imagens via Gemini Vision/DALL-E será ativada após configurar API Key.
                    </p>
                  </div>

                  {/* Grid de thumbs placeholder estrutural */}
                  <div>
                    <label className="section-label mb-2 block">Escolha de Capas</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[1, 2, 3, 4].map((n) => (
                        <div
                          key={n}
                          className="aspect-video rounded-lg flex items-center justify-center cursor-pointer transition-all"
                          style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: n === 1 ? '2px solid var(--color-accent)' : '1px solid rgba(255,255,255,0.07)',
                          }}
                        >
                          <span className="text-xs" style={{ color: 'var(--color-text-3)' }}>Capa {n}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={async () => {
                      await fetch(`/api/videos/${videoId}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ thumb_aprovada: true, step_thumb: true, step_imagens: true }),
                      });
                      setAprovado((p) => ({ ...p, thumb: true }));
                      setAbaAtiva('pacote');
                      onUpdate?.();
                    }}
                    className="btn-primary w-full"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Aprovar Pacote Visual
                    <ArrowRight className="h-4 w-4" /> Finalizar
                  </button>
                </>
              )}
            </div>
          )}

          {/* ABA: EXPORTAR */}
          {abaAtiva === 'pacote' && (
            <div className="space-y-4">
              <div className="card-inner p-4 space-y-3">
                <h3 className="section-label">Metadados Finais</h3>
                <div className="space-y-1.5">
                  <label className="text-xs" style={{ color: 'var(--color-text-3)' }}>Título Oficial</label>
                  <input defaultValue={titulo} className="input w-full text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs" style={{ color: 'var(--color-text-3)' }}>Descrição YouTube (gerada pela IA)</label>
                  <textarea className="input w-full min-h-[80px] text-sm resize-none" placeholder="Descrição com SEO tags..." />
                </div>
              </div>

              <div className="space-y-3">
                <button className="btn-ghost w-full">
                  <Package className="h-4 w-4" /> Baixar Assets para Editor
                </button>
                <button
                  onClick={async () => {
                    await fetch(`/api/videos/${videoId}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ status: 'agendado', step_agendado: true }),
                    });
                    onUpdate?.();
                    onClose();
                  }}
                  className="btn-primary w-full"
                >
                  <CheckCircle2 className="h-4 w-4" /> Agendar Publicação no YouTube
                </button>
              </div>

              {!aprovado.roteiro && (
                <div className="card-inner p-4 text-center">
                  <p className="text-sm" style={{ color: 'var(--color-text-3)' }}>
                    Complete as etapas anteriores para exportar.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
