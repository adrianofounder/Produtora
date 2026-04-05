# Guia de Execução — EPIC-01: Resolução de Débitos Técnicos

**Para:** Time de desenvolvimento
**Epic:** `docs/stories/epic-technical-debt.md`
**Assessment:** `docs/prd/technical-debt-assessment.md`

---

## Como usar este guia

Para cada story abaixo:
1. **Chame o agente indicado** usando o workflow correspondente (ex: `@[.agent/workflows/dev.md]`)
2. **Passe o arquivo da story** como contexto (ex: `@[docs/stories/story-1.1-hotfix-bug-exportar.md]`)
3. **O agente executa** — ao terminar, passe para o próximo
4. **@qa valida** cada story antes de marcar como concluída

> 💡 **Dica rápida:** Cole o comando no chat → `@[.agent/workflows/dev.md] implemente a @[docs/stories/story-X.X-nome.md]`

---

## 🔴 SPRINT 1 — Segurança & Bloqueadores (~20h)

> **Executar nesta ordem exata** — há dependências críticas entre as stories.

---

### Story 1.1 — Hotfix: Gate de Publicação Incompleta
**📄 Arquivo:** `docs/stories/story-1.1-hotfix-bug-exportar.md`
**⏱️ Estimativa:** 0.5h
**🔴 URGENTE** — executar antes de qualquer deploy

| Papel | Agente | Comando | Motor |
|-------|--------|---------|-------|
| Implementação | `@dev` | `@[.agent/workflows/dev.md]` | Edição direta de `video-drawer.tsx` linha 430 |
| Validação | `@qa` | `@[.agent/workflows/qa.md]` | Teste manual: tentar agendar sem áudio/thumb |

---

### Story 1.2 — Hardening de Segurança no Database
**📄 Arquivo:** `docs/stories/story-1.2-seguranca-database.md`
**⏱️ Estimativa:** 1h

| Papel | Agente | Comando | Motor |
|-------|--------|---------|-------|
| Migration DB | `@data-engineer` | `@[.agent/workflows/data-engineer.md]` | SQL via `supabase db execute` |
| Revisão | `@qa` | `@[.agent/workflows/qa.md]` | Query `pg_proc` + `EXPLAIN ANALYZE` |

---

### Story 1.3 — Auditoria e Hardening dos Endpoints de API
**📄 Arquivo:** `docs/stories/story-1.3-auditoria-api-endpoints.md`
**⏱️ Estimativa:** 6h
**⚠️ Pré-requisito da Story 1.6 — concluir antes**

| Papel | Agente | Comando | Motor |
|-------|--------|---------|-------|
| Implementação | `@dev` | `@[.agent/workflows/dev.md]` | Editar rotas em `src/app/api/` |
| Documentação | `@dev` | automático | Criar `docs/api/api-security-audit.md` |
| Validação | `@qa` | `@[.agent/workflows/qa.md]` | Teste de autorização (401/403) |

---

### Story 1.4 — Implementar ARIA e Acessibilidade (WCAG 2.1 AA)
**📄 Arquivo:** `docs/stories/story-1.4-acessibilidade-aria.md`
**⏱️ Estimativa:** 5.5h
**ℹ️ Pode rodar em paralelo com Story 1.3**

| Papel | Agente | Comando | Motor |
|-------|--------|---------|-------|
| Implementação | `@dev` | `@[.agent/workflows/dev.md]` | Editar `video-drawer.tsx` (ARIA + focus trap) |
| Consultoria UX | `@ux-design-expert` | `@[.agent/workflows/ux-design-expert.md]` | Revisão de semântica HTML |
| Validação | `@qa` | `@[.agent/workflows/qa.md]` | `npx axe-cli` + teste manual com teclado |

---

### Story 1.5 — Refatorar VideoDrawer — Decomposição em Componentes
**📄 Arquivo:** `docs/stories/story-1.5-refatorar-video-drawer.md`
**⏱️ Estimativa:** 12h
**ℹ️ Maior story do Sprint 1 — pode dividir em sub-sessões**

| Papel | Agente | Comando | Motor |
|-------|--------|---------|-------|
| Implementação | `@dev` | `@[.agent/workflows/dev.md]` | Criar `tabs/`, `hooks/`, novos componentes |
| Arquitetura | `@architect` | `@[.agent/workflows/architect.md]` | Validar estrutura de pastas antes de iniciar |
| Validação | `@qa` | `@[.agent/workflows/qa.md]` | Teste funcional de todas as 5 abas |

