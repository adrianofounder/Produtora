# Story 2.1 — Sincronizar database.types.ts pós-Migrations

**Story ID:** 2.1
**Epic:** EPIC-01 — Resolução de Débitos Técnicos
**Sprint:** 2 — Qualidade & Consistência
**Prioridade:** 🟡 P1 — ⚠️ Primeiro item do Sprint 2 (bloqueador)
**Estimativa:** 2h
**Assignee:** @dev
**Status:** Ready for Review

---

## User Story

**Como** desenvolvedor,
**Quero** que os tipos TypeScript do banco de dados reflitam o schema real após as migrations do Sprint 1,
**Para que** o build não quebre e o autocompletar/type-checking funcione corretamente.

---

## Contexto / Problema

**SYS-05:** `src/lib/database.types.ts` foi gerado em uma versão anterior do schema. As migrations do Sprint 1 adicionaram e removeram colunas (especialmente DB-07 — renomeação das colunas OAuth). Sem regeneração, o TypeScript compila com tipos errados ou falha no build.

> **Executar como PRIMEIRA ação do Sprint 2**, imediatamente após o deploy do Sprint 1.

---

## Acceptance Criteria

- [x] **AC1:** `npx tsc --noEmit` executa sem erros relacionados a tipos de banco de dados
- [x] **AC2:** `database.types.ts` reflete as colunas `youtube_access_token_enc` e `youtube_refresh_token_enc` (não as antigas sem `_enc`)
- [x] **AC3:** Triggers e tabelas adicionadas no Sprint 1 (DB-02/03/04) estão refletidas nos tipos
- [x] **AC4:** `npm run build` completa sem erros TypeScript (fase linting/types passou; erro de SSR `useSearchParams` é pré-existente e fora do escopo)

---

## Tasks

- [x] **T1:** Regenerar types via Supabase CLI:
  ```bash
  npx -y supabase gen types typescript --project-id uwopcvzhjdmfuogfjqpj --schema public 2>$null | Out-File src\lib\supabase\database.types.ts
  ```
- [x] **T2:** Executar `npx tsc --noEmit` e corrigir erros de tipo resultantes
- [x] **T3:** Atualizar quaisquer referências no código que usem os tipos antigos (4 arquivos com `@ts-expect-error` obsoletos removidos)
- [x] **T4:** Executar `npm run build` para validar build completo

---

## Definition of Done

- [x] `npx tsc --noEmit` sem erros
- [x] `npm run build` sem erros TypeScript (linting/types passou)
- [ ] @qa verificou que os tipos refletem o schema atual

---

## Dev Agent Record

### Agent Model Used
Claude Sonnet 4.6 (Thinking) — Dex (@dev)

### Completion Notes
- `database.types.ts` regenerado via `npx -y supabase@2.85.0 gen types typescript` — 639 linhas
- Removidos 4 `@ts-expect-error` obsoletos inseridos como bypass temporário no Sprint 1
- Corrigidos 8 handlers de API routes que retornavam `NextResponse.json(data)` onde `data` podia ser `null` após `.single()` — adicionado guard `if (!data)` com 404 apropriado
- Corrigida causa raiz: `requireAuth()` e `checkOwnership()` agora retornam `response: undefined` em vez de `null`, eliminando inferência `| null` nos tipos dos handlers
- Erro `useSearchParams()` sem Suspense boundary em `/canais/perfil` é pré-existente, fora do escopo desta story

### File List
- `src/lib/supabase/database.types.ts` — MODIFIED (regenerado via CLI)
- `src/lib/api-utils.ts` — MODIFIED (response: null → undefined)
- `src/app/api/alertas/route.ts` — MODIFIED (guard null no POST)
- `src/app/api/blueprints/[id]/route.ts` — MODIFIED (removido @ts-expect-error, guards null)
- `src/app/api/blueprints/route.ts` — MODIFIED (guard null no POST)
- `src/app/api/canais/[id]/route.ts` — MODIFIED (removido @ts-expect-error, guards null)
- `src/app/api/canais/[id]/perfil/route.ts` — MODIFIED (removido @ts-expect-error, guards null)
- `src/app/api/eixos/route.ts` — MODIFIED (guard null no POST)
- `src/app/api/videos/[id]/route.ts` — MODIFIED (removido @ts-expect-error, guard null)
- `src/app/api/videos/route.ts` — MODIFIED (guard null no POST)

### Change Log
| Data | Alteração |
|------|-----------|
| 2026-04-07 | T1: Regeneração de types via Supabase CLI |
| 2026-04-07 | T2/T3: Remoção de @ts-expect-error + correção de null returns |
| 2026-04-07 | T4: Build validado (linting/types passou) |

---

*Story criada por @pm (Morgan) — EPIC-01, Sprint 2*
