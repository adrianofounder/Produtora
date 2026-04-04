'use client';

import { Activity } from 'lucide-react';
import { MatrizOceano, PontoMatriz } from '@/components/tendencias/matriz-oceano';
import { NichoCard, GarimpoData } from '@/components/tendencias/nicho-card';

const PONTOS: PontoMatriz[] = [
  { id: 1, label: 'True Crime US',  type: 'lotado', x: 20, y: 30, opacity: 0.5 },
  { id: 2, label: 'React Cristão',  type: 'lotado', x: 15, y: 70, opacity: 0.6 },
  { id: 3, label: 'Shorts de Tech', type: 'lotado', x: 80, y: 20, opacity: 0.4 },
  { id: 4, label: 'Relatos VIP',    type: 'gap',    x: 85, y: 80, pulse: true  },
  { id: 5, label: 'Gringo Dublado', type: 'gap',    x: 75, y: 65, pulse: false },
];

const GARIMPOS: GarimpoData[] = [
  { id: 1, titulo: 'The boss who lost $2M on purpose to teach a lesson', canal: 'Corporate Tales', views: '4.2M', tag: 'Gap: Relatos' },
  { id: 2, titulo: 'Why everyone is quitting their $100k tech jobs',     canal: 'Tech Dropout',    views: '1.8M', tag: 'Gap: Carreiras' },
  { id: 3, titulo: 'I stayed in the worlds most illegal hotel',          canal: 'Urbex Worldwide', views: '8.4M', tag: 'Lotado: Urbex' },
];

export default function Tendencias() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-sans font-bold text-white uppercase tracking-tight">
            Tendências & Vídeos Virais
          </h1>
          <span className="badge badge-accent shadow-glow">
            <Activity size={10} />
            BETA
          </span>
        </div>
        <p className="text-sm" style={{ color: 'var(--color-text-3)' }}>
          Radar de Nichos Globais (Garimpo Inteligente)
        </p>
      </header>

      {/* Row 1: Matriz */}
      <section>
        <MatrizOceano pontos={PONTOS} />
      </section>

      {/* Row 2: Resultados da Pesquisa */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-1)' }}>
            Resultados da Pesquisa (Garimpo)
          </h2>
          <span className="text-xs" style={{ color: 'var(--color-text-3)' }}>Últimas 24h</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GARIMPOS.map((nicho) => (
            <NichoCard key={nicho.id} nicho={nicho} />
          ))}
        </div>
      </section>
    </div>
  );
}
