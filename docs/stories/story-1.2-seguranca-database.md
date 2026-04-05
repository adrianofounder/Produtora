# Story 1.2 — Hardening de Segurança no Database

**Story ID:** 1.2
**Epic:** EPIC-01 — Resolução de Débitos Técnicos
**Sprint:** 1 — Segurança & Bloqueadores
**Prioridade:** 🔴 P0 — Crítico
**Estimativa:** 1h
**Assignee:** @dev + @data-engineer

---

## User Story

**Como** engenheiro responsável pelo sistema,
**Quero** que as funções de banco de dados e índices de segurança estejam corretamente configurados,
**Para que** o sistema seja protegido contra privilege escalation e degradação de performance em RLS.

---

## Contexto / Problema

**DB-08:** A função `handle_new_user()` usa `SECURITY DEFINER` sem `SET search_path = public`. Em PostgreSQL, isso significa que a função executa com privilégios do owner mas sem search_path fixo — vetor de privilege escalation se um objeto com nome igual existir em outro schema.

**DB-01:** A tabela `api_keys` não possui índice em `user_id`. Como toda query de RLS filtra por `user_id`, isso causa table scan completo a cada verificação de segurança por linha — degrada progressivamente com crescimento de dados.

---

## Acceptance Criteria

- [ ] **AC1 (DB-08):** A função `handle_new_user()` possui `SET search_path = public` como parâmetro de segurança
- [ ] **AC2 (DB-08):** Novos usuários ainda são criados corretamente via trigger `on_auth_user_created`
- [ ] **AC3 (DB-01):** O índice `idx_api_keys_user_id` existe na tabela `api_keys`
- [ ] **AC4 (DB-01):** `EXPLAIN` numa query `SELECT * FROM api_keys WHERE user_id = $1` utiliza Index Scan (não Seq Scan)

---

## Tasks

- [ ] **T1:** Aplicar fix no `handle_new_user()`:
  ```sql
  CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER AS $$
  BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (NEW.id, NEW.email,
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'avatar_url');
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
  ```
- [ ] **T2:** Criar índice concurrently (sem downtime):
  ```sql
  CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_api_keys_user_id
    ON public.api_keys(user_id);
  ```
  > ⚠️ Executar FORA de transaction block — CONCURRENTLY falha dentro de BEGIN/COMMIT
- [ ] **T3:** Validar que `pg_proc.proconfig` contém `{search_path=public}` para `handle_new_user`
- [ ] **T4:** Executar `EXPLAIN ANALYZE` para confirmar uso de Index Scan

---

## Testes Requeridos

```sql
-- Verificar search_path fixado
SELECT proname, proconfig FROM pg_proc WHERE proname = 'handle_new_user';
-- Expected: proconfig = {search_path=public}

-- Verificar index criado
SELECT indexname FROM pg_indexes
  WHERE tablename = 'api_keys' AND indexname = 'idx_api_keys_user_id';

-- Verificar uso do index
EXPLAIN SELECT * FROM api_keys WHERE user_id = 'uuid-qualquer';
-- Expected: Index Scan using idx_api_keys_user_id
```

---

## Definition of Done

- [ ] Migration aplicada com sucesso no ambiente de produção
- [ ] Nenhum downtime durante aplicação do índice (`CONCURRENTLY`)
- [ ] Signup de novos usuários funcionando normalmente após o fix
- [ ] @qa validou os testes SQL acima

---

*Story criada por @pm (Morgan) — EPIC-01, Sprint 1*