---

### Story 1.6 — Criptografar Tokens OAuth do YouTube
**📄 Arquivo:** `docs/stories/story-1.6-criptografar-tokens-oauth.md`
**⏱️ Estimativa:** 6h
**🔴 EXECUTAR SOMENTE APÓS Story 1.3 estar 100% concluída**
**⚠️ Deploy Atômico: código + migration ao mesmo tempo**

| Papel | Agente | Comando | Motor |
|-------|--------|---------|-------|
| Migration DB | `@data-engineer` | `@[.agent/workflows/data-engineer.md]` | SQL via `supabase db execute` |
| Camada de App | `@dev` | `@[.agent/workflows/dev.md]` | Criar `src/lib/crypto.ts` + atualizar rotas |
| Validação | `@qa` | `@[.agent/workflows/qa.md]` | Verificar coluna enc + teste OAuth end-to-end |

---

## 🟡 SPRINT 2 — Qualidade & Consistência (~22h)

> Iniciar SOMENTE após deploy do Sprint 1 em produção.

---

### Story 2.1 — Sincronizar database.types.ts ⚠️ PRIMEIRO DO SPRINT 2
**📄 Arquivo:** `docs/stories/story-2.1-sincronizar-types.md`
**⏱️ Estimativa:** 2h

| Papel | Agente | Comando | Motor |
|-------|--------|---------|-------|
| Regeneração | `@dev` | `@[.agent/workflows/dev.md]` | `npx supabase gen types typescript` |
| Validação | `@qa` | `@[.agent/workflows/qa.md]` | `npx tsc --noEmit` sem erros |

---

### Story 2.2 — Resolver Erros de Linting Pendentes
**📄 Arquivo:** `docs/stories/story-2.2-resolver-linting.md`
**⏱️ Estimativa:** 3h

| Papel | Agente | Comando | Motor |
|-------|--------|---------|-------|
| Implementação | `@dev` | `@[.agent/workflows/dev.md]` | `npm run lint` + corrigir erros |
| Validação | `@qa` | `@[.agent/workflows/qa.md]` | `npm run lint` sem erros |

---

### Story 2.3 — Auditoria de Triggers e Índices no Database
**📄 Arquivo:** `docs/stories/story-2.3-auditoria-triggers-db.md`
**⏱️ Estimativa:** 3h

| Papel | Agente | Comando | Motor |
|-------|--------|---------|-------|
| Migration DB | `@data-engineer` | `@[.agent/workflows/data-engineer.md]` | SQL via `supabase db execute` |
| Validação | `@qa` | `@[.agent/workflows/qa.md]` | Queries `information_schema.triggers` + `pg_indexes` |

---

### Story 2.4 — Consolidar Design System de Botões
**📄 Arquivo:** `docs/stories/story-2.4-design-system-botoes.md`
**⏱️ Estimativa:** 5h

| Papel | Agente | Comando | Motor |
|-------|--------|---------|-------|
| CSS | `@dev` | `@[.agent/workflows/dev.md]` | Adicionar `.btn-danger` em `globals.css` |
| Revisão visual | `@ux-design-expert` | `@[.agent/workflows/ux-design-expert.md]` | Validar estética e tokens |
| Validação | `@qa` | `@[.agent/workflows/qa.md]` | Verificar zero `style={{color}}` inline destrutivos |

---

### Story 2.5 — Responsividade Mobile do VideoDrawer
**📄 Arquivo:** `docs/stories/story-2.5-responsividade-mobile.md`
**⏱️ Estimativa:** 2h

| Papel | Agente | Comando | Motor |
|-------|--------|---------|-------|
| Implementação | `@dev` | `@[.agent/workflows/dev.md]` | Breakpoints responsivos no Drawer |
| Revisão UX | `@ux-design-expert` | `@[.agent/workflows/ux-design-expert.md]` | Validar padrão bottom sheet mobile |
| Validação | `@qa` | `@[.agent/workflows/qa.md]` | Teste em viewport 375px e 1280px |

---

### Story 2.6 — Otimizar Configuração do Next.js
> **Nota:** Story simples, sem arquivo dedicado. Otimizar `next.config.ts` com image domains, bundle analyzer e compression.

| Papel | Agente | Comando | Motor |
|-------|--------|---------|-------|
| Implementação | `@dev` | `@[.agent/workflows/dev.md]` | Editar `next.config.ts` |
| Validação | `@qa` | `@[.agent/workflows/qa.md]` | `npm run build` sem warnings |

