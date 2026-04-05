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

- [ ] **AC1:** Trigger `set_profiles_updated_at` existe e atualiza `updated_at` ao editar um perfil
- [ ] **AC2:** Trigger `set_api_keys_updated_at` existe e atualiza `updated_at` ao editar uma api_key
- [ ] **AC3:** Tabela `alertas` possui coluna `updated_at` com default `NOW()`
- [ ] **AC4:** Trigger `set_alertas_updated_at` existe em `alertas`
- [ ] **AC5:** Índice `idx_alertas_canal_id` existe na tabela `alertas`

---

## Tasks

- [ ] **T1:** Aplicar migration (script validado pelo @data-engineer):
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
- [ ] **T2:** Validar que triggers disparam corretamente (UPDATE em profile e verificar updated_at mudou)
- [ ] **T3:** Regenerar `database.types.ts` se a adição de coluna em `alertas` não foi capturada em Story 2.1

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

- [ ] Migration aplicada com sucesso
- [ ] Todos os 3 triggers verificados como funcionais
- [ ] Índice criado e confirmado via `pg_indexes`
- [ ] @qa validou testes SQL

---

*Story criada por @pm (Morgan) — EPIC-01, Sprint 2*
