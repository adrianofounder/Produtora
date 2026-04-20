/**
 * prompt-builder.ts
 * Story 4.4 — Auto-Refill e Automação de Madrugada (EPIC-04)
 *
 * Funções de construção de prompts agnósticos de provedor para o Auto-Refill.
 * Compatível com qualquer LLM que implemente a interface ITextEngine.
 *
 * NFR01: NUNCA importar SDKs de provedores aqui — apenas lógica de string.
 */

export interface EixoParaPrompt {
  nome: string;
  premissa?: string | null;
  gancho?: string | null;       // campo "hook" na tabela eixos
  publico_alvo?: string | null;
}

/**
 * buildAutoRefillPrompt
 *
 * Constrói o prompt de geração automática de 5 ideias para o eixo vencedor.
 * O output esperado da IA é um array JSON com objetos { titulo, premissa, nota_ia }.
 *
 * Agnóstico de provedor: funciona com OpenAI, Anthropic, Gemini, DeepSeek etc.
 * Troca de modelo → apenas troca o adaptador de ITextEngine, sem alterar este arquivo.
 */
export function buildAutoRefillPrompt(eixo: EixoParaPrompt): string {
  const linhas = [
    'Você é um estrategista sênior de conteúdo digital especializado em YouTube e vídeo curto.',
    '',
    'Eixo Temático do Canal:',
    `- Nome: ${eixo.nome}`,
    eixo.premissa ? `- Premissa: ${eixo.premissa}` : null,
    eixo.gancho ? `- Gancho Principal: ${eixo.gancho}` : null,
    eixo.publico_alvo ? `- Público-Alvo: ${eixo.publico_alvo}` : null,
    '',
    'Tarefa: Gere exatamente 5 (cinco) novas ideias de vídeo originais para este eixo.',
    'Cada ideia deve ser provocativa, gerar curiosidade e ter alto potencial de engajamento.',
    '',
    'Formato de resposta OBRIGATÓRIO — retorne APENAS o array JSON abaixo, sem texto adicional:',
    '[',
    '  {',
    '    "titulo": "Título impactante do vídeo (máx. 80 caracteres)",',
    '    "premissa": "Descrição em 1-2 frases do conceito e abordagem",',
    '    "nota_ia": "Justificativa em 1 frase do potencial de engajamento"',
    '  }',
    ']',
    '',
    'REGRAS CRÍTICAS:',
    '- Retorne APENAS o array JSON. Sem introdução, conclusão ou markdown.',
    '- Exatamente 5 itens no array.',
    '- Títulos únicos, não repetidos entre si.',
  ].filter((l) => l !== null).join('\n');

  return linhas;
}
