'use client';

import { useRef } from 'react';
import { X } from 'lucide-react';
import { useVideoDrawer } from './hooks/useVideoDrawer';

export function VideoDrawerHeader() {
  const { eixo, titulo, progresso, onClose } = useVideoDrawer();
  const touchStartY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    // Fechar ao fazer swipe down > 50px
    if (touchEndY - touchStartY.current > 50) {
      onClose();
    }
  };

  return (
    <div 
      className="flex items-start justify-between p-5 border-b border-white/5 relative touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Mobile drag handle */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-white/20 rounded-full sm:hidden" />
      
      <div className="flex-1 min-w-0 pt-2 sm:pt-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="badge badge-accent text-[10px]">LINHA DE MONTAGEM</span>
          <span className="text-xs text-[var(--color-text-3)]">{eixo}</span>
        </div>
        <h2 id="video-drawer-title" className="text-[15px] font-bold leading-tight truncate text-[var(--color-text-1)]">
          {titulo}
        </h2>
        {/* Barra de progresso */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 h-1 rounded-full bg-white/5">
            <div
              className="h-1 rounded-full transition-all duration-500 bg-[var(--color-accent)]"
              style={{ width: `${(progresso / 3) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-[var(--color-text-3)]">{progresso}/3 etapas</span>
        </div>
      </div>
      <button aria-label="Fechar" onClick={onClose} className="btn-ghost h-8 w-8 ml-3 shrink-0 p-0 mt-2 sm:mt-0">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
