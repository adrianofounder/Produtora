'use client';

import { CheckCircle2, Package } from 'lucide-react';
import { useVideoDrawer } from '../hooks/useVideoDrawer';

export function PacoteTab() {
  const { 
    videoId, titulo,
    aprovado, 
    onClose, onUpdate
  } = useVideoDrawer();

  return (
    <div className="space-y-4">
      <div className="card-inner p-4 space-y-3">
        <h3 className="section-label">Metadados Finais</h3>
        <div className="space-y-1.5">
          <label htmlFor="titulo-oficial" className="text-xs text-[var(--color-text-3)]">Título Oficial</label>
          <input id="titulo-oficial" defaultValue={titulo} className="input w-full text-sm" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="descricao-youtube" className="text-xs text-[var(--color-text-3)]">Descrição YouTube (gerada pela IA)</label>
          <textarea id="descricao-youtube" className="input w-full min-h-[80px] text-sm resize-none" placeholder="Descrição com SEO tags..." />
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
          disabled={!aprovado.roteiro || !aprovado.audio || !aprovado.thumb}
          className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <CheckCircle2 className="h-4 w-4" /> Agendar Publicação no YouTube
        </button>
      </div>

      {(!aprovado.roteiro || !aprovado.audio || !aprovado.thumb) && (
        <div className="card-inner p-4 text-center">
          <p className="text-sm text-[var(--color-text-3)]">
            Complete as etapas pendentes para exportar:
            {!aprovado.roteiro && <span className="block">• Roteiro não aprovado</span>}
            {!aprovado.audio && <span className="block">• Narração não aprovada</span>}
            {!aprovado.thumb && <span className="block">• Thumbnail não aprovada</span>}
          </p>
        </div>
      )}
    </div>
  );
}
