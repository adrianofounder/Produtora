import { NextResponse } from 'next/server';
import { requireAuth, handleApiError, checkOwnership } from '@/lib/api-utils';
import { ReadAlertaSchema } from '@/lib/validations/api-schemas';

// GET /api/alertas — lista alertas não lidos do usuário
export async function GET(request: Request) {
  const { user, supabase, response: authRes } = await requireAuth();
  if (authRes) return authRes;

  try {
    const { searchParams } = new URL(request.url);
    const incluirLidos = searchParams.get('todos') === 'true';

    let query = supabase
      .from('alertas')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (!incluirLidos) {
      query = query.eq('lido', false);
    }

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err);
  }
}

// PATCH /api/alertas/[id] via POST com { id, lido: true }
// Note: Keeping POST verb as requested by original architecture, but adding Zod and Ownership
export async function POST(request: Request) {
  const { user, supabase, response: authRes } = await requireAuth();
  if (authRes) return authRes;

  try {
    const rawBody = await request.json();
    const body = ReadAlertaSchema.parse(rawBody);

    const ownRes = await checkOwnership('alertas', body.id, user.id);
    if (!ownRes.hasOwnership) return ownRes.response;

    const { data, error } = await supabase
      .from('alertas')
      .update({ lido: true })
      .eq('id', body.id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: 'Alerta não encontrado' }, { status: 404 });
    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err);
  }
}
