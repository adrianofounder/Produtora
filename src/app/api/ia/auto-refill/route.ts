import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// POST /api/ia/auto-refill
// Trigger automático do Motor de Marés:
// Verifica estoque mínimo, gera títulos/ideias automaticamente para reabastecimento
export async function POST(request: Request) {
  const supabase = await createClient();

  // Aceita service role para cron automático ou usuário autenticado
  const { data: { user } } = await supabase.auth.getUser();
  const body = await request.json();
  const { canal_id } = body;

  if (!canal_id) {
    return NextResponse.json({ error: 'canal_id é obrigatório' }, { status: 400 });
  }

  // Busca configurações do canal
  const { data: canalRaw, error: canalError } = await supabase
    .from('canais')
    .select('*')
    .eq('id', canal_id)
    .single();

  const canal = canalRaw as any;
  if (canalError || !canal) {
    return NextResponse.json({ error: 'Canal não encontrado' }, { status: 404 });
  }

  // Verifica se o motor está ativo
  if (!canal.motor_ativo) {
    return NextResponse.json({ message: 'Motor Auto-Refill desativado para este canal' });
  }

  // Conta vídeos em planejamento
  const { count: estoqueAtual } = await supabase
    .from('videos')
    .select('*', { count: 'exact', head: true })
    .eq('canal_id', canal_id)
    .in('status', ['planejamento', 'producao']);

  const estoque = estoqueAtual ?? 0;
  const minimo = canal.estoque_minimo_planejamento ?? 10;

  if (estoque >= minimo) {
    return NextResponse.json({
      message: `Estoque suficiente: ${estoque}/${minimo}`,
      gerou: false,
    });
  }

  // Precisa gerar. Busca eixos ativos do canal
  const { data: eixosRaw } = await supabase
    .from('eixos')
    .select('*')
    .eq('canal_id', canal_id)
    .eq('status', 'testando')
    .limit(3);

  const eixos = (eixosRaw as any[]) || null;
  if (!eixos || eixos.length === 0) {
    return NextResponse.json({ error: 'Nenhum eixo ativo para gerar conteúdo' }, { status: 422 });
  }

  const videosCriados: string[] = [];
  const userId = user?.id ?? canal.user_id;
  const quantidade = minimo - estoque;

  // Gera um título por eixo até completar o estoque
  for (let i = 0; i < Math.min(quantidade, eixos.length * 2); i++) {
    const eixo = eixos[i % eixos.length];

    // Gera título via Gemini
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [{ text: `Gere 1 título magnético para um vídeo do YouTube Dark.
Eixo: ${eixo.nome}
Premissa: ${eixo.premissa ?? 'Drama e relatos de injustiça'}
Responda APENAS o título, sem aspas ou explicações.` }]
          }],
          generationConfig: { temperature: 0.95, maxOutputTokens: 100 },
        }),
      }
    );

    let titulo = `[Auto] Vídeo ${eixo.nome} ${i + 1}`;
    if (geminiRes.ok) {
      const geminiData = await geminiRes.json();
      const gerado = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (gerado) titulo = gerado;
    }

    // Insere o vídeo no banco
    const { data: novoVideoRaw } = await supabase
      .from('videos')
// @ts-expect-error - Supabase bypass
.insert({
        canal_id,
        user_id: userId,
        titulo,
        eixo: eixo.nome,
        status: 'planejamento',
        step_titulo: true,
        step_roteiro: false,
        step_audio: false,
        step_imagens: false,
        step_montagem: false,
        step_thumb: false,
        step_agendado: false,
        roteiro_aprovado: false,
        audio_aprovado: false,
        thumb_aprovada: false,
        aprovado_via: 'automacao',
        criado_por: userId,
      })
      .select('id')
      .single();

    const novoVideo = novoVideoRaw as any;
    if (novoVideo) videosCriados.push(novoVideo.id);
  }

  // Cria alerta de Auto-Refill
  await supabase.from('alertas')
// @ts-expect-error - Supabase bypass
.insert({
    user_id: userId,
    canal_id,
    tipo: 'mare',
    titulo: 'Auto-Refill Executado',
    mensagem: `Motor gerou ${videosCriados.length} novos vídeos para "${canal.nome}". Estoque restaurado.`,
    lido: false,
  });

  return NextResponse.json({
    message: `Auto-Refill executado com sucesso`,
    gerou: true,
    estoque_anterior: estoque,
    videos_criados: videosCriados.length,
    ids: videosCriados,
  });
}
