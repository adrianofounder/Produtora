'use client';

import { Rocket, Bookmark } from 'lucide-react';

export interface GarimpoVideo {
  id: string | number;
  titulo: string;
  canal: string;
  views: string;
  tempo: string;
  tag: string;
  thumbnailUrl?: string;
}

interface NichoCardProps {
  nicho: GarimpoVideo;
  onCriarCanal?: (nicho: GarimpoVideo) => void;
  onSalvarIdeia?: (nicho: GarimpoVideo) => void;
}

export function NichoCard({ nicho, onCriarCanal, onSalvarIdeia }: NichoCardProps) {
  const isGap = nicho.tag ? nicho.tag.toLowerCase().includes('gap') : false;

  return (
    <div className="card-inner p-4 flex flex-col md:flex-row gap-4 transition-colors hover:border-[var(--color-accent)]/20">
      {/* Thumbnail Real */}
      <div 
        className="w-full h-auto aspect-video md:w-[160px] md:h-[90px] rounded-md overflow-hidden relative shrink-0 bg-[var(--color-surface-3)]"
      >
        {nicho.thumbnailUrl ? (
          <img 
            src={nicho.thumbnailUrl} 
            alt={nicho.titulo}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-[var(--color-border-2)] to-transparent" />
        )}
        <div 
          className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded text-[10px] md:text-[11px] font-bold font-mono tracking-widest backdrop-blur-md"
          style={{ backgroundColor: 'var(--color-background)', opacity: 0.8, color: 'var(--color-text-1)' }}
        >
          {nicho.tempo}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col justify-center min-w-0 flex-1">
        <h3 
          className="font-bold text-[14px] md:text-sm leading-snug line-clamp-2 truncate whitespace-normal" 
          style={{ color: 'var(--color-text-1)' }}
          title={nicho.titulo}
        >
          {nicho.titulo}
        </h3>
        <p className="text-[12px] md:text-xs mt-1 truncate" style={{ color: 'var(--color-text-3)' }}>
          {nicho.canal} • <strong style={{ color: 'var(--color-text-2)' }}>{nicho.views} views</strong>
        </p>

        <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 overflow-hidden">
          {nicho.tag && (
            <span 
              className={`badge w-fit shrink-0 ${isGap ? 'badge-accent' : 'badge-muted'}`}
            >
              {nicho.tag}
            </span>
          )}
          <div className="flex gap-1.5 shrink-0">
            <button 
              className="btn-ghost h-8 px-3 text-[11px] flex-1 sm:flex-none"
              onClick={() => onSalvarIdeia?.(nicho)}
            >
              <Bookmark size={12} />
              <span>Salvar Ideia</span>
            </button>
            <button 
              className="btn-primary h-8 px-3 text-[11px] flex-1 sm:flex-none"
              onClick={() => onCriarCanal?.(nicho)}
            >
              <Rocket size={12} />
              <span>Criar Canal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
