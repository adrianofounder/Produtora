# Guia de Execução — EPIC-01: Resolução de Débitos Técnicos

> **Como usar:** Copie e cole o comando no chat na ordem indicada.
> O fluxo padrão de cada story é: **Ativar agente → Implementar → Validar → Commitar → Próxima story**.

---

## 🔴 SPRINT 1 — Segurança & Bloqueadores

> ⚠️ Executar **nesta ordem exata** — há dependências críticas.

---

### ✅ Story 1.1 — Hotfix: Gate de Publicação Incompleta
> **Status:** ✅ CONCLUÍDA — commit `3b3e221`

---

### ✅ Story 1.2 — Hardening de Segurança no Database
> **Status:** ✅ CONCLUÍDA — commit `9836354`
> **DB-08** (privilege escalation) + **DB-01** (índice RLS) | ~1h

**Passo 1 — Ativar o agente e implementar:**
```
@[.agent/workflows/data-engineer.md] implemente a @[docs/stories/story-1.2-seguranca-database.md]
```

**Passo 2 — Validar:**
```
@[.agent/workflows/qa.md] valide a @[docs/stories/story-1.2-seguranca-database.md]
```

**Passo 3 — Após aprovação do QA, commitar:**
```
git add -A && git commit -m "fix(story-1.2): hardening de seguranca no database - DB-08 search_path + DB-01 index"
```

---

### ⏳ Story 1.3 — Auditoria e Hardening dos Endpoints de API
> **API-01** — endpoints sem validação de ownership | ~6h
> ⚠️ Esta story deve ser concluída **ANTES** da Story 1.6

**Passo 1 — Ativar o agente e implementar:**
```
@[.agent/workflows/dev.md] implemente a @[docs/stories/story-1.3-auditoria-api-endpoints.md]
```

**Passo 2 — Validar:**
```
@[.agent/workflows/qa.md] valide a @[docs/stories/story-1.3-auditoria-api-endpoints.md]
```

**Passo 3 — Após aprovação do QA, commitar:**
```
git add -A && git commit -m "fix(story-1.3): auditoria e hardening dos endpoints de API - ownership + input validation"
```

---

### ⏳ Story 1.4 — Implementar ARIA e Acessibilidade (WCAG 2.1 AA)
> **FE-03** + **FE-08** — sem ARIA em modais, labels sem htmlFor | ~5.5h
> ℹ️ Pode rodar em paralelo com a Story 1.3

**Passo 1 — Ativar o agente e implementar:**
```
@[.agent/workflows/dev.md] implemente a @[docs/stories/story-1.4-acessibilidade-aria.md]
```

**Passo 2 — Validar (inclui rodar axe-cli):**
```
@[.agent/workflows/qa.md] valide a @[docs/stories/story-1.4-acessibilidade-aria.md]
```

**Passo 3 — Após aprovação do QA, commitar:**
```
git add -A && git commit -m "fix(story-1.4): implementar ARIA completo e acessibilidade WCAG 2.1 AA no VideoDrawer"
```

---

### ⏳ Story 1.5 — Refatorar VideoDrawer — Decomposição em Componentes
> **FE-01** + **FE-02** — 444 linhas em 1 arquivo, 19 inline styles | ~12h
> ℹ️ Story maior — o agente pode dividir em múltiplas sessões

**Passo 1 — Revisar arquitetura antes de iniciar:**
```
@[.agent/workflows/architect.md] revise a arquitetura de decomposição proposta em @[docs/stories/story-1.5-refatorar-video-drawer.md]
```

**Passo 2 — Implementar:**
```
@[.agent/workflows/dev.md] implemente a @[docs/stories/story-1.5-refatorar-video-drawer.md]
```

**Passo 3 — Validar:**
```
@[.agent/workflows/qa.md] valide a @[docs/stories/story-1.5-refatorar-video-drawer.md]
```

