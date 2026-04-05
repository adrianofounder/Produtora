import { NextResponse } from 'next/server';
import { requireAuth, handleApiError } from '@/lib/api-utils';
import { UpdatePerfilSchema } from '@/lib/validations/api-schemas';

// GET /api/perfil — retorna o profile do usuário autenticado
export async function GET() {
  const { user, supabase, response: authRes } = await requireAuth();
  if (authRes) return authRes;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err);
  }
}

// PATCH /api/perfil — atualiza nome e avatar
export async function PATCH(request: Request) {
  const { user, supabase, response: authRes } = await requireAuth();
  if (authRes) return authRes;

  try {
    const rawBody = await request.json();
    const body = UpdatePerfilSchema.parse(rawBody);

    const { data, error } = await supabase
      .from('profiles')
      // @ts-expect-error - Supabase bypass
      .update({ full_name: body.full_name, avatar_url: body.avatar_url, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err);
  }
}
