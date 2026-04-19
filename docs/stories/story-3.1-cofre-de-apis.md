# Story 3.1 — Arquitetura do Cofre de Credenciais e Limites (Módulo 7)

**Story ID:** 3.1 (EPIC-03)
**Epic:** [EPIC-03 — A Máquina de Criação (Integração IA e Motores)](./EPIC-03-FABRICA-E-IA.md)
**Sprint:** 6 — Fundações Criativas Controladas
**Prioridade:** 🔴 P0 — Bloqueador para chamadas de IA
**Estimativa:** 6h
**Assignee:** @dev
**Status:** ✅ **READY FOR REVIEW — aguardando @qa**

---

## 📖 User Story

**Como** usuário do AD_LABS (Maestro),
**Quero** acessar a tela de Configurações para inserir minhas chaves de API (OpenAI, ElevenLabs, etc.) e definir um Teto Global de Gastos (Tokens ou similar),
**Para que** a plataforma possa autorizar a conexão com motores de IA de forma segura, resiliente a gastos acidentais e de forma agnóstica (permitindo troca de modelos sem refatoração).

---

## 🔍 Contexto / Problema

Esta story dá início à "Fábrica de Conteúdo" (EPIC-03). O sistema precisa gerenciar credenciais de forma multi-tenant e centralizada. Não usaremos `.env` para chaves de usuários.

### Diretrizes Críticas:
1. **Agnosticidade Suprema:** A UI e o Banco não devem estar amarrados a um provedor fixo. Os campos são genéricos (`provider_name`, `base_url`, `api_key`, `model_id`).
2. **Resiliência (Anti-Happy Path):** O **Teto de Gastos Diário** é obrigatório. Se o limite for atingido, o sistema deve "frear" qualquer chamada.
3. **Segurança Máxima:** Uso de Supabase RLS (`auth.uid() = user_id`) e chaves mascaradas na UI.
4. **Fallback do Sistema:** Se o usuário não cadastrar chave própria, o sistema pode usar a `.env` do Maestro (com teto obrigatório ativo).

---

## ✅ Acceptance Criteria (Definition of Done)

- [x] **AC1 (Data Modeling & RLS):** Tabela `tenant_credentials` criada com RLS habilitado. Política `tenant_credentials_owner_only`: `auth.uid() = user_id`. Índices para performance e trigger `updated_at`.
- [x] **AC2 (Configurações UI):** Rota `/configuracoes` funcional com lista 100% dinâmica do banco, separação clara entre Diagnóstico de Ambiente (fixo) e Cofre de IAs (dinâmico).
- [x] **AC3 (CRUD Agnóstico):** Formulário permite salvar Nome do Provedor, URL Base (opcional), API Key (mascarada `sk-••••XXXX`), Model ID e tipo de motor. Botão "Adicionar Provedor" e deletar com confirmação.
- [x] **AC4 (Trava de Segurança):** Switcher "Trava de Custos" funcional. Barra de progresso visual do `daily_spend_count` em cada card. Campo de Limite Diário condicional ao switcher. `consumption-tracker.ts` criado para incremento e verificação.
- [x] **AC5 (UX Feedback):** Estados "Salvando...", "Salvo!", "Erro" com ícones e cores do sistema. Mensagem de erro detalhada exibida inline.
- [x] **AC6 (Tipagem):** `database.types.ts` e `supabase/database.types.ts` atualizados. `tsc --noEmit` e `npm run build` passando com `Exit code: 0`.

---

## 🛠️ Arquivos Modificados (Dev Agent Record)

| Arquivo | Operação | Descrição |
|---|---|---|
| `supabase/migrations/20260419150800_create_tenant_credentials.sql` | MODIFY | Schema agnóstico completo com todos os campos novos, RLS, índices e trigger `updated_at` |
| `src/lib/database.types.ts` | MODIFY | Tipos `tenant_credentials` agnósticos (Row/Insert/Update) |
| `src/lib/supabase/database.types.ts` | MODIFY | Espelho dos tipos agnósticos |
| `src/lib/ai/consumption-tracker.ts` | NEW | Utilitário de rastreamento de unidades por provedor e usuário |
| `src/app/(dashboard)/configuracoes/actions.ts` | MODIFY | `getTenantCredentials` (mascaramento), `upsertCredential` (fallback, tipagem), `deleteCredential` |
| `src/app/(dashboard)/configuracoes/page.tsx` | MODIFY | Lista dinâmica do banco, separação Diagnóstico × Cofre |
| `src/components/configuracoes/api-key-card.tsx` | MODIFY | Modal agnóstico completo: novo provedor, barra de progresso, fallback do sistema |

