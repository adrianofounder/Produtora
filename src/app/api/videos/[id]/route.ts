import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

interface Params {
  params: Promise<{ id: string }>;
}

// PATCH /api/videos/[id] — atualiza status, steps, aprovações
export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const body = await request.json();

  // Audit trail: registra quem aprovou
  if (body.roteiro_aprovado || body.audio_aprovado || body.thumb_aprovada) {
    body.aprovado_por = user.id;
    body.aprovado_via = 'humano';
  }

  const { data, error } = await supabase
    .from('videos')
// @ts-expect-error - Supabase bypass
.update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

// DELETE /api/videos/[id]
export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { error } = await supabase
    .from('videos')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
