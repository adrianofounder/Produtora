'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

type ActionResult = { success: boolean; error?: string };

/**
 * Envia uma única ideia do Laboratório para a Fábrica de Produção.
 * Transiciona status: 'planejamento' → 'producao'
 * Guarda a cláusula .eq('status', 'planejamento') para evitar dupla-transição.
 */
export async function enviarIdeiaParaFabrica(videoId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('videos')
      .update({ status: 'producao' })
      .eq('id', videoId)
      .eq('status', 'planejamento'); // Guard: só transiciona se ainda estiver em planejamento

    if (error) {
      console.error('[Lab Action Error] enviarIdeiaParaFabrica:', error);
      return { success: false, error: 'Falha ao enviar ideia para a fábrica.' };
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
 * Usa .in() para eficiência. Transiciona status: 'planejamento' → 'producao'
 */
export async function enviarLoteParaFabrica(videoIds: string[]): Promise<ActionResult> {
  if (videoIds.length === 0) {
    return { success: false, error: 'Nenhum ID fornecido para o lote.' };
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('videos')
      .update({ status: 'producao' })
      .in('id', videoIds)
      .eq('status', 'planejamento'); // Guard: só transiciona os que ainda estão em planejamento

    if (error) {
      console.error('[Lab Action Error] enviarLoteParaFabrica:', error);
      return { success: false, error: 'Falha ao enviar lote para a fábrica.' };
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
 * Descarta uma ideia do Laboratório.
 * Transiciona status: 'planejamento' → 'descartado'
 * A ideia é removida do Lab e NÃO aparece no Kanban de Canais.
 */
export async function descartarIdeia(videoId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('videos')
      .update({ status: 'descartado' })
      .eq('id', videoId)
      .eq('status', 'planejamento'); // Guard: só descarta se ainda estiver em planejamento

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
