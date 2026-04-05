import { NextResponse } from 'next/server';
import { requireAuth, handleApiError, checkOwnership } from '@/lib/api-utils';
import { CreateEixoSchema } from '@/lib/validations/api-schemas';

// GET /api/eixos?canal_id=xxx
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
      .from('eixos')
      .select('*')
      .order('score_mare', { ascending: false });

    // Note: Due to RLS we might get empty results if user doesn't own the canais anyway,
    // but the backend ownership check on canalId protects metadata leakage.
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

// POST /api/eixos — cria novo eixo
export async function POST(request: Request) {
  const { user, supabase, response: authRes } = await requireAuth();
  if (authRes) return authRes;

  try {
    const rawBody = await request.json();
    const body = CreateEixoSchema.parse(rawBody);

    const ownCanalRes = await checkOwnership('canais', body.canal_id, user.id);
    if (!ownCanalRes.hasOwnership) return ownCanalRes.response;

    const { data, error } = await supabase
      .from('eixos')
      // @ts-expect-error - Supabase bypass
      .insert({
        canal_id: body.canal_id,
        nome: body.nome,
        premissa: body.premissa ?? null,
        publico_alvo: body.publico_alvo ?? null,
        sentimento_dominante: body.sentimento_dominante ?? null,
        status: body.status ?? 'testando',
        views_acumuladas: 0,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
