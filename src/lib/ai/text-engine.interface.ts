/**
 * text-engine.interface.ts
 * Story 3.2 — Gaveta de Produção (EPIC-03)
 *
 * ✅ DESIGN PATTERN: Port & Adapter (Hexagonal Architecture)
 * Esta interface é a "Porta" de saída. Qualquer provedor LLM concreto
 * (OpenAI, Gemini, DeepSeek, Ollama local, etc.) deve implementar ITextEngine.
 *
 * REGRA: NUNCA importar bibliotecas de provedores específicos aqui.
 * Apenas tipos e contratos genéricos são permitidos neste arquivo.
 */

export interface TextGenerationOptions {
  /** ID do modelo a usar (ex: 'gpt-4o', 'gemini-1.5-pro') — agnóstico ao provedor */
  modelId: string;
  /** Contexto do Blueprint do canal (tom, personagem, estrutura) */
  blueprintContext: string;
  /** Tema/título do vídeo que está sendo roteirizado */
  videoTopic: string;
  /** Número de parágrafos desejados para o roteiro */
  paragraphCount?: number;
}

export interface TextGenerationResult {
  /** Array de parágrafos do roteiro gerado */
  paragraphs: string[];
  /** Unidades de custo estimadas consumidas nesta geração */
  costUnits: number;
  /** ID do provedor que executou (para auditoria) */
  providerId: string;
}

/** Erros tipados da camada de geração de texto */
export type TextEngineErrorCode =
  | 'SPEND_LIMIT_REACHED' // Teto de gastos atingido
  | 'CREDENTIAL_NOT_FOUND' // Nenhuma credencial cadastrada para o tipo
  | 'PROVIDER_UNAVAILABLE' // API do provedor offline/timeout
  | 'INVALID_RESPONSE' // Resposta malformada do provedor
  | 'UNKNOWN'; // Catch-all para erros não mapeados

export class TextEngineError extends Error {
  readonly code: TextEngineErrorCode;
  readonly isUserFacing: boolean;

  constructor(code: TextEngineErrorCode, message: string, isUserFacing = true) {
    super(message);
    this.name = 'TextEngineError';
    this.code = code;
    this.isUserFacing = isUserFacing;
  }
}

/**
 * Contrato da Porta de Geração de Texto.
 * Qualquer adaptador concreto DEVE implementar este contrato.
 */
export interface ITextEngine {
  generate(options: TextGenerationOptions): Promise<TextGenerationResult>;
}
