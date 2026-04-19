export class ImageEngineError extends Error {
  constructor(
    message: string,
    public readonly code: 'LIMIT_EXCEEDED' | 'PROVIDER_ERROR' | 'INVALID_PARAMETER' | 'UNAUTHORIZED' | 'TIMEOUT'
  ) {
    super(message);
    this.name = 'ImageEngineError';
  }
}

export interface IImageEngine {
  /**
   * Gera uma imagem baseada num prompt (Abstrato - Agnóstico a provider)
   */
  generate(options: {
    modelId: string;
    prompt: string;
    width?: number;
    height?: number;
  }): Promise<{
    imageBuffer: ArrayBuffer;
    costUnits: number;
    providerId: string;
  }>;
}
