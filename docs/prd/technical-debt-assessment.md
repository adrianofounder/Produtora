# Technical Debt Assessment — FINAL
**Projeto:** Produtora (AD_LABS)
**Data:** 2026-04-05
**Fase:** 8 — Assessment Final (Documento Definitivo)
**Gerado por:** @architect (Aria)
**Status:** ✅ FINAL — Aprovado por todos os especialistas

**Fontes:**
- `docs/prd/technical-debt-DRAFT.md` — Consolidação inicial (Fase 4)
- `docs/reviews/db-specialist-review.md` — @data-engineer, Dara (Fase 5)
- `docs/reviews/ux-specialist-review.md` — @ux-design-expert, Uma (Fase 6)
- `docs/reviews/qa-review.md` — @qa, Quinn (Fase 7)
- `docs/architecture.md` — Arquitetura frontend de referência
- `docs/schema.sql` — Schema PostgreSQL/Supabase analisado linha a linha

---

## Sumário Executivo

O projeto **Produtora (AD_LABS)** possui **26 itens de débito técnico** distribuídos em 6 categorias, mais **1 defeito funcional crítico** que requer atenção imediata. O esforço total estimado é de **~61 horas** de desenvolvimento (~R$ 9.150 a R$150/h).

| Criticidade | Qtd | Impacto Principal |
|-------------|-----|-------------------|
| 🔴 P0 — Críticos (bloqueadores) | 8 | Segurança e integridade de produção |
| 🟡 P1/P2 — Médios | 13 | Qualidade, manutenibilidade, acessibilidade |
| 🔵 P3 — Baixos | 5 | Organização e otimização |
| 🐛 BUG-01 — Defeito funcional | 1 | Publicações incompletas no YouTube |

**Descoberta mais crítica:** 2 vulnerabilidades de segurança não previstas no DRAFT (DB-07: OAuth tokens em texto puro; DB-08: SECURITY DEFINER sem search_path fixo). Ambas requerem correção antes de qualquer release.

---

## 1. Inventário Completo de Débitos

### 1.1 Sistema

> **Fonte:** `docs/architecture/system-architecture.md` | **Validado por:** @architect ✅

| ID | Débito | Impacto | Esforço | Prioridade |
|----|--------|---------|---------|------------|
| SYS-01 | Projeto nomeado `"temp-app"` no `package.json` | 🔵 Baixo | ⚡ Trivial | P3 |
| SYS-02 | Arquivos soltos na raiz (`workmeu`, `veterano.txt`) | 🔵 Baixo | ⚡ Trivial | P3 |
| SYS-03 | Volume massivo de erros de linting pendentes | 🟡 Alto | 🧪 Médio | P1 |
| SYS-04 | `next.config.ts` vazio — sem otimizações de build | 🟡 Médio | 🧪 Médio | P2 |
| SYS-05 | `database.types.ts` desatualizado em relação ao schema | 🟡 Alto | 🧪 Médio | **P1** ⚠️ Bloqueador pós-migration |

> **⚠️ Risco RC-02:** SYS-05 vai causar erros de compilação TypeScript imediatamente após as migrations de Sprint 1. Deve ser resolvido como **primeira ação do Sprint 2**.

---

### 1.2 Database

> **Fonte:** `docs/schema.sql` + `supabase/docs/DB-AUDIT.md` | **Validado por:** @data-engineer ✅

| ID | Débito | Área | Impacto | Esforço | Prioridade |
|----|--------|------|---------|---------|------------|
| DB-01 | Índice ausente em `api_keys(user_id)` — degrada RLS | Performance/Seg. | 🔴 Crítico | ⚡ 0.5h | **P0** |
| DB-02 | Trigger `updated_at` ausente em `profiles` *(coluna existe)* | Auditoria | 🟡 Médio | ⚡ 1h | P1 |
| DB-02b | Trigger `updated_at` ausente em `api_keys` *(coluna existe)* | Auditoria | 🟡 Médio | ⚡ 0.5h | P1 |
| DB-03 | Coluna `updated_at` ausente em `alertas` *(coluna + trigger)* | Auditoria | 🟡 Médio | ⚡ 1h | P1 |
| DB-04 | Índice ausente em `alertas(canal_id)` | Performance | 🟡 Médio | ⚡ 0.5h | P1 |
| DB-05 | RLS de `eixos`/`blueprints` via subquery `IN (SELECT …)` | Performance/Escala | 🟡 Médio | 🧪 4h | **P2** *(elevado de P3)* |
| DB-06 | Índice GIN ausente em `videos(tags)` | Performance | 🔵 Baixo | 🧪 1h | P2 *(condicional)* |
| DB-07 | OAuth tokens (`youtube_access_token/refresh_token`) em TEXT puro | **Segurança Crítica** | 🔴 Crítico | 🧪 6h | **P0** |
| DB-08 | `handle_new_user()` — `SECURITY DEFINER` sem `SET search_path` | **Privilege Escalation** | 🔴 Crítico | ⚡ 0.5h | **P0** |
| DB-09 | Índice composto ausente em `canais(user_id, mare_status)` | Performance | 🟡 Médio | ⚡ 0.5h | P2 |

