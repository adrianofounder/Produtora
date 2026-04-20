/**
 * /api/cron/auto-refill/route.ts
 * Story 4.4 — Auto-Refill e Automação de Madrugada (EPIC-04)
 *
 * Endpoint POST seguro para o job noturno de reabastecimento da fila.
 * Acionado por Vercel Cron Jobs ou Supabase Edge Function Scheduler.
 *
 * Segurança: valida Bearer Token antes de qualquer lógica de negócio.
 * Responses:
 *   401 → Token inválido ou ausente
 *   200 → Sucesso, skip (kill-switch/teto/fila) ou erro interno tratado
 *   500 → Falha de sistema não esperada (ex: CRON_SECRET não configurado)
 *
 * Nota: Skips retornam 200, não 4xx/5xx, para evitar retry automático da infra.
 */

import { NextRequest, NextResponse } from 'next/server';
import { runAutoRefill } from '@/lib/auto-refill';

export async function POST(req: NextRequest) {
  // ── PRIMEIRA INSTRUÇÃO: Validação do Bearer Token ───────────
  // Nenhum código de negócio executa antes desta verificação.
  const authHeader = req.headers.get('Authorization');
  const cronSecret = process.env.CRON_SECRET;

  // Se CRON_SECRET não está configurado no ambiente, bloqueia por segurança
  if (!cronSecret) {
    console.error('[Auto-Refill] CRON_SECRET não configurado no ambiente. Acesso bloqueado.');
    return NextResponse.json(
      { error: 'Configuração de segurança ausente no servidor.' },
      { status: 500 }
    );
  }

  const expectedToken = `Bearer ${cronSecret}`;

  if (!authHeader || authHeader !== expectedToken) {
    // Não logar o token recebido — evitar exposição em logs
    console.warn('[Auto-Refill] Tentativa de acesso com token inválido ou ausente.');
    return NextResponse.json(
      { error: 'Unauthorized — token inválido ou ausente.' },
      { status: 401 }
    );
  }

  // ── Lê tenant_id opcional do body ───────────────────────────
  // Se fornecido, processa apenas aquele tenant.
  // Se omitido, processa todos os tenants com canais ativos.
  let tenantId: string | null = null;
  try {
    const body = await req.json();
    tenantId = typeof body?.tenant_id === 'string' ? body.tenant_id : null;
  } catch {
    // Body vazio ou inválido — trata como "processar todos"
    tenantId = null;
  }

  // ── Executa a lógica core (isolada para testabilidade) ──────
  try {
    const report = await runAutoRefill(tenantId);
    return NextResponse.json(report, { status: 200 });
  } catch (err) {
    // Erro de sistema (ex: SUPABASE_SERVICE_ROLE_KEY ausente)
    console.error('[Auto-Refill] Erro crítico de sistema:', err);
    return NextResponse.json(
      { error: 'Erro interno do servidor. Verifique os logs.' },
      { status: 500 }
    );
  }
}

// GET não é suportado — retorna 405 Method Not Allowed
export async function GET() {
  return NextResponse.json(
    { error: 'Método não permitido. Use POST com Authorization header.' },
    { status: 405 }
  );
}
