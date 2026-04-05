'use client';

import { ArrowRight, CheckCircle2, Loader2, MessageSquare, RefreshCw, RotateCcw, Scissors, Sparkles } from 'lucide-react';
import { useVideoDrawer } from '../hooks/useVideoDrawer';
import { useEffect, useRef } from 'react';

export function RoteiroTab() {
  const { 
    roteiro, setRoteiro, 
    loadingRoteiro, gerarRoteiro, 
    aprovarRoteiro
  } = useVideoDrawer();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [roteiro]);

  return (
    <div className="space-y-4">
      <div className="card-inner p-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 shrink-0 text-[var(--color-accent)]" />
        <p className="text-xs text-[var(--color-text-3)]">
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
            className={`input w-full min-h-[300px] text-sm leading-relaxed resize-none font-mono ${loadingRoteiro ? 'opacity-50' : 'opacity-100'}`}
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
  );
}
