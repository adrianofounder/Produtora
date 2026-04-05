import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/perfil — retorna o profile do usuário autenticado
export async function GET() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

// PATCH /api/perfil — atualiza nome e avatar
export async function PATCH(request: Request) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from('profiles')
// @ts-expect-error - Supabase bypass
.update({ full_name: body.full_name, avatar_url: body.avatar_url, updated_at: new Date().toISOString() })
    .eq('id', user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
