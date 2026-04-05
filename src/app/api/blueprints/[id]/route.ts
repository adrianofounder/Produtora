import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

interface Params { params: Promise<{ id: string }> }

// GET /api/blueprints/[canalId]
export async function GET(_req: Request, { params }: Params) {
  const { id: canalId } = await params;
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const { data, error } = await supabase
    .from('blueprints')
    .select('*')
    .eq('canal_id', canalId)
    .single();

  if (error) return NextResponse.json(null); // sem blueprint ainda
  return NextResponse.json(data);
}

// PUT /api/blueprints/[canalId] — upsert
export async function PUT(request: Request, { params }: Params) {
  const { id: canalId } = await params;
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const body = await request.json();

  const { data, error } = await supabase
    .from('blueprints')
    .upsert({ ...body, canal_id: canalId, updated_at: new Date().toISOString() } as any, { onConflict: 'canal_id' })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
