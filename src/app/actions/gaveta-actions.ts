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
import { mockImageEngine } from '@/lib/ai/mock-image-engine';
import { ImageEngineError } from '@/lib/ai/image-engine.interface';
import { mockChatEngine, ChatEngineError, ChatMessage } from '@/lib/ai/mock-chat-engine';

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

// ============================================================
// Action 4: Gerar Thumbnail Visual (Mock)
// ============================================================

export type GenerateThumbnailResult =
  | { success: true; thumbUrl: string; costUnits: number; promptUsed: string }
  | { success: false; errorCode: string; errorMessage: string };

export async function generateThumbnailAction(
  videoId: string
): Promise<GenerateThumbnailResult> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, errorCode: 'AUTH_REQUIRED', errorMessage: 'Faça login.' };
    }

    // 1. Busca rules de arte
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .select(`
        id,
        titulo,
        eixo,
        canais (
          blueprints (
            estetica_visual
          )
        )
      `)
      .eq('id', videoId)
      .eq('user_id', user.id)
      .single();

    if (videoError || !video) {
      return { success: false, errorCode: 'VIDEO_NOT_FOUND', errorMessage: 'Vídeo não encontrado.' };
    }

    // Busca cores_thumb e elemento_visual do eixo
    let axisData = null;
    if (video.eixo) {
      const { data: eixoRow } = await supabase.from('eixos').select('cores_thumb, elemento_visual').eq('nome', video.eixo).maybeSingle();
      axisData = eixoRow;
    }

    const canal = Array.isArray(video.canais) ? video.canais[0] : video.canais;
    const blueprint = canal?.blueprints
      ? Array.isArray(canal.blueprints)
        ? canal.blueprints[0]
        : canal.blueprints
      : null;

    const promptContext = [
      video.titulo && `Assunto: ${video.titulo}`,
      blueprint?.estetica_visual && `Estética Visual: ${blueprint.estetica_visual}`,
      axisData?.cores_thumb && `Cores: ${axisData.cores_thumb}`,
      axisData?.elemento_visual && `Elementos Visuais: ${axisData.elemento_visual}`
    ].filter(Boolean).join(' | ');

    const finalPrompt = promptContext.length > 5 ? promptContext : 'Generative Minimalist Thumbnail Video Concept';

    // 2. Trava de Custos (Story 3.1 & 3.4) limit 'image_gen'
    const spendCheck = await checkSpendLimit(user.id, 'image_gen');
    if (!spendCheck.allowed) {
      return {
        success: false,
        errorCode: 'SPEND_LIMIT_REACHED',
        errorMessage: spendCheck.message ?? 'Teto de gastos atingido para Geração de Imagem.',
      };
    }

    // 3. Engine Request
    const result = await mockImageEngine.generate({
      modelId: 'mock-dalle-3',
      prompt: finalPrompt
    });

    // 4. Upload to Storage
    const fileName = `${user.id}/${videoId}/thumb-${Date.now()}.png`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('assets')
      .upload(fileName, result.imageBuffer, {
        contentType: 'image/png',
        upsert: true,
      });

    if (uploadError) {
      console.error('[gaveta-actions] Storage Thumbnail Upload Error:', uploadError);
      return { success: false, errorCode: 'STORAGE_ERROR', errorMessage: 'Falha ao salvar a Thumbnail gerada na nuvem.' };
    }

    // 5. Connect to Video and deduct tokens
    const { data: publicData } = supabase.storage.from('assets').getPublicUrl(fileName);
    const thumbUrl = publicData.publicUrl;

    const { error: dbUpdateError } = await supabase
      .from('videos')
      .update({ thumb_url: thumbUrl, thumb_aprovada: false, step_thumb: true })
      .eq('id', videoId)
      .eq('user_id', user.id);

    if (dbUpdateError) {
      console.error('[gaveta-actions] Failed to connect thumb URL:', dbUpdateError);
      return { success: false, errorCode: 'DB_UPDATE_ERROR', errorMessage: 'Falha ao vincular a thumbnail no banco de dados.' };
    }

    await incrementSpend(user.id, 'image_gen', result.costUnits);

    return {
      success: true,
      thumbUrl,
      costUnits: result.costUnits,
      promptUsed: finalPrompt
    };
  } catch (err: unknown) {
    if (err instanceof ImageEngineError) {
      return { success: false, errorCode: err.code, errorMessage: err.message };
    }
    console.error('[gaveta-actions] Unknown error in generateThumbnail:', err);
    return { success: false, errorCode: 'UNKNOWN', errorMessage: 'Erro inesperado ao gerar a Thumb.' };
  }
}

