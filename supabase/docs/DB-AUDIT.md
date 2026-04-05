# Database Audit Report (AD_LABS)

**Data:** 2026-04-05  
**Auditor:** Dara (Sage) — Data Engineer  
**Status:** Auditado via Análise Estática (`docs/schema.sql`)

---

## 🔍 Executive Summary

O schema do AD_LABS demonstra uma maturidade inicial sólida, com RLS (Row Level Security) habilitado em 100% das tabelas e uso consistente de UUIDs. No entanto, foram identificados débitos técnicos críticos em performance de RLS e consistência de auditoria (`updated_at`).

**Pontuação Geral: 82/100**

- **Segurança (RLS)**: 🟢 95% (Habilitado, mas polices de subquery podem ser otimizadas)
- **Integridade**: 🟡 85% (Faltam triggers de `updated_at` em tabelas chave)
- **Performance**: 🔴 65% (Faltam índices em colunas de filtragem de RLS)

---

## 🔴 Critical Issues (Fix Immediately)

### 1. Missing Index on RLS Filter (Performance Risk)
A tabela `api_keys` não possui índice em `user_id`. Como a política de RLS filtra por este campo em TODA consulta, a performance degradará linearmente com o número de usuários.
- **Impacto**: Latência alta em todas as requisições autenticadas que consultam chaves.
- **Correção**: `CREATE INDEX idx_api_keys_user_id ON public.api_keys(user_id);`

---

## ⚠️ Warnings

### 2. Inconsistent Audit Triggers
Enquanto `canais`, `videos`, `eixos` e `blueprints` possuem triggers de `updated_at`, as tabelas `profiles` e `api_keys` não possuem. Além disso, a tabela `alertas` não possui sequer a coluna `updated_at`.
- **Impacto**: Dificuldade em debugar modificações de perfil ou falhas em chaves de API.
- **Correção**: Adicionar triggers e colunas faltantes.

### 3. Subquery RLS Policies (Potential Bottleneck)
As tabelas `eixos` e `blueprints` utilizam `IN (SELECT id FROM canais WHERE user_id = auth.uid())`. Em escala, isso é menos eficiente que um `EXISTS` ou a inclusão direta do `user_id` na tabela (denormalização para segurança).
- **Correção**: Considerar adicionar `user_id` em `eixos` e `blueprints` para filtros flat.

---

## 💡 Recommendations

### 4. Performance Optimizations
- **GIN Index em Tags**: A tabela `videos` usa `tags TEXT[]`. Se houver filtragem frequente por tags no dashboard, é recomendado um índice GIN.
- **Foreign Key Indexing**: O campo `alertas.canal_id` não está indexado, o que pode causar lentidão ao listar alertas de um canal específico.

---

## 📋 Prioritization Matrix

| ID | Ação | Severidade | Esforço | Prioridade |
|----|------|------------|---------|------------|
| DB-01 | Index `api_keys(user_id)` | 🔴 Alta | ⚡ Baixo | P0 |
| DB-02 | Timestamps Trigger em `profiles` e `api_keys` | 🟡 Média | ⚡ Baixo | P1 |
| DB-03 | Adicionar `updated_at` em `alertas` | 🟡 Média | 🧪 Médio | P1 |
| DB-04 | Index GIN em `videos(tags)` | 🔵 Baixa | 🧪 Médio | P2 |
| DB-05 | Migrar RLS de subquery para EXISTS/Flat | 🔵 Baixa | 🧪 Médio | P3 |

---

## 🛠️ Proposed Fix Script (DDL)

```sql
-- Fix P0: Indexes for RLS Performance
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_alertas_canal_id ON public.alertas(canal_id);

-- Fix P1: Consistency Triggers
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

CREATE TRIGGER set_api_keys_updated_at BEFORE UPDATE ON public.api_keys
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Fix P1: Missing columns
ALTER TABLE public.alertas ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
```

— Dara, seu guia na fundação de dados 🗄️
