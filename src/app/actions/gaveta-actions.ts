'use server';

/**
 * gaveta-actions.ts
 * Story 3.2 — Gaveta de Produção (EPIC-03)
 *
 * Server Actions da Gaveta de Produção:
 * - generateScriptAction: Gera roteiro via motor abstrato, verificando teto de gastos
 * - saveScriptAction: Persiste o roteiro editado no campo `videos.roteiro`
 *
 * FLUXO ANTI-HAPPY-PATH:
 * 1. checkSpendLimit → bloqueia antes de chamar IA
 * 2. ITextEngine.generate → pode lançar TextEngineError
 * 3. incrementSpend → só executa após sucesso da IA
 * 4. Todos os erros são retornados tipados, nunca crasham silenciosamente
 */

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { checkSpendLimit, incrementSpend } from '@/lib/ai/consumption-tracker';
import { mockTextEngine } from '@/lib/ai/mock-text-engine';
import { TextEngineError } from '@/lib/ai/text-engine.interface';

// ============================================================
// Tipos de Resposta — sempre union discriminada (nunca exceção pura)
// ============================================================

export type GenerateScriptResult =
  | {
      success: true;
      paragraphs: string[];
      tokensUsed: number;
      providerId: string;
    }
  | {
      success: false;
      errorCode:
        | 'SPEND_LIMIT_REACHED'
        | 'CREDENTIAL_NOT_FOUND'
        | 'PROVIDER_UNAVAILABLE'
        | 'INVALID_RESPONSE'
        | 'AUTH_REQUIRED'
        | 'VIDEO_NOT_FOUND'
        | 'UNKNOWN';
      errorMessage: string;
    };

export type SaveScriptResult =
  | { success: true }
  | { success: false; errorMessage: string };

// ============================================================
// Action 1: Gerar Roteiro (com checagem de limite obrigatória)
// ============================================================

export async function generateScriptAction(
  videoId: string,
): Promise<GenerateScriptResult> {
  try {
    const supabase = await createClient();

    // 1. Valida autenticação
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        errorCode: 'AUTH_REQUIRED',
        errorMessage: 'Sessão expirada. Faça login novamente.',
      };
    }

    // 2. Busca dados do vídeo + Blueprint do canal
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .select(
        `
        id,
        titulo,
        eixo,
        canal_id,
        canais (
          id,
          nome,
          blueprints (
            voz_narrador,
            estrutura_emocional,
            hook,
            tipo_narrativa,
            emocao_dominante,
            formula_emocional
          )
        )
      `,
      )
      .eq('id', videoId)
      .eq('user_id', user.id)
      .single();

    if (videoError || !video) {
      return {
        success: false,
        errorCode: 'VIDEO_NOT_FOUND',
        errorMessage:
          'Vídeo não encontrado ou sem permissão de acesso.',
      };
    }

    // 3. TRAVA OBRIGATÓRIA: Verifica teto de gastos ANTES de chamar IA
    const spendCheck = await checkSpendLimit(user.id, 'llm_text');

    if (!spendCheck.allowed) {
      return {
        success: false,
        errorCode: 'SPEND_LIMIT_REACHED',
        errorMessage:
          spendCheck.message ??
          'Teto de gastos diário atingido. Ajuste os limites em Configurações.',
      };
    }

    // 4. Monta contexto do Blueprint para injetar no motor
    const canal = Array.isArray(video.canais) ? video.canais[0] : video.canais;
    const blueprint = canal?.blueprints
      ? Array.isArray(canal.blueprints)
        ? canal.blueprints[0]
        : canal.blueprints
      : null;

    const blueprintContext = blueprint
      ? [
          blueprint.voz_narrador && `Voz do Narrador: ${blueprint.voz_narrador}`,
          blueprint.estrutura_emocional &&
            `Estrutura Emocional: ${blueprint.estrutura_emocional}`,
          blueprint.tipo_narrativa && `Tipo de Narrativa: ${blueprint.tipo_narrativa}`,
          blueprint.emocao_dominante &&
            `Emoção Dominante: ${blueprint.emocao_dominante}`,
          blueprint.hook && `Hook: ${blueprint.hook}`,
          blueprint.formula_emocional &&
            `Fórmula Emocional: ${blueprint.formula_emocional}`,
        ]
          .filter(Boolean)
          .join('\n')
      : 'Sem blueprint definido para este canal. Use tom neutro e informativo.';

    // 5. Chama o motor abstrato (MockTextEngine em dev, real em produção)
    // ⚠️ TROCA FUTURA: substituir mockTextEngine por textEngineFactory.create(user.id)
    const result = await mockTextEngine.generate({
      modelId: 'mock-dev-v1',
      blueprintContext,
      videoTopic: video.titulo,
      paragraphCount: 5,
    });

    // 6. Incrementa spend SOMENTE após sucesso confirmado da IA
    await incrementSpend(user.id, 'llm_text', result.costUnits);

    return {
      success: true,
      paragraphs: result.paragraphs,
      tokensUsed: result.costUnits,
      providerId: result.providerId,
    };
  } catch (err: unknown) {
    // TextEngineError é um erro de domínio com código tipado
    if (err instanceof TextEngineError) {
      return {
        success: false,
        errorCode: err.code,
        errorMessage: err.message,
      };
    }

    // Erros não mapeados — loga no servidor, retorna mensagem genérica
    console.error('[gaveta-actions] Erro não mapeado em generateScriptAction:', err);
    return {
      success: false,
      errorCode: 'UNKNOWN',
      errorMessage:
        'Falha inesperada ao conectar com o motor criativo. Tente novamente.',
    };
  }
}

// ============================================================
// Action 2: Salvar Roteiro Editado
// ============================================================

export async function saveScriptAction(
  videoId: string,
  paragraphs: string[],
): Promise<SaveScriptResult> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, errorMessage: 'Sessão expirada. Faça login novamente.' };
    }

    if (!paragraphs.length) {
      return { success: false, errorMessage: 'O roteiro não pode ser vazio.' };
    }

    // Salva como JSON stringificado no campo `roteiro` da tabela videos
    // Formato: JSON array de strings para fácil parse no futuro
    const roteiroJson = JSON.stringify(paragraphs);

    const { error } = await supabase
      .from('videos')
      .update({
        roteiro: roteiroJson,
        roteiro_aprovado: false, // Resetar aprovação quando salva nova versão
        step_roteiro: true, // Marca o step de roteiro como feito
      })
      .eq('id', videoId)
      .eq('user_id', user.id);

    if (error) {
      console.error('[gaveta-actions] Erro ao salvar roteiro:', error);
      return {
        success: false,
        errorMessage: 'Falha ao salvar o roteiro no banco. Verifique sua conexão.',
      };
    }

    revalidatePath('/canais');

    return { success: true };
  } catch (err: unknown) {
    console.error('[gaveta-actions] Erro não mapeado em saveScriptAction:', err);
    return {
      success: false,
      errorMessage: 'Erro inesperado ao salvar. Tente novamente.',
    };
  }
}
