---
executor: "@data-engineer"
quality_gate: "@dev"
quality_gate_tools: [schema_validation, rls_policy_review, migration_test, tenant_isolation_check]
epic: "EPIC-04"
story: "4.1"
sprint: 8
status: "Draft"
---

# Story 4.1 — Modelo de Dados e RLS do Laboratório

## Como Desenvolvedor @data-engineer, quero…
…expandir o schema existente da tabela `eixos` com os campos completos do DNA Temático e criar a tabela `ideias`, com todas as políticas RLS do padrão multi-tenant do projeto, para que o Laboratório tenha uma base de dados real, isolada por tenant e pronta para consumo pela UI.

---

## Contexto do Sistema Existente

> **[Source: docs/schema.sql]**

- A tabela `public.eixos` **já existe** no banco com alguns campos básicos (`nome`, `status`, `score_mare`, `views_acumuladas`, etc.) ligados a `canal_id → canais.id`.
- O padrão de RLS do projeto usa **indireção via canal**: `canal_id IN (SELECT id FROM public.canais WHERE user_id = auth.uid())` — não usa `tenant_id` diretamente.
- A tabela `public.videos` tem o campo `eixo TEXT` (texto livre). A Story 4.2 poderá ligar ideias a vídeos via FK.
- Triggers de `updated_at` já existem para `eixos` e são reutilizáveis.
- Extensões `uuid-ossp` e `pgcrypto` já estão ativas.

---

## Critérios de Aceitação

### AC1 — Tabela `eixos` expandida com os campos do DNA Temático

A migration deve adicionar as colunas faltantes à tabela existente via `ALTER TABLE`, sem recriar a tabela (preservando dados):

```sql
-- Campos de Identidade (já existem parcialmente)
ALTER TABLE public.eixos
  ADD COLUMN IF NOT EXISTS demografia TEXT,
  ADD COLUMN IF NOT EXISTS emocao TEXT,
  ADD COLUMN IF NOT EXISTS gatilho TEXT,

  -- Dramaturgia
  ADD COLUMN IF NOT EXISTS protagonista TEXT,
  ADD COLUMN IF NOT EXISTS antagonista TEXT,
  ADD COLUMN IF NOT EXISTS conflito TEXT,
  ADD COLUMN IF NOT EXISTS hook TEXT,

  -- Comercial (SEO) — alguns já existem com nomes diferentes
  -- score_retencao → renomear para retencao_est ou manter ambos
  ADD COLUMN IF NOT EXISTS safewords TEXT[],

  -- Fábrica
  ADD COLUMN IF NOT EXISTS cores_thumb TEXT[],  -- versão array (cores_thumb TEXT já existe)

  -- Analytics (Motor Marés — Story 4.3)
  ADD COLUMN IF NOT EXISTS score_mare_anterior NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS score_calculado_em TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS views_7d BIGINT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ctr NUMERIC(5,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS retencao NUMERIC(5,2) DEFAULT 0,

  -- Auditoria
  ADD COLUMN IF NOT EXISTS media_views BIGINT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS taxa_aprovacao NUMERIC(5,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS videos_count INT DEFAULT 0;
```

> **ATENÇÃO @data-engineer:** Verificar conflito de nomes com colunas existentes (`taxa_concorrencia`, `score_retencao`, `cores_thumb`). Preferir `ADD COLUMN IF NOT EXISTS` para segurança. Documentar mapeamento entre nome antigo e novo.

### AC2 — Nova tabela `ideias` criada

```sql
CREATE TABLE IF NOT EXISTS public.ideias (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  canal_id      UUID REFERENCES public.canais(id) ON DELETE CASCADE NOT NULL,
  eixo_id       UUID REFERENCES public.eixos(id) ON DELETE CASCADE NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),

  titulo        TEXT NOT NULL,
  premissa      TEXT,
  nota_ia       NUMERIC(4,2) CHECK (nota_ia BETWEEN 0 AND 10),
  tags          TEXT[],
  status        TEXT NOT NULL DEFAULT 'pendente'
                  CHECK (status IN ('pendente', 'fabrica', 'planejamento', 'publicado')),

  -- Auditoria (NFR06)
  origem        TEXT NOT NULL DEFAULT 'Humano'
                  CHECK (origem IN ('Humano', '[Automação Lvl 3]')),
  origem_uuid   UUID REFERENCES auth.users(id)  -- NULL se automação
);
```

### AC3 — RLS da tabela `ideias` configurada (padrão do projeto)

