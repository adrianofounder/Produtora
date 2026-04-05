# Story 2.2 — Resolver Erros de Linting Pendentes

**Story ID:** 2.2
**Epic:** EPIC-01 — Resolução de Débitos Técnicos
**Sprint:** 2 — Qualidade & Consistência
**Prioridade:** 🟡 P1
**Estimativa:** 3h
**Assignee:** @dev

---

## User Story

**Como** desenvolvedor,
**Quero** que o linter reporte zero erros no codebase,
**Para que** novos erros sejam detectados imediatamente e não se misturem ao ruído existente.

---

## Contexto / Problema

**SYS-03:** Existe um volume massivo de erros de linting acumulados. Com tantos erros existentes, novos erros introduzidos por código novo se tornam invisíveis — o linter perde sua utilidade como ferramenta de qualidade.

---

## Acceptance Criteria

- [ ] **AC1:** `npm run lint` executa sem erros (pode ter warnings, mas sem errors)
- [ ] **AC2:** CI pipeline em PRs futuros bloqueia merge se linting falhar
- [ ] **AC3:** Regras do ESLint configuradas adequadamente para o projeto Next.js/TypeScript

---

## Tasks

- [ ] **T1:** Executar `npm run lint` e catalogar todos os erros por categoria
- [ ] **T2:** Corrigir erros críticos (any types, unused variables em código de produção)
- [ ] **T3:** Corrigir erros de acessibilidade (jsx-a11y rules) — complementar Story 1.4
- [ ] **T4:** Para regras que não fazem sentido no projeto, desabilitar adequadamente com comentário justificado
- [ ] **T5:** Configurar `lint-staged` para rodar linting apenas em arquivos editados no pre-commit

---

## Definition of Done

- [ ] `npm run lint` sem erros
- [ ] Regras desnecessárias documentadas e desabilitadas com justificativa
- [ ] @qa verificou que `lint-staged` está configurado

---

*Story criada por @pm (Morgan) — EPIC-01, Sprint 2*