**Passo 4 — Após aprovação do QA, commitar:**
```
git add -A && git commit -m "refactor(story-1.5): decomposicao do VideoDrawer em componentes atomicos + remocao inline styles"
```

---

### ⏳ Story 1.6 — Criptografar Tokens OAuth do YouTube
> **DB-07** — tokens em texto puro no banco | ~6h
> 🔴 **EXECUTAR SOMENTE APÓS Story 1.3 estar 100% concluída**
> ⚠️ Deploy atômico: código + migration ao mesmo tempo

**Passo 1 — Implementar camada de aplicação (crypto.ts + rotas):**
```
@[.agent/workflows/dev.md] implemente a parte de aplicação da @[docs/stories/story-1.6-criptografar-tokens-oauth.md]
```

**Passo 2 — Aplicar migration no banco:**
```
@[.agent/workflows/data-engineer.md] aplique a migration de banco da @[docs/stories/story-1.6-criptografar-tokens-oauth.md]
```

**Passo 3 — Validar:**
```
@[.agent/workflows/qa.md] valide a @[docs/stories/story-1.6-criptografar-tokens-oauth.md]
```

**Passo 4 — Após aprovação, commitar (deploy atômico):**
```
git add -A && git commit -m "feat(story-1.6): criptografar tokens OAuth do YouTube com pgcrypto - DB-07"
```

---

## 🟡 SPRINT 2 — Qualidade & Consistência

> Iniciar somente após **deploy do Sprint 1** em produção.

---

### ⏳ Story 2.1 — Sincronizar database.types.ts ⚠️ PRIMEIRO DO SPRINT 2
> **SYS-05** — tipos desatualizados após migrations | ~2h

**Passo 1 — Regenerar tipos e corrigir erros:**
```
@[.agent/workflows/dev.md] implemente a @[docs/stories/story-2.1-sincronizar-types.md]
```

**Passo 2 — Validar build:**
```
@[.agent/workflows/qa.md] valide a @[docs/stories/story-2.1-sincronizar-types.md]
```

**Passo 3 — Commitar:**
```
git add -A && git commit -m "fix(story-2.1): regenerar database.types.ts pos-migrations Sprint 1 - SYS-05"
```

---

### ⏳ Story 2.2 — Resolver Erros de Linting Pendentes
> **SYS-03** — volume massivo de erros de lint acumulados | ~3h

**Passo 1 — Implementar:**
```
@[.agent/workflows/dev.md] implemente a @[docs/stories/story-2.2-resolver-linting.md]
```

**Passo 2 — Validar:**
```
@[.agent/workflows/qa.md] valide a @[docs/stories/story-2.2-resolver-linting.md]
```

**Passo 3 — Commitar:**
```
git add -A && git commit -m "fix(story-2.2): resolver erros de linting pendentes + configurar lint-staged - SYS-03"
```

---

### ⏳ Story 2.3 — Auditoria de Triggers e Índices no Database
> **DB-02/03/04** — triggers updated_at ausentes + índice alertas | ~3h

**Passo 1 — Aplicar migrations:**
```
@[.agent/workflows/data-engineer.md] implemente a @[docs/stories/story-2.3-auditoria-triggers-db.md]
```

**Passo 2 — Validar:**
```
@[.agent/workflows/qa.md] valide a @[docs/stories/story-2.3-auditoria-triggers-db.md]
```

**Passo 3 — Commitar:**
```
git add -A && git commit -m "fix(story-2.3): adicionar triggers updated_at e indice alertas(canal_id) - DB-02/03/04"
```

---

### ⏳ Story 2.4 — Consolidar Design System de Botões
> **FE-04** + **FE-05** — .btn-danger ausente, statusConfig duplicado | ~5h

**Passo 1 — Implementar:**
```
@[.agent/workflows/dev.md] implemente a @[docs/stories/story-2.4-design-system-botoes.md]
```

