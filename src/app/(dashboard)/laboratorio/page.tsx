import { createClient } from '@/lib/supabase/server';
import { LaboratorioClient } from './laboratorio-client';
import { TrendMetrica } from '@/components/laboratorio/trend-analysis';
import { EixoData } from '@/components/laboratorio/eixo-card';
import { IdeiaData } from '@/components/laboratorio/ideias-table';
import { processarMares } from '@/lib/mares-engine';

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

  // 2. Busca os Eixos com base no isolamento de canal (NFR03)
  const { data: eixosData } = await supabase
    .from('eixos')
    .select('*')
    .eq('canal_id', canalAtivo.id)
    // Inicialmente desc by score, o Motor garante na memória
    .order('score_mare', { ascending: false });

  // 3. Executa Motor Marés localmente (NFR09) e processa
  const eixosProcessados = processarMares(eixosData || []);

  // 4. Busca as Ideias de Gaveta com status 'pendente' e filtradas por canal
  const { data: ideiasData } = await supabase
    .from('ideias')
    .select('id, titulo, premissa, nota_ia, tags, status, eixo_id, origem')
    .eq('canal_id', canalAtivo.id)
    .order('nota_ia', { ascending: false });

  // 5. Mapeia para os formatos da UI (EixoData) — Story 4.1 & 4.3 Campos atualizados
  const mappedEixos: EixoData[] = eixosProcessados.map((e) => ({
    id: e.id,
    nome: e.nome,
    nicho: e.nicho || 'Geral',
    status: (e.status as 'testando' | 'aguardando' | 'venceu') || 'aguardando',
    videos: e.videos_count ?? 0,
    mediaViews: e.media_views
      ? `${Math.round(e.media_views / 1000)}K`
      : '0K',
    taxaAprovacao: e.taxa_aprovacao ?? e.score_mare ?? 0,
    colorStyle: e.colorHexOrVar // Do motor marés!
  }));

  // 6. Mapeia para Trend Analysis
  const mappedTrends: TrendMetrica[] = eixosProcessados.map((e) => ({
    eixo: e.nome,
    score: e.score_mare,
    views7d: e.views_7d ? `${Math.round(e.views_7d / 1000)}K` : '0',
    ctr: e.ctr ? `${e.ctr}%` : '0%',
    retencao: e.retencao ? `${e.retencao}%` : '0%',
    direcao: e.direcao,
    isLeader: e.isLeader
  }));

  // 7. Mapeia para Ideias
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
      initialTrends={mappedTrends}
    />
  );
}
