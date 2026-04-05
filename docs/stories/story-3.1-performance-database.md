# Story 3.1 — Otimização de Performance no Database

**Story ID:** 3.1
**Epic:** EPIC-01 — Resolução de Débitos Técnicos
**Sprint:** 3 — Performance & Excelência
**Prioridade:** 🔵 P2
**Estimativa:** 5.5h
**Assignee:** @data-engineer

---

## User Story

**Como** usuário com múltiplos canais e vídeos,
**Quero** que as consultas ao banco de dados sejam eficientes,
**Para que** o dashboard carregue rapidamente mesmo com muitos dados.

---

## Contexto / Problema

- **DB-05:** Políticas RLS de `eixos` e `blueprints` usam `user_id IN (SELECT id FROM canais WHERE user_id = auth.uid())` — subquery `IN` é menos eficiente que `EXISTS` e pode ser lenta em tabelas maiores
- **DB-09:** Queries frequentes do dashboard filtram `canais` por `user_id AND mare_status = 'ativa'` mas só existe índice simples em `user_id` — índice composto seria mais eficiente
- **DB-06:** Campo `videos.tags` é `TEXT[]` sem índice GIN — executar apenas se queries de filtragem por tags estiverem ativas

---

## Acceptance Criteria

- [ ] **AC1 (DB-05):** Policies RLS de `eixos` e `blueprints` usam `EXISTS` em vez de `IN`
- [ ] **AC2 (DB-09):** Índice composto `canais(user_id, mare_status)` existe
- [ ] **AC3 (DB-09):** Query de listagem de canais ativos usa o índice composto (verificável via EXPLAIN)
- [ ] **AC4 (DB-06):** *(Condicional)* Índice GIN criado apenas se houver queries com operadores `@>` ou `&&` em `videos.tags`

---

## Tasks

- [ ] **T1:** Migrar policy RLS de `eixos`:
  ```sql
  DROP POLICY "eixos_own" ON public.eixos;
  CREATE POLICY "eixos_own" ON public.eixos FOR ALL
    USING (EXISTS (
      SELECT 1 FROM public.canais
      WHERE canais.id = eixos.canal_id
        AND canais.user_id = auth.uid()
    ));
  ```
- [ ] **T2:** Migrar policy RLS de `blueprints` (mesmo padrão)
- [ ] **T3:** Criar índice composto em `canais`:
  ```sql
  CREATE INDEX IF NOT EXISTS idx_canais_user_mare
    ON public.canais(user_id, mare_status);
  ```
- [ ] **T4:** *(Condicional)* Verificar se há queries com `@>` ou `&&` em `videos`. Se sim, criar índice GIN:
  ```sql
  CREATE INDEX IF NOT EXISTS idx_videos_tags_gin ON public.videos USING gin(tags);
  ```
- [ ] **T5:** Executar EXPLAIN em queries de RLS e dashboard para confirmar uso dos novos índices

---

## Definition of Done

- [ ] Policies `EXISTS` aplicadas e funcionando
- [ ] Índice composto criado e confirmado via `pg_indexes`
- [ ] EXPLAIN confirma uso dos novos índices em queries reais
- [ ] @qa validou acceptance criteria

---

*Story criada por @pm (Morgan) — EPIC-01, Sprint 3*
