import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// POST /api/ia/gerar-roteiro
// Body: { video_id, canal_id, titulo, eixo_id? }
export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const body = await request.json();
  const { video_id, canal_id, titulo, tom, gancho, narrativa } = body;

  if (!titulo || !canal_id) {
    return NextResponse.json({ error: 'titulo e canal_id são obrigatórios' }, { status: 400 });
  }

  // Busca o blueprint do canal para injetar a persona na IA
  const { data: blueprint } = await supabase
    .from('blueprints')
    .select('hook, emocao_dominante, conflito_central, estrutura_emocional, tipo_narrativa')
    .eq('canal_id', canal_id)
    .single();

  // Prompt estruturado com Blueprint como contexto
  const systemPrompt = `Você é um roteirista especialista em vídeos virais para YouTube Dark (relatos, histórias, drama).
Escreva roteiros com alta retenção, usando a estrutura de tensão progressiva.

${blueprint ? `
BLUEPRINT DO CANAL (respeitado obrigatoriamente):
- Hook padrão: ${blueprint.hook ?? 'Começa pela cena mais tensa'}
- Emoção dominante: ${blueprint.emocao_dominante ?? 'Injustiça + Catarse'}
- Conflito central: ${blueprint.conflito_central ?? 'Poder hierárquico vs protagonista'}
- Estrutura emocional: ${blueprint.estrutura_emocional ?? 'Tensão → Pico → Payoff'}
- Tipo de narrativa: ${blueprint.tipo_narrativa ?? 'Narrador Onisciente'}
` : ''}

${tom ? `Tom específico: ${tom}` : ''}
${gancho ? `Gancho de abertura sugerido: ${gancho}` : ''}
${narrativa ? `Estrutura narrativa a seguir: ${narrativa}` : ''}

FORMATO OBRIGATÓRIO DO ROTEIRO:
[HOOK INQUEBRÁVEL (0:00 - 0:05)]
Texto do hook aqui.

[DESENVOLVIMENTO (0:06 - X:XX)]
Texto do desenvolvimento em parágrafos curtos com marcação de tempo.

[CLÍMAX E PAYOFF (X:XX - X:XX)]
Resolução emocional.

[CHAMADA PARA AÇÃO (X:XX - FIM)]
Fechamento natural.

Escreva APENAS o roteiro, sem comentários extras, entre 1200 e 2000 palavras.`;

  const userPrompt = `Título do vídeo: "${titulo}"\n\nGere o roteiro completo agora:`;

  try {
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: systemPrompt + '\n\n' + userPrompt }] }
          ],
          generationConfig: {
            temperature: 0.85,
            maxOutputTokens: 3000,
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const err = await geminiResponse.json();
      return NextResponse.json({ error: 'Erro na API Gemini', detail: err }, { status: 502 });
    }

    const geminiData = await geminiResponse.json();
    const roteiro = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    // Persiste o roteiro no banco se video_id foi fornecido
    if (video_id && roteiro) {
      await supabase
        .from('videos')
        .update({ roteiro, step_roteiro: true, updated_at: new Date().toISOString() })
        .eq('id', video_id)
        .eq('user_id', user.id);
    }

    return NextResponse.json({ roteiro, video_id });

  } catch (err) {
    return NextResponse.json({ error: 'Falha interna ao chamar IA', detail: String(err) }, { status: 500 });
  }
}
