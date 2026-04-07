import { NextResponse } from 'next/server';
import { requireAuth, handleApiError, checkOwnership } from '@/lib/api-utils';
import { CreateVideoSchema } from '@/lib/validations/api-schemas';

// GET /api/videos?canal_id=xxx
export async function GET(request: Request) {
  const { user, supabase, response: authRes } = await requireAuth();
  if (authRes) return authRes;

  try {
    const { searchParams } = new URL(request.url);
    const canalId = searchParams.get('canal_id');

    if (canalId) {
      const ownCanalRes = await checkOwnership('canais', canalId, user.id);
      if (!ownCanalRes.hasOwnership) return ownCanalRes.response;
    }

    let query = supabase
      .from('videos')
      .select('*')
      .eq('user_id', user.id)
      .order('data_previsao', { ascending: true });

    if (canalId) {
      query = query.eq('canal_id', canalId);
    }

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err);
  }
}

// POST /api/videos
export async function POST(request: Request) {
  const { user, supabase, response: authRes } = await requireAuth();
  if (authRes) return authRes;

  try {
    const rawBody = await request.json();
    const body = CreateVideoSchema.parse(rawBody);

    const ownCanalRes = await checkOwnership('canais', body.canal_id, user.id);
    if (!ownCanalRes.hasOwnership) return ownCanalRes.response;

    const { data, error } = await supabase
      .from('videos')
      .insert({
        canal_id: body.canal_id,
        user_id: user.id,
        titulo: body.titulo,
        eixo: body.eixo ?? null,
        status: body.status ?? 'planejamento',
        data_previsao: body.data_previsao ?? null,
        step_titulo: false,
        step_roteiro: false,
        step_audio: false,
        step_imagens: false,
        step_montagem: false,
        step_thumb: false,
        step_agendado: false,
        roteiro_aprovado: false,
        audio_aprovado: false,
        thumb_aprovada: false,
        criado_por: user.id,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: 'Erro ao criar vídeo' }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
