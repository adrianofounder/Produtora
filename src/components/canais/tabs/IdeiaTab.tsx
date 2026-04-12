'use client';

import { ChevronRight, Sparkles } from 'lucide-react';
import { useVideoDrawer } from '../hooks/useVideoDrawer';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';

export function IdeiaTab() {
  const { 
    eixo, 
    titulos, 
    tituloSelecionado, setTituloSelecionado, 
    loadingTitulos, gerarTitulos, 
    errorTitulos,
    setAbaAtiva, gerarRoteiro 
  } = useVideoDrawer();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="section-label mb-3">Gerar Títulos Magnéticos</h3>
        <p className="text-sm mb-4 text-[var(--color-text-3)]">
          A IA vai criar 5 variações de título para o eixo <strong className="text-[var(--color-text-1)]">{eixo}</strong>.
        </p>
        <button onClick={gerarTitulos} disabled={loadingTitulos} className="btn-primary">
          {!loadingTitulos && <Sparkles className="h-4 w-4" />}
          {loadingTitulos ? 'Gerando títulos...' : 'Gerar 5 Títulos com IA'}
        </button>
      </div>

      {errorTitulos && (
        <ErrorState 
          title="Erro na IA" 
          message={errorTitulos} 
          onRetry={gerarTitulos} 
        />
      )}

      {loadingTitulos ? (
        <LoadingState label="Gerando opções de títulos..." />
      ) : titulos.length > 0 && (
        <div className="space-y-2">
          {titulos.map((t, i) => (
            <button
              key={i}
              onClick={() => setTituloSelecionado(t)}
              className={`w-full text-left p-3 rounded-lg transition-all border ${
                tituloSelecionado === t ? 'bg-[rgba(124,58,237,0.12)] border-[rgba(124,58,237,0.35)] text-[var(--color-text-1)]' : 
                'bg-white/5 border-white/10 text-[var(--color-text-2)]'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-xs font-mono mt-0.5 shrink-0 text-[var(--color-text-3)]">
                  #{i + 1}
                </span>
                <span className="text-sm">{t}</span>
              </div>
            </button>
          ))}

          {tituloSelecionado && (
            <button
              onClick={() => {
                setAbaAtiva('roteiro');
                gerarRoteiro();
              }}
              className="btn-primary w-full mt-2"
            >
              Usar este título e gerar Roteiro
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
