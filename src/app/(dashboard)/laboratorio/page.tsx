import { createClient } from '@/lib/supabase/server';
import { LaboratorioClient } from './laboratorio-client';
import { TrendMetrica } from '@/components/laboratorio/trend-analysis';
import { EixoData } from '@/components/laboratorio/eixo-card';
import { IdeiaData } from '@/components/laboratorio/ideias-table';

// Fallback temporário para Trends (Enquanto não temos o Crawler populando o Histórico)
const TRENDS_FALLBACK: TrendMetrica[] = [
  { eixo: 'Trabalho (Chefe vs. Tropa)', score: 94, views7d: '2.1M', ctr: '8.4%', retencao: '73%', direcao: 'up' },
  { eixo: 'Igreja (Fé & Conflito)',     score: 71, views7d: '980K', ctr: '6.1%', retencao: '61%', direcao: 'up' },
];

export default async function Laboratorio() {
  const supabase = await createClient();

  // 1. Busca os Eixos (DNA Completo conforme PRD)
  const { data: eixosData } = await supabase
    .from('eixos')
    .select('*')
    .order('score_mare', { ascending: false });

  // 2. Busca os Vídeos em status 'planejamento' (Ideias de Gaveta)
  const { data: ideiasData } = await supabase
    .from('videos')
    .select('*')
    .eq('status', 'planejamento')
    .order('created_at', { ascending: false });

  // 3. Mapeia para os formatos da UI (EixoData)
  const mappedEixos: EixoData[] = (eixosData || []).map((e) => ({
    id: e.id,
    nome: e.nome,
    nicho: e.sentimento_dominante || 'Geral',
    status: (e.status as 'testando' | 'aguardando' | 'venceu') || 'aguardando',
    videos: 0, // Pode ser preenchido por um view ou contagem
    mediaViews: `${Math.floor(e.views_acumuladas / 1000)}K`,
    // score_mare (0-100) é o Score da Maré — indicador principal de performance do Eixo (Doutrina Epic-4)
    taxaAprovacao: e.score_mare ? Math.round(e.score_mare) : 0,
  }));

  // 4. Mapeia para os formatos da UI (IdeiaData)
  const mappedIdeias: IdeiaData[] = (ideiasData || []).map((v) => ({
    id: v.id,
    titulo: v.titulo,
    premissa: v.roteiro || 'Em desenvolvimento',
    // notaIA normalizada na escala 0-10 usando score_mare (0-100) do eixo associado — sem hardcode
    notaIA: 0, // Preenchido pela análise de blueprint no futuro (Story 2.3+)
    tags: [v.eixo || 'maré'],
    status: 'pendente' as const, // Força type literais
  }));

  return (
    <LaboratorioClient 
      initialEixos={mappedEixos} 
      initialIdeias={mappedIdeias}
      initialTrends={TRENDS_FALLBACK}
    />
  );
}
