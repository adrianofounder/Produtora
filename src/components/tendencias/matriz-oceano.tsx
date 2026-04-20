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

export function MatrizOceano() {
  const [hoveredPonto, setHoveredPonto] = useState<number | null>(null);

  // Eixo X: Emoção / Sentimento
  // Eixo Y: Nível de Concorrência (quanto menor Y, mais "no topo" se usarmos top/bottom inversamente,
  // mas como o Oceano Azul geralmente é alta demanda e baixa concorrência,
  // vamos assumir Origem (0,0) no canto inferior esquerdo.)

  return (
    <div className="card w-full h-[400px] flex flex-col p-6">
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
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--color-error)", opacity: 0.5 }} />
            <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: "var(--color-text-3)" }}>Lotado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--color-accent)", boxShadow: "0 0 8px var(--color-accent)" }} />
            <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: "var(--color-text-3)" }}>Oceano Azul</span>
          </div>
        </div>
      </div>

      <div className="relative flex-1 w-full rounded-lg overflow-hidden border" style={{ borderColor: "var(--color-border)" }}>
        {/* Marca d'água / Grid de fundo */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `radial-gradient(var(--color-text-3) 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        />

        {/* Labels dos Eixos */}
        <div className="absolute left-2 bottom-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-bold uppercase tracking-widest opacity-50" style={{ color: "var(--color-text-2)" }}>
          &larr; Concorrência
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest opacity-50" style={{ color: "var(--color-text-2)" }}>
          Sentimento / Demanda &rarr;
        </div>

        {/* Linhas centrais simulando quadrantes */}
        <div className="absolute inset-x-0 top-1/2 h-px opacity-30" style={{ backgroundColor: "var(--color-border-2)" }} />
        <div className="absolute inset-y-0 left-1/2 w-px opacity-30" style={{ backgroundColor: "var(--color-border-2)" }} />

        {/* Pontos da Matriz */}
        {PONTOS_MOCK.map((ponto) => {
          const isLotado = ponto.type === "lotado";
          const isGap = ponto.type === "gap";
          const isHovered = hoveredPonto === ponto.id;

          return (
            <div
              key={ponto.id}
              className={`absolute transform -translate-x-1/2 translate-y-1/2 transition-all duration-300 cursor-pointer flex items-center justify-center rounded-full group ${
                isLotado ? "blur-[1px] hover:blur-none" : ""
              } ${isGap ? "hover:scale-125" : "hover:scale-110"}`}
              style={{
                left: `${ponto.x}%`,
                bottom: `${ponto.y}%`,
                zIndex: isHovered ? 50 : isGap ? 30 : 10,
              }}
              onMouseEnter={() => setHoveredPonto(ponto.id)}
              onMouseLeave={() => setHoveredPonto(null)}
            >
              <div
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  ponto.pulse ? "animate-pulse" : ""
                }`}
                style={{
                  backgroundColor: isLotado ? "var(--color-error)" : "var(--color-accent)",
                  opacity: ponto.opacity ?? (isGap ? 1 : 0.5),
                  boxShadow: isGap ? "0 0 15px var(--color-accent)" : "none",
                }}
              />

              {/* Tooltip Hover */}
              <div
                className={`absolute bottom-full mb-2 whitespace-nowrap pointer-events-none transition-all duration-200 glass px-3 py-1.5 rounded-md flex items-center gap-1.5
                ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
                `}
                style={{ zIndex: 100 }}
              >
                <span className="text-xs font-semibold" style={{ color: "var(--color-text-1)" }}>
                  {ponto.label}
                </span>
                {isGap && <Info size={12} style={{ color: "var(--color-accent)" }} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
