import {
  IVoiceEngine,
  VoiceGenerationOptions,
  VoiceGenerationResult,
  VoiceEngineError,
} from './voice-engine.interface';

/**
 * Dummy MP3 (silêncio) em base64. 
 * Permite que o player HTML5 `<audio>` toque sem erro e o Supabase tenha um arquivo válido.
 */
const TINY_MP3_BASE64 = 
  '//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';

class MockVoiceEngine implements IVoiceEngine {
  private failureRate = 0.0; // Configurável para forçar exibição de UX de erro em testes (Anti-Happy Path)

  async speak(options: VoiceGenerationOptions): Promise<VoiceGenerationResult> {
    console.log(`[MockVoiceEngine] Solicitado TTS para modelo: ${options.modelId}`);
    console.log(`[MockVoiceEngine] Identidade da voz: ${options.voiceIdentity}`);
    console.log(`[MockVoiceEngine] Texto: "${options.textBlock.substring(0, 50)}..."`);

    // Mock Latency (Aguardar entre 1.5 e 3 segundos simulando geração do TTS)
    const mockLatency = Math.floor(Math.random() * 1500) + 1500;
    await new Promise((resolve) => setTimeout(resolve, mockLatency));

    // Simulação Anti-Happy Path (Testes)
    if (Math.random() < this.failureRate) {
      throw new VoiceEngineError(
        'PROVIDER_UNAVAILABLE',
        'Simulação de falha: Motor de Voz Indisponível (Timeout).',
      );
    }

    // Calcula de forma mockada o consumo de caracteres
    const simulatedCost = options.textBlock.length;

    // Transforma a string Base64 do mp3 minúsculo para um ArrayBuffer real
    const buffer = Buffer.from(TINY_MP3_BASE64, 'base64');
    const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

    return {
      audioBuffer: arrayBuffer,
      costUnits: simulatedCost,
      providerId: 'mock-tts-dev',
    };
  }

  // Permite aos testes de UI forçar a taxa de falha remotamente se necessário
  setFailureRate(rate: number) {
    this.failureRate = rate;
  }
}

export const mockVoiceEngine = new MockVoiceEngine();
