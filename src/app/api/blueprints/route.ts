import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/blueprints?canal_id=xxx
export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const canalId = searchParams.get('canal_id');

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
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
}

// POST /api/blueprints — cria novo blueprint
export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const body = await request.json();

  if (!body.canal_id) {
    return NextResponse.json({ error: 'canal_id é obrigatório' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('blueprints')
// @ts-expect-error - Supabase bypass
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

  return NextResponse.json(data, { status: 201 });
}
