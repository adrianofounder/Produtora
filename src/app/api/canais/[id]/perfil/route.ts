import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/canais/[id]/perfil — usado pela página 4.3
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const { data, error } = await supabase
    .from('canais')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

// PATCH /api/canais/[id]/perfil — salva dados do perfil (4.3)
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const body = await request.json();

  const campos = [
    'nome', 'descricao', 'idioma', 'pais', 'categoria',
    'privacidade_padrao', 'email_contato', 'conteudo_sintetico',
    'frequencia_dia', 'horario_padrao'
  ];

  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  campos.forEach((campo) => {
    if (campo in body) payload[campo] = body[campo];
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
}
