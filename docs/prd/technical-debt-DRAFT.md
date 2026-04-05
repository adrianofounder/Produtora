# Technical Debt Assessment — DRAFT
**Projeto:** Produtora (AD_LABS)
**Data:** 2026-04-05
**Fase:** 4 — Consolidação Inicial (DRAFT para Revisão dos Especialistas)
**Gerado por:** @architect (Aria)
**Status:** ⚠️ DRAFT — PENDENTE revisão de @data-engineer e @ux-design-expert

---

## 1. Débitos de Sistema
> Fonte: `docs/architecture/system-architecture.md`
> Validado por: @architect ✅

| ID | Débito | Área | Impacto | Esforço |
|----|--------|------|---------|---------|
| SYS-01 | Projeto nomeado como `"temp-app"` no `package.json` | Infra/Meta | Baixo | ⚡ Trivial |
| SYS-02 | Arquivos de texto soltos na raiz (`workmeu`, `veterano.txt`, etc.) | Organização | Baixo | ⚡ Trivial |
| SYS-03 | Volume massivo de erros de linting pendentes (`lint-out.txt`) | Qualidade | Alto | 🧪 Médio |
| SYS-04 | `next.config.ts` vazio — sem otimizações de build/imagem configuradas | Performance | Médio | 🧪 Médio |
| SYS-05 | `database.types.ts` pode estar desatualizado em relação ao schema real | Type Safety | Alto | 🧪 Médio |

---

## 2. Débitos de Database
> Fonte: `supabase/docs/DB-AUDIT.md` + `supabase/docs/SCHEMA.md`
> ⚠️ PENDENTE: Revisão e validação por @data-engineer

| ID | Débito | Área | Impacto | Esforço | Prioridade @Dara |
|----|--------|------|---------|---------|------------------|
| DB-01 | Índice ausente em `api_keys(user_id)` — degrada RLS em escala | Performance/Segurança | 🔴 Crítico | ⚡ Baixo | P0 |
| DB-02 | Trigger de `updated_at` ausente em `profiles` e `api_keys` | Auditória | 🟡 Médio | ⚡ Baixo | P1 |
| DB-03 | Coluna `updated_at` ausente em `alertas` | Auditória | 🟡 Médio | 🧪 Médio | P1 |
| DB-04 | Índice ausente em `alertas(canal_id)` — lentidão em listagens | Performance | 🟡 Médio | ⚡ Baixo | P1 |
| DB-05 | RLS de `eixos` e `blueprints` usa subquery `IN (SELECT ...)` | Performance/Escala | 🔵 Baixo | 🧪 Médio | P3 |
| DB-06 | Índice GIN ausente em `videos(tags)` — para filtragem | Performance | 🔵 Baixo | 🧪 Médio | P2 |

---

## 3. Débitos de Frontend/UX
> Fonte: `docs/frontend/frontend-spec.md`
> ⚠️ PENDENTE: Revisão e validação por @ux-design-expert

| ID | Débito | Área | Impacto | Esforço | Prioridade @Uma |
|----|--------|------|---------|---------|-----------------|
| FE-01 | `VideoDrawer.tsx` +400 linhas gerenciando múltiplas responsabilidades | Manutenibilidade | 🔴 Crítico | 🏗️ Alto | P0 |
| FE-02 | Estilização hardcoded via `style={{ }}` ignorando tokens do Design System | Consistência/Manutenção | 🔴 Crítico | 🧪 Médio | P0 |
| FE-03 | Ausência completa de ARIA e suporte a teclado em modais e drawers | Acessibilidade | 🔴 Crítico | 🧪 Médio | P0 |
| FE-04 | Uso misto de `btn-primary` e estilização ad-hoc nos botões | Consistência | 🟡 Médio | 🧪 Médio | P1 |
| FE-05 | Lógica de cores/labels de status de vídeo duplicada no `VideoCard` | DRY / Manutenção | 🟡 Médio | ⚡ Baixo | P1 |
| FE-06 | Estados de erro de IA sem tratamento visual adequado | UX | 🟡 Médio | 🧪 Médio | P2 |
| FE-07 | Skeletons/spinners de loading não centralizados | UX / Loading | 🟡 Médio | ⚡ Baixo | P2 |

---

## 4. Matriz Preliminar de Priorização

> ⚠️ Prioridades sujeitas a revisão pelos especialistas nas Fases 5 e 6.

