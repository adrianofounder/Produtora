'use client';

/**
 * AutoRefillToggle
 * Story 4.4 — Kill-switch do Auto-Refill nas Configurações
 *
 * Componente Client que renderiza o toggle switch de ativação/desativação
 * do Auto-Refill noturno. Chama toggleAutoRefillAction via Server Action binding.
 */

import { useState, useTransition } from 'react';
import { Loader2 } from 'lucide-react';

interface AutoRefillToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => Promise<{ success: boolean; error?: string }>;
}

export function AutoRefillToggle({ enabled, onToggle }: AutoRefillToggleProps) {
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleToggle() {
    const newValue = !isEnabled;
    setError(null);

    // Optimistic update
    setIsEnabled(newValue);

    startTransition(async () => {
      const result = await onToggle(newValue);
      if (!result.success) {
        // Reverter em caso de falha
        setIsEnabled(!newValue);
        setError(result.error ?? 'Falha ao salvar configuração.');
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        id="auto-refill-toggle"
        type="button"
        role="switch"
        aria-checked={isEnabled}
        aria-label={isEnabled ? 'Desativar Auto-Refill Noturno' : 'Ativar Auto-Refill Noturno'}
        onClick={handleToggle}
        disabled={isPending}
        className="relative inline-flex items-center shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2"
        style={{
          width: '44px',
          height: '24px',
          background: isEnabled
            ? 'var(--color-success)'
            : 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.08)',
          cursor: isPending ? 'not-allowed' : 'pointer',
          opacity: isPending ? 0.7 : 1,
        }}
      >
        {isPending ? (
          <Loader2
            className="animate-spin mx-auto"
            style={{ width: '14px', height: '14px', color: 'var(--color-text-1)' }}
          />
        ) : (
          <span
            className="pointer-events-none block rounded-full shadow transition-transform"
            style={{
              width: '18px',
              height: '18px',
              background: 'white',
              transform: isEnabled ? 'translateX(22px)' : 'translateX(2px)',
            }}
          />
        )}
      </button>

      <span
        className="text-[10px] font-mono"
        style={{ color: isEnabled ? 'var(--color-success)' : 'var(--color-text-3)' }}
      >
        {isEnabled ? 'ATIVO' : 'INATIVO'}
      </span>

      {error && (
        <p className="text-[10px]" style={{ color: 'var(--color-error)' }}>
          {error}
        </p>
      )}
    </div>
  );
}
