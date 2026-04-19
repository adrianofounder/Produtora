'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { VideoStatus } from '@/components/dashboard/video-card';

export async function updateVideoStatus(videoId: string, newStatus: VideoStatus) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('videos')
      .update({ status: newStatus })
      .eq('id', videoId);

    if (error) {
      console.error('[Kanban Action Error] falha ao atualizar status:', error);
      return { success: false, error: 'Falha ao atualizar o status do vídeo no banco.' };
    }

    // Força revalidação da rota para que os Client Components do kanban recebam dados frescos
    revalidatePath('/canais');
    
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Erro desconhecido.' };
  }
}
