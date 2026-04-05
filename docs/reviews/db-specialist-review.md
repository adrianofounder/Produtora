# Database Specialist Review
**Projeto:** Produtora (AD_LABS)
**Data:** 2026-04-05
**Reviewer:** Dara (Sage) — @data-engineer
**Fase:** 5 — Validação: Database
**Referência:** `docs/prd/technical-debt-DRAFT.md`
**Schema analisado:** `docs/schema.sql` (análise estática linha a linha)

---

## Gate Status: ✅ APPROVED com ressalvas críticas

O DRAFT capturou os débitos mais visíveis. No entanto, **2 débitos de segurança críticos não foram identificados** pela análise estática e precisam ser adicionados antes de seguir para o Assessment Final.

---

## 1. Débitos Validados

| ID | Débito | Severidade | Status | Ajuste | Horas | Prioridade Final |
|----|--------|------------|--------|--------|-------|-----------------|
| DB-01 | Índice ausente em `api_keys(user_id)` | 🔴 Crítico | ✅ Confirmado | — | 0.5h | **P0** |
| DB-02 | Trigger `updated_at` ausente em `profiles` | 🟡 Médio | ⚠️ Ajustado | Coluna existe, falta o trigger | 1h | **P1** |
| DB-02b | Trigger `updated_at` ausente em `api_keys` | 🟡 Médio | ⚠️ Ajustado | Coluna existe, falta o trigger | 0.5h | **P1** |
| DB-03 | Coluna `updated_at` ausente em `alertas` | 🟡 Médio | ✅ Confirmado | Coluna E trigger faltam | 1h | **P1** |
| DB-04 | Índice ausente em `alertas(canal_id)` | 🟡 Médio | ✅ Confirmado | — | 0.5h | **P1** |
| DB-05 | RLS `eixos`/`blueprints` via subquery `IN` | 🟡 Médio | ⬆️ Elevado | Padrão de acesso frequente → P2 | 4h | **P2** *(era P3)* |
| DB-06 | Índice GIN em `videos(tags)` | 🔵 Baixo | ✅ Mantido | ROI só se houver queries `@>` ou `&&` | 1h | **P2** (condicional) |

### Detalhe da correção DB-02:
O DRAFT descreveu incorretamente o débito. Ao analisar `docs/schema.sql`:
- `profiles.updated_at` existe (linha 21) — falta apenas o **trigger** `set_profiles_updated_at`
- `api_keys.updated_at` existe (linha 211) — falta apenas o **trigger** `set_api_keys_updated_at`

O impacto é idêntico (auditoria quebrada), mas o esforço é menor: apenas criar os triggers, sem ALTER TABLE.

---

## 2. Débitos Adicionados (Não Identificados no DRAFT)

### 🔴 DB-07 — OAuth Tokens Armazenados em Texto Plano (CRÍTICO)
> **Localização:** `public.canais`, colunas `youtube_access_token` e `youtube_refresh_token` (schema.sql, linhas 65-67)

A tabela `canais` armazena tokens OAuth do YouTube diretamente como `TEXT NOT NULL`, sem qualquer camada de criptografia em nível de banco. Diferente de `api_keys` que usa `chave_criptografada`, esses tokens ficam expostos:

- Se um admin com service role exportar a tabela, os tokens ficam visíveis
- Em logs de debug, backups, e ferramentas de inspeção do Supabase Dashboard
- Um token de refresh do YouTube válido permite postar vídeos e gerenciar o canal da vítima

**Severidade:** 🔴 Crítico
**Esforço:** 🧪 Médio (migração + criptografia via `pgcrypto` já instalado)
**Prioridade:** **P0**

**Correção recomendada:**
```sql
-- Usar pgcrypto (já instalado) para criptografar tokens
-- Renomear colunas para deixar explícita a criptografia
ALTER TABLE public.canais
  RENAME COLUMN youtube_access_token TO youtube_access_token_enc;
ALTER TABLE public.canais
  RENAME COLUMN youtube_refresh_token TO youtube_refresh_token_enc;

-- Na camada de aplicação: encrypt/decrypt com pgp_sym_encrypt/pgp_sym_decrypt
-- usando chave armazenada em variável de ambiente (Supabase Vault ou env var)
```

---

### 🔴 DB-08 — SECURITY DEFINER sem `SET search_path` (Privilege Escalation Risk)
> **Localização:** Função `public.handle_new_user()` (schema.sql, linhas 25-42)

A função `handle_new_user()` usa `SECURITY DEFINER` sem fixar o `search_path`. Em PostgreSQL, funções `SECURITY DEFINER` executam com os privilégios do owner (tipicamente `postgres`). Se um atacante conseguir criar uma função ou tabela com o mesmo nome em um schema diferente no `search_path`, pode executar código arbitrário com privilégios elevados.

**Severidade:** 🔴 Crítico
**Esforço:** ⚡ Baixo (1 linha de código)
**Prioridade:** **P0**

**Correção:**
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public; -- ← CORREÇÃO
```

---

### 🟡 DB-09 — `canais` sem índice em `user_id` para campo `mare_status` (Query Pattern)
> Existe `idx_canais_user_id`, mas consultas frequentes do dashboard filtram por `user_id AND mare_status = 'ativa'`. Um índice composto seria mais eficiente para o padrão de acesso real.

**Severidade:** 🟡 Médio
**Esforço:** ⚡ Baixo
**Prioridade:** **P2**

```sql
CREATE INDEX IF NOT EXISTS idx_canais_user_mare
  ON public.canais(user_id, mare_status);