**Passo 2 — Revisar visual (opcional mas recomendado):**
```
@[.agent/workflows/ux-design-expert.md] revise o design system da @[docs/stories/story-2.4-design-system-botoes.md]
```

**Passo 3 — Validar:**
```
@[.agent/workflows/qa.md] valide a @[docs/stories/story-2.4-design-system-botoes.md]
```

**Passo 4 — Commitar:**
```
git add -A && git commit -m "feat(story-2.4): adicionar .btn-danger ao design system e unificar statusConfig - FE-04/05"
```

---

### ⏳ Story 2.5 — Responsividade Mobile do VideoDrawer
> **FE-09** — sem bottom sheet em mobile | ~2h

**Passo 1 — Implementar:**
```
@[.agent/workflows/dev.md] implemente a @[docs/stories/story-2.5-responsividade-mobile.md]
```

**Passo 2 — Validar:**
```
@[.agent/workflows/qa.md] valide a @[docs/stories/story-2.5-responsividade-mobile.md]
```

**Passo 3 — Commitar:**
```
git add -A && git commit -m "feat(story-2.5): responsividade mobile do VideoDrawer com bottom sheet - FE-09"
```

---

### ⏳ Story 2.6 — Otimizar Configuração do Next.js
> **SYS-04** — next.config.ts vazio sem otimizações | ~2h

**Passo 1 — Implementar:**
```
@[.agent/workflows/dev.md] otimize o next.config.ts: adicione image domains, compressão e bundle analyzer. Veja @[docs/prd/technical-debt-assessment.md] para contexto do item SYS-04
```

**Passo 2 — Validar build:**
```
@[.agent/workflows/qa.md] valide que o build do Next.js está sem warnings e devidamente otimizado
```

**Passo 3 — Commitar:**
```
git add -A && git commit -m "feat(story-2.6): otimizar next.config.ts com image domains, compressao e bundle config - SYS-04"
```

---

## 🔵 SPRINT 3 — Performance & Excelência

> Iniciar após Sprint 2 concluído.

---

### ⏳ Story 3.1 — Otimização de Performance no Database
> **DB-05/09/06** — RLS com IN, índices compostos ausentes | ~5.5h

**Passo 1 — Aplicar migrations:**
```
@[.agent/workflows/data-engineer.md] implemente a @[docs/stories/story-3.1-performance-database.md]
```

**Passo 2 — Validar com EXPLAIN ANALYZE:**
```
@[.agent/workflows/qa.md] valide a @[docs/stories/story-3.1-performance-database.md]
```

**Passo 3 — Commitar:**
```
git add -A && git commit -m "perf(story-3.1): migrar RLS para EXISTS e adicionar indices compostos - DB-05/09/06"
```

---

### ⏳ Story 3.2 — Estados de Feedback de UX (Error, Loading, Empty)
> **FE-06** + **FE-07** — sem feedback visual de erros de IA | ~5h

**Passo 1 — Implementar atoms de UI:**
```
@[.agent/workflows/dev.md] implemente a @[docs/stories/story-3.2-ux-estados-feedback.md]
```

**Passo 2 — Revisar visual:**
```
@[.agent/workflows/ux-design-expert.md] revise os atoms de feedback da @[docs/stories/story-3.2-ux-estados-feedback.md]
```

**Passo 3 — Validar:**
```
@[.agent/workflows/qa.md] valide a @[docs/stories/story-3.2-ux-estados-feedback.md]
```

**Passo 4 — Commitar:**
```
git add -A && git commit -m "feat(story-3.2): adicionar atoms ErrorState, LoadingState e EmptyState - FE-06/07"
```

---

### ⏳ Story 3.3 — Implementar Error Tracking em Produção (Sentry)
> **OBS-01** — sem monitoramento de erros em runtime | ~4h

**Passo 1 — Configurar infraestrutura:**
```
@[.agent/workflows/devops.md] configure o Sentry para o projeto seguindo a @[docs/stories/story-3.3-error-tracking.md]
```

