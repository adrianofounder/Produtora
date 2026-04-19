# Story 2.2 — Integração Completa do Pipeline (Kanban / Canais)

**Story ID:** 2.2
**Epic:** EPIC-02 — Validação de Fluxos e MVP
**Sprint:** 4 — Fundação de Dados (Integração Core)
**Prioridade:** 🔴 P0
**Estimativa:** 4h
**Assignee:** @dev

---

## 📖 User Story

**Como** usuário do AD_LABS (Operador/Estrategista),
**Quero** que as movimentações de vídeos no painel Kanban da aba Canais se reflitam imediatamente no meu banco de dados na nuvem,
**Para que** o ciclo de vida e andamento e priorização das produções sejam persistidos e acessíveis por todo o meu time.

---

## 🧠 Contexto / Problema

- A rota `/canais` possivelmente já tem a UI base ou consumia "Mock Data". Na Story 2.1, iniciou-se o Fetching básico, mas a interatividade (mutação) do Kanban não reflete no banco de dados. 
- **O Objetivo Principal** é garantir que mover um card de, por exemplo, `planejamento` para `producao` (seja por Drag and Drop ou botões de ação), evoque uma alteração no backend que chame o Supabase (update).
- Se a UI ficar dessincronizada, teremos falhas na UX. Portanto, é necessário fazer uso de *Server Actions* associadas ao revalidate de rotas (ou client refreshing) e gerenciar adequadamente o estado asíncrono da transição.

---

## ✅ Acceptance Criteria (Definition of Done)

- [x] **AC1 (Server Action):** Criação de uma Server Action para transição de status (ex: `moveVideoStatus(videoId: string, newStatus: string)`). A action atualiza a linha correspondente na tabela `videos` via cliente Supabase (Server Side).
- [x] **AC2 (DND/Click Integration):** O evento do componente Kanban de canais (`onDragEnd` para arrastar, ou botões de avanço `onMove`) foi plugado à Server Action. 
- [x] **AC3 (Revalidação Over The Wire):** A Server Action finaliza executando o `revalidatePath('/canais')` (ou equivalente no Client context) para garantir que toda a árvore de dados receba as versões mais recentes das colunas do Kanban e reflita visualmente a mudança.
- [x] **AC4 (Loading & UX Resiliente):** Implementado `useTransition`, `useOptimistic` ou um simples Status de Loading nos cards durante o disparo da Server Action, para evitar toques duplos e demonstrar responsividade durante o pequeno delay de rede, mantendo o "Lendária Dark Mode UI".

---

## 🛠️ Detalhamento Técnico para o @dev (Instruções de Handoff)

**1. Mutação via Server Components & Server Actions:**
- O Layout de canais/kanban costuma exigir componentes Cliente (`'use client'`) por envolver interação de mouse complexa.
- A função exportada com `'use server'` deve residir à parte (ex. `/src/app/actions/kanban-actions.ts` ou junto ao page) e ser importada no componente Client, o qual fará `startTransition(() => { myAction(...) })`.

**2. Integração com Banco (Supabase):**
- A tabela afetada será `videos`, mapeando `id` (UUID) para atualizar a coluna indicadora da fase do kanban (`status` ou `etapa`).

**3. Manter Coesão do Design:**
- Não reescreva a UI visual ou adicione bibliotecas pesadas de DND sem necessidade (use o que já existe ou opções nativas simples/HTML5, a menos que existam componentes radix/lucide predeterminados). 
- O CSS usa Tailwind v4 (com `@theme inline`) e as colors globais de `var(--color-...)` devem continuar intactas.

---

## 🤖 CodeRabbit Integration (Quality Planning)

- **Agent Prediction**: Esta tarefa foca substancialmente no ciclo RPC/Server Actions. Recomendado que `@qa` force testes que tentem submeter falhas propositais (RLS fail ou erro 500) para ver se o card Kanban "estorna" e dá aviso visual em vez de ficar numa lane errada.
- **Risco Primário**: Inconsistência Client vs Server. Um *Optimistic Update* mal planejado pode fazer o card duplicar na UI, sumir temporariamente, ou o framework jogar um Erro de Hidratação. Redobre a atenção no gerenciamento do State reativo PÓS a chamada assíncrona.

---

## 📁 File List
- `src/app/actions/kanban-actions.ts`
- `src/components/dashboard/video-card.tsx`
- `src/app/(dashboard)/canais/page.tsx`

---

## 🚦 Status
**✅ Approved (QA Pass)**

---

## 🔎 QA Results
**Gate Decision:** `PASS`
**Date:** 2026-04-19
**Reviewer:** @qa (Quinn)

**Analysis:**
1. **Requirements Traceability:** AC1 through AC4 are completely fulfilled. The implementation favored action buttons with `isMoving` visual state over heavy DND, aligning perfectly with MVP constraints.
2. **Error Handling (RLS/500):** Validated. Server Action returns `{ success: false, error: ... }` which is caught in the Client array by an `alert()` and cleanly reverts the transition state (`setMovingCardId(null)`). No Hydration errors present.
3. **Optimistic/Reactive Update:** Handled gracefully via `revalidatePath` and a forced re-fetch (`carregarVideos`).
4. **Code Quality:** Next build and Lint passed with 0 errors.

**Recommendation:**
Story matches acceptance criteria and is safe to be merged/closed.

---

*Detailed by @sm (River) — Sprint 4 / EPIC-02*