| ID | Débito | Área | Impacto | Esforço | Prioridade Preliminar |
|----|--------|------|---------|---------|----------------------|
| DB-01 | Índice `api_keys(user_id)` | DB | 🔴 Crítico | ⚡ Baixo | **P0** |
| FE-01 | Refatorar `VideoDrawer.tsx` | Frontend | 🔴 Crítico | 🏗️ Alto | **P0** |
| FE-02 | Eliminar `style={{}}` hardcoded | Frontend | 🔴 Crítico | 🧪 Médio | **P0** |
| FE-03 | Implementar ARIA / a11y | Frontend | 🔴 Crítico | 🧪 Médio | **P0** |
| SYS-03 | Resolver erros de Linting | Sistema | 🟡 Alto | 🧪 Médio | **P1** |
| SYS-05 | Sincronizar `database.types.ts` | Sistema | 🟡 Alto | 🧪 Médio | **P1** |
| DB-02 | Triggers `updated_at` faltantes | DB | 🟡 Médio | ⚡ Baixo | **P1** |
| DB-03 | Adicionar `updated_at` em `alertas` | DB | 🟡 Médio | 🧪 Médio | **P1** |
| DB-04 | Índice `alertas(canal_id)` | DB | 🟡 Médio | ⚡ Baixo | **P1** |
| FE-04 | Unificar variantes de botão | Frontend | 🟡 Médio | 🧪 Médio | **P1** |
| FE-05 | Centralizar lógica de status de vídeo | Frontend | 🟡 Médio | ⚡ Baixo | **P1** |
| SYS-04 | Otimizar `next.config.ts` | Sistema | 🟡 Médio | 🧪 Médio | **P2** |
| FE-06 | Tratar erros de IA visualmente | Frontend | 🟡 Médio | 🧪 Médio | **P2** |
| FE-07 | Centralizar Skeletons/Spinners | Frontend | 🟡 Médio | ⚡ Baixo | **P2** |
| DB-06 | Índice GIN em `videos(tags)` | DB | 🔵 Baixo | 🧪 Médio | **P2** |
| DB-05 | Migrar RLS de subquery p/ EXISTS | DB | 🔵 Baixo | 🧪 Médio | **P3** |
| SYS-01 | Renomear projeto de `temp-app` | Sistema | 🔵 Baixo | ⚡ Trivial | **P3** |
| SYS-02 | Limpar arquivos temporários da raiz | Sistema | 🔵 Baixo | ⚡ Trivial | **P3** |

---

## 5. Perguntas para Especialistas

### Para @data-engineer (Dara):

1. **DB-01 (Crítico):** O índice em `api_keys(user_id)` deve ser `BTREE` padrão ou há argumento para outro tipo? Existe risco de downtime ao aplicar a migration em produção?
2. **DB-05 (RLS Subquery):** Qual é a melhor estratégia de migração para os RLS de `eixos` e `blueprints`? Adicionar `user_id` como denormalização ou migrar a subquery para `EXISTS`? Qual o impacto em policies existentes?
3. **DB-06 (GIN Tags):** O filtro por `tags` em `videos` já está sendo usado em queries de produção? Isso confirma a prioridade P2 ou deveria ser P1?
4. **Geral:** Existe algum débito de dados que a análise estática **não conseguiu capturar** e que você identificou operacionalmente (ex: dados com integridade corrompida, migration pendente, etc.)?

### Para @ux-design-expert (Uma):

1. **FE-01 (VideoDrawer):** Qual é o critério de decomposição recomendado? Por **aba** (Ideia, Roteiro, Narração) ou por **responsabilidade** (estado de API, estado de UI, navegação)? Isso impacta o esforço de P0.
2. **FE-02 (Hardcoded Styles):** A eliminação dos `style={{}}` deve ser feita como uma refatoração separada ou **integrada** à decomposição do `VideoDrawer`? Existe risco de regressão visual?
3. **FE-03 (a11y):** Qual é o nível de conformidade alvo? WCAG 2.1 AA? Existe alguma prioridade de componente (modais vs drawers vs botões)?
4. **FE-04 (Botões Inconsistentes):** A unificação deve ser feita via `shadcn/ui` variants ou mantendo o sistema atual de `btn-primary` com pequenos ajustes?
5. **Geral:** Existem outros débitos de UX não listados, como responsividade mobile, estados vazios (empty states), ou fluxos não mapeados?

---

## 6. Resumo do Volume de Débitos

| Área | Crítico 🔴 | Médio 🟡 | Baixo 🔵 | Total |
|------|-----------|---------|---------|-------|
| Sistema | 0 | 2 | 3 | **5** |
| Database | 1 | 3 | 2 | **6** |
| Frontend/UX | 3 | 4 | 0 | **7** |
| **TOTAL** | **4** | **9** | **5** | **18** |

---

*Este documento é um DRAFT preliminar gerado automaticamente pelo @architect na Fase 4 do Brownfield Discovery.*
*Aguarda validação pelos especialistas (@data-engineer na Fase 5, @ux-design-expert na Fase 6, @qa na Fase 7) antes de ser promovido a Assessment Final.*
