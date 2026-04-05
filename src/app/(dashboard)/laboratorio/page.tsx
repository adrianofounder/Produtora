'use client';

import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { EixoData, EixoCard } from '@/components/laboratorio/eixo-card';
import { IdeiasTable, IdeiaData } from '@/components/laboratorio/ideias-table';
import { TrendAnalysis, TrendMetrica } from '@/components/laboratorio/trend-analysis';
import { Skeleton } from '@/components/ui/skeleton';

// Dados iniciais e auxiliares - Removidos os mocks constantes daqui.
const TRENDS_FALLBACK: TrendMetrica[] = [
  { eixo: 'Trabalho (Chefe vs. Tropa)', score: 94, views7d: '2.1M', ctr: '8.4%', retencao: '73%', direcao: 'up'     },
  { eixo: 'Igreja (Fé & Conflito)',     score: 71, views7d: '980K', ctr: '6.1%', retencao: '61%', direcao: 'up'     },
];

export default function Laboratorio() {
  const [eixos, setEixos] = useState<EixoData[]>([]);
  const [ideias, setIdeias] = useState<IdeiaData[]>([]);
  const [trends, setTrends] = useState<TrendMetrica[]>(TRENDS_FALLBACK);
  const [activeEixoId, setActiveEixoId] = useState<string | number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      setLoading(true);
      try {
        const [resEixos, resBlueprints] = await Promise.all([
          fetch('/api/eixos'),
          fetch('/api/blueprints')
        ]);

        const dataEixos = await resEixos.json();
        const dataBlueprints = await resBlueprints.json();

        // Mapeia Eixos do banco para o formato da UI
        const mappedEixos: EixoData[] = (dataEixos || []).map((e: any) => ({
          id: e.id,
          nome: e.nome,
          nicho: e.sentimento_dominante || 'Geral',
          status: e.status,
          videos: 0, // Placeholder operacional até o join de vídeos
          mediaViews: `${Math.floor(e.views_acumuladas / 1000)}K`,
          taxaAprovacao: e.score_mare || 0
        }));

        // Mapeia Blueprints para o formato de Ideias
        const mappedIdeias: IdeiaData[] = (dataBlueprints || []).map((b: any) => ({
          id: b.id,
          titulo: b.titulo_benchmark || 'Nova Ideia',
          premissa: b.hook || 'Em desenvolvimento',
          notaIA: b.performance_score || 0,
          tags: [b.emocao_dominante || 'maré'],
          status: b.veredito === 'aprovado' ? 'fabrica' : 'pendente'
        }));

        setEixos(mappedEixos);
        setIdeias(mappedIdeias);
        if (mappedEixos.length > 0) setActiveEixoId(mappedEixos[0].id);
        
      } catch (err) {
        console.error('Erro ao carregar Laboratório:', err);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  const handleSendToFabrica = async (id?: string | number) => {
    // Se ID for passado, envia um específico. Se não, envia todos 'pendentes'.
    const idsParaEnviar = id ? [id] : ideias.filter(i => i.status === 'pendente').map(i => i.id);
    
    if (idsParaEnviar.length === 0) {
      alert('Nenhuma ideia pendente para enviar.');
      return;
    }

    try {
      // Simula o processamento em lote
      alert(`Enviando ${idsParaEnviar.length} ideia(s) para a Fábrica de Produção...`);
      
      // Aqui faríamos o loop de UPDATE na API /api/blueprints/[id]
      // Por brevidade nesta fase, vamos apenas simular o sucesso visual
      setIdeias(prev => prev.map(i => 
        //@ts-ignore
        idsParaEnviar.includes(i.id) ? { ...i, status: 'fabrica' } : i
      ));

    } catch (err) {
      console.error('Erro ao enviar para fábrica:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </header>
        <section>
          <Skeleton className="h-4 w-32 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        </section>
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="flex justify-between items-center h-10">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-9 w-40 rounded-lg" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Skeleton className="h-6 w-48 h-10 flex items-center" />
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-10 p-6 max-w-[1400px] mx-auto min-h-screen">
      {/* Background Effect */}
      <div className="mesh-bg opacity-30 right-[-10%] top-[40%]" />

      {/* Page Header */}
      <header className="flex flex-col gap-2 pt-4">
        <div className="flex items-center gap-3">
          <div className="icon-box icon-box-accent w-10 h-10 rounded-xl">
             <Activity className="w-5 h-5 shadow-[0_0_10px_var(--color-accent)]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tighter text-white">Laboratório & Marés</h1>
              <span className="badge badge-accent animate-pulse">Live Analysis</span>
            </div>
            <p className="text-sm font-medium mt-0.5 text-[var(--color-text-3)]">
              Motor de validação e análise de eixos temáticos.
            </p>
          </div>
        </div>
      </header>

      {/* Row 1: Eixos Matrix */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-label flex items-center gap-2">
            Matriz de Eixos Ativos
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-glow" />
          </h2>
          <span className="text-[10px] font-mono opacity-40 uppercase tracking-widest font-bold">{eixos.length} eixos rastreados</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {eixos.length === 0 ? (
            <div className="col-span-full py-20 text-center card border-dashed">
                <p className="text-sm opacity-40">Nenhum eixo temático disponível.</p>
            </div>
          ) : eixos.map((eixo) => (
            <EixoCard 
              key={eixo.id} 
              eixo={eixo} 
              isActive={activeEixoId === eixo.id}
              onClick={() => setActiveEixoId(eixo.id)} 
            />
          ))}
        </div>
      </section>

      {/* Row 2: Ideas + Trends - Bento Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
        
        {/* Left: Ideas Table */}
        <div className="lg:col-span-12 xl:col-span-7 flex flex-col gap-5">
          <div className="flex justify-between items-center px-1">
            <h2 className="section-label text-white flex items-center gap-3">
              Banco de Ideias Validado
              <span className="badge badge-muted font-mono px-2">{ideias.length}</span>
            </h2>
            <button 
              onClick={() => handleSendToFabrica()}
              className="btn-primary h-9 px-5 text-[11px] font-bold"
            >
              + Enviar Lote p/ Fábrica
            </button>
          </div>
          
          <div className="card p-1">
             <IdeiasTable 
               ideias={ideias} 
               onSendToFabrica={(id) => handleSendToFabrica(id)} 
             />
          </div>
        </div>

        {/* Right: Trends Analysis */}
        <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-5">
          <div className="flex justify-between items-center px-1">
            <h2 className="section-label text-white">Sinais e Tendências</h2>
            <span className="text-[10px] font-mono opacity-40 uppercase font-bold">7 dias retroativos</span>
          </div>
          <div className="card h-full">
            <TrendAnalysis metricas={trends} />
          </div>
        </div>

      </section>
    </div>
  );
}
