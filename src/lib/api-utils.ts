import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

/**
 * Valida a sessão do usuário via Supabase.
 * Retorna o usuário logado e o client do supabase. Se falhar, retorna um response 401 pronto.
 */
export async function requireAuth() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return { user: null, supabase, response: NextResponse.json({ error: 'Não autorizado' }, { status: 401 }) };
  }
  return { user, supabase, response: undefined };
}

/**
 * Verifica se um recurso genérico pertence ao usuário dono da requisição.
 * Ideal para tabelas que possuam a coluna `user_id`.
 */
export async function checkOwnership(tableName: string, resourceId: string, userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(tableName as any)
    .select('user_id')
    .eq('id', resourceId)
    .single();

  if (error || !data) {
    return { hasOwnership: false, response: NextResponse.json({ error: 'Recurso não encontrado' }, { status: 404 }) };
  }

  if ((data as any).user_id !== userId) {
    return { hasOwnership: false, response: NextResponse.json({ error: 'Acesso negado: você não é o dono deste recurso' }, { status: 403 }) };
  }

  return { hasOwnership: true, response: undefined };
}

/**
 * Centraliza o tratamento de erros provenientes do Zod ou do banco.
 */
export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json({ 
      error: 'Problema na validação dos dados (422)', 
      details: (error as any).errors 
    }, { status: 422 });
  }
  
  console.error("API Internal Error:", error);
  return NextResponse.json({ 
    error: 'Falha interna no servidor (500)', 
    detail: error instanceof Error ? error.message : String(error) 
  }, { status: 500 });
}