---

## 🔵 SPRINT 3 — Performance & Excelência (~19h)

> Iniciar após Sprint 2 concluído.

---

### Story 3.1 — Otimização de Performance no Database
**📄 Arquivo:** `docs/stories/story-3.1-performance-database.md`
**⏱️ Estimativa:** 5.5h

| Papel | Agente | Comando | Motor |
|-------|--------|---------|-------|
| Migration DB | `@data-engineer` | `@[.agent/workflows/data-engineer.md]` | SQL RLS EXISTS + índices compostos |
| Validação | `@qa` | `@[.agent/workflows/qa.md]` | `EXPLAIN ANALYZE` nas queries críticas |

---

### Story 3.2 — Estados de Feedback de UX
**📄 Arquivo:** `docs/stories/story-3.2-ux-estados-feedback.md`
**⏱️ Estimativa:** 5h

| Papel | Agente | Comando | Motor |
|-------|--------|---------|-------|
| Implementação | `@dev` | `@[.agent/workflows/dev.md]` | Criar atoms `ErrorState`, `LoadingState`, `EmptyState` |
| Revisão UX | `@ux-design-expert` | `@[.agent/workflows/ux-design-expert.md]` | Aprovar visual e copy dos estados |
| Validação | `@qa` | `@[.agent/workflows/qa.md]` | Simular erro de API e verificar exibição |

---

### Story 3.3 — Error Tracking em Produção (Sentry)
**📄 Arquivo:** `docs/stories/story-3.3-error-tracking.md`
**⏱️ Estimativa:** 4h

| Papel | Agente | Comando | Motor |
|-------|--------|---------|-------|
| Configuração | `@devops` | `@[.agent/workflows/devops.md]` | Configurar Sentry + variáveis de ambiente |
| Integração | `@dev` | `@[.agent/workflows/dev.md]` | SDK Next.js + user context |
| Validação | `@qa` | `@[.agent/workflows/qa.md]` | Erro de teste → verificar no dashboard Sentry |

---

### Story 3.4 — Estrutura Inicial de Testes Automatizados
**📄 Arquivo:** `docs/stories/story-3.4-testes-automatizados.md`
**⏱️ Estimativa:** 4h+

| Papel | Agente | Comando | Motor |
|-------|--------|---------|-------|
| Setup | `@dev` | `@[.agent/workflows/dev.md]` | Instalar Vitest + configurar `vitest.config.ts` |
| Escrita de testes | `@qa` | `@[.agent/workflows/qa.md]` | Escrever testes unitários e de integração |
| CI | `@devops` | `@[.agent/workflows/devops.md]` | GitHub Actions para rodar testes em PRs |

---

### Story 3.5 — Limpeza e Organização do Sistema
**📄 Arquivo:** `docs/stories/story-3.5-limpeza-sistema.md`
**⏱️ Estimativa:** 0.5h (quick win — pode fazer qualquer hora)

| Papel | Agente | Comando | Motor |
|-------|--------|---------|-------|
| Implementação | `@dev` | `@[.agent/workflows/dev.md]` | Editar `package.json` + remover arquivos soltos |

---

## Fluxo Padrão por Story

```
1. USER: "@[.agent/workflows/dev.md] implemente @[docs/stories/story-X.X-nome.md]"
2. @dev executa as tasks da story
3. USER: "@[.agent/workflows/qa.md] valide @[docs/stories/story-X.X-nome.md]"
4. @qa roda os testes e dá gate decision
5. Se APPROVED → commitar + próxima story
6. Se NEEDS WORK → @dev corrige → @qa re-valida
```

---

## Resumo Rápido por Agente

| Agente | Responsabilidade no Epic |
|--------|--------------------------|
| `@dev` | Implementação de todas as stories de código |
| `@data-engineer` | Stories de migration de banco (1.2, 1.6, 2.3, 3.1) |
| `@qa` | Validação de todas as stories antes de fechar |
| `@ux-design-expert` | Revisão de stories de interface (1.4, 2.4, 2.5, 3.2) |
| `@architect` | Revisão de arquitetura na Story 1.5 (VideoDrawer) |
| `@devops` | Stories de infra (3.3 Sentry, 3.4 CI) |

---

*Guia gerado por @pm (Morgan) — EPIC-01 Brownfield Discovery Workflow*
*Referência técnica completa: `docs/prd/technical-debt-assessment.md`*
