import { NextResponse } from 'next/server';
import { requireAuth, handleApiError, checkOwnership } from '@/lib/api-utils';
import { CreateBlueprintSchema } from '@/lib/validations/api-schemas';

// GET /api/blueprints?canal_id=xxx
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
      .from('blueprints')
      .select('*')
      .order('created_at', { ascending: false });

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

// POST /api/blueprints — cria novo blueprint
export async function POST(request: Request) {
  const { user, supabase, response: authRes } = await requireAuth();
  if (authRes) return authRes;

  try {
    const rawBody = await request.json();
    const body = CreateBlueprintSchema.parse(rawBody);

    const ownCanalRes = await checkOwnership('canais', body.canal_id, user.id);
    if (!ownCanalRes.hasOwnership) return ownCanalRes.response;

    const { data, error } = await supabase
      .from('blueprints')
      .insert({
        canal_id: body.canal_id,
        titulo_benchmark: body.titulo_benchmark ?? null,
        canal_benchmark: body.canal_benchmark ?? null,
        hook: body.hook ?? null,
        veredito: body.veredito ?? 'pendente',
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: 'Erro ao criar blueprint' }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
