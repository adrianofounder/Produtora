'use client';

import { useEffect, useRef } from 'react';
import { useVideoDrawerState, VideoDrawerContext } from './hooks/useVideoDrawer';
import { VideoDrawerHeader } from './VideoDrawerHeader';
import { VideoDrawerTabs } from './VideoDrawerTabs';
import { IdeiaTab } from './tabs/IdeiaTab';
import { RoteiroTab } from './tabs/RoteiroTab';
import { NarracaoTab } from './tabs/NarracaoTab';
import { ThumbTab } from './tabs/ThumbTab';
import { PacoteTab } from './tabs/PacoteTab';

interface VideoDrawerProps {
  videoId: string;
  titulo: string;
  eixo: string;
  canalId: string;
  onClose: () => void;
  onUpdate?: () => void;
}

export function VideoDrawer(props: VideoDrawerProps) {
  const state = useVideoDrawerState({
    videoId: props.videoId,
    canalId: props.canalId,
    eixo: props.eixo,
    tituloInicial: props.titulo,
    onUpdate: props.onUpdate,
    onClose: props.onClose
  });

  const drawerRef = useRef<HTMLDivElement>(null);

  // Acessibilidade: Focus Trap & Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        props.onClose();
        return;
      }
      
      if (e.key === 'Tab') {
        if (!drawerRef.current) return;
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement || document.activeElement === drawerRef.current) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };
    
    // Focus in the drawer when opened
    drawerRef.current?.focus();

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [props.onClose]);

  return (
    <VideoDrawerContext.Provider value={state}>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 flex justify-end bg-black/65 backdrop-blur-sm"
        onClick={(e) => { if (e.target === e.currentTarget) props.onClose(); }}
      >
        {/* Drawer */}
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="video-drawer-title"
          tabIndex={-1}
          className="h-full w-full sm:max-w-2xl flex flex-col overflow-hidden sm:ml-auto outline-none bg-[var(--color-surface)] sm:border-l sm:border-white/10 shadow-[-20px_0_60px_rgba(0,0,0,0.5)]"
        >
          <VideoDrawerHeader />
          <VideoDrawerTabs />

          {/* Conteúdo das Abas */}
          <div 
            id={`panel-${state.abaAtiva}`} 
            role="tabpanel" 
            aria-labelledby={`tab-${state.abaAtiva}`}
            className="flex-1 overflow-y-auto p-5 space-y-4"
          >
            {state.abaAtiva === 'ideia' && <IdeiaTab />}
            {state.abaAtiva === 'roteiro' && <RoteiroTab />}
            {state.abaAtiva === 'narracao' && <NarracaoTab />}
            {state.abaAtiva === 'thumb' && <ThumbTab />}
            {state.abaAtiva === 'pacote' && <PacoteTab />}
          </div>
        </div>
      </div>
    </VideoDrawerContext.Provider>
  );
}
