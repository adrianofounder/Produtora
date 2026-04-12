import { Loader2 } from 'lucide-react';
import React from 'react';

interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = 'Carregando...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-[var(--color-text-3)] min-h-[150px]">
      <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent)] mb-4" />
      {label && <p className="text-sm font-medium animate-pulse">{label}</p>}
    </div>
  );
}
