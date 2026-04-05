'use client';

import { CheckCircle2, FileText, Image, Lightbulb, Mic, Package } from 'lucide-react';
import { useVideoDrawer, Aba } from './hooks/useVideoDrawer';

const ABAS: { id: Aba; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'ideia',    label: '1. Ideia/Título',  icon: Lightbulb   },
  { id: 'roteiro',  label: '2. Roteiro',        icon: FileText    },
  { id: 'narracao', label: '3. Narração',        icon: Mic         },
  { id: 'thumb',    label: '4. Thumbnails',      icon: Image       },
  { id: 'pacote',   label: '5. Exportar',        icon: Package     },
];

export function VideoDrawerTabs() {
  const { abaAtiva, setAbaAtiva, aprovado } = useVideoDrawer();

  return (
    <div role="tablist" aria-label="Abas de Edição do Vídeo" className="flex border-b border-white/5 overflow-x-auto">
      {ABAS.map((aba) => {
        const isActive = abaAtiva === aba.id;
        const isAprovado =
          (aba.id === 'roteiro' && aprovado.roteiro) ||
          (aba.id === 'narracao' && aprovado.audio) ||
          (aba.id === 'thumb' && aprovado.thumb);
        const Icon = aba.icon;
        
        return (
          <button
            key={aba.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${aba.id}`}
            id={`tab-${aba.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => setAbaAtiva(aba.id)}
            className={`flex items-center gap-1.5 px-4 py-3 text-[11px] font-medium shrink-0 border-b-2 transition-all ${
              isActive ? 'border-[var(--color-accent)] text-[var(--color-accent)]' : 
              isAprovado ? 'border-transparent text-[var(--color-success)]' : 
              'border-transparent text-[var(--color-text-3)]'
            }`}
          >
            {isAprovado ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-[var(--color-success)]" />
            ) : (
              <Icon className="h-3.5 w-3.5" />
            )}
            {aba.label}
          </button>
        );
      })}
    </div>
  );
}
