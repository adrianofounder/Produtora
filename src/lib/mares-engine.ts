export type DirecaoMare = 'up' | 'stable' | 'down' | 'new';

export interface EixoDBAnalytics {
  id: string;
  nome: string;
  nicho?: string;
  sentimento_dominante?: string | null;
  gatilho_curiosidade?: string | null;
  status: string;
  videos_count: number;
  media_views: number;
  taxa_aprovacao: number;
  score_mare_anterior: number | null;
  views_7d: number;
  ctr: number;
  retencao: number;
  // Outros campos omitidos por não servirem ao marés
}

export interface EixoMares extends EixoDBAnalytics {
  score_mare: number;          // Normalizado 0-100
  direcao: DirecaoMare;
  isLeader: boolean;
  colorHexOrVar: string;       // var(--color-success) etc.
}

/**
 * Motor Marés (Story 4.3): Normaliza os dados e calcula as flags baseadas 
 * em dados de analytics pré-computados, respeitando NFR09.
 */
export function processarMares(eixos: EixoDBAnalytics[]): EixoMares[] {
  if (!eixos || eixos.length === 0) return [];

  // AC1: Normalização. Maior média de views = 100.
  const maxViews = Math.max(...eixos.map(e => Number(e.media_views) || 0));

  // Pré-computa o array inicial sem a flag isLeader
  let processados = eixos.map((eixo) => {
    const views = Number(eixo.media_views) || 0;
    
    let score = 0;
    if (maxViews > 0) {
      score = Math.round((views / maxViews) * 100);
    }
    
    // Calcula Direção (AC4)
    let direcao: DirecaoMare = 'new';
    if (eixo.score_mare_anterior !== null && eixo.score_mare_anterior !== undefined) {
      if (score > eixo.score_mare_anterior) direcao = 'up';
      else if (score < eixo.score_mare_anterior) direcao = 'down';
      else direcao = 'stable';
    }

    // AC2: Coloração Semântica
    let color = 'var(--color-error)';
    if (score >= 80) color = 'var(--color-success)';
    else if (score >= 50) color = 'var(--color-accent)';
    else if (score >= 30) color = 'var(--color-premium)';

    return {
      ...eixo,
      nicho: eixo.nicho || eixo.sentimento_dominante || eixo.gatilho_curiosidade || 'Geral',
      score_mare: score,
      direcao,
      colorHexOrVar: color,
      isLeader: false // Inicial
    } as EixoMares;
  });

  // AC3: Resolve o Líder
  if (processados.length > 0) {
    // Ordena DESC_Score -> DESC_Aprovacao para identificar o absoluto líder
    const sortedDesc = [...processados].sort((a, b) => {
      if (b.score_mare !== a.score_mare) return b.score_mare - a.score_mare;
      return Number(b.taxa_aprovacao || 0) - Number(a.taxa_aprovacao || 0);
    });

    const highestScore = sortedDesc[0].score_mare;
    const highestTaxa = sortedDesc[0].taxa_aprovacao;

    // Marca como leader apenas o melhor score (resolve empate pela taxa caso haja)
    processados = processados.map(p => {
      if (p.score_mare === highestScore && p.taxa_aprovacao === highestTaxa && !sortedDesc.find(sd => sd.score_mare === p.score_mare && sd.taxa_aprovacao > p.taxa_aprovacao)) {
         return { ...p, isLeader: p.id === sortedDesc[0].id };
      }
      return p;
    });
  }

  // Ordena global por padrão - o TrendAnalysis gosta dele ordenado
  processados.sort((a, b) => b.score_mare - a.score_mare);

  return processados;
}
