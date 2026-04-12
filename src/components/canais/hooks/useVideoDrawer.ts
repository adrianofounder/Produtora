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
  const [errorRoteiro, setErrorRoteiro] = useState<string | null>(null);
  const [errorTitulos, setErrorTitulos] = useState<string | null>(null);
  const [aprovado, setAprovado] = useState({ roteiro: false, audio: false, thumb: false });

  // actions
  async function gerarRoteiro(instrucao?: string) {
    setLoadingRoteiro(true);
    setErrorRoteiro(null);
    try {
      const res = await fetch('/api/ia/gerar-roteiro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_id: videoId, canal_id: canalId, titulo, tom: instrucao }),
      });
      if (!res.ok) throw new Error('Falha ao gerar roteiro na IA');
      const data = await res.json();
      if (data.roteiro) setRoteiro(data.roteiro);
    } catch (err: any) {
      setErrorRoteiro(err.message || 'Erro inesperado na geração do roteiro.');
    } finally {
      setLoadingRoteiro(false);
    }
  }

  async function gerarTitulos() {
    setLoadingTitulos(true);
    setErrorTitulos(null);
    try {
      const res = await fetch('/api/ia/gerar-titulos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ canal_id: canalId, eixo, premissa: titulo }),
      });
      if (!res.ok) throw new Error('Falha ao gerar títulos na IA');
      const data = await res.json();
      if (data.titulos) {
        setTitulos(data.titulos);
        setTituloSelecionado(data.titulos[0] ?? '');
      }
    } catch (err: any) {
      setErrorTitulos(err.message || 'Erro inesperado na geração de títulos.');
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
    errorRoteiro, setErrorRoteiro,
    errorTitulos, setErrorTitulos,
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
