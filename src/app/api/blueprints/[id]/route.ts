import { NextResponse } from 'next/server';
import { requireAuth, handleApiError, checkOwnership } from '@/lib/api-utils';
import { UpdateBlueprintSchema } from '@/lib/validations/api-schemas';

interface Params { params: Promise<{ id: string }> }

// GET /api/blueprints/[canalId]
// Notice here `id` represents the `canalId` according to the original file
export async function GET(request: Request, { params }: Params) {
  const { user, supabase, response: authRes } = await requireAuth();
  if (authRes) return authRes;

  try {
    const { id: canalId } = await params;

    const ownCanalRes = await checkOwnership('canais', canalId, user.id);
    if (!ownCanalRes.hasOwnership) return ownCanalRes.response;

    const { data, error } = await supabase
      .from('blueprints')
      .select('*')
      .eq('canal_id', canalId)
      .single();

    if (error) return NextResponse.json({ data: null }, { status: 200 }); // sem blueprint ainda
    if (!data) return NextResponse.json({ data: null }, { status: 200 });
    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err);
  }
}

// PUT /api/blueprints/[canalId] — upsert
export async function PUT(request: Request, { params }: Params) {
  const { user, supabase, response: authRes } = await requireAuth();
  if (authRes) return authRes;

  try {
    const { id: canalId } = await params;

    const ownCanalRes = await checkOwnership('canais', canalId, user.id);
    if (!ownCanalRes.hasOwnership) return ownCanalRes.response;

    const rawBody = await request.json();
    // Validate fields using the Update schema (everything optional)
    const body = UpdateBlueprintSchema.parse(rawBody);

    const { data, error } = await supabase
      .from('blueprints')
      .upsert({ ...body, canal_id: canalId, updated_at: new Date().toISOString() }, { onConflict: 'canal_id' })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: 'Blueprint não encontrado' }, { status: 404 });
    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err);
  }
}
