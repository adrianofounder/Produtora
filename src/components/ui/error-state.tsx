import { AlertCircle, RotateCcw } from 'lucide-react';
import React from 'react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ title = 'Algo deu errado', message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col p-4 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] text-[var(--color-error)]">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold mb-1">{title}</h3>
          <p className="text-xs opacity-80 leading-relaxed mb-3">{message}</p>
          
          {onRetry && (
            <button 
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-[var(--color-error)] text-white hover:opacity-90 transition-opacity"
            >
              <RotateCcw className="w-3 h-3" />
              Tentar novamente
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
