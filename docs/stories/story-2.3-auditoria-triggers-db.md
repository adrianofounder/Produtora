# Story 2.3 — Auditoria de Triggers e Índices no Database

**Story ID:** 2.3
**Epic:** EPIC-01 — Resolução de Débitos Técnicos
**Sprint:** 2 — Qualidade & Consistência
**Prioridade:** 🟡 P1
**Estimativa:** 3h
**Assignee:** @data-engineer

---

## User Story

**Como** engenheiro de dados,
**Quero** que todas as tabelas com `updated_at` tenham triggers automáticos de atualização,
**Para que** os registros de auditoria sejam confiáveis e consultas de ordenação por data funcionem corretamente.

---

## Contexto / Problema

- **DB-02:** `profiles.updated_at` existe mas sem trigger `set_profiles_updated_at`
- **DB-02b:** `api_keys.updated_at` existe mas sem trigger `set_api_keys_updated_at`
- **DB-03:** `alertas` não possui a coluna `updated_at` nem trigger
- **DB-04:** `alertas` não possui índice em `canal_id` — queries de listagem de alertas por canal fazem full table scan

---

## Acceptance Criteria

- [x] **AC1:** Trigger `set_profiles_updated_at` existe e atualiza `updated_at` ao editar um perfil
- [x] **AC2:** Trigger `set_api_keys_updated_at` existe e atualiza `updated_at` ao editar uma api_key
- [x] **AC3:** Tabela `alertas` possui coluna `updated_at` com default `NOW()`
- [x] **AC4:** Trigger `set_alertas_updated_at` existe em `alertas`
- [x] **AC5:** Índice `idx_alertas_canal_id` existe na tabela `alertas`

---

## Tasks

- [x] **T1:** Aplicar migration (script validado pelo @data-engineer):
  ```sql
  -- DB-02b: Trigger em api_keys
  CREATE TRIGGER set_api_keys_updated_at BEFORE UPDATE ON public.api_keys
    FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

  -- DB-02: Trigger em profiles
  CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

  -- DB-03: Coluna + Trigger em alertas
  ALTER TABLE public.alertas
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
  CREATE TRIGGER set_alertas_updated_at BEFORE UPDATE ON public.alertas
    FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

  -- DB-04: Índice em alertas(canal_id)
  CREATE INDEX IF NOT EXISTS idx_alertas_canal_id ON public.alertas(canal_id);
  ```
- [x] **T2:** Validar que triggers disparam corretamente (UPDATE em profile e verificar updated_at mudou)
- [x] **T3:** Regenerar `database.types.ts` se a adição de coluna em `alertas` não foi capturada em Story 2.1

---

## Testes Requeridos

```sql
-- Verificar triggers
SELECT trigger_name FROM information_schema.triggers
  WHERE event_object_table IN ('profiles', 'api_keys', 'alertas');
-- Expected: 3 triggers listados

-- Verificar coluna alertas.updated_at
SELECT column_name FROM information_schema.columns
  WHERE table_name = 'alertas' AND column_name = 'updated_at';

-- Verificar índice
SELECT indexname FROM pg_indexes
  WHERE tablename = 'alertas' AND indexname = 'idx_alertas_canal_id';
```

---

## Definition of Done

- [x] Migration aplicada com sucesso
- [x] Todos os 3 triggers verificados como funcionais
- [x] Índice criado e confirmado via `pg_indexes`
- [x] @qa validou testes SQL

---

*Story criada por @pm (Morgan) — EPIC-01, Sprint 2*

---

## Data Engineer Record

### Agent
Dara (Data Engineer)

### Completion Notes
- Script DDL anexado e consolidado num Supabase Snapshot (`20260407025047_story_2_3_triggers.sql`).
- Executei a migration remotamente via `npx supabase db push`.
- Gerei script node ad-hoc para validação dos objetos SQL criados na layer `public`, confirmando triggers em `profiles`, `api_keys` e `alertas`, a coluna `updated_at` na tabela `alertas` e o index em `alertas(canal_id)`.
- Re-gerei o `database.types.ts` via link remoto do Supabase garantindo segurança tipológica da nova coluna na aplicação.

### File List
- `supabase/migrations/20260407025047_story_2_3_triggers.sql`
- `src/lib/database.types.ts`

### Status
Ready for Review

---

## QA Results

### Quality Gate Decision: PASS ✅

#### Rationale
- O script temporário de validação (`test_db.mjs`) rodou de forma efetiva e os objetos reportados no `information_schema.triggers` corresponderam as chaves esperadas (`profiles`, `api_keys`, e `alertas`).
- Além disso, a adição da coluna auditória (`updated_at`) e index em `alertas(canal_id)` reportados pela CLI foram observadas por via das queries `pg_indexes` testadas na base public.
- Foi confirmada a sincronização do Typescript definition object pelo Supabase cli impedindo drift entre schema e código frontend.

#### Auditor
@qa (Quinn)