// ============================================================
// Action 5: Finalizar Produção (Movimentação Kanban)
// ============================================================

export type FinalizeVideoResult = 
  | { success: true }
  | { success: false; errorMessage: string };

export async function finalizeVideoProductionAction(videoId: string): Promise<FinalizeVideoResult> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, errorMessage: 'Autenticação necessária.' };
    }

    const { error } = await supabase
      .from('videos')
      .update({ status: 'pronto' })
      .eq('id', videoId)
      .eq('user_id', user.id);

    if (error) {
      console.error('[gaveta-actions] Erro na transição de status:', error);
      return { success: false, errorMessage: 'Falha ao fechar o pacote e atualizar o Kanban.' };
    }

    revalidatePath('/canais');
    return { success: true };

  } catch (err) {
    console.error('[gaveta-actions] Erro não tratado em finalizar:', err);
    return { success: false, errorMessage: 'Erro inesperado na Finalização.' };
  }
}

// ============================================================
// Action 6: Conversão Interativa de Contexto (Story 3.5)
// ============================================================

export type ContextualChatResult =
  | { success: true; text: string; costUnits: number }
  | { success: false; errorCode: string; errorMessage: string };

export async function contextualChatAction(
  videoId: string,
  tabId: string,
  userMessage: string,
  history: ChatMessage[]
): Promise<ContextualChatResult> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, errorCode: 'AUTH_REQUIRED', errorMessage: 'Faça login.' };
    }

    const spendCheck = await checkSpendLimit(user.id, 'llm_text');
    if (!spendCheck.allowed) {
      return {
        success: false,
        errorCode: 'SPEND_LIMIT_REACHED',
        errorMessage: spendCheck.message ?? 'Teto de gastos atingido. Aguarde a renovação diária.',
      };
    }

    const { data: video, error: videoError } = await supabase
      .from('videos')
      .select(`
        titulo,
        canais ( blueprints ( voz_narrador, estetica_visual, tipo_narrativa ) )
      `)
      .eq('id', videoId)
      .eq('user_id', user.id)
      .single();

    if (videoError || !video) {
      return { success: false, errorCode: 'VIDEO_NOT_FOUND', errorMessage: 'Vídeo não encontrado.' };
    }

    const canal = Array.isArray(video.canais) ? video.canais[0] : video.canais;
    const blueprint = canal?.blueprints
      ? Array.isArray(canal.blueprints) ? canal.blueprints[0] : canal.blueprints
      : null;

    let identity = 'Assistente de Direção';
    if (tabId === 'roteiro') identity = 'Você atua como um Diretor Criativo experiente e Roteirista (Anti-Happy Path). Seja conciso, incisivo e reforce a dramaticidade baseando-se nestas diretrizes de narrativa.';
    if (tabId === 'audio') identity = 'Você atua como um Técnico de Som e Editor Sênior. Foque no pacing fonético, tom e respirabilidade da locução.';
    if (tabId === 'asset') identity = 'Você atua como um Diretor de Fotografia e Editor Visual Gráfico. Dê feedback prático sobre composição e estética de capas de vídeo, sem floreios.';

    const contextParams = [
      video.titulo && `Assunto: ${video.titulo}`,
      blueprint?.voz_narrador && `Voz Mestre: ${blueprint.voz_narrador}`,
      blueprint?.tipo_narrativa && `Narrativa Mestra: ${blueprint.tipo_narrativa}`,
      blueprint?.estetica_visual && `Estética: ${blueprint.estetica_visual}`,
    ].filter(Boolean).join(' | ');

    const systemPrompt = `${identity}\nContexto Base:\n${contextParams}`;

    const result = await mockChatEngine.chat({
      modelId: 'mock-chat-v1',
      systemPrompt,
      history,
      userMessage
    });

    await incrementSpend(user.id, 'llm_text', result.costUnits);

    return {
      success: true,
      text: result.text,
      costUnits: result.costUnits
    };
  } catch (err: unknown) {
    if (err instanceof ChatEngineError) {
      return { success: false, errorCode: err.code, errorMessage: err.message };
    }
    console.error('[gaveta-actions] Erro em contextualChatAction:', err);
    return { success: false, errorCode: 'UNKNOWN', errorMessage: 'Erro de comunicação do Chat.' };
  }
}