```sql
ALTER TABLE public.ideias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ideias_own" ON public.ideias FOR ALL
  USING (canal_id IN (SELECT id FROM public.canais WHERE user_id = auth.uid()));
```

> A tabela `eixos` já possui a policy `"eixos_own"` — apenas verificar que cobre INSERT/UPDATE/DELETE além de SELECT.

### AC4 — Trigger `updated_at` para `ideias`

```sql
CREATE TRIGGER set_ideias_updated_at BEFORE UPDATE ON public.ideias
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
```

### AC5 — Índices de performance para `ideias`

```sql
CREATE INDEX IF NOT EXISTS idx_ideias_canal_id ON public.ideias(canal_id);
CREATE INDEX IF NOT EXISTS idx_ideias_eixo_id  ON public.ideias(eixo_id);
CREATE INDEX IF NOT EXISTS idx_ideias_status   ON public.ideias(status);
```

### AC6 — Tipos TypeScript atualizados

- Arquivo `src/types/database.ts` (ou equivalente gerado pelo Supabase) deve refletir os tipos `Eixo` e `Ideia` derivados do schema atualizado.
- Executar `npx supabase gen types typescript` ou atualizar manualmente o tipo conforme o padrão do projeto.

### AC7 — Seed de desenvolvimento atualizado

- `supabase/seed.sql` atualizado com ao menos **3 eixos** (um em cada status: `testando`, `aguardando`, `venceu`) e **7 ideias** distribuídas entre os eixos, cobrindo todos os status possíveis (`pendente`, `fabrica`, `planejamento`, `publicado`).
- Dados do seed devem espelhar os dados mock existentes na UI do Laboratório.

---

## Arquivos a Criar/Modificar

| Arquivo | Ação |
|---------|------|
| `supabase/migrations/{timestamp}_expand_eixos_create_ideias.sql` | CRIAR |
| `src/types/database.ts` (ou `src/lib/database.types.ts`) | MODIFICAR |
| `supabase/seed.sql` | MODIFICAR |

---

## Dev Notes

### Padrão de RLS do Projeto (CRÍTICO)
> **[Source: docs/schema.sql — Seção ROW LEVEL SECURITY]**

O projeto NÃO usa `tenant_id` diretamente nas tabelas filhas. A indireção é via `canais`:
```sql
-- Padrão CORRETO para tabelas ligadas a canais:
USING (canal_id IN (SELECT id FROM public.canais WHERE user_id = auth.uid()))

-- Padrão ERRADO (não usar):
USING (user_id = auth.uid())
```

### Colunas Existentes vs. Novas (Mapeamento de Conflitos)

| Campo no Briefing PM | Campo Real no Banco | Ação |
|---------------------|---------------------|------|
| `emocao` | `sentimento_dominante` | Usar `sentimento_dominante` existente OU adicionar `emocao` como alias |
| `gatilho` | `gatilho_curiosidade` | Usar `gatilho_curiosidade` existente |
| `concorrencia` | `taxa_concorrencia` | Usar `taxa_concorrencia` existente (já tem CHECK) |
| `retencao_est` | `score_retencao` | Usar `score_retencao` existente |
| `elemento_ancora` | `elemento_visual` | Usar `elemento_visual` existente |
| `cores_thumb (TEXT[])` | `cores_thumb TEXT` | Converter para array OU adicionar `cores_thumb_array` |

**Decisão:** Preferir reutilizar os campos existentes com os nomes já estabelecidos. Adicionar apenas os campos genuinamente novos.

### Campos Genuinamente Novos (não existem ainda)
- `media_views`, `taxa_aprovacao`, `videos_count` — Analytics agregados
- `score_mare_anterior` — Para cálculo de direção no Motor Marés (Story 4.3)
- `score_calculado_em` — Cache timestamp (Story 4.3)
- `views_7d`, `ctr`, `retencao` — KPIs inline do TrendAnalysis (Story 4.3)
- `safewords` — DNA Temático (está faltando)

### Observação sobre `ideias.canal_id`
A tabela `ideias` deve ter `canal_id` (não `user_id`) para seguir o padrão de RLS por indireção do projeto. A FK em `eixos.canal_id` garante consistência implícita.

---

## Tasks / Subtasks

