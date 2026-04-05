import { NextResponse } from 'next/server';
import { requireAuth, handleApiError, checkOwnership } from '@/lib/api-utils';
import { AnalisarCanalSchema } from '@/lib/validations/api-schemas';
import { createClient } from '@/lib/supabase/server';

// POST /api/ia/analisar-canal
// Body: { url, canal_id }
export async function POST(request: Request) {
  const { user, response: authRes } = await requireAuth();
  if (authRes) return authRes;

  try {
    const rawBody = await request.json();
    const body = AnalisarCanalSchema.parse(rawBody);
    const { canal_id } = body;
    const url = rawBody.url; // AnalisarCanal não tinha url no schema base, então pegamos fora por compatibilidade ou alteramos. 
    // Wait, eu tenho que validar url tbm!

    if (!url) {
      return NextResponse.json({ error: 'url é obrigatório' }, { status: 400 });
    }

    const ownCanalRes = await checkOwnership('canais', canal_id, user.id);
    if (!ownCanalRes.hasOwnership) return ownCanalRes.response;

    const prompt = `Você é um especialista em engenharia reversa de canais do YouTube Dark (relatos, drama, histórias).
Analise o canal ou vídeo pelo URL fornecido e extraia a estrutura do Blueprint de engenharia de retenção.

URL do benchmark: ${url}

Com base nas características típicas de canais desta categoria, gere um Blueprint técnico completo.
Responda APENAS em JSON puro, sem markdown:

{
  "titulo_benchmark": "Nome estimado do canal/vídeo",
  "canal_benchmark": "Nome do canal",
  "performance_score": 8.5,
  "hook": "Descrição do tipo de gancho de abertura usado",
  "emocao_dominante": "Sentimento predominante",
  "retention_loop": "Técnica de retenção usada (SFX, cliffhangers, etc)",
  "conflito_central": "Descrição do conflito recorrente",
  "plot_twist": "Tipo de virada típica",
  "estrutura_emocional": "Ex: Tensão → Pico → Payoff",
  "tipo_narrativa": "Ex: Narrador Onisciente",
  "estetica_visual": "Estilo visual das thumbnails",
  "ritmo_edicao": "Velocidade e estilo de edição",
  "formula_emocional": "Ex: Injustiça + Reparação",
  "quality_score": 8.2,
  "market_signal": "Alto/Médio/Baixo risco",
  "veredito": "Pronto para Maré"
}`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      return NextResponse.json({ error: 'Erro na API Gemini' }, { status: 502 });
    }

    const geminiData = await geminiResponse.json();
    const raw = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';

    let blueprint: Record<string, unknown> = {};
    try { blueprint = JSON.parse(raw); } catch { blueprint = {}; }

    if (canal_id && Object.keys(blueprint).length > 0) {
      const supabaseClient = await createClient();
      await supabaseClient
        .from('blueprints')
        // @ts-expect-error - Supabase bypass
        .upsert({ ...blueprint, canal_id, updated_at: new Date().toISOString() }, { onConflict: 'canal_id' });
    }

    return NextResponse.json(blueprint);

  } catch (err) {
    return handleApiError(err);
  }
}