**Script de migration validado:** Disponível em `docs/reviews/db-specialist-review.md` (seção 6) para P0+P1.

> **⚠️ Dependência atômica DB-07:** A migration que criptografa os tokens OAuth **exige deploy coordenado** com a camada de aplicação. Não aplicar isoladamente — ver RC-01.

---

### 1.3 Frontend / UX

> **Fonte:** `docs/frontend/frontend-spec.md` + análise de `video-drawer.tsx` e `video-card.tsx` | **Validado por:** @ux-design-expert ✅

| ID | Débito | Área | Impacto | Esforço | Prioridade |
|----|--------|------|---------|---------|------------|
| FE-01 | `VideoDrawer.tsx` — 444 linhas, múltiplas responsabilidades | Manutenibilidade | 🔴 Crítico | 🏗️ 8h | **P0** |
| FE-02 | ~19 ocorrências de `style={{}}` estáticos ignorando tokens | Consistência | 🔴 Crítico | 🧪 4h | **P0** *(integrar com FE-01)* |
| FE-03 | Ausência de ARIA e suporte a teclado em modais/drawers | Acessibilidade | 🔴 Crítico | 🧪 5h | **P0** |
| FE-04 | Variant `btn-danger` ausente — botão Excluir usa inline style | Design System | 🟡 Médio | 🧪 3h | P1 |
| FE-05 | `statusConfig` em `VideoCard` duplica tokens `.glow-*` do CSS | DRY/Manutenção | 🟡 Médio | ⚡ 2h | P1 |
| FE-06 | `gerarRoteiro()` — `try/finally` sem `catch` visual para erros de IA | UX/Feedback | 🟡 Médio | 🧪 3h | P2 |
| FE-07 | Spinners/skeletons ad-hoc — falta `<LoadingState>` e `<EmptyState>` atoms | UX/Reutilização | 🟡 Médio | ⚡ 2h | P2 |
| FE-08 | Formulários sem `htmlFor`/`id` — falha WCAG SC 1.3.1 e 4.1.2 | Acessibilidade | 🔴 Crítico | ⚡ 0.5h | **P0** *(agrupar com FE-03)* |
| FE-09 | Layout mobile ausente no `VideoDrawer` — sem bottom sheet | Responsividade | 🟡 Médio | 🧪 2h | P1 |

**Arquitetura de decomposição validada para FE-01:**
```
VideoDrawer.tsx (container ~80 linhas)
├── VideoDrawerHeader.tsx
├── VideoDrawerTabs.tsx
├── tabs/
│   ├── IdeiaTab.tsx
│   ├── RoteiroTab.tsx
│   ├── NarracaoTab.tsx
│   ├── ThumbTab.tsx
│   └── PacoteTab.tsx
└── hooks/useVideoDrawer.ts
```
*Alinhado com a arquitetura de componentes definida em `docs/architecture.md` (Section 1.1 File Structure Strategy).*

---

### 1.4 API (Camada de Integração)

> **Fonte:** Identificado por @qa na Fase 7 | **Gap não coberto pelos reviews anteriores**

| ID | Débito | Área | Impacto | Esforço | Prioridade |
|----|--------|------|---------|---------|------------|
| API-01 | Endpoints `/api/` sem auditoria de segurança e validação de input | Segurança/API | 🔴 Crítico | 🧪 ~6h | **P0** |

> Os endpoints `/api/ia/gerar-roteiro`, `/api/ia/gerar-titulos`, `/api/videos/[id]` não foram auditados para validação de ownership, input sanitization e tratamento de erros HTTP correto. Ponto crítico de potencial bypass de RLS via service role.

---

### 1.5 Observabilidade

| ID | Débito | Área | Impacto | Esforço | Prioridade |
|----|--------|------|---------|---------|------------|
| OBS-01 | Ausência de error tracking em runtime (Sentry ou equivalente) | Observabilidade | 🟡 Médio | 🧪 ~4h | P2 |

