'use client';

/**
 * gaveta-producao.tsx
 * Story 3.2 e 3.3 — Gaveta de Produção (EPIC-03)
 *
 * Sheet/Drawer lateral que abre sobre o Kanban.
 * Abas: [Roteiro] | [Áudio] | [Asset]
 */

import { useState, useTransition, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, FileText, Headphones, Image, Sparkles, Loader2, Save,
  AlertTriangle, CheckCircle2, ZapOff, WifiOff, RefreshCw, Play, Pause, Mic, Box, Download, ArrowRight, Paintbrush
} from 'lucide-react';
import { generateScriptAction, saveScriptAction, generateParagraphAudioAction, generateThumbnailAction, finalizeVideoProductionAction } from '@/app/actions/gaveta-actions';
import { createProductionZip, ZipAsset } from '@/lib/utils/zipper-service';
import type { GenerateScriptResult } from '@/app/actions/gaveta-actions';
import { ContextualChat } from './contextual-chat';
import { cn } from '@/lib/utils';

// ============================================================
// Tipos
// ============================================================

interface Blueprint {
  voz_narrador?: string | null;
  estrutura_emocional?: string | null;
  tipo_narrativa?: string | null;
  emocao_dominante?: string | null;
}

export interface VideoGavetaData {
  id: string;
  titulo: string;
  eixo?: string | null;
  status: string;
  roteiro?: string | null;
  thumb_url?: string | null;
  thumb_aprovada?: boolean | null;
  canal: {
    nome: string;
    blueprint?: Blueprint | null;
  };
}

export interface ScriptParagraph {
  id: string;
  text: string;
  audioUrl?: string;
  isGeneratingAudio?: boolean;
}

interface GavetaProducaoProps {
  isOpen: boolean;
  onClose: () => void;
  video: VideoGavetaData | null;
  onScriptSaved?: () => void;
}

type TabId = 'roteiro' | 'audio' | 'asset' | 'exportar';

const TABS: { id: TabId; label: string; icon: React.ElementType; available: boolean }[] = [
  { id: 'roteiro', label: 'Roteiro', icon: FileText, available: true },
  { id: 'audio', label: 'Áudio', icon: Headphones, available: true },
  { id: 'asset', label: 'Capa Visual', icon: Image, available: true },
  { id: 'exportar', label: 'Empacotar', icon: Box, available: true }
];

// ============================================================
// Mapeamento de Erro
// ============================================================

const ERROR_DISPLAY: Record<string, { icon: React.ElementType; title: string; color: string }> = {
  SPEND_LIMIT_REACHED: { icon: ZapOff, title: 'Teto de Gastos Atingido', color: 'text-amber-400' },
  CREDENTIAL_NOT_FOUND: { icon: ZapOff, title: 'Credencial não configurada', color: 'text-amber-400' },
  PROVIDER_UNAVAILABLE: { icon: WifiOff, title: 'Motor Criativo Indisponível', color: 'text-red-400' },
  AUTH_REQUIRED: { icon: AlertTriangle, title: 'Sessão Expirada', color: 'text-red-400' },
  UNKNOWN: { icon: AlertTriangle, title: 'Erro Inesperado', color: 'text-red-400' },
};

// ============================================================
// Sub-componente: Aba de Roteiro
// ============================================================

interface RoteiroTabProps {
  videoId: string;
  initialParagraphs: ScriptParagraph[];
  onSaveSuccess?: () => void;
}

