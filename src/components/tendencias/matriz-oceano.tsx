"use client";

import React, { useState } from "react";
import { Info } from "lucide-react";

export interface NichoPonto {
  id: number;
  label: string;
  type: "lotado" | "gap";
  x: number; // Posição percentual no Eixo X (0-100)
  y: number; // Posição percentual no Eixo Y (0-100)
  opacity?: number;
  pulse?: boolean;
}

export const PONTOS_MOCK: NichoPonto[] = [
  { id: 1, label: "True Crime US", type: "lotado", x: 20, y: 30, opacity: 0.5 },
  { id: 2, label: "React Cristão", type: "lotado", x: 15, y: 70, opacity: 0.6 },
  { id: 3, label: "Shorts de Tech", type: "lotado", x: 80, y: 20, opacity: 0.4 },
  { id: 4, label: "Relatos VIP", type: "gap", x: 85, y: 80, pulse: true },
  { id: 5, label: "Gringo Dublado", type: "gap", x: 75, y: 65, pulse: false },
];

export interface MatrizOceanoProps {
  points?: NichoPonto[];
}

export function MatrizOceano({ points }: MatrizOceanoProps) {
  const [hoveredPonto, setHoveredPonto] = useState<number | null>(null);
  
  const displayPoints = points || PONTOS_MOCK;

  // Eixo X: Emoção / Sentimento
  // Eixo Y: Nível de Concorrência
  return (
    <div className="card w-full h-[450px] flex flex-col p-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center mb-4 z-10">
        <div>
          <h2 className="text-lg font-bold" style={{ color: "var(--color-text-1)" }}>
            Matriz Oceano Azul
          </h2>
          <p className="text-xs" style={{ color: "var(--color-text-3)" }}>
            Concorrência vs. Sentimento da Audiência
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--color-error)", opacity: 0.5 }} />
            <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: "var(--color-text-3)" }}>Lotado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full relative" style={{ backgroundColor: "var(--color-accent)" }}>
              <div className="absolute inset-0 rounded-full animate-ping opacity-40" style={{ backgroundColor: "var(--color-accent)" }} />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: "var(--color-text-3)" }}>Oceano Azul</span>
          </div>
        </div>
      </div>

      <div className="relative flex-1 w-full rounded-xl overflow-hidden border transition-all" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}>
        {/* Marca d'água / Grid de fundo */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(var(--color-text-1) 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />

        {/* Labels dos Eixos */}
        <div className="absolute left-4 bottom-1/2 -translate-y-1/2 -rotate-90 text-[9px] font-black uppercase tracking-[0.2em] opacity-30 select-none" style={{ color: "var(--color-text-1)" }}>
          &larr; Concorrência
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-[0.2em] opacity-30 select-none" style={{ color: "var(--color-text-1)" }}>
          Sentimento / Demanda &rarr;
        </div>

        {/* Linhas centrais simulando quadrantes */}
        <div className="absolute inset-x-0 top-1/2 h-px opacity-30" style={{ backgroundColor: "var(--color-border)" }} />
        <div className="absolute inset-y-0 left-1/2 w-px opacity-30" style={{ backgroundColor: "var(--color-border)" }} />

        {/* Pontos da Matriz */}
        {displayPoints.map((ponto, index) => {
          const isLotado = ponto.type === "lotado";
          const isGap = ponto.type === "gap";
          const isHovered = hoveredPonto === ponto.id;

          return (
            <div
              key={`${ponto.id}-${index}`}
              className={`absolute transform -translate-x-1/2 translate-y-1/2 transition-all duration-500 cursor-pointer flex items-center justify-center rounded-full group ${
                isLotado ? "opacity-60 scale-90 hover:opacity-100 hover:scale-100" : ""
              } ${isGap ? "hover:scale-150" : "hover:scale-110"}`}
              style={{
                left: `${ponto.x}%`,
                bottom: `${ponto.y}%`,
                zIndex: isHovered ? 50 : isGap ? 30 : 10,
                transitionDelay: `${index * 50}ms`
              }}
              onMouseEnter={() => setHoveredPonto(ponto.id)}
              onMouseLeave={() => setHoveredPonto(null)}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full transition-all duration-300 relative ${
                  ponto.pulse || isGap ? "animate-pulse" : ""
                }`}
                style={{
                  backgroundColor: isLotado ? "var(--color-error)" : "var(--color-accent)",
                  boxShadow: isGap ? "0 0 20px var(--color-accent)" : "none",
                }}
              >
                {isGap && (
                   <div className="absolute inset-[-4px] rounded-full border border-[var(--color-accent)] opacity-20 scale-125" />
                )}
              </div>

              {/* Tooltip Hover */}
              <div
                className={`absolute bottom-full mb-3 whitespace-nowrap pointer-events-none transition-all duration-300 glass px-4 py-2 rounded-lg flex items-center gap-2 border border-[var(--color-border)] shadow-xl
                ${isHovered ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95"}
                `}
                style={{ zIndex: 100 }}
              >
                <div className="flex flex-col">
                  <span className="text-xs font-bold" style={{ color: "var(--color-text-1)" }}>
                    {ponto.label}
                  </span>
                  <span className="text-[10px] opacity-60 uppercase font-mono tracking-tighter" style={{ color: "var(--color-text-1)" }}>
                    {isGap ? "Oceano Azul / Gap" : "Saturado / Alta Compet"}
                  </span>
                </div>
                {isGap && <Info size={14} style={{ color: "var(--color-accent)" }} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