**Passo 2 — Integrar no código:**
```
@[.agent/workflows/dev.md] integre o Sentry SDK no Next.js seguindo a @[docs/stories/story-3.3-error-tracking.md]
```

**Passo 3 — Validar:**
```
@[.agent/workflows/qa.md] valide a @[docs/stories/story-3.3-error-tracking.md]
```

**Passo 4 — Commitar:**
```
git add -A && git commit -m "feat(story-3.3): integrar Sentry para error tracking em producao - OBS-01"
```

---

### ⏳ Story 3.4 — Estrutura Inicial de Testes Automatizados
> **TEST-01** — zero cobertura de testes | ~4h+

**Passo 1 — Configurar framework:**
```
@[.agent/workflows/dev.md] configure a estrutura de testes Vitest seguindo a @[docs/stories/story-3.4-testes-automatizados.md]
```

**Passo 2 — Escrever testes iniciais:**
```
@[.agent/workflows/qa.md] escreva os primeiros testes automatizados seguindo a @[docs/stories/story-3.4-testes-automatizados.md]
```

**Passo 3 — Configurar CI:**
```
@[.agent/workflows/devops.md] configure o GitHub Actions para rodar os testes em PRs seguindo a @[docs/stories/story-3.4-testes-automatizados.md]
```

**Passo 4 — Commitar:**
```
git add -A && git commit -m "feat(story-3.4): configurar Vitest + primeiros testes automatizados + CI pipeline - TEST-01"
```

---

### ⏳ Story 3.5 — Limpeza e Organização do Sistema
> **SYS-01/02** — package.json com nome temp-app, arquivos soltos | ~0.5h
> ✅ Quick win — pode executar a qualquer momento

**Passo 1 — Implementar:**
```
@[.agent/workflows/dev.md] implemente a @[docs/stories/story-3.5-limpeza-sistema.md]
```

**Passo 2 — Commitar (sem necessidade de QA):**
```
git add -A && git commit -m "chore(story-3.5): renomear temp-app para produtora e limpar arquivos soltos da raiz - SYS-01/02"
```

---

## 📊 Tracker de Progresso

| Story | Título | Sprint | Status |
|-------|--------|--------|--------|
| 1.1 | Hotfix gate publicação | 1 | ✅ Concluída |
| 1.2 | Hardening Database (DB-08/01) | 1 | ✅ Concluída |
| 1.3 | Auditoria API endpoints | 1 | ⏳ Aguardando |
| 1.4 | ARIA acessibilidade | 1 | ⏳ Aguardando |
| 1.5 | Refatorar VideoDrawer | 1 | ⏳ Aguardando |
| 1.6 | Criptografar tokens OAuth | 1 | ⏳ Após 1.3 |
| 2.1 | Sincronizar database.types.ts | 2 | ⏳ Aguardando |
| 2.2 | Resolver linting | 2 | ⏳ Aguardando |
| 2.3 | Triggers e índices DB | 2 | ⏳ Aguardando |
| 2.4 | Design system botões | 2 | ⏳ Aguardando |
| 2.5 | Responsividade mobile | 2 | ⏳ Aguardando |
| 2.6 | Otimizar Next.js config | 2 | ⏳ Aguardando |
| 3.1 | Performance database | 3 | ⏳ Aguardando |
| 3.2 | UX estados de feedback | 3 | ⏳ Aguardando |
| 3.3 | Error tracking (Sentry) | 3 | ⏳ Aguardando |
| 3.4 | Testes automatizados | 3 | ⏳ Aguardando |
| 3.5 | Limpeza sistema | 3 | ⏳ Aguardando |

---

*Guia gerado por @pm (Morgan) e @dev (Dex) — EPIC-01 Brownfield Discovery Workflow*
*Referência técnica completa: `docs/prd/technical-debt-assessment.md`*