- [ ] **Task 1 (AC1):** Criar migration `ALTER TABLE public.eixos ADD COLUMN IF NOT EXISTS ...` para adicionar apenas os campos genuinamente novos (ver mapeamento de conflitos acima). Verificar com `\d public.eixos` antes de aplicar.
- [ ] **Task 2 (AC2):** Criar `CREATE TABLE IF NOT EXISTS public.ideias (...)` na mesma migration.
- [ ] **Task 3 (AC3):** Adicionar `ALTER TABLE public.ideias ENABLE ROW LEVEL SECURITY` + policy `"ideias_own"` usando o padrão de indireção via `canal_id`.
- [ ] **Task 4 (AC4):** Registrar trigger `set_ideias_updated_at` reutilizando a function `public.set_updated_at()` já existente.
- [ ] **Task 5 (AC5):** Criar índices para `ideias` (`canal_id`, `eixo_id`, `status`).
- [ ] **Task 6 (AC3 — verificação):** Confirmar que a policy `"eixos_own"` cobre `INSERT`, `UPDATE`, `DELETE` além de `SELECT`. Se não cobrir, adicionar policies específicas.
- [ ] **Task 7 (AC6):** Atualizar / regenerar `src/types/database.ts` com os tipos de `Eixo` expandido e `Ideia`.
- [ ] **Task 8 (AC7):** Atualizar `supabase/seed.sql` com 3 eixos e 7 ideias cobrindo todos os status possíveis.
- [ ] **Task 9 (Verificação):** Executar `npm run build` para confirmar que os tipos TypeScript não introduzem erros de compilação.

---

## 🤖 CodeRabbit Integration

### Story Type Analysis
- **Primary Type:** Database
- **Secondary Type:** Security (RLS multi-tenant)
- **Complexity:** High — altera tabela existente com dados, cria nova tabela, envolve políticas de segurança críticas.

### Specialized Agent Assignment
- **Primary Agents:** `@data-engineer` (migration e schema), `@dev` (revisão de tipos TS)
- **Quality Gate:** `@dev` valida que a migration é idempotente (`IF NOT EXISTS` em tudo) e que os tipos TS compilam.

### Quality Gate Tasks
- [ ] **Pre-Commit (@dev):** Revisar migration — confirmar `IF NOT EXISTS` em todo statement, sem DROP de colunas existentes.
- [ ] **Pre-Commit (@dev):** `npm run build` sem erros após atualização dos tipos.
- [ ] **Pre-Migration (manual):** Executar em ambiente de desenvolvimento antes de aplicar em produção.

### CodeRabbit Focus Areas
**Primary Focus:**
- RLS: verificar que a policy usa o padrão correto de indireção (`canal_id IN (SELECT ...)`) — não `user_id` direto.
- Migration idempotente: `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` em todos os campos.
- Trigger `updated_at` registrado para `ideias`.

**Secondary Focus:**
- Índices criados nas FKs de `ideias` (`canal_id`, `eixo_id`, `status`).
- Seed refletindo todos os status possíveis (`pendente`, `fabrica`, `planejamento`, `publicado`).
- Tipos TypeScript sem regressão.

---

## Definition of Done

- [ ] Migration executada com sucesso em ambiente de desenvolvimento sem erros
- [ ] Tabela `eixos` expandida com novos campos — sem perda de dados existentes
- [ ] Tabela `ideias` criada com FK, RLS e trigger corretos
- [ ] RLS testada: usuário logado só vê dados do próprio canal (`canal_id` correto)
- [ ] Tentativa de acesso cross-tenant bloqueada pela policy
- [ ] Tipos TypeScript atualizados e `npm run build` passando sem erros
- [ ] Seed com 3 eixos e 7 ideias funcionando em dev
- [ ] Code review de `@dev` aprovado

---
---
*Story gerada por @sm (River) · Sprint 8 · EPIC-04.*

## QA Results (@quinn)

### Gate Decision: ✅ PASS

A Story 4.1 foi validada com foco em integridade de dados e isolamento multi-tenant (NFR03).

#### Verificações Realizadas:
- **Migration Validation:** A migration foi aplicada com sucesso após correção de erro de sintaxe.
- **Tenant Isolation (RLS):** Testes confirmaram que o `Maestro AD` (User A) não consegue ler, inserir ou modificar dados do `Tenant B`.
- **NFR06 (Auditoria):** Validado que registros gerados por automação (`[Automação Lvl 3]`) aceitam `origem_uuid` como NULL.
- **Schema Integrity:** Verificado que a tabela `ideias` e as novas colunas de `eixos` estão corretamente tipadas e presentes.

#### Observações Técnicas:
- Foi identificado e corrigido um erro de sintaxe na migration: `CREATE POLICY IF NOT EXISTS` não é suportado pelo PostgreSQL 17. Alterado para o padrão `DROP POLICY IF EXISTS`.
- O isolamento RLS por indireção via `canal_id` está operando conforme a NFR03.

*Validado por @quinn em 2026-04-19.*
