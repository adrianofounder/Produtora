import { NextResponse } from 'next/server';
import { requireAuth, handleApiError, checkOwnership } from '@/lib/api-utils';
import { UpdateVideoSchema } from '@/lib/validations/api-schemas';

interface Params {
  params: Promise<{ id: string }>;
}

// PATCH /api/videos/[id]
export async function PATCH(request: Request, { params }: Params) {
  const { user, supabase, response: authRes } = await requireAuth();
  if (authRes) return authRes;

  try {
    const { id } = await params;
    
    // Explicit ownership check beforehand
    const ownRes = await checkOwnership('videos', id, user.id);
    if (!ownRes.hasOwnership) return ownRes.response;

    const rawBody = await request.json();
    const body = UpdateVideoSchema.parse(rawBody);

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
  } catch (err) {
    return handleApiError(err);
  }
}

// DELETE /api/videos/[id]
export async function DELETE(request: Request, { params }: Params) {
  const { user, supabase, response: authRes } = await requireAuth();
  if (authRes) return authRes;

  try {
    const { id } = await params;

    // Explicit ownership check beforehand
    const ownRes = await checkOwnership('videos', id, user.id);
    if (!ownRes.hasOwnership) return ownRes.response;

    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
