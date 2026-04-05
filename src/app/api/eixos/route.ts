import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/eixos?canal_id=xxx
export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const canalId = searchParams.get('canal_id');

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  let query = supabase
    .from('eixos')
    .select('*')
    .order('score_mare', { ascending: false });

  if (canalId) {
    query = query.eq('canal_id', canalId);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

// POST /api/eixos — cria novo eixo
export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const body = await request.json();

  if (!body.canal_id || !body.nome) {
    return NextResponse.json({ error: 'canal_id e nome são obrigatórios' }, { status: 400 });
  }

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
}
