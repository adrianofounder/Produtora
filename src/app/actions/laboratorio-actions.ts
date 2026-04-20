'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

type ActionResult = { success: boolean; error?: string };

/**
 * Envia uma única ideia do Laboratório para a Fábrica de Produção / Kanban.
 * Transiciona status na tabela IDEIAS de: 'pendente' → 'planejamento'
 */
export async function enviarIdeiaParaFabrica(ideiaId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Buscar canal ativo para garantir isolamento NFR03
    const { data: canalAtivo } = await supabase
      .from('canais')
      .select('id')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    if (!canalAtivo) throw new Error('Canal não identificado.');

    // Buscar dados da ideia para transição
    const { data: ideiaAtiva } = await supabase
      .from('ideias')
      .select('titulo, eixo:eixos(nome), canal_id, eixo_id')
      .eq('id', ideiaId)
      .eq('canal_id', canalAtivo.id)
      .single();

    if (!ideiaAtiva) throw new Error('Ideia não encontrada ou acesso negado.');

    const { error } = await supabase
      .from('ideias')
      .update({ status: 'planejamento' })
      .eq('id', ideiaId)
      .eq('canal_id', canalAtivo.id)
      .eq('status', 'pendente');

    if (error) {
      console.error('[Lab Action Error] enviarIdeiaParaFabrica (Update):', error);
      return { success: false, error: 'Falha ao atualizar status da ideia.' };
    }

    // Criar o registro na tabela de vídeos para aparecer no Kanban
    const { data: newVideo, error: videoError } = await supabase
      .from('videos')
      .insert({
        canal_id: canalAtivo.id,
        user_id: user!.id,
        titulo: ideiaAtiva.titulo,
        eixo: (ideiaAtiva.eixo as any)?.nome || 'Geral',
        status: 'planejamento',
        criado_por: user!.id
      })
      .select();

    if (videoError) {
      console.error('[Lab Action Error] enviarIdeiaParaFabrica (Insert Video):', videoError);
    } else {
      console.log('[Lab Action Success] Vídeo criado no Kanban:', newVideo?.[0]?.id);
    }

    revalidatePath('/laboratorio');
    revalidatePath('/canais');

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido.';
    return { success: false, error: message };
  }
}

/**
 * Envia um lote de ideias do Laboratório para a Fábrica em uma única query.
 * Transiciona status na tabela IDEIAS de: 'pendente' → 'planejamento'
 */
export async function enviarLoteParaFabrica(ideiaIds: string[]): Promise<ActionResult> {
  if (ideiaIds.length === 0) {
    return { success: false, error: 'Nenhum ID fornecido para o lote.' };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Buscar canal ativo para garantir isolamento NFR03
    const { data: canalAtivo } = await supabase
      .from('canais')
      .select('id')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    if (!canalAtivo) throw new Error('Canal não identificado.');

    // Buscar dados das ideias para transição
    const { data: ideiasAtivas } = await supabase
      .from('ideias')
      .select('id, titulo, eixo:eixos(nome)')
      .in('id', ideiaIds)
      .eq('canal_id', canalAtivo.id)
      .eq('status', 'pendente');

    if (!ideiasAtivas || ideiasAtivas.length === 0) {
      return { success: false, error: 'Nenhuma ideia válida encontrada para o lote.' };
    }

    const { error } = await supabase
      .from('ideias')
      .update({ status: 'planejamento' })
      .in('id', ideiasAtivas.map(i => i.id))
      .eq('canal_id', canalAtivo.id);

    if (error) {
      console.error('[Lab Action Error] enviarLoteParaFabrica (Update):', error);
      return { success: false, error: 'Falha ao atualizar lote de ideias.' };
    }

    // Criar os registros na tabela de vídeos em lote
    const { data: newVideos, error: videoError } = await supabase
      .from('videos')
      .insert(
        ideiasAtivas.map(i => ({
          canal_id: canalAtivo.id,
          user_id: user!.id,
          titulo: i.titulo,
          eixo: (i.eixo as any)?.nome || 'Geral',
          status: 'planejamento',
          criado_por: user!.id
        }))
      )
      .select();

    if (videoError) {
      console.error('[Lab Action Error] enviarLoteParaFabrica (Insert Videos):', videoError);
    } else {
      console.log('[Lab Action Success] Lote de vídeos criado no Kanban:', newVideos?.length);
    }

    revalidatePath('/laboratorio');
    revalidatePath('/canais');

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido.';
    return { success: false, error: message };
  }
}

/**
 * Descarta fisicamente uma ideia do Laboratório via tabela IDEIAS.
 * Ação Destrutiva autorizada (DELETE) para contornar Constraints com limpeza real.
 */
export async function descartarIdeia(ideiaId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Buscar canal ativo para garantir isolamento NFR03
    const { data: canalAtivo } = await supabase
      .from('canais')
      .select('id')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    if (!canalAtivo) throw new Error('Canal não identificado.');

    const { error } = await supabase
      .from('ideias')
      .delete()
      .eq('id', ideiaId)
      .eq('canal_id', canalAtivo.id) // Blindagem NFR03
      .eq('status', 'pendente'); // Apenas as não processadas

    if (error) {
      console.error('[Lab Action Error] descartarIdeia:', error);
      return { success: false, error: 'Falha ao descartar a ideia.' };
    }

    revalidatePath('/laboratorio');

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido.';
    return { success: false, error: message };
  }
}

/**
 * Master Override: Transforma um Eixo isolado no principal do painel do Laboratório de Maneira Exclusiva (Um por Canal).
 */
export async function setEixoVencedor(eixoId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Buscar o escopo do Canal de maneira segura para garantir manipulação local perante RLS e Multi-tenant NFR03
    // Validamos se o canal pertence ao usuário autenticado diretamente na query
    const { data: eixo, error: fetchError } = await supabase
      .from('eixos')
      .select('id, canal_id, canais!inner(user_id)')
      .eq('id', eixoId)
      .eq('canais.user_id', user!.id)
      .single();

    if (fetchError || !eixo) {
      return { success: false, error: 'Eixo protegido não encontrado ou acesso negado.' };
    }

    // Passo 1: Limpar competidores perante aquele canal isolado
    const { error: resetError } = await supabase
      .from('eixos')
      .update({ status: 'aguardando' })
      .eq('canal_id', eixo.canal_id)
      .neq('id', eixoId);

    if (resetError) throw new Error('Não foi possível estabilizar a hierarquia de eixos.');

    // Passo 2: Consolidar a promoção atômica do Master Override
    const { error: winnerError } = await supabase
      .from('eixos')
      .update({ status: 'venceu' })
      .eq('id', eixoId);

    if (winnerError) throw new Error('Falha transacional ao consagrar o perfil vencedor.');

    revalidatePath('/laboratorio');
    
    return { success: true };
  } catch (err: unknown) {
    console.error('[Lab Master Override Error]:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Erro interno.' };
  }
}

