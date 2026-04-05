# Story 3.5 — Limpeza e Organização do Sistema

**Story ID:** 3.5
**Epic:** EPIC-01 — Resolução de Débitos Técnicos
**Sprint:** 3 — Performance & Excelência
**Prioridade:** 🔵 P3 — Baixo (Quick win)
**Estimativa:** 0.5h
**Assignee:** @dev

---

## User Story

**Como** desenvolvedor novo no projeto,
**Quero** que o repositório esteja organizado e com metadados corretos,
**Para que** a primeira impressão do projeto seja profissional e arquivos temporários não confundam.

---

## Contexto / Problema

- **SYS-01:** `package.json` tem `"name": "temp-app"` — nome provisório nunca atualizado
- **SYS-02:** Existem arquivos soltos na raiz do projeto (`workmeu`, `veterano.txt` e similares) — provavelmente artefatos de sessões de trabalho anteriores

---

## Acceptance Criteria

- [ ] **AC1:** `package.json` tem `"name": "produtora"` (ou nome definitivo do produto)
- [ ] **AC2:** Arquivos soltos sem extensão na raiz do repositório foram removidos ou movidos
- [ ] **AC3:** `.gitignore` inclui padrões para evitar que esse tipo de arquivo seja commitado novamente

---

## Tasks

- [ ] **T1:** Atualizar `package.json`:
  ```json
  { "name": "produtora", "description": "AD_LABS — Plataforma de produção de conteúdo" }
  ```
- [ ] **T2:** Remover/mover arquivos soltos: `workmeu`, `veterano.txt` e similares
- [ ] **T3:** Adicionar ao `.gitignore` padrões como `workmeu`, `*.txt` na raiz (se não for intencional), arquivos de notas temporárias

---

## Definition of Done

- [ ] `package.json` com nome correto
- [ ] Raiz do repositório limpa
- [ ] `.gitignore` atualizado

---

*Story criada por @pm (Morgan) — EPIC-01, Sprint 3*
