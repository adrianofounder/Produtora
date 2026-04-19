import { IImageEngine, ImageEngineError } from './image-engine.interface';

/**
 * Pseudo-imagem em formato minimalista em Base64 (1x1 px png) para economizar banda 
 * enquanto simula um arquivo gerado para salvar no Supabase Storage.
 */
const dummyPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==";

export const mockImageEngine: IImageEngine = {
  async generate({ prompt }) {
    // Anti-happy-path: Simula delay realista da geração de thumbnail na rede (3s)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Lógica para falhas aleatórias (10% de chance) para validar tratamento de erros no Front
    if (Math.random() < 0.1) {
      throw new ImageEngineError('Simulated Network Timeout from Image Provider.', 'TIMEOUT');
    }

    return {
      // Converte o base64 para ArrayBuffer
      imageBuffer: Buffer.from(dummyPngBase64, 'base64').buffer, // .buffer pega o ArrayBuffer base
      costUnits: 5000, // Carga pesada definida na Doutrina (EPIC Billing)
      providerId: 'mock-vision-v2',
    };
  }
};
