'use client';

import { Rocket, Search } from 'lucide-react';

export interface GarimpoData {
  id: string | number;
  titulo: string;
  canal: string;
  views: string;
  tag?: string | null;
}

interface NichoCardProps {
  nicho: GarimpoData;
}

export function NichoCard({ nicho }: NichoCardProps) {
  const isGap = nicho.tag ? nicho.tag.toLowerCase().includes('gap') : false;

  return (
    <div className="card-inner p-4 flex gap-4 transition-colors hover:border-[rgba(124,58,237,0.3)]">
      {/* Thumbnail Simulado */}
      <div 
        className="w-[124px] h-[70px] rounded-md overflow-hidden relative shrink-0"
        style={{ background: 'var(--color-surface-3)' }}
      >
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white to-transparent" />
        <div 
          className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold font-mono tracking-widest backdrop-blur-md"
          style={{ background: 'rgba(0,0,0,0.7)', color: 'var(--color-text-1)' }}
        >
          12:40
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col justify-center min-w-0 flex-1">
        <h3 
          className="font-bold text-[13px] leading-snug line-clamp-2 truncate whitespace-normal" 
          style={{ color: 'var(--color-text-1)' }}
          title={nicho.titulo}
        >
          {nicho.titulo}
        </h3>
        <p className="text-[11px] mt-1 truncate" style={{ color: 'var(--color-text-3)' }}>
          {nicho.canal} • <strong style={{ color: 'var(--color-text-2)' }}>{nicho.views} views</strong>
        </p>

        <div className="mt-2.5 flex items-center justify-between gap-2 overflow-hidden">
          {nicho.tag && (
            <span 
              className={`badge shrink-0 ${isGap ? 'badge-accent' : 'badge-error'}`}
            >
              {nicho.tag}
            </span>
          )}
          <div className="flex gap-1.5 shrink-0">
            <button className="btn-ghost h-7 px-2.5 text-[10px]">
              <Search size={10} />
              Analisar
            </button>
            <button className="btn-primary h-7 px-2.5 text-[10px]">
              <Rocket size={10} />
              Criar Canal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
