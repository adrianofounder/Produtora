'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, LayoutGrid, Activity, Filter, Loader2, AlertCircle } from 'lucide-react';
import { VideoCard } from '@/components/dashboard/video-card';
import { Skeleton } from '@/components/ui/skeleton';

type VideoStatus = 'planejamento' | 'producao' | 'pronto' | 'agendado' | 'publicado' | 'erro';

interface Canal {
  id: string;
  nome: string;
  mare_status: 'aguardando' | 'testando' | 'ativa' | 'pausada';
  mare_eixo_ativo: string | null;
}

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

  // Carrega canais do usuário
  useEffect(() => {
    async function carregarCanais() {
      setLoadingCanais(true);
      try {
        const res = await fetch('/api/canais');
        if (!res.ok) throw new Error('Falha ao carregar canais');
        const data = await res.json();
        setCanais(data);
      } catch {
        setErro('Não foi possível carregar os canais. Verifique sua conexão.');
      } finally {
        setLoadingCanais(false);
      }
    }
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
    <div className="p-6 max-w-[1280px] mx-auto flex flex-col gap-5">
      {/* Header */}
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

      {/* Seletor de Canal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {canais.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setCanalAtivo(i)}
            className="text-left p-4 rounded-xl transition-all duration-300"
            style={{
              background: canalAtivo === i
                ? (c.mare_status === 'ativa' ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.07)')
                : 'rgba(255,255,255,0.02)',
              border: canalAtivo === i
                ? (c.mare_status === 'ativa' ? '1px solid rgba(124,58,237,0.35)' : '1px solid rgba(255,255,255,0.15)')
                : '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-bold" style={{ color: c.mare_status === 'ativa' ? 'var(--color-accent)' : 'var(--color-text-1)' }}>
                {c.nome}
              </span>
              {c.mare_status === 'ativa' && (
                <span className="badge badge-accent">
                  <Activity className="w-2.5 h-2.5" /> Maré Ativa
                </span>
              )}
            </div>
            <div className="flex gap-3 text-[11px]" style={{ color: 'var(--color-text-3)' }}>
              <span>Status: <strong style={{ color: 'var(--color-text-1)' }}>{c.mare_status}</strong></span>
              {c.mare_eixo_ativo && (
                <span>Eixo: <strong style={{ color: 'var(--color-accent)' }}>{c.mare_eixo_ativo}</strong></span>
              )}
            </div>
          </button>
        ))}
      </div>

      {canal && (
        <>
          {/* Info do canal ativo */}
          <div
            className="p-5 rounded-xl flex flex-wrap items-center gap-x-6 gap-y-2"
            style={{
              background: canal.mare_status === 'ativa' ? 'rgba(124,58,237,0.06)' : 'rgba(255,255,255,0.02)',
              border: canal.mare_status === 'ativa' ? '1px solid rgba(124,58,237,0.20)' : '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="flex-1 min-w-[200px]">
              <p className="text-[12px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-3)' }}>
                Canal Ativo
              </p>
              <p className="text-[17px] font-bold mt-0.5" style={{ color: 'var(--color-text-1)' }}>
                {canal.nome}
              </p>
            </div>
            <div className="flex gap-5 text-[12px]">
              <div className="flex flex-col gap-0.5">
                <span style={{ color: 'var(--color-text-3)' }}>Vídeos</span>
                <span className="font-semibold" style={{ color: 'var(--color-text-1)' }}>{videos.length}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span style={{ color: 'var(--color-text-3)' }}>Em Produção</span>
                <span className="font-semibold" style={{ color: 'var(--color-accent)' }}>
                  {videos.filter(v => v.status === 'producao').length}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span style={{ color: 'var(--color-text-3)' }}>Publicados</span>
                <span className="font-semibold" style={{ color: 'var(--color-success)' }}>
                  {videos.filter(v => v.status === 'publicado').length}
                </span>
              </div>
            </div>
            <button className="btn-ghost h-8 text-[12px]">
              <LayoutGrid className="w-3.5 h-3.5" /> Analytics & X-Ray
            </button>
          </div>

          {/* Filtros */}
          <div
            className="flex items-center justify-between p-3 rounded-xl gap-3 flex-wrap"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex gap-1.5 flex-wrap">
              {filtros.map((f) => {
                const ativo = filtroAtivo === f.value;
                return (
                  <button
                    key={f.value}
                    onClick={() => setFiltroAtivo(f.value)}
                    className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all duration-200"
                    style={{
                      background: ativo ? 'rgba(124,58,237,0.15)' : 'transparent',
                      border: ativo ? '1px solid rgba(124,58,237,0.30)' : '1px solid transparent',
                      color: ativo ? 'var(--color-accent)' : 'var(--color-text-3)',
                    }}
                  >
                    {f.label} <span className="ml-1.5 opacity-60">({countPorStatus(f.value)})</span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center">
                <Search className="absolute left-2.5 w-3.5 h-3.5 pointer-events-none" style={{ color: 'var(--color-text-3)' }} />
                <input
                  type="text"
                  placeholder="Buscar títulos..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="input pl-8 pr-3 h-8 text-[12px] w-44"
                />
              </div>
              <button className="btn-ghost h-8 text-[11px]">
                <Filter className="w-3.5 h-3.5" /> Filtrar
              </button>
              <button className="btn-primary h-8 text-[11px]">
                <Plus className="w-3.5 h-3.5" /> Novo Vídeo
              </button>
            </div>
          </div>

          {/* Lista de Vídeos */}
          <div className="flex flex-col gap-2.5 pb-6">
            {loadingVideos ? (
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
              </div>
            ) : videosFiltrados.length === 0 ? (
              <div
                className="text-center py-16 rounded-xl"
                style={{ border: '1px dashed rgba(255,255,255,0.08)', color: 'var(--color-text-3)' }}
              >
                <p className="text-[14px]">Nenhum vídeo encontrado para este filtro.</p>
              </div>
            ) : (
              videosFiltrados.map((v) => <VideoCard key={v.id} {...videoToCardProps(v)} />)
            )}
          </div>
        </>
      )}
    </div>
  );
}