```

---

## 3. Estimativas de Esforço Revisadas

| ID | Ação | Horas Estimadas | Complexidade |
|----|------|-----------------|--------------|
| DB-01 | Criar índice `api_keys(user_id)` | 0.5h | Simples |
| DB-07 | Criptografar tokens OAuth em `canais` | 6h | Complexo (migration + app) |
| DB-08 | Fixar `search_path` em `handle_new_user` | 0.5h | Simples |
| DB-02/b | Criar triggers `updated_at` em `profiles` e `api_keys` | 1h | Simples |
| DB-03 | Adicionar coluna + trigger `updated_at` em `alertas` | 1h | Simples |
| DB-04 | Criar índice `alertas(canal_id)` | 0.5h | Simples |
| DB-05 | Migrar RLS subquery para `EXISTS` ou denormalizar | 4h | Médio |
| DB-06 | Índice GIN em `videos(tags)` | 1h | Simples |
| DB-09 | Índice composto `canais(user_id, mare_status)` | 0.5h | Simples |
| | **TOTAL DB** | **15h** | — |

---

## 4. Respostas ao Architect (Perguntas da Fase 4)

### Pergunta 1: DB-01 — Tipo de índice BTREE ou outro? Risco de downtime?
**Resposta:** BTREE é o correto para `user_id` (UUID com filtros de igualdade `=`). Sem discussão. Quanto ao downtime: **zero risco** com `CREATE INDEX CONCURRENTLY` — o PostgreSQL constrói o índice sem bloquear leituras ou escritas. A migration deve ser:
```sql
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_api_keys_user_id
  ON public.api_keys(user_id);
```
O `CONCURRENTLY` não pode ser usado dentro de uma transaction block — deve ser executado como statement isolado.

### Pergunta 2: DB-05 — Denormalizar `user_id` em `eixos`/`blueprints` ou migrar para EXISTS?
**Resposta:** Recomendo **migrar para EXISTS** sem denormalização. Justificativa:
1. A denormalização cria inconsistência potencial (dois lugares para a mesma informação)
2. A versão com `EXISTS` é tão performática quanto se houver índice em `canais(id, user_id)` (já existe: `idx_canais_user_id`)
3. Solução mais limpa e sem risco de drift de dados

```sql
-- Substituir policy atual de eixos
DROP POLICY "eixos_own" ON public.eixos;
CREATE POLICY "eixos_own" ON public.eixos FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.canais
    WHERE canais.id = eixos.canal_id
      AND canais.user_id = auth.uid()
  ));
```

### Pergunta 3: DB-06 — GIN Tags está em produção? Ajustar prioridade?
**Resposta:** Pela análise estática do schema, `tags TEXT[]` é um campo presente mas sem evidência de queries com operadores de array (`@>`, `&&`, `ANY`). **Manter P2 condicional**: criar o índice apenas quando as queries de filtragem por tags forem implementadas no frontend. Isso evita índice inativo consumindo I/O.

### Pergunta 4: Débito não captado por análise estática?
**Resposta:** Sim — **DB-07 e DB-08** acima. São os dois mais críticos e não apareceriam em auditoria de schema superficial:
- DB-07 requer conhecimento do domínio (OAuth tokens ≠ API keys internas)
- DB-08 requer conhecimento de segurança PostgreSQL (SECURITY DEFINER pitfalls)

---

## 5. Recomendações de Ordem de Resolução (perspectiva DB)

```
Sprint 1 — Segurança (P0):     DB-08 → DB-01 → DB-07
Sprint 2 — Auditoria (P1):     DB-02b → DB-02 → DB-03 → DB-04
Sprint 3 — Performance (P2):   DB-09 → DB-05 → DB-06 (condicional)
```

**Racional:**
- DB-08 primeiro por ser 0.5h e ser um vetor de privilege escalation
- DB-01 antes de DB-07 porque é zero downtime e imediato
- DB-07 requer planejamento de migration e mudanças na camada de aplicação (criptografia end-to-end)
- DB-09 antes de DB-05 por ser mais simples e ter impacto imediato no dashboard

---

## 6. Script de Migration Consolidado (P0 + P1)

```sql
-- ============================================================
-- Migration: brownfield-db-debt-fix-p0-p1.sql
-- Autor: Dara (@data-engineer)
-- Data: 2026-04-05
-- EXECUTAR COM: supabase db execute --file migration.sql
-- ============================================================

-- [DB-08] Fix SECURITY DEFINER search_path (P0) — BREAKING RISK: NONE
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- [DB-01] Index api_keys(user_id) — CONCURRENTLY = zero downtime
-- NOTA: Executar FORA de transaction block
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_api_keys_user_id
  ON public.api_keys(user_id);

-- [DB-02b] Trigger updated_at em api_keys
CREATE TRIGGER set_api_keys_updated_at BEFORE UPDATE ON public.api_keys
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- [DB-02] Trigger updated_at em profiles
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- [DB-03] Coluna + Trigger updated_at em alertas
ALTER TABLE public.alertas
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE TRIGGER set_alertas_updated_at BEFORE UPDATE ON public.alertas
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- [DB-04] Index alertas(canal_id)
CREATE INDEX IF NOT EXISTS idx_alertas_canal_id
  ON public.alertas(canal_id);
```

> ⚠️ **DB-07 (tokens OAuth)** requer migration separada com coordenação da camada de aplicação. Não incluído aqui para evitar quebra de funcionalidade sem deploy simultâneo do frontend.

---

**Documento gerado por:** @data-engineer (Dara)
**Status:** ✅ Completo — pronto para Fase 6 (@ux-design-expert)

*— Dara, arquitetando dados 🗄️*
