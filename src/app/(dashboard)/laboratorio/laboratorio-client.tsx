'use client';

import { useState, useTransition, useMemo } from 'react';
import { Activity } from 'lucide-react';
import { EixoData, EixoCard } from '@/components/laboratorio/eixo-card';
import { IdeiasTable, IdeiaData } from '@/components/laboratorio/ideias-table';
import { TrendAnalysis, TrendMetrica } from '@/components/laboratorio/trend-analysis';
import {
  enviarIdeiaParaFabrica,
  enviarLoteParaFabrica,
  descartarIdeia,
  setEixoVencedor,
} from '@/app/actions/laboratorio-actions';

interface LaboratorioClientProps {
  initialEixos: EixoData[];
  initialIdeias: IdeiaData[];
  initialTrends: TrendMetrica[];
}

export function LaboratorioClient({ initialEixos, initialIdeias, initialTrends }: LaboratorioClientProps) {
  const [eixos, setEixos] = useState<EixoData[]>(initialEixos);
  const [ideias, setIdeias] = useState<IdeiaData[]>(initialIdeias);
  const [trends] = useState<TrendMetrica[]>(initialTrends);
  
  // O eixo vencedor detém o canal no start; ou apenas o primeiro carregado.
  const initialActive = initialEixos.find(e => e.status === 'venceu')?.id || (initialEixos.length > 0 ? initialEixos[0].id : null);
  const [activeEixoId, setActiveEixoId] = useState<string | number | null>(initialActive);

  // IDs em trânsito (evita duplo-clique e mostra spinner nos botões)
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  const [isPending, startTransition] = useTransition();

  // ---------------------------------------------------------------
  // Filtragem de Ideias reativas ao Eixo Ativo
  // ---------------------------------------------------------------

  // O EixoID da tabela de ideias no banco agora é "eixo_id" mapeado em page.tsx ou filtrado de forma simulada.
  // Como `IdeiaData` no Client não tem eixo_id explicito, usaremos filtro passivo provisório para fins de Layout AC4 se disponivel ou simular o array bruto filtrado pelo Servidor.
  // NOTA: Como as ideas vêm filtradas do servidor pelo canal, mostraremos todas ou pre-filtraremos dependendo das props, como apenas temos o componente Ideias recebendo array cego, a logica AC4 é assumida pela page com eq('canal_id'). Para visual, vamos espelhar as recebidas ativas.
  const ideiasAtivas = ideias;

  // ---------------------------------------------------------------
  // Marcar/desmarcar IDs como pendentes
  // ---------------------------------------------------------------
  const addPending = (ids: string[]) =>
    setPendingIds((prev) => new Set([...prev, ...ids]));

  const removePending = (ids: string[]) =>
    setPendingIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.delete(id));
      return next;
    });

  // ---------------------------------------------------------------
  // Envio individual (AC1 / AC4)
  // ---------------------------------------------------------------
  const handleSendToFabrica = (id: string | number) => {
    const strId = String(id);

    // Optimistic update status modificado para 'planejamento' conforme tabela nova DB.
    const previousIdeias = [...ideias];
    setIdeias((prev) =>
      prev.map((i) => (String(i.id) === strId ? { ...i, status: 'planejamento' as const } : i))
    );
    addPending([strId]);

    startTransition(async () => {
      const result = await enviarIdeiaParaFabrica(strId);

      if (!result.success) {
        setIdeias(previousIdeias);
        console.error('[Lab Action Error] enviarIdeiaParaFabrica:', result.error);
      }

      removePending([strId]);
    });
  };

  // ---------------------------------------------------------------
  // Envio em lote (AC2 / AC5)
  // ---------------------------------------------------------------
  const handleSendLote = () => {
    const idsParaEnviar = ideiasAtivas
      .filter((i) => i.status === 'pendente')
      .map((i) => String(i.id));

    if (idsParaEnviar.length === 0) return;

    // Optimistic update migrando para 'planejamento' (Tabela DB) em lote
    const previousIdeias = [...ideias];
    setIdeias((prev) =>
      prev.map((i) =>
        idsParaEnviar.includes(String(i.id)) ? { ...i, status: 'planejamento' as const } : i
      )
    );
    addPending(idsParaEnviar);

    startTransition(async () => {
      const result = await enviarLoteParaFabrica(idsParaEnviar);

      if (!result.success) {
        setIdeias(previousIdeias);
        console.error('[Lab Action Error] enviarLoteParaFabrica:', result.error);
      }

      removePending(idsParaEnviar);
    });
  };

  // ---------------------------------------------------------------
  // Descarte (AC3 / AC4 / AC7)
  // ---------------------------------------------------------------
  const handleDescartar = (id: string | number) => {
    const strId = String(id);

    // Optimistic update expurgando em tela visto que usamos DELETE físico no backend (Task 7)
    const previousIdeias = [...ideias];
    setIdeias((prev) => prev.filter((i) => String(i.id) !== strId));
    addPending([strId]);

    startTransition(async () => {
      const result = await descartarIdeia(strId);

      if (!result.success) {
        setIdeias(previousIdeias);
        console.error('[Lab Action Error] descartarIdeia:', result.error);
      }

      removePending([strId]);
    });
  };

  // ---------------------------------------------------------------
  // Master Override Action (AC4)
  // ---------------------------------------------------------------
  const handleMasterOverride = (eixoId: string | number) => {
    const strId = String(eixoId);
    
    // Ignorar tentativas duplas
    if (eixos.find(e => String(e.id) === strId)?.status === 'venceu') return;

    // Optimistic State - Atualizar a array provisória instantaneamente
    const previousEixos = [...eixos];
    setEixos(prev => prev.map(e => ({
      ...e,
      status: String(e.id) === strId ? 'venceu' :
              e.status === 'venceu' ? 'aguardando' : e.status
    })));

    // Ao invés de travar a UI toda; foca automaticamente no eixo forçado
    setActiveEixoId(eixoId);

    // Realizar ação atômica e com fallback
    startTransition(async () => {
      const result = await setEixoVencedor(strId);
      if (!result.success) {
         setEixos(previousEixos); // Rollback de todos os eixos perante falha
         console.error('[Master Override Error]:', result.error);
      }
    });
  };

  const temIdeiasParaEnviar = ideiasAtivas.some((i) => i.status === 'pendente');

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
              <h1 className="text-3xl font-bold tracking-tighter text-white">Laboratório &amp; Marés</h1>
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
          <span className="text-[10px] font-mono opacity-40 uppercase tracking-widest font-bold">
            {eixos.length} eixos rastreados
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {eixos.length === 0 ? (
            <div className="col-span-full py-20 text-center card border-dashed">
                <p className="text-sm opacity-40">Nenhum eixo temático disponível para essa amostragem.</p>
            </div>
          ) : eixos.map((eixo) => (
            <EixoCard
              key={eixo.id}
              eixo={eixo}
              isActive={activeEixoId === eixo.id}
              onClick={() => setActiveEixoId(eixo.id)}
              onMasterOverride={() => handleMasterOverride(eixo.id)}
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
              <span className="badge badge-muted font-mono px-2">{ideiasAtivas.length}</span>
            </h2>
            <button
              onClick={handleSendLote}
              disabled={isPending || !temIdeiasParaEnviar}
              className="btn-primary h-9 px-5 text-[11px] font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              ) : (
                '+ Enviar Lote p/ Fábrica'
              )}
            </button>
          </div>

          <div className="card p-1">
             <IdeiasTable
               ideias={ideiasAtivas}
               onSendToFabrica={handleSendToFabrica}
               onDescartar={handleDescartar}
               pendingIds={pendingIds}
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