---

### 1.6 Qualidade / Testes

| ID | Débito | Área | Impacto | Esforço | Prioridade |
|----|--------|------|---------|---------|------------|
| TEST-01 | Zero cobertura de testes automatizados (unit + integration + e2e) | Qualidade | 🟡 Médio | 🏗️ Alto | P2 |

---

## 2. Defeito Funcional (Separado do Epic de Débitos)

### 🐛 BUG-01 — Gate Incompleto na Aba "Exportar" do VideoDrawer

> **Localização:** `video-drawer.tsx`, linha 430
> **Severidade:** Alta — impacta produção imediatamente

O botão "Agendar Publicação no YouTube" fica disponível verificando apenas `!aprovado.roteiro`, ignorando `aprovado.audio` e `aprovado.thumb`. Resultado: um usuário pode agendar publicação de um vídeo sem áudio gerado e sem thumbnail.

**Correção (< 30 minutos):**
```tsx
// ❌ Atual
{!aprovado.roteiro && (
  <div className="card-inner p-4 text-center">…</div>
)}

// ✅ Correto
{(!aprovado.roteiro || !aprovado.audio || !aprovado.thumb) && (
  <div className="card-inner p-4 text-center">…</div>
)}
```

> **Recomendação:** Criar story `BUG-01` separada do epic de débitos técnicos. Resolver como **hotfix antes do próximo deploy**.

---

## 3. Matriz de Risco Cruzado

| ID | Risco | Áreas | Probabilidade | Impacto | Ação |
|----|-------|-------|---------------|---------|------|
| RC-01 | DB-07 (tokens em texto) + API não auditada → leak de tokens OAuth | DB + API | **Alta** | Crítico | Resolver simultaneamente em Sprint 1 |
| RC-02 | SYS-05 (types) + migrations de DB → build quebrado | SYS + DB | **Alta** | Alto | Regenerar types como 1ª ação do Sprint 2 |
| RC-03 | FE-01 (refatoração Drawer) + FE-03 (ARIA) sem coordenação → regressão | FE | Média | Médio | Implementar ARIA durante ou antes da refatoração |
| RC-04 | DB-08 (SECURITY DEFINER ativo) + novos usuários → privilege escalation | DB + Seg. | Baixa | Crítico | Fix imediato — 0.5h |
| RC-05 | BUG-01 ativo em produção → publicações incompletas no YouTube | FE + Produto | **Alta** | Alto | Hotfix emergencial antes de qualquer deploy |

---

## 4. Plano de Resolução por Sprint

### 🔴 Sprint 1 — Segurança e Bloqueadores (~20h)

| Ordem | ID | Ação | Horas | Responsável |
|-------|----|------|-------|-------------|
| 1 | BUG-01 | Hotfix: corrigir gate da aba Exportar | 0.5h | @dev |
| 2 | DB-08 | Fix: `SET search_path = public` em `handle_new_user()` | 0.5h | @dev + @data-engineer |
| 3 | DB-01 | `CREATE INDEX CONCURRENTLY` em `api_keys(user_id)` | 0.5h | @data-engineer |
| 4 | API-01 | Auditoria e hardening dos endpoints `/api/` | 6h | @dev |
| 5 | FE-03 + FE-08 | ARIA completo no VideoDrawer + labels de formulário | 5h | @dev + @ux-design-expert |
| 6 | FE-01 + FE-02 | Decomposição do VideoDrawer + tokens estáticos | 8h | @dev |
| — | DB-07 | Criptografar tokens OAuth *(deploy coordenado com API-01)* | 6h | @data-engineer + @dev |

> **Nota:** DB-07 deve ser o **último item do Sprint 1**, após API-01 estar completo. Deploy atômico obrigatório.

---

### 🟡 Sprint 2 — Qualidade e Auditoria (~22h)

| Ordem | ID | Ação | Horas | Responsável |
|-------|----|------|-------|-------------|
| 1 | SYS-05 | Regenerar `database.types.ts` pós-migrations | 2h | @dev |
| 2 | SYS-03 | Resolver erros de linting pendentes | 3h | @dev |
| 3 | DB-02/b | Criar triggers `updated_at` em `profiles` e `api_keys` | 1.5h | @data-engineer |
| 4 | DB-03 | Adicionar coluna + trigger `updated_at` em `alertas` | 1h | @data-engineer |
| 5 | DB-04 | Criar índice `alertas(canal_id)` | 0.5h | @data-engineer |
| 6 | FE-04 | Adicionar `.btn-danger` ao `globals.css` + unificar botões | 3h | @dev |
| 7 | FE-05 | Unificar `statusConfig` com tokens `.glow-*` | 2h | @dev |
| 8 | FE-09 | Responsividade mobile do VideoDrawer | 2h | @dev |
| 9 | SYS-04 | Otimizar `next.config.ts` | 2h | @dev |

