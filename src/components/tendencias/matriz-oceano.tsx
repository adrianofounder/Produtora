'use client';

export interface PontoMatriz {
  id: number;
  label: string;
  type: 'lotado' | 'gap';
  x: number; // 0 a 100
  y: number; // 0 a 100
  opacity?: number;
  pulse?: boolean;
}

interface MatrizOceanoProps {
  pontos: PontoMatriz[];
}

export function MatrizOceano({ pontos }: MatrizOceanoProps) {
  return (
    <div className="card w-full flex flex-col overflow-hidden">
      <div className="p-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-3">
          <span className="icon-box icon-box-accent shrink-0">🌊</span>
          <div>
            <h2 className="text-sm font-bold" style={{ color: 'var(--color-text-1)' }}>
              Matriz Oceano Azul (Oportunidades)
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-3)' }}>
              Esquerda/Direita = Concorrência | Baixo/Cima = Demanda Identificada
            </p>
          </div>
        </div>
      </div>

      {/* Grid container */}
      <div 
        className="relative w-full h-[320px] bg-transparent overflow-hidden"
      >
        {/* Marca d'água / Grade */}
        <div 
          className="absolute inset-0 opacity-20" 
          style={{ 
            backgroundImage: 'radial-gradient(var(--color-accent) 1px, transparent 1px)', 
            backgroundSize: '24px 24px' 
          }}
        />

        {/* Linhas cruzadas centrais (Eixos X e Y) */}
        <div className="absolute top-1/2 left-0 w-full border-t border-dashed" style={{ borderColor: 'var(--color-border-2)' }} />
        <div className="absolute top-0 left-1/2 h-full border-l border-dashed" style={{ borderColor: 'var(--color-border-2)' }} />

        {/* Eixo Labels */}
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-text-3)' }}>
          Baixa ← Concorrência → Alta
        </span>
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-widest -rotate-90 origin-left ml-4" style={{ color: 'var(--color-text-3)' }}>
          Baixa ← Demanda → Alta
        </span>

        {/* Renderização dos pontos */}
        {pontos.map((p) => {
          if (p.type === 'lotado') {
            return (
              <div 
                key={p.id}
                className="absolute flex items-center justify-center text-[10px] rounded-full transition-all"
                style={{
                  left: `${p.x}%`,
                  bottom: `${p.y}%`,
                  transform: 'translate(-50%, 50%)',
                  width: '64px',
                  height: '64px',
                  background: 'rgba(239, 68, 68, 0.1)', // var(--color-error) com alpha
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: 'var(--color-error)',
                  filter: 'blur(1px)',
                  opacity: p.opacity ?? 0.6,
                  zIndex: 1,
                }}
              >
                {p.label}
              </div>
            );
          }

          // Tipo gap (Oceano Azul)
          return (
            <div 
              key={p.id}
              className="absolute group flex flex-col items-center justify-center cursor-pointer transition-all duration-300"
              style={{
                left: `${p.x}%`,
                bottom: `${p.y}%`,
                transform: 'translate(-50%, 50%)',
                zIndex: 10,
              }}
            >
              <div 
                className={`relative flex items-center justify-center w-4 h-4 rounded-full group-hover:scale-125 transition-transform duration-300 ${p.pulse ? 'animate-pulse' : ''}`}
                style={{
                  background: 'var(--color-accent)',
                  boxShadow: '0 0 16px var(--color-accent), inset 0 0 4px rgba(255,255,255,0.5)',
                }}
              >
                {/* Ping animation effect */}
                {p.pulse && (
                  <div 
                    className="absolute inset-0 rounded-full animate-ping opacity-50"
                    style={{ background: 'var(--color-accent)' }}
                  />
                )}
              </div>
              <span 
                className="mt-2 text-[11px] font-bold px-2 py-1 rounded bg-[#121214] border border-[#202024] whitespace-nowrap shadow-lg group-hover:-translate-y-1 transition-transform"
                style={{ color: 'var(--color-text-1)' }}
              >
                {p.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
