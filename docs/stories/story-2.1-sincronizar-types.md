# Story 2.1 — Sincronizar database.types.ts pós-Migrations

**Story ID:** 2.1
**Epic:** EPIC-01 — Resolução de Débitos Técnicos
**Sprint:** 2 — Qualidade & Consistência
**Prioridade:** 🟡 P1 — ⚠️ Primeiro item do Sprint 2 (bloqueador)
**Estimativa:** 2h
**Assignee:** @dev

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

- [ ] **AC1:** `npx tsc --noEmit` executa sem erros relacionados a tipos de banco de dados
- [ ] **AC2:** `database.types.ts` reflete as colunas `youtube_access_token_enc` e `youtube_refresh_token_enc` (não as antigas sem `_enc`)
- [ ] **AC3:** Triggers e tabelas adicionadas no Sprint 1 (DB-02/03/04) estão refletidas nos tipos
- [ ] **AC4:** `npm run build` completa sem erros TypeScript

---

## Tasks

- [ ] **T1:** Regenerar types via Supabase CLI:
  ```bash
  npx supabase gen types typescript --project-id <project-id> > src/lib/database.types.ts
  ```
- [ ] **T2:** Executar `npx tsc --noEmit` e corrigir erros de tipo resultantes
- [ ] **T3:** Atualizar quaisquer referências no código que usem os tipos antigos
- [ ] **T4:** Executar `npm run build` para validar build completo

---

## Definition of Done

- [ ] `npx tsc --noEmit` sem erros
- [ ] `npm run build` sem erros
- [ ] @qa verificou que os tipos refletem o schema atual

---

*Story criada por @pm (Morgan) — EPIC-01, Sprint 2*