---

## 🚨 Dívida Técnica Registrada (TD-01)

**Billing Real por Usuário** — Faturamento proporcional por consumo de API (R$ real) deve ser implementado em EPIC futuro. O sistema atual rastreia Unidades Genéricas, não valor monetário. O `@pm` deve abrir Epic de Billing antes do lançamento comercial. Referências técnicas documentadas no `implementation_plan.md`.

---

## 🧪 Instruções para @qa (Quinn)

### Cenários de Teste Obrigatórios:

**AC1 — Teste de RLS (Isolamento Multi-Tenant):**
1. Criar dois usuários no Supabase (User A e User B).
2. User A cadastra uma credencial `provider_type = 'llm_text'`.
3. Conectar como User B e tentar `SELECT * FROM tenant_credentials` — deve retornar 0 linhas.
4. Tentar `SELECT * FROM tenant_credentials WHERE user_id = '<user_a_id>'` — deve retornar 0 linhas.

**AC3 — Teste CRUD Agnóstico:**
1. Adicionar provedor "DeepSeek R1" tipo "Motor LLM", chave `sk-teste-123`, URL `https://api.deepseek.com`.
2. Recarregar a página e validar que o provedor aparece com status `ATIVA`.
3. Editar o teto para `20000` unidades e salvar.
4. Recarregar e validar persistência do teto.
5. Deletar o provedor e confirmar que desaparece da lista.

**AC4 — Teste da Trava de Segurança:**
1. Cadastrar um provedor com teto de 10 unidades.
2. Via Supabase Console (SQL Editor): `UPDATE tenant_credentials SET daily_spend_count = 10 WHERE provider_type = 'llm_text';`
3. Chamar `checkSpendLimit()` e validar que retorna `{ allowed: false }`.

**AC5 — Teste de Fallback:**
1. Criar provedor com `is_system_fallback = TRUE` e `api_key = ''`.
2. Salvar e confirmar que aparece com status `SISTEMA` (ícone ⚡ amarelo).

---

## 🏁 Handoff para QA

```
@[.agent/workflows/qa.md] valide a story-3.1 conforme os cenários de teste descritos na seção "Instruções para @qa".
```


**Story ID:** 3.1 (EPIC-03)
**Epic:** [EPIC-03 — A Máquina de Criação (Integração IA e Motores)](./EPIC-03-FABRICA-E-IA.md)
**Sprint:** 6 — Fundações Criativas Controladas
**Prioridade:** 🔴 P0 — Bloqueador para chamadas de IA
**Estimativa:** 6h
**Assignee:** @dev

---

## 📖 User Story

**Como** usuário do AD_LABS (Maestro),
**Quero** acessar a tela de Configurações para inserir minhas chaves de API (OpenAI, ElevenLabs, etc.) e definir um Teto Global de Gastos (Tokens ou similar),
**Para que** a plataforma possa autorizar a conexão com motores de IA de forma segura, resiliente a gastos acidentais e de forma agnóstica (permitindo troca de modelos sem refatoração).

---

## 🔍 Contexto / Problema

Esta story dá início à "Fábrica de Conteúdo" (EPIC-03). O sistema precisa gerenciar credenciais de forma multi-tenant e centralizada. Não usaremos `.env` para chaves de usuários.