---

### 🔵 Sprint 3 — Performance e Excelência (~19h)

| Ordem | ID | Ação | Horas | Responsável |
|-------|----|------|-------|-------------|
| 1 | DB-09 | Índice composto `canais(user_id, mare_status)` | 0.5h | @data-engineer |
| 2 | DB-05 | Migrar RLS de subquery `IN` para `EXISTS` | 4h | @data-engineer |
| 3 | FE-06 | Criar `<ErrorState>` atom + tratar erros de API visualmente | 3h | @dev |
| 4 | FE-07 | Criar atoms `<LoadingState>` e `<EmptyState>` | 2h | @dev |
| 5 | OBS-01 | Integrar Sentry para error tracking em runtime | 4h | @devops + @dev |
| 6 | TEST-01 | Estrutura inicial de testes (unit + integration básicos) | Alto | @qa + @dev |
| 7 | SYS-01/02 | Renomear `temp-app` + limpar arquivos soltos na raiz | 0.5h | @dev |
| 8 | DB-06 | Índice GIN em `videos(tags)` *(somente se queries implementadas)* | 1h | @data-engineer |

---

## 5. Sumário por Volume e Esforço

### Volume de débitos por categoria:

| Área | 🔴 P0 | 🟡 P1/P2 | 🔵 P3 | Total |
|------|-------|----------|-------|-------|
| Sistema | 0 | 2+1 | 3 | **5** |
| Database | 3 | 4+3 | 0 | **10** |
| Frontend/UX | 4 | 3+2 | 0 | **9** |
| API | 1 | 0 | 0 | **1** |
| Observabilidade | 0 | 1 | 0 | **1** |
| Qualidade | 0 | 1 | 0 | **1** |
| **TOTAL** | **8** | **13** | **5** | **26** |

### Estimativa financeira:

| Sprint | Horas | Custo (R$150/h) |
|--------|-------|-----------------|
| Sprint 1 (P0) | ~20h | ~R$ 3.000 |
| Sprint 2 (P1) | ~22h | ~R$ 3.300 |
| Sprint 3 (P2/P3) | ~19h | ~R$ 2.850 |
| **TOTAL** | **~61h** | **~R$ 9.150** |

---

## 6. Critérios de Aceite (Quick Reference)

| ID | Critério Verificável |
|----|---------------------|
| BUG-01 | Botão "Agendar" desabilitado sem áudio + thumb aprovados |
| DB-08 | `pg_proc.proconfig` inclui `search_path=public` para `handle_new_user` |
| DB-01 | `EXPLAIN` em `api_keys WHERE user_id = $1` usa Index Scan |
| DB-07 | Coluna `youtube_access_token` inexistente; `_enc` contém valor cifrado |
| FE-01 | `VideoDrawer.tsx` < 100 linhas; `tabs/` contém 5 subcomponentes |
| FE-03 | `axe-cli` retorna 0 violações para `role=dialog` no VideoDrawer |
| API-01 | Todos os endpoints `/api/` documentados com validação de ownership |
| SYS-05 | `database.types.ts` regenerado pós-Sprint 1 sem erros TypeScript |

---

## 7. Referências Técnicas Geradas

| Documento | Conteúdo | Fase |
|-----------|----------|------|
| `docs/prd/technical-debt-DRAFT.md` | Draft inicial — 18 débitos | Fase 4 |
| `docs/reviews/db-specialist-review.md` | Validação + script de migration DB | Fase 5 |
| `docs/reviews/ux-specialist-review.md` | Validação + arquitetura decomposição UX | Fase 6 |
| `docs/reviews/qa-review.md` | Gate decision + riscos cruzados + gaps | Fase 7 |
| **`docs/prd/technical-debt-assessment.md`** | **Este documento — Assessment Final** | **Fase 8** |

---

*Este documento é o Assessment Final do Brownfield Discovery do projeto Produtora (AD_LABS).*
*Aprovado por: @architect (Aria), @data-engineer (Dara), @ux-design-expert (Uma), @qa (Quinn).*
*Próxima fase: Fase 9 — Executive Awareness Report e Fase 10 — Planning (Epic + User Stories).*
