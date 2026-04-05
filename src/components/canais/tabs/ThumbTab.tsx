'use client';

import { ArrowRight, CheckCircle2, Image, Mic } from 'lucide-react';
import { useVideoDrawer } from '../hooks/useVideoDrawer';

export function ThumbTab() {
  const { 
    videoId,
    aprovado, setAprovado, 
    setAbaAtiva, onUpdate
  } = useVideoDrawer();

  if (!aprovado.audio) {
    return (
      <div className="space-y-4">
        <div className="card-inner p-6 text-center">
          <Mic className="h-8 w-8 mx-auto mb-2 text-[var(--color-text-3)]" />
          <p className="text-sm text-[var(--color-text-3)]">Aprove a narração primeiro.</p>
          <button onClick={() => setAbaAtiva('narracao')} className="btn-ghost text-xs mt-3">
            Ir para Narração
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="card-inner p-3 flex items-center gap-2">
        <Image className="h-4 w-4 text-[var(--color-accent)]" />
        <p className="text-xs text-[var(--color-text-3)]">
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
              className={`aspect-video rounded-lg flex items-center justify-center cursor-pointer transition-all border ${
                n === 1 ? 'border-2 border-[var(--color-accent)]' : 'border-white/5'
              } bg-white/5`}
            >
              <span className="text-xs text-[var(--color-text-3)]">Capa {n}</span>
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
    </div>
  );
}
