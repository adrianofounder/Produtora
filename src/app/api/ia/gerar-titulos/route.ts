import { NextResponse } from 'next/server';
import { requireAuth, handleApiError, checkOwnership } from '@/lib/api-utils';
import { GerarTitulosSchema } from '@/lib/validations/api-schemas';

// POST /api/ia/gerar-titulos
export async function POST(request: Request) {
  const { user, response: authRes } = await requireAuth();
  if (authRes) return authRes;

  try {
    const rawBody = await request.json();
    const body = GerarTitulosSchema.parse(rawBody);
    const { canal_id, eixo, premissa, formula_titulo } = body;

    if (canal_id) {
      const ownCanalRes = await checkOwnership('canais', canal_id, user.id);
      if (!ownCanalRes.hasOwnership) return ownCanalRes.response;
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
    return handleApiError(err);
  }
}
