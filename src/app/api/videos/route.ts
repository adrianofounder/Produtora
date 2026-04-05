import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/videos?canal_id=xxx
export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const canalId = searchParams.get('canal_id');

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
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
}

// POST /api/videos — cria um novo vídeo no kanban
export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const body = await request.json();

  if (!body.canal_id || !body.titulo) {
    return NextResponse.json({ error: 'canal_id e titulo são obrigatórios' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('videos')
// @ts-expect-error - Supabase bypass
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

  return NextResponse.json(data, { status: 201 });
}
