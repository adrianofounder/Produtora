---
executor: "@data-engineer"
quality_gate: "@dev"
quality_gate_tools: [schema_validation, rls_policy_review, migration_test, tenant_isolation_check]
epic: "EPIC-04"
story: "4.1"
sprint: 8
---

# Story 4.1 — Modelo de Dados e RLS do Laboratório

## Objetivo
Construir a fundação de dados do Laboratório no Supabase: criar as tabelas `eixos` (com os 20 campos do DNA Temático) e `ideias`, configurar políticas de Row Level Security (RLS) multi-tenant rigorosas, e garantir consistência referencial com o módulo de `videos` (Kanban de Canais).

---

## Contexto do Sistema Existente

- **Banco atual:** Supabase PostgreSQL com tabelas `canais`, `videos`, `api_credentials` (EPIC-03).
- **RLS padrão do projeto:** Todas as tabelas filtram por `tenant_id = auth.uid()` via policy `USING`.
- **Referência do schema:** `docs/schema.sql` + `docs/stories/EPIC-04-LABORATORIO-BACKEND.md`.
- **Doutrina crítica:** `docs/epic-4-laboratorio.md` — Seção "Ficha Técnica do Eixo (O DNA de 20 Campos)".

---

## Critérios de Aceitação

### AC1 — Tabela `eixos` criada

```sql
CREATE TABLE eixos (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),

  -- Identidade
  nome          TEXT NOT NULL,
  premissa      TEXT,
  demografia    TEXT,
  emocao        TEXT,
  gatilho       TEXT,

  -- Dramaturgia
  protagonista  TEXT,
  antagonista   TEXT,
  conflito      TEXT,
  payoff        TEXT,
  hook          TEXT,

  -- Comercial (SEO)
  concorrencia  TEXT CHECK (concorrencia IN ('Alta', 'Media', 'Baixa')),
  retencao_est  NUMERIC(5,2),   -- % estimada de retenção
  rpm_estimado  NUMERIC(8,2),   -- RPM estimado em R$
  safewords     TEXT[],         -- tags de tabu/safewords

  -- Fábrica
  cores_thumb   TEXT[],         -- palette de cores da thumbnail
  elemento_ancora TEXT,
  duracao_max   INT,            -- duração máxima em segundos

  -- Analytics (Motor Marés)
  score_mare    INT DEFAULT 0 CHECK (score_mare BETWEEN 0 AND 100),
  status        TEXT NOT NULL DEFAULT 'testando'
                  CHECK (status IN ('testando', 'aguardando', 'venceu')),
  videos_count  INT DEFAULT 0,
  media_views   BIGINT DEFAULT 0,
  taxa_aprovacao NUMERIC(5,2) DEFAULT 0
);
```

### AC2 — Tabela `ideias` criada

```sql
CREATE TABLE ideias (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  eixo_id       UUID NOT NULL REFERENCES eixos(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),

  titulo        TEXT NOT NULL,
  premissa      TEXT,
  nota_ia       NUMERIC(4,2) CHECK (nota_ia BETWEEN 0 AND 10),
  tags          TEXT[],
  status        TEXT NOT NULL DEFAULT 'pendente'
                  CHECK (status IN ('pendente', 'fabrica', 'planejamento', 'publicado')),

  -- Auditoria
  origem        TEXT DEFAULT 'Humano', -- ou '[Automação Lvl 3]'
  origem_uuid   UUID              -- UUID do usuário autenticado ou NULL se automação
);
```

### AC3 — Políticas RLS configuradas (NFR03)

- `eixos` e `ideias` possuem políticas `SELECT`, `INSERT`, `UPDATE`, `DELETE` filtrando `tenant_id = auth.uid()`.
- Policy de SELECT: `USING (tenant_id = auth.uid())`
- Policy de INSERT: `WITH CHECK (tenant_id = auth.uid())`
- RLS habilitado com `ALTER TABLE eixos ENABLE ROW LEVEL SECURITY`.

### AC4 — Consistência referencial

- Coluna `eixo_id` em `ideias` é FK para `eixos.id` com `ON DELETE CASCADE`.
- `tenant_id` de `ideias` DEVE ser igual ao `tenant_id` do `eixo` pai (validar via trigger ou check constraint).

### AC5 — Tipos TypeScript atualizados

- Arquivo `src/types/database.ts` (ou equivalente) atualizado com os tipos `Eixo` e `Ideia` derivados do schema.

### AC6 — Seed de desenvolvimento

- Script `supabase/seed.sql` atualizado com ao menos 3 eixos e 7 ideias por tenant de teste, refletindo os dados mock antigos da UI.

---

## Arquivos a Criar/Modificar

| Arquivo | Ação |
|---------|------|
| `supabase/migrations/YYYYMMDD_create_laboratorio_tables.sql` | CRIAR |
| `src/types/database.ts` | MODIFICAR |
| `supabase/seed.sql` | MODIFICAR |

---

## Notas de Implementação Críticas

> **NFR03 (RLS):** Após ativar RLS, NENHUM dado é retornável sem autenticação. Testar sempre com usuário autenticado no cliente Supabase.

> **Dados preenchidos pela IA:** Os 20 campos do DNA (exceto `nome` e `status`) são preenchidos passivamente nas "madrugadas" pelo Motor Marés/Auto-Refill — não pelo usuário. O schema já deve prevê-los mas o formulário de criação manual só exige `nome`.

---

## Definition of Done

- [ ] Migration executada com sucesso em ambiente de desenvolvimento
- [ ] RLS testada: tenant A não acessa dados de tenant B
- [ ] Tipos TypeScript compilam sem erro (`npm run build`)
- [ ] Seed atualizado com dados de desenvolvimento realistas
- [ ] Code review de @dev aprovado no schema e nas policies
