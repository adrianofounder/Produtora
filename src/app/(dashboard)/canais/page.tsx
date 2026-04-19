'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { Plus, Search, LayoutGrid, Activity, Filter, Loader2, AlertCircle } from 'lucide-react';
import { updateVideoStatus } from '@/app/actions/kanban-actions';
import { VideoCard } from '@/components/dashboard/video-card';
import { GavetaProducao } from '@/components/gaveta/gaveta-producao';
import type { VideoGavetaData } from '@/components/gaveta/gaveta-producao';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';

type VideoStatus = 'planejamento' | 'producao' | 'pronto' | 'agendado' | 'publicado' | 'erro';

interface Canal {
  id: string;
  nome: string;
  mare_status: 'aguardando' | 'testando' | 'ativa' | 'pausada';
  mare_eixo_ativo: string | null;
  idioma: string;
  frequencia_dia: number;
  horario_padrao: string;
  email_contato: string | null;
  descricao: string | null;
}

import { CanalModal } from '@/components/modals/canal-modal';
import { VideoModal } from '@/components/modals/video-modal';

interface Video {
  id: string;
  canal_id: string;
  titulo: string;
  eixo: string | null;
  status: VideoStatus;
  data_previsao: string | null;
  step_titulo: boolean;
  step_roteiro: boolean;
  step_audio: boolean;
  step_imagens: boolean;
  step_montagem: boolean;
  step_thumb: boolean;
  step_agendado: boolean;
  roteiro: string | null;
}

const STEPS_LABELS = ['Título', 'Roteiro', 'Áudio', 'Imagens', 'Montagem', 'Thumb', 'Agendado'];
const STEP_KEYS = ['step_titulo', 'step_roteiro', 'step_audio', 'step_imagens', 'step_montagem', 'step_thumb', 'step_agendado'] as const;

const filtros: { label: string; value: VideoStatus | 'todos' }[] = [
  { label: 'Todos', value: 'todos' },
  { label: 'Planejamento', value: 'planejamento' },
  { label: 'Em Produção', value: 'producao' },
  { label: 'Prontos', value: 'pronto' },
  { label: 'Agendados', value: 'agendado' },
  { label: 'Publicados', value: 'publicado' },
];

function videoToCardProps(v: Video) {
  return {
    titulo: v.titulo,
    eixo: v.eixo ?? '',
    dataPrevisao: v.data_previsao
      ? new Date(v.data_previsao).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
      : '--/--',
    status: v.status,
    steps: STEPS_LABELS.map((label, i) => ({
      label,
      done: v[STEP_KEYS[i]],
    })),
    acaoPrimaria: getAcaoPrimaria(v),
  };
}

function getAcaoPrimaria(v: Video): string | undefined {
  if (!v.step_roteiro) return 'Revisar Ideia';
  if (!v.step_audio) return 'Aprovar Áudio';
  if (!v.step_thumb) return 'Aprovar Thumb';
  if (v.status === 'agendado') return 'Ver no Calendário';
  return undefined;
}

