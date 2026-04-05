import { useState, createContext, useContext } from 'react';

export type Aba = 'ideia' | 'roteiro' | 'narracao' | 'thumb' | 'pacote';

export interface UseVideoDrawerProps {
  videoId: string;
  canalId: string;
  eixo: string;
  tituloInicial: string;
  onUpdate?: () => void;
  onClose: () => void;
}

export function useVideoDrawerState({ videoId, canalId, eixo, tituloInicial, onUpdate, onClose }: UseVideoDrawerProps) {
  const [abaAtiva, setAbaAtiva] = useState<Aba>('roteiro');
  const [roteiro, setRoteiro] = useState('');
  const [titulos, setTitulos] = useState<string[]>([]);
  const [tituloSelecionado, setTituloSelecionado] = useState('');
  const [titulo, setTitulo] = useState(tituloInicial);
  const [loadingRoteiro, setLoadingRoteiro] = useState(false);
  const [loadingTitulos, setLoadingTitulos] = useState(false);
  const [aprovado, setAprovado] = useState({ roteiro: false, audio: false, thumb: false });

  // actions
  async function gerarRoteiro(instrucao?: string) {
    setLoadingRoteiro(true);
    try {
      const res = await fetch('/api/ia/gerar-roteiro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_id: videoId, canal_id: canalId, titulo, tom: instrucao }),
      });
      const data = await res.json();
      if (data.roteiro) setRoteiro(data.roteiro);
    } finally {
      setLoadingRoteiro(false);
    }
  }

  async function gerarTitulos() {
    setLoadingTitulos(true);
    try {
      const res = await fetch('/api/ia/gerar-titulos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ canal_id: canalId, eixo, premissa: titulo }),
      });
      const data = await res.json();
      if (data.titulos) {
        setTitulos(data.titulos);
        setTituloSelecionado(data.titulos[0] ?? '');
      }
    } finally {
      setLoadingTitulos(false);
    }
  }

  async function aprovarRoteiro() {
    await fetch(`/api/videos/${videoId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roteiro, roteiro_aprovado: true, step_roteiro: true }),
    });
    setAprovado((p) => ({ ...p, roteiro: true }));
    setAbaAtiva('narracao');
    onUpdate?.();
  }

  const progresso = Object.values(aprovado).filter(Boolean).length;

  return {
    videoId, canalId, eixo, titulo, setTitulo,
    abaAtiva, setAbaAtiva,
    roteiro, setRoteiro,
    titulos, setTitulos,
    tituloSelecionado, setTituloSelecionado,
    loadingRoteiro, setLoadingRoteiro,
    loadingTitulos, setLoadingTitulos,
    aprovado, setAprovado,
    progresso,
    gerarRoteiro, gerarTitulos, aprovarRoteiro,
    onUpdate, onClose
  };
}

export type VideoDrawerContextType = ReturnType<typeof useVideoDrawerState>;

export const VideoDrawerContext = createContext<VideoDrawerContextType | null>(null);

export function useVideoDrawer() {
  const context = useContext(VideoDrawerContext);
  if (!context) throw new Error('useVideoDrawer must be used within VideoDrawerContext.Provider');
  return context;
}
