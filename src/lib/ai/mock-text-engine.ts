/**
 * mock-text-engine.ts
 * Story 3.2 — Gaveta de Produção (EPIC-03)
 *
 * ✅ ADAPTADOR DE DESENVOLVIMENTO: Implementação mock da ITextEngine.
 * Simula latência realista e falhas aleatórias configuráveis para
 * que o frontend e o sistema de erros possam ser testados sem API real.
 *
 * ⚠️ NUNCA usar em produção. O Maestro substituirá por adaptador real
 * após pesquisa de motores LLM (fora do escopo deste Epic).
 *
 * TROCA FUTURA: Criar `openai-text-engine.ts` ou `deepseek-text-engine.ts`
 * implementando ITextEngine e injetar via `text-engine.factory.ts`.
 */

import type {
  ITextEngine,
  TextGenerationOptions,
  TextGenerationResult,
} from './text-engine.interface';
import { TextEngineError } from './text-engine.interface';

const MOCK_PARAGRAPHS_POOL = [
  'Você sabia que existe uma força invisível que molda cada decisão da sua vida? Não é sorte, não é coincidência — é algo muito mais profundo.',
  'Ao longo da história, os maiores líderes do mundo descobriram esse segredo. E hoje, vou revelar como você pode usar isso a seu favor.',
  'O primeiro passo é entender que nossa mente funciona em camadas. A camada superficial é o que pensamos. A camada profunda é o que realmente sentimos.',
  'Pesquisas da Universidade de Harvard mostram que 85% das nossas decisões são tomadas de forma inconsciente. Isso muda tudo o que você pensava saber sobre escolhas.',
  'Mas não se preocupe. Existe um método simples, testado por milhares de pessoas, que vai te ajudar a reprogramar esse sistema interno.',
  'O segredo está na repetição consciente. Não qualquer repetição — mas aquela feita com intenção, no momento certo, da forma correta.',
  'Agora você tem uma escolha: continuar como está, ou dar o primeiro passo em direção a uma versão melhor de si mesmo. A decisão é sua.',
];

/** Simula latência de rede de API real (800ms - 2.5s) */
const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Configurações do mock (podem ser sobrescritas para testes) */
interface MockConfig {
  /** Taxa de falha aleatória (0-1). Default: 0 (nunca falha) */
  failureRate?: number;
  /** Latência mínima em ms */
  minLatencyMs?: number;
  /** Latência máxima em ms */
  maxLatencyMs?: number;
}

export class MockTextEngine implements ITextEngine {
  private readonly config: Required<MockConfig>;

  constructor(config: MockConfig = {}) {
    this.config = {
      failureRate: config.failureRate ?? 0,
      minLatencyMs: config.minLatencyMs ?? 800,
      maxLatencyMs: config.maxLatencyMs ?? 2500,
    };
  }

  async generate(options: TextGenerationOptions): Promise<TextGenerationResult> {
    // Simula latência realista de API
    const latency =
      this.config.minLatencyMs +
      Math.random() * (this.config.maxLatencyMs - this.config.minLatencyMs);
    await sleep(latency);

    // Simula falha aleatória de rede (anti-happy-path)
    if (Math.random() < this.config.failureRate) {
      throw new TextEngineError(
        'PROVIDER_UNAVAILABLE',
        'Motor criativo temporariamente indisponível. Tente novamente em instantes.',
      );
    }

    const count = options.paragraphCount ?? 5;
    const shuffled = [...MOCK_PARAGRAPHS_POOL].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));

    let paragraphs = selected;

    // Story 4.4: Se o prompt pedir JSON (caso do Auto-Refill), o mock deve obedecer
    if (options.blueprintContext?.includes('JSON')) {
      const ideias = selected.map((p, idx) => ({
        titulo: `Ideia Mock ${idx + 1}: ${p.split(' ').slice(0, 4).join(' ')}...`,
        premissa: p,
        nota_ia: (8 + Math.random() * 2).toFixed(1)
      }));
      paragraphs = [JSON.stringify(ideias, null, 2)];
    }

    // Custo simulado: ~500 tokens de input + 150 tokens/parágrafo output
    const estimatedTokens = 500 + paragraphs.length * 150;

    return {
      paragraphs,
      costUnits: estimatedTokens,
      providerId: 'mock-dev-engine-v1',
    };
  }
}

/** Instância singleton para uso no servidor durante desenvolvimento */
export const mockTextEngine = new MockTextEngine({
  failureRate: 0, // Sem falha por padrão; QA pode sobrescrever
  minLatencyMs: 1000,
  maxLatencyMs: 2200,
});
