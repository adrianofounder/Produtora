import { NextResponse } from 'next/server';
import { requireAuth, handleApiError, checkOwnership } from '@/lib/api-utils';
import { UpdateCanalSchema } from '@/lib/validations/api-schemas';

interface Params {
  params: Promise<{ id: string }>;
}

// GET /api/canais/[id]/perfil
export async function GET(request: Request, { params }: Params) {
  const { user, supabase, response: authRes } = await requireAuth();
  if (authRes) return authRes;

  try {
    const { id } = await params;

    const ownRes = await checkOwnership('canais', id, user.id);
    if (!ownRes.hasOwnership) return ownRes.response;

    const { data, error } = await supabase
      .from('canais')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 404 });
    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err);
  }
}

// PATCH /api/canais/[id]/perfil
export async function PATCH(request: Request, { params }: Params) {
  const { user, supabase, response: authRes } = await requireAuth();
  if (authRes) return authRes;

  try {
    const { id } = await params;

    const ownRes = await checkOwnership('canais', id, user.id);
    if (!ownRes.hasOwnership) return ownRes.response;

    const rawBody = await request.json();
    
    // We can reuse the update canal schema since the fields match the allowed perfil fields
    const body = UpdateCanalSchema.parse(rawBody);

    const campos = [
      'nome', 'descricao', 'idioma', 'pais', 'categoria',
      'privacidade_padrao', 'email_contato', 'conteudo_sintetico',
      'frequencia_dia', 'horario_padrao'
    ];

    const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    campos.forEach((campo) => {
      if (campo in body) payload[campo] = (body as any)[campo];
    });

    const { data, error } = await supabase
      .from('canais')
      // @ts-expect-error - Supabase bypass
      .update(payload)
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
