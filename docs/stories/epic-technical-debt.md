# Epic: Resolução de Débitos Técnicos — Produtora (AD_LABS)

**Epic ID:** EPIC-01
**Projeto:** Produtora (AD_LABS)
**Data de Criação:** 2026-04-05
**PM:** Morgan (@pm)
**Status:** 📋 Planejado — Aguardando aprovação de budget

**Documentos de referência:**
- `docs/prd/technical-debt-assessment.md` — Assessment técnico completo
- `docs/reports/TECHNICAL-DEBT-REPORT.md` — Relatório executivo
- `docs/reviews/db-specialist-review.md` — Review de Database
- `docs/reviews/ux-specialist-review.md` — Review de UX/Frontend
- `docs/reviews/qa-review.md` — Gate de QA

---

## Objetivo

Resolver os **26 débitos técnicos** e **1 defeito funcional** identificados no Brownfield Discovery da plataforma Produtora (AD_LABS), priorizando segurança, estabilidade em produção e manutenibilidade do código.

A resolução elimina exposição de risco de **R$ 166k–R$ 670k** com investimento de **~R$ 9.150**.

---

## Escopo

| Sprint | Foco | Débitos | Horas | Custo |
|--------|------|---------|-------|-------|
| **Sprint 1** | Segurança & Bloqueadores | BUG-01, DB-01, DB-07, DB-08, API-01, FE-01, FE-02, FE-03, FE-08 | ~20h | ~R$ 3.000 |
| **Sprint 2** | Qualidade & Consistência | SYS-03, SYS-04, SYS-05, DB-02, DB-03, DB-04, FE-04, FE-05, FE-09 | ~22h | ~R$ 3.300 |
| **Sprint 3** | Performance & Excelência | DB-05, DB-09, FE-06, FE-07, OBS-01, TEST-01, SYS-01, SYS-02, DB-06 | ~19h | ~R$ 2.850 |
| **TOTAL** | | **26 débitos + 1 bug** | **~61h** | **~R$ 9.150** |

---

## Critérios de Sucesso do Epic

- [ ] Zero vulnerabilidades críticas de segurança (DB-07, DB-08, API-01)
- [ ] BUG-01 corrigido antes do próximo deploy em produção
- [ ] `VideoDrawer.tsx` decomposto em ≤ 100 linhas + 7 subcomponentes
- [ ] Conformidade WCAG 2.1 AA — `axe-cli` com 0 violações em `role=dialog`
- [ ] `database.types.ts` sincronizado com o schema real sem erros TypeScript
- [ ] Error tracking ativo em produção (Sentry ou equivalente)
- [ ] Cobertura mínima de testes para o fluxo crítico (Ideia → Roteiro → Publicar)

---

## Timeline

| Período | Sprint | Status |
|---------|--------|--------|
| Semanas 1-2 | Sprint 1 — Segurança & Bloqueadores | ⏳ Aguardando |
| Semanas 3-4 | Sprint 2 — Qualidade & Consistência | ⏳ Aguardando |
| Semanas 5-6 | Sprint 3 — Performance & Excelência | ⏳ Aguardando |

---

## Stories do Epic

### 🔴 Sprint 1 — Segurança & Bloqueadores

| Story | Título | Débitos | Horas |
|-------|--------|---------|-------|
| [Story 1.1](story-1.1-hotfix-bug-exportar.md) | Hotfix: Gate de publicação incompleta (BUG-01) | BUG-01 | 0.5h |
| [Story 1.2](story-1.2-seguranca-database.md) | Hardening de Segurança no Database | DB-08, DB-01 | 1h |
| [Story 1.3](story-1.3-auditoria-api-endpoints.md) | Auditoria e Hardening dos Endpoints de API | API-01 | 6h |
| [Story 1.4](story-1.4-acessibilidade-aria.md) | Implementar ARIA e Acessibilidade (WCAG 2.1 AA) | FE-03, FE-08 | 5.5h |
| [Story 1.5](story-1.5-refatorar-video-drawer.md) | Refatorar VideoDrawer — Decomposição em Componentes | FE-01, FE-02 | 12h |
| [Story 1.6](story-1.6-criptografar-tokens-oauth.md) | Criptografar Tokens OAuth do YouTube | DB-07 | 6h |

### 🟡 Sprint 2 — Qualidade & Consistência

| Story | Título | Débitos | Horas |
|-------|--------|---------|-------|
| [Story 2.1](story-2.1-sincronizar-types.md) | Sincronizar database.types.ts pós-Migrations | SYS-05 | 2h |
| [Story 2.2](story-2.2-resolver-linting.md) | Resolver Erros de Linting Pendentes | SYS-03 | 3h |
| [Story 2.3](story-2.3-auditoria-triggers-db.md) | Auditoria de Triggers e Índices no Database | DB-02, DB-03, DB-04 | 3h |
| [Story 2.4](story-2.4-design-system-botoes.md) | Consolidar Design System de Botões | FE-04, FE-05 | 5h |
| [Story 2.5](story-2.5-responsividade-mobile.md) | Responsividade Mobile do VideoDrawer | FE-09 | 2h |
| [Story 2.6](story-2.6-next-config.md) | Otimizar Configuração do Next.js | SYS-04 | 2h |

### 🔵 Sprint 3 — Performance & Excelência

| Story | Título | Débitos | Horas |
|-------|--------|---------|-------|
| [Story 3.1](story-3.1-performance-database.md) | Otimização de Performance no Database | DB-05, DB-09, DB-06 | 5.5h |
| [Story 3.2](story-3.2-ux-estados-feedback.md) | Estados de Feedback de UX (Error, Loading, Empty) | FE-06, FE-07 | 5h |
| [Story 3.3](story-3.3-error-tracking.md) | Implementar Error Tracking em Produção | OBS-01 | 4h |
| [Story 3.4](story-3.4-testes-automatizados.md) | Estrutura Inicial de Testes Automatizados | TEST-01 | 4h+ |
| [Story 3.5](story-3.5-limpeza-sistema.md) | Limpeza e Organização do Sistema | SYS-01, SYS-02 | 0.5h |

---

## Dependências Críticas

> ⚠️ **Story 1.6 (DB-07)** DEVE ser executada APÓS Story 1.3 (API-01) — deploy coordenado obrigatório.
> ⚠️ **Story 2.1 (SYS-05)** DEVE ser a primeira do Sprint 2 — tipos quebram após migrations do Sprint 1.

---

## Definition of Done (Epic)

- [ ] Todos os critérios de aceite das stories validados pelo @qa
- [ ] Zero issues CRITICAL/HIGH no scan de CodeRabbit
- [ ] Build TypeScript sem erros (`npx tsc --noEmit`)
- [ ] Linting sem erros (`npm run lint`)
- [ ] Deploy realizado em produção sem incidentes
- [ ] `docs/reports/TECHNICAL-DEBT-REPORT.md` atualizado com status "RESOLVIDO"

---

*Epic criado por @pm (Morgan) — Fase 10 do Brownfield Discovery Workflow.*
