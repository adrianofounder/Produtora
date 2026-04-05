'use client';

import { ArrowRight, CheckCircle2, FileText, Mic } from 'lucide-react';
import { useVideoDrawer } from '../hooks/useVideoDrawer';

export function NarracaoTab() {
  const { 
    videoId,
    aprovado, setAprovado, 
    setAbaAtiva, onUpdate
  } = useVideoDrawer();

  if (!aprovado.roteiro) {
    return (
      <div className="space-y-4">
        <div className="card-inner p-6 text-center">
          <FileText className="h-8 w-8 mx-auto mb-2 text-[var(--color-text-3)]" />
          <p className="text-sm text-[var(--color-text-3)]">Aprove o roteiro primeiro para habilitar a narração.</p>
          <button onClick={() => setAbaAtiva('roteiro')} className="btn-ghost text-xs mt-3">
            Ir para Roteiro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="card-inner p-3 flex items-center gap-2">
        <Mic className="h-4 w-4 text-[var(--color-accent)]" />
        <p className="text-xs text-[var(--color-text-3)]">
          Integração com ElevenLabs será ativada após cadastrar a API Key em Configurações.
        </p>
      </div>

      {/* Voz selecionada */}
      <div className="space-y-2">
        <label htmlFor="voz-blueprint" className="section-label">Voz do Blueprint</label>
        <select id="voz-blueprint" className="input w-full">
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
    </div>
  );
}