function RoteiroTab({ videoId, initialParagraphs, onSaveSuccess }: RoteiroTabProps) {
  const [paragraphs, setParagraphs] = useState<ScriptParagraph[]>(initialParagraphs);
  const [generateError, setGenerateError] = useState<GenerateScriptResult | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isGenerating, startGenerating] = useTransition();
  const [isSaving, startSaving] = useTransition();

  const handleGenerate = useCallback(() => {
    setGenerateError(null);
    setSaveStatus('idle');

    startGenerating(async () => {
      const result = await generateScriptAction(videoId);
      if (!result.success) {
        setGenerateError(result);
        return;
      }
      setParagraphs(result.paragraphs.map(p => ({
        id: `para-${Math.random().toString(36).substr(2, 9)}`,
        text: p
      })));
    });
  }, [videoId]);

  const handleParagraphChange = useCallback((index: number, value: string) => {
    setParagraphs((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], text: value };
      return next;
    });
  }, []);

  const handleSave = useCallback(() => {
    if (!paragraphs.length) return;
    setSaveStatus('saving');
    startSaving(async () => {
      const result = await saveScriptAction(videoId, paragraphs);
      if (result.success) {
        setSaveStatus('saved');
        onSaveSuccess?.();
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    });
  }, [videoId, paragraphs, onSaveSuccess]);

  return (
    <div className="flex flex-col gap-5 h-full">
      <button
        onClick={handleGenerate}
        disabled={isGenerating || isSaving}
        className={cn('btn-primary h-12 w-full shadow-lg shadow-purple-500/25 transition-all duration-200', isGenerating && 'opacity-70 cursor-not-allowed')}
      >
        {isGenerating ? (
          <><Loader2 className="w-4 h-4 animate-spin" /><span>Conectando com Motor Criativo...</span></>
        ) : (
          <><Sparkles className="w-4 h-4" /><span>{paragraphs.length > 0 ? 'Regerar Roteiro' : 'Gerar Roteiro'}</span></>
        )}
      </button>

      <AnimatePresence>
        {generateError && !generateError.success && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
            {(() => {
              const cfg = ERROR_DISPLAY[generateError.errorCode] ?? ERROR_DISPLAY['UNKNOWN'];
              const Icon = cfg.icon;
              return (
                <div className="flex items-start gap-3">
                  <Icon className={cn('w-5 h-5 mt-0.5 shrink-0', cfg.color)} />
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-sm font-bold', cfg.color)}>{cfg.title}</p>
                    <p className="text-xs text-[var(--color-text-3)] mt-1">{generateError.errorMessage}</p>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {paragraphs.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3 flex-1">
          <div className="flex items-center justify-between">
            <p className="section-label opacity-60">Edite o Roteiro</p>
            <span className="text-[10px] font-mono opacity-30">{paragraphs.length} parágrafos</span>
          </div>
          <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-1 max-h-[45vh]">
            {paragraphs.map((para, i) => (
              <div key={para.id} className="group relative">
                <span className="absolute left-3 top-3 text-[10px] font-mono text-[var(--color-accent)]/40 select-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <textarea
                  value={para.text}
                  onChange={(e) => handleParagraphChange(i, e.target.value)}
                  rows={3}
                  className={cn(
                    'w-full resize-none rounded-xl border border-white/5 bg-white/5 text-sm',
                    'text-[var(--color-text-2)] pl-9 pr-4 py-3 leading-relaxed',
                    'focus:outline-none focus:border-[var(--color-accent)]/40 focus:bg-white/8 transition-all',
                    'group-hover:border-white/10'
                  )}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 pt-2 border-t border-white/5">
            <button
              onClick={handleSave}
              disabled={isSaving || saveStatus === 'saving'}
              className={cn('btn-primary flex-1 h-10 text-sm', saveStatus === 'saved' && 'bg-green-600/80 border-green-500/30', saveStatus === 'error' && 'bg-red-600/80 border-red-500/30')}
            >
              {saveStatus === 'saving' || isSaving ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" />Salvando...</>
              ) : saveStatus === 'saved' ? (
                <><CheckCircle2 className="w-3.5 h-3.5" />Roteiro Salvo!</>
              ) : saveStatus === 'error' ? (
                <><AlertTriangle className="w-3.5 h-3.5" />Falha ao Salvar</>
              ) : (
                <><Save className="w-3.5 h-3.5" />Salvar Roteiro</>
              )}
            </button>
          </div>
        </motion.div>
      )}
      {!isGenerating && paragraphs.length === 0 && !generateError && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 opacity-40">
          <FileText className="w-10 h-10" />
          <p className="text-sm font-medium">Nenhum roteiro gerado ainda</p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Sub-componente: Aba de Ouvir (Áudio)
// ============================================================

interface OuvirTabProps {
  videoId: string;
  initialParagraphs: ScriptParagraph[];
  onAudioSaved?: () => void;
}

function OuvirTab({ videoId, initialParagraphs, onAudioSaved }: OuvirTabProps) {
  const [paragraphs, setParagraphs] = useState<ScriptParagraph[]>(initialParagraphs);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const handleGenerateAudio = async (index: number) => {
    const para = paragraphs[index];
    if (!para.text.trim()) return;

    setErrorMsg(null);
    const updated = [...paragraphs];
    updated[index].isGeneratingAudio = true;
    setParagraphs(updated);

    const result = await generateParagraphAudioAction(videoId, para.id, para.text);
    
    const finalUpdate = [...paragraphs];
    finalUpdate[index].isGeneratingAudio = false;

    if (result.success) {
      finalUpdate[index].audioUrl = result.audioUrl;
      setParagraphs(finalUpdate);
      if (onAudioSaved) onAudioSaved();
    } else {
      setParagraphs(finalUpdate);
      setErrorMsg(result.errorMessage);
    }
  };

  if (!paragraphs.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 opacity-40 h-full">
        <Headphones className="w-10 h-10" />
        <p className="text-sm font-medium text-center">Nenhum roteiro salvo ainda.</p>
        <p className="text-xs text-[var(--color-text-3)] text-center max-w-[200px]">
          Salve o roteiro na aba anterior antes de gerar o áudio.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      {errorMsg && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex items-center gap-3">
          <ZapOff className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-sm text-red-200">{errorMsg}</p>
        </div>
      )}

      <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-1 max-h-[60vh]">
        {paragraphs.map((para, i) => (
          <div key={para.id} className="flex flex-col gap-2 p-4 rounded-xl border border-white/5 bg-white/5">
            <p className="text-sm text-[var(--color-text-2)] leading-relaxed line-clamp-3">
              {para.text}
            </p>
            <div className="flex items-center justify-end mt-2">
              {para.audioUrl ? (
                <div className="flex items-center gap-3 w-full">
                  <audio src={para.audioUrl} controls className="h-8 flex-1 outline-none" />
                  <button
                    onClick={() => handleGenerateAudio(i)}
                    disabled={para.isGeneratingAudio}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded hover:bg-white/10 text-[var(--color-text-3)] transition-colors"
                  >
                    {para.isGeneratingAudio ? <Loader2 className="w-3 h-3 animate-spin"/> : <RefreshCw className="w-3 h-3"/>}
                    Regerar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleGenerateAudio(i)}
                  disabled={para.isGeneratingAudio}
                  className="btn-primary w-full h-9 text-xs flex items-center justify-center gap-2"
                >
                  {para.isGeneratingAudio ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Processando Motor TTS...</>
                  ) : (
                    <><Mic className="w-3.5 h-3.5" /> Gerar Áudio deste Parágrafo</>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Sub-componente: Aba Asset Visual (Thumb)
// ============================================================

interface AssetTabProps {
  videoId: string;
  currentThumbUrl?: string | null;
  onThumbSaved?: (url: string) => void;
}

function AssetTab({ videoId, currentThumbUrl, onThumbSaved }: AssetTabProps) {
  const [thumbUrl, setThumbUrl] = useState<string | null>(currentThumbUrl || null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isGenerating, startGenerating] = useTransition();

  const handleGenerate = () => {
    setErrorMsg(null);
    startGenerating(async () => {
      const result = await generateThumbnailAction(videoId);
      if (result.success) {
        setThumbUrl(result.thumbUrl);
        if (onThumbSaved) onThumbSaved(result.thumbUrl);
      } else {
        setErrorMsg(result.errorMessage);
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {errorMsg && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex items-center gap-3">
          <ZapOff className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-sm text-red-200">{errorMsg}</p>
        </div>
      )}

      <div className="flex-1 rounded-xl bg-black/40 border border-white/5 flex flex-col overflow-hidden relative group">
        {thumbUrl ? (
          <img src={thumbUrl} alt="Thumbnail Concept" className="w-full h-[250px] object-cover" />
        ) : (
          <div className="w-full h-[250px] flex items-center justify-center text-white/20">
            <Image className="w-16 h-16 opacity-50" />
          </div>
        )}

        <div className="p-5 flex flex-col gap-4">
          <p className="text-sm text-[var(--color-text-2)] leading-relaxed text-center">
            A thumbnail será criada seguindo a <strong>estética visual</strong> definida no Blueprint do seu canal e adaptada ao tema geral deste vídeo.
          </p>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="btn-primary h-12 text-sm shadow-xl mt-auto w-full flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Mapeando Arte e Gerando...</>
            ) : (
              <><Paintbrush className="w-4 h-4" /> {thumbUrl ? 'Regerar Conceito' : 'Criar Capa Conceitual'}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Sub-componente: Aba Retaguarda / Exportar (Aba 5)
// ============================================================

interface ExportarTabProps {
  videoId: string;
  videoTitle: string;
  paragraphs: ScriptParagraph[];
  thumbUrl?: string | null;
  onFinish?: () => void;
}

function ExportarTab({ videoId, videoTitle, paragraphs, thumbUrl, onFinish }: ExportarTabProps) {
  const [isZipping, startZipping] = useTransition();
  const [isFinishing, startFinishing] = useTransition();
  const [zipSuccess, setZipSuccess] = useState(false);
  const [zipError, setZipError] = useState<string | null>(null);

  const hasScript = paragraphs.some(p => p.text.trim().length > 0);
  const audioCount = paragraphs.filter(p => p.audioUrl).length;
  const hasThumb = !!thumbUrl;

  const handleDownload = () => {
    setZipError(null);
    startZipping(async () => {
      const textContent = paragraphs.map(p => p.text).join('\n\n');
      
      const assets: ZipAsset[] = [];
      paragraphs.forEach((p, i) => {
        if (p.audioUrl) {
          assets.push({ url: p.audioUrl, filename: `paragrafo-${i+1}.mp3` });
        }
      });
      if (thumbUrl) {
        assets.push({ url: thumbUrl, filename: 'thumbnail-conceito.png' });
      }

      const res = await createProductionZip(videoTitle, textContent, assets);
      if (res.success) {
        setZipSuccess(true);
        setTimeout(() => setZipSuccess(false), 3000);
      } else {
        setZipError(res.errorMessage || "Erro desconhecido");
      }
    });
  };

  const handleFinish = () => {
    startFinishing(async () => {
      await finalizeVideoProductionAction(videoId);
      if (onFinish) onFinish(); // Vai invocar onClose por cima 
    });
  };

  return (
    <div className="flex flex-col h-full gap-5">
      <div className="p-5 rounded-xl border border-white/10 bg-white/5">
        <h3 className="text-sm font-bold text-white mb-4">Itens Consolidados para o Zip</h3>
        <ul className="flex flex-col gap-3 text-sm text-[var(--color-text-2)] font-mono">
          <li className="flex items-center gap-2">
            {hasScript ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <AlertTriangle className="w-4 h-4 text-amber-400" />}
            Documento Mestre (Roteiro)
          </li>
          <li className="flex items-center gap-2">
            {audioCount > 0 ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <AlertTriangle className="w-4 h-4 text-amber-400" />}
            Trilhas de Áudio: {audioCount} / {paragraphs.length} parágrafos
          </li>
          <li className="flex items-center gap-2">
            {hasThumb ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <AlertTriangle className="w-4 h-4 text-amber-400" />}
            Capa Conceito (Thumbnail)
          </li>
        </ul>
      </div>

      {zipError && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-200">
          {zipError}
        </div>
      )}

      <div className="mt-auto flex flex-col gap-3">
        <button
          onClick={handleDownload}
          disabled={isZipping || isFinishing}
          className={cn('h-12 w-full rounded-xl border font-bold text-sm flex items-center justify-center gap-2 transition-all', zipSuccess ? 'bg-green-600/20 border-green-500/40 text-green-300' : 'bg-white/5 border-white/10 text-white hover:bg-white/10')}
        >
          {isZipping ? <><Loader2 className="w-4 h-4 animate-spin" /> Empacotando Media Localmente...</> :
           zipSuccess ? <><CheckCircle2 className="w-4 h-4" /> Download Iniciado!</> :
           <><Download className="w-4 h-4" /> Extrair ZIP Local</>}
        </button>

        <button
          onClick={handleFinish}
          disabled={isZipping || isFinishing}
          className="btn-primary h-12 w-full text-sm flex items-center justify-center gap-2"
        >
          {isFinishing ? <><Loader2 className="w-4 h-4 animate-spin" /> Finalizando Status...</> : <><ArrowRight className="w-4 h-4" /> Finalizar & Enviar para Estante</>}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// Componente Principal: GavetaProducao
// ============================================================

export function GavetaProducao({ isOpen, onClose, video, onScriptSaved }: GavetaProducaoProps) {
  const [activeTab, setActiveTab] = useState<TabId>('roteiro');
  const [localThumb, setLocalThumb] = useState<string | null>(video?.thumb_url || null);
  const [isChatExpanded, setIsChatExpanded] = useState(false);

  // Lazy parsing
  const savedParagraphs: ScriptParagraph[] = (() => {
    if (!video?.roteiro) return [];
    try {
      const parsed = JSON.parse(video.roteiro);
      if (Array.isArray(parsed)) {
        return parsed.map((item, i) => {
          if (typeof item === 'string') {
            return { id: `para-legacy-${i}-${Date.now()}`, text: item };
          }
          return item as ScriptParagraph;
        });
      }
      return [{ id: `para-legacy-0`, text: video.roteiro }];
    } catch {
      return video.roteiro ? [{ id: `para-legacy-0`, text: video.roteiro }] : [];
    }
  })();

  const blueprint = video?.canal?.blueprint;

  return (
    <AnimatePresence>
      {isOpen && video && (
        <>
          <motion.div key="gaveta-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]" />
          <motion.aside key="gaveta-sheet" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 280 }} className="fixed top-0 right-0 z-50 h-full flex bg-gradient-to-b from-[#111114] to-[#0A0A0D] border-l border-white/8 shadow-2xl">
            <div className="flex-1 flex flex-col w-[576px] shrink-0 h-full overflow-hidden">
              <div className="flex items-start justify-between p-6 pb-4 border-b border-white/5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge badge-accent text-[10px]">Linha de Montagem</span>
                    <span className="text-[10px] font-mono opacity-30 truncate">#{video.id.split('-')[0]}</span>
                  </div>
                  <h2 className="text-lg font-bold text-white tracking-tight truncate">{video.titulo}</h2>
                </div>
                <button onClick={onClose} className="ml-4 p-2 hover:bg-white/5 rounded-lg transition-colors text-[var(--color-text-3)] hover:text-white shrink-0"><X size={18} /></button>
              </div>

              {blueprint && (blueprint.voz_narrador || blueprint.tipo_narrativa) && (
                <div className="mx-6 mt-4 px-4 py-3 rounded-xl bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/15">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)]/70 mb-1.5">Blueprint Ativo</p>
                  <div className="flex flex-wrap gap-3 text-[11px] text-[var(--color-text-3)]">
                    {blueprint.voz_narrador && <span>🎙️ <span className="text-white/60">{blueprint.voz_narrador}</span></span>}
                    {blueprint.tipo_narrativa && <span>📖 <span className="text-white/60">{blueprint.tipo_narrativa}</span></span>}
                  </div>
                </div>
              )}

              <div className="flex gap-1 px-6 pt-5 pb-2">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => tab.available && setActiveTab(tab.id)}
                      disabled={!tab.available}
                      className={cn(
                        'flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-bold transition-all duration-200',
                        isActive ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)] border border-[var(--color-accent)]/20'
                          : tab.available ? 'text-[var(--color-text-3)] hover:text-white hover:bg-white/5'
                          : 'text-white/15 cursor-not-allowed',
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />{tab.label}
                      {!tab.available && <span className="text-[9px] opacity-50 ml-0.5">em breve</span>}
                    </button>
                  );
                })}
              </div>

              <div className="flex-1 overflow-hidden px-6 pb-6 pt-3">
                <AnimatePresence mode="wait">
                  {activeTab === 'roteiro' && (
                    <motion.div key="tab-roteiro" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="h-full">
                      <RoteiroTab videoId={video.id} initialParagraphs={savedParagraphs} onSaveSuccess={onScriptSaved} />
                    </motion.div>
                  )}
                  {activeTab === 'audio' && (
                    <motion.div key="tab-audio" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="h-full">
                      <OuvirTab videoId={video.id} initialParagraphs={savedParagraphs} onAudioSaved={onScriptSaved} />
                    </motion.div>
                  )}
                  {activeTab === 'asset' && (
                    <motion.div key="tab-asset" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="h-full">
                      <AssetTab videoId={video.id} currentThumbUrl={localThumb} onThumbSaved={(url) => { setLocalThumb(url); if(onScriptSaved) onScriptSaved(); }} />
                    </motion.div>
                  )}
                  {activeTab === 'exportar' && (
                    <motion.div key="tab-exportar" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="h-full">
                      <ExportarTab videoId={video.id} videoTitle={video.titulo} paragraphs={savedParagraphs} thumbUrl={localThumb} onFinish={onClose} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            <ContextualChat
              videoId={video.id}
              activeTab={activeTab}
              isExpanded={isChatExpanded}
              onToggleExpand={() => setIsChatExpanded(!isChatExpanded)}
            />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
