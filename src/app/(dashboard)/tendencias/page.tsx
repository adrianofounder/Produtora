import { Activity } from 'lucide-react';
import { MatrizOceano } from '@/components/tendencias/matriz-oceano';
import { NichoCard } from '@/components/tendencias/nicho-card';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';

type MatrizNichoRow = Database['public']['Tables']['matriz_nichos']['Row'];
type GarimpoRow = Database['public']['Tables']['garimpos_minados']['Row'];

export default async function Tendencias() {
  const supabase = await createClient();

  // Buscar dados da Matriz Oceano Azul — Eixo Y: Concorrência, Eixo X: Sentimento Dominante (Doutrina Epic-5 §2)
  const { data: pontosMatrix } = await supabase
    .from('matriz_nichos')
    .select('*')
    .order('created_at', { ascending: true });

  // Buscar Resultados do Garimpo — Algoritmo de Filtros de Nichos (Doutrina Epic-5 §1)
  const { data: garimposMinados } = await supabase
    .from('garimpos_minados')
    .select('*')
    .order('created_at', { ascending: false });

  // Mapeia tipos do banco para o formato dos componentes
  const PONTOS = (pontosMatrix as MatrizNichoRow[] | null || []).map(p => ({
    id: p.id,
    label: p.label,
    type: p.tipo as 'lotado' | 'gap',
    x: p.x,
    y: p.y,
    opacity: p.opacity,
    pulse: p.pulse,
  }));

  const GARIMPOS = (garimposMinados as GarimpoRow[] | null || []).map(g => ({
    id: g.id,
    titulo: g.titulo,
    canal: g.canal,
    views: g.views_text,
    tag: g.tag,
  }));

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
          
          {GARIMPOS.length === 0 && (
            <div className="col-span-full py-10 flex flex-col items-center justify-center border border-dashed rounded-lg opacity-50" style={{ borderColor: 'var(--color-border-2)' }}>
              <span className="text-2xl mb-2">📡</span>
              <p className="text-sm" style={{ color: 'var(--color-text-3)' }}>O Worker OpenCLI-rs ainda não processou dados hoje.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
