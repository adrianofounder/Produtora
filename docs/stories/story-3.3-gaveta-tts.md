# Story 3.3 — Gaveta de Produção (Aba 3): O Motor de Emissão Sonora (TTS)

**Story ID:** 3.3 (EPIC-03)
**Epic:** [EPIC-03 — A Máquina de Criação (Integração IA e Motores)](./EPIC-03-FABRICA-E-IA.md)
**Sprint:** 7 — Sonorização e Empacotamento
**Prioridade:** 🔴 P0 — Core do sistema de geração
**Estimativa:** 8h
**Assignee:** @dev
**Status:** ✅ **FINALIZED**

---

## 📖 User Story

**Como** usuário do AD_LABS (Maestro),
**Quero** usar a Aba "Ouvir" para transformar os parágrafos aprovados de Roteiro em amostras de Áudio,
**Para que** eu possa escutar a narração usando uma VUI nativa, substituir parágrafos com problemas fonéticos isoladamente e garantir o arquivamento dessas trilhas na nuvem (Supabase).

---

## 🔍 Contexto / Problema

Esta story materializa a geração Sonora (Text-to-Speech) sobre os blocos de texto aprovados na Aba 1 da Gaveta.

### Diretrizes Críticas:
1. **Armazenamento Seguro (Supabase Storage):** Blob de áudio ou bytes recebidos do Motor de TTS não podem residir eternamente no cache da interface, eles devem ser despachados e persistidos no Bucket daquele Tenant, que retornará as `publicUrl`s.
2. **Fachada Agnóstica de Voz (`IVoiceEngine`):** Garantir que a integração do backend (Server Actions) chame uma interface provisória, sem amarração severa de SDK com ElevenLabs ou OpenAI.
3. **Resiliência de Custos:** `consumption-tracker.ts` deve prevenir chamadas se o `voiceTokens` do teto tiver sido atingido.
4. **Edição Paragrafada:** A UI expõe as divisões. Se apenas o segundo parágrafo tiver ficado "robotizado", o botão de Regerar Áudio deve atuar unicamente ali, salvando cota diária.

---

## ✅ Acceptance Criteria (Definition of Done)

- [ ] **AC1 (Interface Aba Ouvir):** A view mapeia os blocos de texto atuais. Cria um esqueleto "Em processamento" / "Play" para cada um individualmente.
- [ ] **AC2 (Abstração TTS):** Criação/Integração do adapter que reitera de forma assíncrona recebendo `(textInfo, blueprintTone) => Promise<AudioBuffer>`.
- [ ] **AC3 (Cloud Storage Upload):** O backend deposita os arquivos mp3 usando nome hash e referenciando o ID do video, no bucket do Supabase.
- [ ] **AC4 (VUI Player Customizado):** Componente HTML5 de controle minimalista (Play, pause) de fácil identificação. Evitar reflow pesado da Gaveta.
- [ ] **AC5 (Gestão Error Rates):** Mostrar toast em caso de Mocking limits ou falha na transição de rede.

---

## 🛠️ Dev Notes — Contexto Técnico (Handoff para @dev)

### Architecture Preview (Mock Adapter):
O `@dev` deve instanciar um adaptador falso similar à `ITextEngine`:

```typescript
export interface IVoiceEngine {
  speak(options: { modelId: string, text: string, voiceContext: string }): Promise<{ audioBuffer: ArrayBuffer, costUnits: number }>;
}
```

- Lembre-se, use o Supabase `storage.from('assets')` para a persistência.
- O payload de retorno no Array do JsonB na tabela `videos` deve acomodar a propriedade nova `audioUrl` por parágrafo, mantendo coesão com Story 3.2.

---

## 📅 Tasks / Subtasks

- [x] 1. Base UI Gaveta: Criar aba condicional `Ouvir`.
- [x] 2. Core ServerAction: Mapear ação `generateParagraphAudio(paragraphId, videoId, text)`
- [x] 3. Cloud: Configurar permissões de RLS no Bucket Supabase.
- [x] 4. Mock Engine: Construir proxy TTS retornando dummy mp3.
- [x] 5. State ZUSTAND/React: Acoplar as URLs baixadas no PlayButton.

---

## 🛠️ Dev Agent Record

### File List Central
| Arquivo | Modificação |
|---|---|
| `supabase/migrations/20260419180000_create_assets_bucket.sql` | [NEW] Migration criando bucket e RLS policies |
| `src/lib/ai/voice-engine.interface.ts` | [NEW] Contratos IVoiceEngine |
| `src/lib/ai/mock-voice-engine.ts` | [NEW] Mocks do MP3 Buffer (Base64) |
| `src/app/actions/gaveta-actions.ts` | [MODIFY] Upload Storage, limit TTS, interface ScriptAction |
| `src/components/gaveta/gaveta-producao.tsx` | [MODIFY] Lazy-parse Paragraph e OuvirTab implementada |
| `docs/stories/epic-technical-debt.md` | [MODIFY] Registrada dívida técnica para Engine Real |

### Completion Notes
- A Aba "Ouvir" foi implementada com mapeamento do roteiro legados/strings suportando lazy hydration.
- O mock engine já devolve um mp3 minúsculo para que o elemento HTML5 `<audio>` reproduza silenciosamente em vez de crashar.
- O tracker de consumo "tts_audio" foi amarrado na Server Action provando o conceito "anti-happy-path".

---

## 🧪 CodeRabbit Integration (Quality Planning)

**Story Type Analysis:** Frontend Audio Player (VUI), Server-Side Buffer Handling, External API (Voice), Bucket Data.
**Specialized Agent Assignment:** `@dev` fará o file upload streaming e VUI. `@qa` garantirá que áudios falhos/quebras não fechem a Gaveta acidentalmente, além de testar limite financeiro excedido.