export default function Canais() {
  const [canais, setCanais] = useState<Canal[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [canalAtivo, setCanalAtivo] = useState(0);
  const [filtroAtivo, setFiltroAtivo] = useState<VideoStatus | 'todos'>('todos');
  const [busca, setBusca] = useState('');
  const [loadingCanais, setLoadingCanais] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Estado da Gaveta de Produção (Story 3.2)
  const [gavetaVideo, setGavetaVideo] = useState<VideoGavetaData | null>(null);

  // Estados dos Modais
  const [isCanalModalOpen, setIsCanalModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Pipeline Transitions
  const [isPending, startTransition] = useTransition();
  const [movingCardId, setMovingCardId] = useState<string | null>(null);

  const handleMoveStatus = (videoId: string, currentStatus: VideoStatus, direction: 'forward' | 'backward') => {
      const flow: VideoStatus[] = ['planejamento', 'producao', 'pronto', 'agendado', 'publicado'];
      const idx = flow.indexOf(currentStatus);
      if (idx === -1) return;
      
      let nextIdx = direction === 'forward' ? idx + 1 : idx - 1;
      if (nextIdx < 0 || nextIdx >= flow.length) return;
      
      const newStatus = flow[nextIdx];
      setMovingCardId(videoId);
      startTransition(async () => {
         const res = await updateVideoStatus(videoId, newStatus);
         if (res.success) {
            if (canais[canalAtivo]) {
               carregarVideos(canais[canalAtivo].id);
            }
         } else {
            alert(res.error);
         }
         setMovingCardId(null);
      });
  };

  // Carrega canais do usuário
  const carregarCanais = useCallback(async () => {
    setLoadingCanais(true);
    try {
      const res = await fetch('/api/canais');
      if (!res.ok) throw new Error('Falha ao carregar canais');
      const data = await res.json();
      setCanais(data || []);
      if (data && data.length > 0 && !canais[canalAtivo]) {
        // Mantém o canal ativo se possível
      }
    } catch {
      setErro('Não foi possível carregar os canais. Verifique sua conexão.');
    } finally {
      setLoadingCanais(false);
    }
  }, [canalAtivo, canais]);

  useEffect(() => {
    carregarCanais();
  }, []);

  // Carrega vídeos do canal ativo
  const carregarVideos = useCallback(async (canalId: string) => {
    setLoadingVideos(true);
    try {
      const res = await fetch(`/api/videos?canal_id=${canalId}`);
      if (!res.ok) throw new Error('Falha ao carregar vídeos');
      const data = await res.json();
      setVideos(data);
    } catch {
      setErro('Não foi possível carregar os vídeos.');
    } finally {
      setLoadingVideos(false);
    }
  }, []);

  useEffect(() => {
    if (canais[canalAtivo]) {
      carregarVideos(canais[canalAtivo].id);
    }
  }, [canalAtivo, canais, carregarVideos]);

  const canal = canais[canalAtivo];

  const videosFiltrados = videos.filter((v) => {
    const matchFiltro = filtroAtivo === 'todos' || v.status === filtroAtivo;
    const matchBusca = v.titulo.toLowerCase().includes(busca.toLowerCase());
    return matchFiltro && matchBusca;
  });

  const countPorStatus = (s: VideoStatus | 'todos') =>
    s === 'todos' ? videos.length : videos.filter((v) => v.status === s).length;

  if (loadingCanais) {
    return (
      <div className="p-6 max-w-[1280px] mx-auto flex flex-col gap-5">
        <div className="flex items-center justify-between pt-1">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[100px] w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-20 w-full rounded-xl" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // Se houver erro E não houver canais, mostramos o erro. 
  // Mas se for apenas o banco vazio (canais.length === 0), o useEffect lidará com isso.
  if (erro && canais.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <div className="card flex flex-col items-center gap-3 p-10 max-w-md text-center">
          <div className="p-3 rounded-full bg-red-500/10 mb-2">
            <AlertCircle className="h-8 w-8" style={{ color: 'var(--color-error)' }} />
          </div>
          <h3 className="font-bold text-lg" style={{ color: 'var(--color-text-1)' }}>Ops! Algo deu errado</h3>
          <p className="text-sm" style={{ color: 'var(--color-text-3)' }}>{erro}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary mt-4"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  // Estado vazio: nenhum canal cadastrado
  if (canais.length === 0) {
    return (
      <div className="p-6 max-w-[1280px] mx-auto flex flex-col gap-5">
        <div className="flex items-center justify-between pt-1">
          <div>
            <h1 className="text-[20px] font-bold tracking-tight" style={{ color: 'var(--color-text-1)' }}>
              Gestão de Canais
            </h1>
            <p className="text-[13px] mt-0.5" style={{ color: 'var(--color-text-3)' }}>
              Pipeline de produção e status dos vídeos
            </p>
          </div>
          <button className="btn-primary h-9">
            <Plus className="w-4 h-4" /> Novo Canal
          </button>
        </div>
        <div className="card text-center py-20 flex flex-col items-center gap-4">
          <div className="icon-box icon-box-accent">
            <LayoutGrid className="h-8 w-8" style={{ color: 'var(--color-accent)' }} />
          </div>
          <div>
            <p className="font-semibold" style={{ color: 'var(--color-text-1)' }}>Nenhum canal cadastrado</p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-3)' }}>
              Crie seu primeiro canal para iniciar a produção.
            </p>
          </div>
          <button className="btn-primary">
            <Plus className="w-4 h-4" /> Criar Primeiro Canal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative p-6 max-w-[1400px] mx-auto flex flex-col gap-8 min-h-screen">
      {/* Background Effect */}
      <div className="mesh-bg opacity-30" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-accent">Operacional</span>
            <span className="text-[10px] uppercase tracking-widest font-bold opacity-30">v1.2</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Gestão de Canais
          </h1>
          <p className="text-sm mt-1 text-[var(--color-text-3)] max-w-md">
            Monitore o pipeline de produção e a saúde das suas marés em tempo real.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => alert('Histórico de Marés em desenvolvimento')} className="btn-ghost h-10 px-4">
             Histórico
          </button>
          <button 
            onClick={() => setIsCanalModalOpen(true)} 
            className="btn-primary h-10 px-6 shadow-xl shadow-purple-500/20"
          >
            <Plus className="w-4 h-4" /> Novo Canal
          </button>
        </div>
      </div>

      {/* Seletor de Canal - Horizontal Bento Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-label">Seus Canais</h2>
          <span className="text-[10px] font-mono opacity-40">{canais.length} canais conectados</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {canais.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setCanalAtivo(i)}
              className={`
                text-left p-5 transition-all duration-300
                ${canalAtivo === i ? 'card-accent scale-[1.02]' : 'card hover:scale-[1.01]'}
              `}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm font-bold tracking-tight ${canalAtivo === i ? 'text-[var(--color-accent)]' : 'text-white'}`}>
                  {c.nome}
                </span>
                {c.mare_status === 'ativa' ? (
                  <div className="dot-live" title="Maré Ativa" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                )}
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold opacity-40">Status</span>
                  <span className={`badge ${c.mare_status === 'ativa' ? 'badge-accent' : 'badge-muted'} scale-90 origin-right`}>
                    {c.mare_status}
                  </span>
                </div>
                {c.mare_eixo_ativo && (
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold opacity-40">Eixo Ativo</span>
                    <span className="text-[10px] font-mono font-bold text-[var(--color-text-2)]">
                      {c.mare_eixo_ativo}
                    </span>
                  </div>
                )}
              </div>
            </button>
          ))}
          
          {/* Action Card */}
          <button 
            onClick={() => setIsCanalModalOpen(true)}
            className="card border-dashed border-white/10 bg-transparent flex flex-col items-center justify-center gap-2 p-5 group hover:border-purple-500/30 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-500/10 transition-colors">
              <Plus className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-[11px] font-bold opacity-40 group-hover:opacity-100 uppercase tracking-wider">Adicionar Canal</span>
          </button>
        </div>
      </section>

      {canal && (
        <section className="flex flex-col gap-6">
          {/* Info do canal ativo - Bento Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Main Info */}
            <div className={`lg:col-span-8 p-6 ${canal.mare_status === 'ativa' ? 'card-accent' : 'card'} flex flex-col md:flex-row items-center gap-8`}>
              <div className="flex-1">
                <p className="section-label opacity-40 mb-1">Visão Geral do Canal</p>
                <h2 className="text-2xl font-bold text-white mb-2">{canal.nome}</h2>
                
                {/* Informações Extras Pedidas no PRD */}
                <div className="flex flex-wrap gap-4 text-[11px] mt-3 mb-4 bg-white/5 border border-white/5 w-fit px-4 py-2 rounded-lg">
                  <div className="flex items-center gap-1.5 opacity-80">
                    <span className="text-[var(--color-text-3)]">Idioma:</span>
                    <span className="font-bold uppercase">{canal.idioma || 'PT-BR'}</span>
                  </div>
                  <div className="w-[1px] h-3 bg-white/10" />
                  <div className="flex items-center gap-1.5 opacity-80">
                    <span className="text-[var(--color-text-3)]">Freq:</span>
                    <span className="font-bold">{canal.frequencia_dia ? `${canal.frequencia_dia}/dia` : '1/dia'}</span>
                  </div>
                  <div className="w-[1px] h-3 bg-white/10" />
                  <div className="flex items-center gap-1.5 opacity-80">
                    <span className="text-[var(--color-text-3)]">Horário:</span>
                    <span className="font-bold">{canal.horario_padrao || '18h00'}</span>
                  </div>
                  {canal.email_contato && (
                    <>
                      <div className="w-[1px] h-3 bg-white/10" />
                      <div className="flex items-center gap-1.5 opacity-80">
                        <span className="text-[var(--color-text-3)]">E-mail:</span>
                        <span className="font-bold text-[var(--color-accent)]">{canal.email_contato}</span>
                      </div>
                    </>
                  )}
                </div>
                
                {canal.descricao && (
                  <p className="text-[11px] text-[var(--color-text-2)] max-w-2xl mb-4 italic leading-relaxed border-l-2 border-[var(--color-accent)]/30 pl-3">
                    <span className="font-bold not-italic opacity-50 mr-1">Desc:</span> {canal.descricao}
                  </p>
                )}

                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1.5">
                     <div className={`w-2 h-2 rounded-full ${canal.mare_status === 'ativa' ? 'bg-[var(--color-accent)] animate-pulse shadow-[0_0_8px_var(--color-accent)]' : 'bg-white/20'}`} />
                     <span className="text-xs font-bold uppercase tracking-wide">{canal.mare_status}</span>
                   </div>
                   <div className="h-4 w-[1px] bg-white/10" />
                   <span className="text-xs text-[var(--color-text-3)]">
                     ID: <span className="font-mono text-[10px] uppercase">{canal.id.split('-')[0]}...</span>
                   </span>
                </div>
              </div>
              
              <div className="flex gap-8 border-l border-white/5 pl-8 h-full items-center">
                <div className="flex flex-col">
                  <span className="section-label opacity-40">Vídeos</span>
                  <span className="text-2xl font-mono font-bold text-white">{videos.length}</span>
                </div>
                <div className="flex flex-col">
                  <span className="section-label opacity-40">Em Produção</span>
                  <span className="text-2xl font-mono font-bold text-[var(--color-accent)]">
                    {videos.filter(v => v.status === 'producao').length}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="section-label opacity-40">Publicados</span>
                  <span className="text-2xl font-mono font-bold text-[var(--color-success)]">
                    {videos.filter(v => v.status === 'publicado').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats Card - Real Data Integration */}
            <div className="lg:col-span-4 card p-6 flex flex-col justify-between group">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-sm font-bold text-white">Performance do Canal</h3>
                 <Activity className="w-4 h-4 text-[var(--color-accent)]" />
              </div>
              <div className="space-y-4">
                 <div className="flex items-center justify-between text-[11px]">
                    <span className="opacity-40 uppercase font-bold">Saúde da Maré</span>
                    <span className={`font-mono font-bold ${videos.length > 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-warning)]'}`}>
                      {videos.length > 10 ? 'Estável' : videos.length > 0 ? 'Em Maturação' : 'Inativa'}
                    </span>
                 </div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-[0_0_10px_rgba(124,58,237,0.3)] transition-all duration-1000" 
                      style={{ width: `${Math.min((videos.length / 20) * 100, 100)}%` }}
                    />
                 </div>
              </div>
              <button 
                onClick={() => alert('Relatórios detalhados em processamento (Fase 4)')}
                className="btn-ghost w-full h-9 text-[11px] font-bold mt-6 group-hover:border-[var(--color-accent)]/50 transition-colors flex items-center justify-center gap-2"
              >
                <Activity className="w-3.5 h-3.5" /> Visualizar Analytics e X-Ray
              </button>
            </div>
          </div>

          {/* Pipeline Controls */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-xl border border-white/5">
              {filtros.map((f) => {
                const ativo = filtroAtivo === f.value;
                return (
                  <button
                    key={f.value}
                    onClick={() => setFiltroAtivo(f.value)}
                    className={`
                      text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-all duration-200
                      ${ativo ? 'bg-white/10 text-white shadow-sm' : 'text-[var(--color-text-3)] hover:text-white'}
                    `}
                  >
                    {f.label} <span className="ml-1 opacity-30">({countPorStatus(f.value)})</span>
                  </button>
                );
              })}
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-3)] group-focus-within:text-[var(--color-accent)] transition-colors" />
                <input
                  type="text"
                  placeholder="Pesquisar vídeos..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="input pl-9 pr-4 h-10 text-xs w-64 bg-white/5 border-white/5 focus:bg-white/10"
                />
              </div>
              <button onClick={() => alert('Filtros avançados em breve')} className="btn-ghost h-10 px-4">
                <Filter className="w-4 h-4 mr-2 opacity-40" /> Filtros
              </button>
              <button 
                onClick={() => setIsVideoModalOpen(true)} 
                className="btn-primary h-10 px-6"
              >
                <Plus className="w-4 h-4 mr-2" /> Novo Vídeo
              </button>
            </div>
          </div>

          {/* Video Grid/List Section */}
          <div className="flex flex-col gap-3 pb-12">
            {loadingVideos ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-2xl" />
                ))}
              </div>
            ) : videosFiltrados.length === 0 ? (
              <EmptyState 
                icon={LayoutGrid}
                title="Nada encontrado"
                description="Não há vídeos que correspondam à sua busca."
                action={
                  <button 
                    onClick={() => {setBusca(''); setFiltroAtivo('todos');}}
                    className="btn-ghost text-[10px] h-8 px-4"
                  >
                    Limpar Filtros
                  </button>
                }
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 {videosFiltrados.map((v) => {
                     const flow: VideoStatus[] = ['planejamento', 'producao', 'pronto', 'agendado', 'publicado'];
                     const idx = flow.indexOf(v.status);
                     const canMoveForward = idx >= 0 && idx < flow.length - 1 && v.status !== 'erro';
                     const canMoveBackward = idx > 0 && v.status !== 'erro';
                     
                     return (
                       <VideoCard 
                         key={v.id} 
                         {...videoToCardProps(v)} 
                         isMoving={movingCardId === v.id}
                         onMoveForward={canMoveForward ? () => handleMoveStatus(v.id, v.status, 'forward') : undefined}
                         onMoveBackward={canMoveBackward ? () => handleMoveStatus(v.id, v.status, 'backward') : undefined}
                         onOpenGaveta={() => {
                           const blueprint = null; // blueprints carregados separadamente em Story futura
                           setGavetaVideo({
                             id: v.id,
                             titulo: v.titulo,
                             eixo: v.eixo,
                             status: v.status,
                             roteiro: v.roteiro ?? null,
                             canal: {
                               nome: canal?.nome ?? '',
                               blueprint,
                             },
                           });
                         }}
                       />
                     );
                 })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Modais de Ação */}
      <CanalModal 
        isOpen={isCanalModalOpen} 
        onClose={() => setIsCanalModalOpen(false)}
        onSuccess={carregarCanais}
      />

      <VideoModal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)}
        onSuccess={() => canal && carregarVideos(canal.id)}
        canalId={canal?.id || ''}
      />

      {/* Gaveta de Produção Story 3.2 */}
      <GavetaProducao
        isOpen={!!gavetaVideo}
        onClose={() => setGavetaVideo(null)}
        video={gavetaVideo}
        onScriptSaved={() => canal && carregarVideos(canal.id)}
      />
    </div>
  );
}