### Diretrizes Críticas:
1. **Agnosticidade Suprema:** A UI e o Banco não devem estar amarrados a um provedor fixo. Os campos devem ser genéricos o suficiente (Labels flexíveis como "Provider Name", "Base URL", "API Key", "Model ID").
2. **Resiliência (Anti-Happy Path):** O **Teto de Gastos Diário** é obrigatório. Se o limite for atingido, o sistema deve "frear" qualquer chamada.
3. **Segurança Máxima:** Uso de Supabase RLS (`auth.uid() = user_id`) e as chaves devem ser tratadas como sensíveis (mascaradas na UI).

---

## ✅ Acceptance Criteria (Definition of Done)

- [ ] **AC1 (Data Modeling & RLS):** Tabela `tenant_credentials` criada com RLS habilitado. Política: `auth.uid() = user_id`.
- [ ] **AC2 (Configurações UI):** Rota `/configuracoes` funcional, seguindo o Design System Veterano (cards translúcidos, botões roxos).
- [ ] **AC3 (CRUD Agnóstico):** Formulário permite salvar Nome do Provedor, URL Base (opcional), API Key (mascarada) e Model ID.
- [ ] **AC4 (Trava de Segurança):** Switcher "Ativar Teto de Gastos" funcional. Se ativo, o campo "Limite Diário (Tokens/Moeda)" deve ser respeitado por futuras chamadas de IA.
- [ ] **AC5 (UX Feedback):** Indicações claras de "Salvando..." e "Sucesso/Erro" usando as cores do sistema.
- [ ] **AC6 (Tipagem):** `database.types.ts` atualizado e build passando sem erros.

---

## 🛠️ Dev Notes — Contexto Técnico (Handoff para @dev)

### 1. Migração Supabase Sugerida
```sql
CREATE TABLE public.tenant_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider_type TEXT NOT NULL, -- Ex: 'llm_text', 'tts_audio'
    provider_name TEXT NOT NULL, -- Nome amigável (OpenAI, ElevenLabs)
    api_key TEXT NOT NULL,
    base_url TEXT,               -- Opcional para IAs compatíveis
    model_id TEXT,               -- Opcional (gpt-4, vicuna, etc)
    max_daily_limit INTEGER DEFAULT 50000,
    is_limit_active BOOLEAN DEFAULT TRUE,
    daily_spend_count INTEGER DEFAULT 0, -- Para controle de teto
    last_reset_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, provider_type)
);

ALTER TABLE public.tenant_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Credenciais tenant auth" 
ON public.tenant_credentials 
FOR ALL USING (auth.uid() = user_id);
```

### 2. Fluxo de Reset de Gastos
- O `@dev` deve considerar uma lógica simples (inicialmente manual ou via trigger) para resetar o `daily_spend_count` quando o dia mudar, ou simplesmente comparar o `last_reset_at`.

---

## 📅 Tasks / Subtasks

### Task 1 — Modelação e Segurança
- [ ] 1.1 Executar Migration para `tenant_credentials`.
- [ ] 1.2 Garantir que o RLS está bloqueando acessos cruzados.
- [ ] 1.3 Atualizar os tipos do Supabase no projeto.

### Task 2 — Interface de Configurações
- [ ] 2.1 Criar/Atualizar `src/app/(dashboard)/configuracoes/page.tsx`.
- [ ] 2.2 Implementar os Cards de Credenciais (Agnósticos).
- [ ] 2.3 Adicionar o Switcher de Teto e o slider/input de limite.

### Task 3 — Backend e Lógica de Limite
- [ ] 3.1 Implementar Server Actions para UPSERT das chaves.
- [ ] 3.2 Garantir que a `api_key` nunca vaze em log ou estado global sem máscara.

### Task 4 — Quality Gate
- [ ] 4.1 Validar `npm run build`.
- [ ] 4.2 Teste manual: Salvar teto = 10 e verificar persistência.

---

## 🧪 CodeRabbit Integration (Quality Planning)

**Story Type Analysis:** Database, Security (RLS), UX (Settings).
**Specialized Agent Assignment:** `@dev` (Dex) para implementação, `@qa` (Gage) para quebra de limites.

---

## 🏁 Fluxo de Handoff
Quando validado pelo SM, chame:
```
@[.agent/workflows/dev.md] implemente a story-3.1 definida pelo sm, sem esquecer de validar a seguranca do Supabase RLS.
```
