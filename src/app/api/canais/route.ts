import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/canais — lista todos os canais do usuário autenticado
export async function GET() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('canais')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/canais — cria um novo canal
export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from('canais')
// @ts-expect-error - Supabase bypass
.insert({
      user_id: user.id,
      nome: body.nome,
      descricao: body.descricao ?? null,
      idioma: body.idioma ?? 'pt-BR',
      pais: body.pais ?? 'BR',
      categoria: body.categoria ?? 'Entretenimento',
      privacidade_padrao: body.privacidade_padrao ?? 'unlisted',
      frequencia_dia: body.frequencia_dia ?? 1,
      horario_padrao: body.horario_padrao ?? '18:00',
      conteudo_sintetico: body.conteudo_sintetico ?? true,
      mare_status: 'aguardando',
      motor_ativo: false,
      estoque_minimo_planejamento: 10,
      estoque_minimo_producao: 5,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
