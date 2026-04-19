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
import { mockVoiceEngine } from '@/lib/ai/mock-voice-engine';
import { VoiceEngineError } from '@/lib/ai/voice-engine.interface';

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
  paragraphs: any[],
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

// ============================================================
// Action 3: Gerar Áudio TTS por Parágrafo
// ============================================================

export type GenerateAudioResult =
  | { success: true; audioUrl: string; costUnits: number }
  | { success: false; errorCode: string; errorMessage: string };

export async function generateParagraphAudioAction(
  videoId: string,
  paragraphId: string,
  text: string
): Promise<GenerateAudioResult> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, errorCode: 'AUTH_REQUIRED', errorMessage: 'Faça login.' };
    }

    // 1. Busca Blueprint e Roteiro atual
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .select(`
        id,
        roteiro,
        canais (
          blueprints (
            voz_narrador
          )
        )
      `)
      .eq('id', videoId)
      .eq('user_id', user.id)
      .single();

    if (videoError || !video) {
      return { success: false, errorCode: 'VIDEO_NOT_FOUND', errorMessage: 'Vídeo não encontrado.' };
    }

    // 2. Trava de Custos (Story 3.1)
    const spendCheck = await checkSpendLimit(user.id, 'tts_audio');

    if (!spendCheck.allowed) {
      return {
        success: false,
        errorCode: 'SPEND_LIMIT_REACHED',
        errorMessage: spendCheck.message ?? 'Teto de gastos atingido para TTS.',
      };
    }

    const canal = Array.isArray(video.canais) ? video.canais[0] : video.canais;
    const blueprint = canal?.blueprints
      ? Array.isArray(canal.blueprints)
        ? canal.blueprints[0]
        : canal.blueprints
      : null;

    const voiceIdentity = blueprint?.voz_narrador || 'Voz Padrão Neutra';

    // 3. Gerar TTS via Motor Abstrato
    const result = await mockVoiceEngine.speak({
      modelId: 'mock-voice-v1',
      textBlock: text,
      voiceIdentity,
    });

    // 4. Transformar Buffer em Storage Upload
    const fileName = `${user.id}/${videoId}/audio-${paragraphId}-${Date.now()}.mp3`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('assets')
      .upload(fileName, result.audioBuffer, {
        contentType: 'audio/mpeg',
        upsert: true, // Substitui a versão antiga do mesmo bloco
      });

    if (uploadError) {
      console.error('[gaveta-actions] Erro ao subir áudio para o Storage:', uploadError);
      return {
        success: false,
        errorCode: 'STORAGE_ERROR',
        errorMessage: 'Falha ao salvar áudio gerado na nuvem.',
      };
    }

    // 5. Atualizar o Roteiro no Banco de Dados (Atomicidade Core)
    // Pega a URL pública
    const { data: publicData } = supabase.storage.from('assets').getPublicUrl(fileName);
    const audioUrl = publicData.publicUrl;

    // Buscamos o roteiro atual e injetamos a nova URL no parágrafo correto
    let currentParagraphs: any[] = [];
    try {
      if (video.roteiro) {
        const parsed = JSON.parse(video.roteiro);
        currentParagraphs = Array.isArray(parsed) ? parsed : [];
      }
    } catch (e) {
      console.warn('[gaveta-actions] Falha ao parsear roteiro existente para merge de áudio.');
    }

    // Mapear parágrafos convertendo legacy (string) para objeto se necessário
    const updatedParagraphs = currentParagraphs.map((p, i) => {
      // Se for apenas string (legacy), converte pra objeto
      const isLegacy = typeof p === 'string';
      const pObj = isLegacy ? { id: `para-legacy-${i}`, text: p } : p;
      
      // Se for o alvo, injeta a URL
      if (pObj.id === paragraphId) {
        return { ...pObj, audioUrl };
      }
      return pObj;
    });

    const { error: dbUpdateError } = await supabase
      .from('videos')
      .update({ roteiro: JSON.stringify(updatedParagraphs) })
      .eq('id', videoId)
      .eq('user_id', user.id);

    if (dbUpdateError) {
      console.error('[gaveta-actions] Falha ao atualizar roteiro com URL de áudio:', dbUpdateError);
      // NFR: Mesmo que falte atualizar o DB, o arquivo está no Storage.
      // Mas para o usuário é falha, então retornamos erro.
      return {
        success: false,
        errorCode: 'DB_UPDATE_ERROR',
        errorMessage: 'Áudio gerado, mas falhou ao vincular ao roteiro.',
      };
    }

    // 6. Incrementa consumos (Anti-Happy Path: token descontado apenas no sucesso real)
    await incrementSpend(user.id, 'tts_audio', result.costUnits);

    revalidatePath('/canais');

    return {
      success: true,
      audioUrl,
      costUnits: result.costUnits,
    };
  } catch (err: unknown) {
    if (err instanceof VoiceEngineError) {
      return {
        success: false,
        errorCode: err.code,
        errorMessage: err.message,
      };
    }

    console.error('[gaveta-actions] Erro em generateParagraphAudioAction:', err);
    return {
      success: false,
      errorCode: 'UNKNOWN',
      errorMessage: 'Falha inesperada ao tentar gerar áudio.',
    };
  }
}
