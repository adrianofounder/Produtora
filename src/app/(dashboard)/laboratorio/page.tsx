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

  const { data: { user } } = await supabase.auth.getUser();

  // 1. Defesa ativa contra acessos não isolados: Buscar explicitamente o Canal (NFR03)
  const { data: canalAtivo } = await supabase
    .from('canais')
    .select('id')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: true })
    .limit(1)
    .single();

  if (!canalAtivo) {
    // TODO: Adicionar um componente client-side simples ou um alerta na UI caso o canal não exista.
    return (
      <div className="p-8 text-center text-white/50">
        Nenhum canal associado a sua conta foi encontrado. Por favor, crie um canal primeiro.
      </div>
    );
  }

  // 2. Busca os Eixos com base no isolamento de canal (NFR03) validado
  const { data: eixosData } = await supabase
    .from('eixos')
    .select('*')
    .eq('canal_id', canalAtivo.id)
    .order('score_mare', { ascending: false });

  // 3. Busca as Ideias de Gaveta com status 'pendente' e filtradas por canal
  const { data: ideiasData } = await supabase
    .from('ideias')
    .select('id, titulo, premissa, nota_ia, tags, status, eixo_id, origem')
    .eq('canal_id', canalAtivo.id)
    .order('nota_ia', { ascending: false });

  // 4. Mapeia para os formatos da UI (EixoData) — Story 4.1 Campos atualizados
  const mappedEixos: EixoData[] = (eixosData || []).map((e) => ({
    id: e.id,
    nome: e.nome,
    nicho: e.sentimento_dominante || e.gatilho_curiosidade || 'Geral',
    status: (e.status as 'testando' | 'aguardando' | 'venceu') || 'aguardando',
    videos: e.videos_count ?? 0,
    mediaViews: e.media_views
      ? `${Math.round(e.media_views / 1000)}K`
      : `${Math.floor((e.views_acumuladas || 0) / 1000)}K`,
    taxaAprovacao: e.taxa_aprovacao ?? e.score_mare ?? 0,
  }));

  // 5. Mapeia para os formatos da UI (IdeiaData) — Story 4.1 Campos atualizados
  const mappedIdeias: IdeiaData[] = (ideiasData || []).map((i) => ({
    id: i.id,
    titulo: i.titulo,
    premissa: i.premissa || 'Sem premissa definida',
    notaIA: i.nota_ia ?? 0,
    tags: i.tags ?? [],
    status: i.status as IdeiaData['status'],
  }));

  return (
    <LaboratorioClient 
      initialEixos={mappedEixos} 
      initialIdeias={mappedIdeias}
      initialTrends={TRENDS_FALLBACK}
    />
  );
}
