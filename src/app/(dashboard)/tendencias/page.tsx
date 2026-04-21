import { Radar } from 'lucide-react';
import { MatrizOceano } from '@/components/tendencias/matriz-oceano';
import { NichoCard } from '@/components/tendencias/nicho-card';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';

type MatrizNichoRow = Database['public']['Tables']['matriz_nichos']['Row'];
type GarimpoRow = Database['public']['Tables']['garimpos_minados']['Row'];

export default async function Tendencias() {
  const supabase = await createClient();

  // Buscar dados da Matriz Oceano Azul — NFR03 (RLS deve estar ativo no Supabase)
  const { data: pontosMatrix } = await supabase
    .from('matriz_nichos')
    .select('*')
    .order('created_at', { ascending: true });

  // Buscar Resultados do Garimpo
  const { data: garimposMinados } = await supabase
    .from('garimpos_minados')
    .select('*')
    .order('created_at', { ascending: false });

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
    views: g.views_text || '0',
    tempo: g.tempo_duracao || '0:00',
    tag: g.tag || '',
    thumbnailUrl: g.thumbnail_url || '',
  }));

  return (
    <div className="flex flex-col gap-6 p-8 min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* ─── Header: Radar de Nichos Globais (Premium) ─── */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="icon-box icon-box-accent p-2.5 rounded-xl shadow-lg shadow-[var(--color-accent)]/10">
              <Radar size={22} className="animate-pulse" />
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-sans font-black tracking-tight" style={{ color: 'var(--color-text-1)' }}>
                Radar de Nichos
              </h1>
              <span className="badge-glass border-[var(--color-accent)]/30 text-[var(--color-accent)] shadow-[0_0_15px_rgba(124,58,237,0.15)]">
                BETA
              </span>
            </div>
          </div>
          <p className="text-sm font-medium opacity-60 max-w-lg" style={{ color: 'var(--color-text-2)' }}>
            Inteligência de garimpo em tempo real. Identifique o que está explodindo no "Oceano Azul" antes da concorrência saturar o nicho.
          </p>
        </div>
        
        {/* Stats rápidos ou Filtros (Futuro) */}
        <div className="hidden md:flex gap-6 items-center px-6 py-3 rounded-2xl border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold opacity-40">Gaps Ativos</span>
            <span className="text-lg font-black" style={{ color: 'var(--color-accent)' }}>{PONTOS.filter(p => p.type === 'gap').length}</span>
          </div>
          <div className="w-px h-8 opacity-20" style={{ backgroundColor: 'var(--color-text-1)' }} />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold opacity-40">Canais Minados</span>
            <span className="text-lg font-black" style={{ color: 'var(--color-text-1)' }}>{GARIMPOS.length}</span>
          </div>
        </div>
      </header>

      {/* ─── Bento Grid Principal (gap-6 / 24px) ─── */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-max">
        
        {/* Bloco 1: Matriz Oceano (Featured - 2 colunas large) */}
        <section className="lg:col-span-2 group">
          <MatrizOceano points={PONTOS} />
        </section>

        {/* Bloco 2: Insights Rápidos / Explicação (Side block Bento) */}
        <section className="card p-6 flex flex-col gap-4 border-dashed border-2 opacity-80 hover:opacity-100 transition-opacity" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
           <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2" style={{ color: 'var(--color-text-2)' }}>
             <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
             Como interpretar
           </h3>
           <div className="flex flex-col gap-3">
             <p className="text-[13px] leading-relaxed" style={{ color: 'var(--color-text-3)' }}>
               Nichos no quadrante <strong style={{ color: 'var(--color-accent)' }}>inferior direito</strong> representam o Santo Graal: Alta Demanda e Baixa Concorrência.
             </p>
             <div className="p-4 rounded-xl text-xs font-mono italic opacity-70" style={{ backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
               "A oportunidade mora onde o público pede, mas o criador ainda não entregou."
             </div>
           </div>
        </section>

        {/* Bloco 3: Listagem de Garimpos (Full width bottom row ou Custom Bento) */}
        <section className="lg:col-span-3 flex flex-col gap-6 mt-4">
          <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
               <h2 className="text-lg font-black tracking-tight" style={{ color: 'var(--color-text-1)' }}>
                 Resultados de Garimpo D-1
               </h2>
            </div>
            <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest hidden sm:block">
              Atualizado há 14 minutos
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {GARIMPOS.map((nicho) => (
              <div key={nicho.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <NichoCard nicho={nicho} />
              </div>
            ))}
            
            {GARIMPOS.length === 0 && (
              <div 
                className="col-span-full py-24 flex flex-col items-center justify-center border border-dashed rounded-3xl" 
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
              >
                <Radar size={48} className="mb-4 opacity-10 animate-spin-slow" />
                <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-1)' }}>Varrendo frequências...</h3>
                <p className="max-w-xs text-center text-sm mt-2 opacity-60" style={{ color: 'var(--color-text-3)' }}>
                  Nenhum sinal detectado no quadrante atual. Nossos crawlers estão buscando novas tendências.
                </p>
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}


