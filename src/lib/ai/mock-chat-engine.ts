/**
 * mock-chat-engine.ts
 * Story 3.5 — Chat Contextual (EPIC-03)
 *
 * Simulador do motor de conversação para o ambiente de desenvolvimento.
 * Cumpre a abstração proposta na arquitetura, retornando chunks assíncronos formatados.
 */

import { ProviderType } from './consumption-tracker';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatGenerateRequest {
  modelId: string;
  systemPrompt: string;
  history: ChatMessage[];
  userMessage: string;
}

export interface ChatGenerateResult {
  text: string;
  costUnits: number;
}

export class ChatEngineError extends Error {
  constructor(
    public code: 'PROVIDER_ERROR' | 'TIMEOUT' | 'INVALID_REQUEST' | 'RATE_LIMIT',
    message: string
  ) {
    super(message);
    this.name = 'ChatEngineError';
  }
}

class MockChatEngine {
  async chat(request: ChatGenerateRequest): Promise<ChatGenerateResult> {
    const { userMessage, systemPrompt, history } = request;

    // Simular delay de processamento LLM
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Anti-Happy Path: Simular Timeout Excepcional (1/20 de chance)
    if (Math.random() < 0.05) {
      throw new ChatEngineError('TIMEOUT', 'O motor conversacional demorou demais para responder.');
    }

    let identity = 'Especialista';
    if (systemPrompt.includes('Diretor Criativo') || systemPrompt.includes('Roteirista')) {
      identity = 'Diretora Criativa';
    } else if (systemPrompt.includes('Técnico de Som') || systemPrompt.includes('Diretor de Som')) {
      identity = 'Técnico de Som';
    } else if (systemPrompt.includes('Editor Visual')) {
      identity = 'Editor de Imagens';
    }

    // Mockar resposta contextual baseada na Aba (System Prompt)
    let reply = `[${identity}] Entendi que você solicitou: "${userMessage}". `;
    
    const messageHistoryContext = history.length > 0 
      ? ` Analisando seu histórico de ${history.length} mensagens, vou manter o contexto anterior.` 
      : ` Como esta é a primeira mensagem, vamos começar a refinar o seu trabalho aqui.`;

    const randomSuffix = [
      " Como está a consistência até o momento?",
      " Posso realizar alterações imediatas no documento principal, bastando você confirmar.",
      " Recomendo seguir essa abordagem agressiva no roteiro.",
      " O que acha de testarmos duas versões disso?",
    ][Math.floor(Math.random() * 4)];

    reply += messageHistoryContext + randomSuffix;

    // Calcular custo genérico do LLM.
    const tokenCostEstimate = Math.max(10, Math.floor(reply.length / 4) + Math.floor(userMessage.length / 4));

    return {
      text: reply,
      costUnits: tokenCostEstimate,
    };
  }
}

export const mockChatEngine = new MockChatEngine();
