import { NextResponse } from 'next/server';
import { requireAuth, handleApiError, checkOwnership } from '@/lib/api-utils';
import { UpdateCanalSchema } from '@/lib/validations/api-schemas';

interface Params {
  params: Promise<{ id: string }>;
}

// GET /api/canais/[id]
export async function GET(request: Request, { params }: Params) {
  const { user, supabase, response: authRes } = await requireAuth();
  if (authRes) return authRes;

  try {
    const { id } = await params;

    const ownRes = await checkOwnership('canais', id, user.id);
    if (!ownRes.hasOwnership) return ownRes.response;

    const { data, error } = await supabase
      .from('canais')
      .select('*, eixos(*), blueprints(*)')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 404 });
    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err);
  }
}

// PATCH /api/canais/[id]
export async function PATCH(request: Request, { params }: Params) {
  const { user, supabase, response: authRes } = await requireAuth();
  if (authRes) return authRes;

  try {
    const { id } = await params;

    const ownRes = await checkOwnership('canais', id, user.id);
    if (!ownRes.hasOwnership) return ownRes.response;

    const rawBody = await request.json();
    const body = UpdateCanalSchema.parse(rawBody);

    const { data, error } = await supabase
      .from('canais')
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

// DELETE /api/canais/[id]
export async function DELETE(request: Request, { params }: Params) {
  const { user, supabase, response: authRes } = await requireAuth();
  if (authRes) return authRes;

  try {
    const { id } = await params;

    const ownRes = await checkOwnership('canais', id, user.id);
    if (!ownRes.hasOwnership) return ownRes.response;

    const { error } = await supabase
      .from('canais')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
