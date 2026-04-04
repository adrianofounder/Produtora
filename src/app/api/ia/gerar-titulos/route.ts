import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// POST /api/ia/gerar-titulos
// Body: { canal_id, eixo, premissa, formula_titulo? }
export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const body = await request.json();
  const { canal_id, eixo, premissa, formula_titulo } = body;

  if (!eixo || !premissa) {
    return NextResponse.json({ error: 'eixo e premissa são obrigatórios' }, { status: 400 });
  }

  const prompt = `Você é um especialista em copywriting magnético para YouTube Dark (relatos, histórias, drama viral).
  
Gere EXATAMENTE 5 títulos virais e magnéticos para o seguinte vídeo:

Eixo temático: ${eixo}
Premissa: ${premissa}
${formula_titulo ? `Fórmula a seguir: ${formula_titulo}` : ''}

REGRAS OBRIGATÓRIAS:
- Títulos entre 50 e 80 caracteres
- Use curiosity gap, números, tensão emocional
- Nunca use clickbait óbvio ou caps lock excessivo
- Varie as estruturas (pergunta, afirmação chocante, confissão, revelação)

FORMATO DE RESPOSTA (JSON puro, sem markdown):
{"titulos": ["Título 1", "Título 2", "Título 3", "Título 4", "Título 5"]}`;

  try {
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 500,
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

    let parsed: { titulos?: string[] } = {};
    try {
      parsed = JSON.parse(raw);
    } catch {
      // fallback se Gemini não responder em JSON puro
      parsed = { titulos: [raw] };
    }

    return NextResponse.json({ titulos: parsed.titulos ?? [], canal_id });

  } catch (err) {
    return NextResponse.json({ error: 'Falha ao gerar títulos', detail: String(err) }, { status: 500 });
  }
}
