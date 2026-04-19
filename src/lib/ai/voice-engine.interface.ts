/**
 * voice-engine.interface.ts
 * Story 3.3 — Gaveta de Produção (EPIC-03)
 *
 * ✅ DESIGN PATTERN: Port & Adapter (Hexagonal Architecture)
 * Esta interface é a "Porta" de saída para Text-To-Speech. Qualquer provedor TTS concreto
 * (ElevenLabs, OpenAI TTS, Google, etc) deve implementar IVoiceEngine.
 */

export interface VoiceGenerationOptions {
  /** ID do modelo a usar (ex: 'eleven_multilingual_v2') */
  modelId: string;
  /** Texto a ser convertido em áudio (geralmente um parágrafo) */
  textBlock: string;
  /** Identidade da voz (vem do Blueprint do canal) */
  voiceIdentity: string;
}

export interface VoiceGenerationResult {
  /** O binário do arquivo MP3 gerado */
  audioBuffer: ArrayBuffer;
  /** Unidades de custo (tokens ou caracteres) consumidas nesta geração */
  costUnits: number;
  /** ID do provedor que executou */
  providerId: string;
}

export type VoiceEngineErrorCode =
  | 'SPEND_LIMIT_REACHED'
  | 'CREDENTIAL_NOT_FOUND'
  | 'PROVIDER_UNAVAILABLE'
  | 'INVALID_RESPONSE'
  | 'UNKNOWN';

export class VoiceEngineError extends Error {
  readonly code: VoiceEngineErrorCode;
  readonly isUserFacing: boolean;

  constructor(code: VoiceEngineErrorCode, message: string, isUserFacing = true) {
    super(message);
    this.name = 'VoiceEngineError';
    this.code = code;
    this.isUserFacing = isUserFacing;
  }
}

export interface IVoiceEngine {
  speak(options: VoiceGenerationOptions): Promise<VoiceGenerationResult>;
}
