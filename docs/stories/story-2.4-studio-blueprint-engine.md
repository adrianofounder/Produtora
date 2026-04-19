# Story 2.4 — Studio Blueprint Engine (CRUD Real de Ponta a Ponta)

**Story ID:** 2.4 (EPIC-02)
**Epic:** EPIC-02 — Validação de Fluxos e MVP
**Sprint:** 5 — Laboratório e Studio (CRUD MVP)
**Prioridade:** 🔴 P0 — MVP Gate Final
**Estimativa:** 6h
**Assignee:** @dev

---

## 📖 User Story

**Como** usuário do AD_LABS (Estrategista/Maestro),
**Quero** abrir o `/studio`, selecionar o canal ativo, editar os campos do Blueprint (Hook A, Desenvolvimento B, CTA C, Voz, Emoção) e ao clicar em "Injetar Blueprint" ter esse conteúdo salvo no banco Supabase — com a tela refletindo o estado persistido após qualquer reload —
**Para que** o ciclo de vida do conteúdo esteja 100% completo: `Laboratório (aprovado) → Studio (blueprint salvo) → Kanban de Canais (em produção)`, validando o EPIC-02 de ponta a ponta.

---

## 🧠 Contexto / Problema

### O que já existe (codebase real — verificado):

1. **`src/app/(dashboard)/studio/page.tsx`** — Página Client Component (`'use client'`) que:
   - Carrega canais via `fetch('/api/canais')` e popula um `<select>`.
   - Carrega o blueprint do canal via `fetch('/api/blueprints/${canalId}')` (rota `GET /api/blueprints/[id]`).
   - Salva o blueprint via `fetch('/api/blueprints/${canalId}', { method: 'PUT' })`.
   - **PROBLEMA CRÍTICO:** A rota `GET /api/blueprints/[id]` usa o `canalId` como parâmetro de rota dinâmica, mas a tabela `blueprints` tem relação `canal_id` (chave estrangeira). É preciso verificar se a rota `[id]` busca por `id` do blueprint ou por `canal_id`. A query na `page.tsx` usa o padrão `/api/blueprints/${canalId}` — isto é: busca blueprint **pelo canal**, não pelo blueprint em si.
   - Os campos `hook`, `tipo_narrativa`, `emocao_dominante`, `voz_narrador` são carregados do banco mas `desenvolvimento` (Seção B) mapeia para `tipo_narrativa` — sem campo dedicado para CTA (Seção C). **CTA não persiste hoje.**
   - O "Histórico de Blueprints" na sidebar usa **dados hardcoded** (mock estático).

2. **Tabela `blueprints` (schema verificado em `database.types.ts`):**
   ```
   id, canal_id, titulo_benchmark, canal_benchmark, hook,
   tipo_narrativa, emocao_dominante, voz_narrador, conflito_central,
   estetica_visual, estrutura_emocional, formula_emocional,
   plot_twist, quality_score, retention_loop, ritmo_edicao,
   performance_score, market_signal, veredito, created_at, updated_at
   ```
   - **Não há campo `cta`** — o CTA da Seção C deve ser mapeado para `estrutura_emocional` (campo mais semântico disponível) ou para `conflito_central`. Usar `estrutura_emocional` para o CTA.
   - Relação `isOneToOne: true` com `canais` — cada canal tem **no máximo 1 blueprint**.

3. **Rota `GET/PUT /api/blueprints/[id]`** — Precisa ser inspecionada para verificar se faz UPSERT ou UPDATE por `canal_id`.

4. **API de canais `GET /api/canais`** — Retorna `{ id, nome, mare_status }[]` — já funcional (Story 2.1).

5. **Server Actions** — O padrão estabelecido em Stories 2.2 e 2.3 usa `'use server'` + `revalidatePath`. Esta story não precisa de Server Actions novas para o blueprint, pois o Studio é puramente Client-side com `fetch`. Porém o `revalidatePath('/studio')` é desnecessário — blueprints são editados pelo próprio usuário no mesmo componente.

### O que está quebrado/faltando:

| Problema | Impacto | Solução |
|---|---|---|
| CTA (Seção C) não salva no banco | Dados perdidos no reload | Mapear `cta` → coluna `estrutura_emocional` |
| Histórico de Blueprints é hardcoded | UX enganosa | Buscar blueprints do banco via `GET /api/blueprints?canal_id=X` |
| Sem feedback de sucesso no Save | UX confusa (usuário não sabe se salvou) | Toast/badge de confirmação após `salvarBlueprint()` |
| UPSERT vs UPDATE não validado | Usuário sem blueprint salvo vê erro 404 na PUT | Garantir que a rota `[id]` faz UPSERT por `canal_id` |
| Sem `quality_score` sendo persistido | Campo existe no DB, UI mostra `8.5` hardcoded | Persistir `quality_score` no save |

---

## ✅ Acceptance Criteria (Definition of Done)

- [x] **AC1 (Load Blueprint):** Ao selecionar um canal que **já tem** blueprint salvo, os campos Hook (A), Desenvolvimento (B), CTA (C), Voz e Emoção são preenchidos com os dados do Supabase sem intervenção manual. Campos sem dado no banco exibem placeholder padrão (não string vazia).
- [x] **AC2 (Load — Canal sem Blueprint):** Ao selecionar um canal que **não tem** blueprint, os campos exibem os valores default das constantes (`hook` padrão, `desenvolvimento` padrão, `cta` padrão). **Nenhum erro 404 é exibido no console** para esse cenário.
- [x] **AC3 (Save Blueprint — UPSERT):** Clicar em `[🚀 INJETAR BLUEPRINT NO MOTOR CENTRAL]` salva os campos `hook`, `tipo_narrativa` (desenvolvimento B), `estrutura_emocional` (CTA C), `emocao_dominante`, `voz_narrador` e `veredito: 'ativo'` na tabela `blueprints`. Se já existe registro para o `canal_id`, faz UPDATE. Se não existe, faz INSERT. Nenhum erro TypeScript ou duplicação de chave.
- [x] **AC4 (Feedback Visual de Save):** Após o save bem-sucedido, o botão exibe estado "✅ Salvo!" por 2 segundos antes de voltar ao texto original. Em caso de erro, exibe "❌ Erro ao salvar" com o erro no `console.error`.
- [x] **AC5 (CTA persiste):** Recarregar a página após salvar e trocar/voltar para o mesmo canal deve revelar o CTA (Seção C) preenchido com o valor salvo, buscado do campo `estrutura_emocional` do banco.
- [x] **AC6 (Histórico de Blueprints — Real):** A sidebar "Histórico de Blueprints" lista os últimos **3 blueprints** do canal ativo buscados via `GET /api/blueprints?canal_id=X`, exibindo `veredito` como status e `quality_score` como score. Se sem registros, exibe estado vazio `"Nenhum blueprint salvo ainda."`.
- [x] **AC7 (MVP Gate — Fluxo Completo):** Um vídeo com `status='producao'` (aprovado via Story 2.3) aparece no Kanban de Canais. O Blueprint do canal está salvo no Studio. O fluxo `Laboratório → Studio → Canais` é navegável sem erro de hidratação ou console error crítico.
- [x] **AC8 (Build Clean):** `npm run build` encerra com exit code 0, zero erros TypeScript, todas as páginas geradas.

---

## 🛠️ Dev Notes — Contexto Técnico (Handoff para @dev)

> ⚠️ **CRÍTICO:** Todo detalhe abaixo é baseado no codebase real. Não inventar endpoints, libs ou padrões.

### 1. Mapeamento de Campos (UI ↔ Banco)

```typescript
// Mapeamento confirmado (UI state → coluna blueprints):
{
  hook          → blueprints.hook
  desenvolvimento → blueprints.tipo_narrativa   // Seção B
  cta           → blueprints.estrutura_emocional // Seção C (sem col própria)
  emocao        → blueprints.emocao_dominante
  voz           → blueprints.voz_narrador
  veredito      → blueprints.veredito = 'ativo'  // ao salvar sempre
  quality_score → blueprints.quality_score = 8.5 // manter valor fixo por ora
}
```

### 2. UPSERT no Supabase

A rota `PUT /api/blueprints/[id]` precisa ser verificada. Se ela faz UPDATE por `id` do blueprint mas o Studio usa `canalId` como parâmetro, **haverá bug na primeira chamada** (sem id de blueprint). A solução é fazer UPSERT usando `onConflict: 'canal_id'`:

```typescript
// Em /api/blueprints/[id]/route.ts (PUT handler)
const { data, error } = await supabase
  .from('blueprints')
  .upsert(
    { canal_id: canalId, hook, tipo_narrativa, estrutura_emocional, emocao_dominante, voz_narrador, veredito: 'ativo', quality_score: 8.5 },
    { onConflict: 'canal_id' }
  )
  .select()
  .single();
```

> ⚠️ Verificar se a constraint `UNIQUE(canal_id)` existe na tabela `blueprints` (schema diz `isOneToOne: true` — indica que sim). Se não existir no DB real, adicionar migração.

### 3. Carregamento do Blueprint por `canal_id`

A rota atual `GET /api/blueprints/[id]` trata `id` como `canal_id` (observando como o Studio chama: `/api/blueprints/${canalId}`). Verificar o handler atual:

```typescript
// Se a rota [id] já filtra por canal_id, manter.
// Se filtra por id do blueprint, corrigir para:
const { data } = await supabase
  .from('blueprints')
  .select('*')
  .eq('canal_id', params.id)  // params.id = canalId passado pela URL
  .maybeSingle();             // .maybeSingle() retorna null sem erro 404
```

**USAR `.maybeSingle()` em vez de `.single()`** para o caso de canal sem blueprint (AC2).

### 4. Histórico de Blueprints — Busca Real

No `page.tsx`, substituir o array hardcoded pelo resultado de um `useEffect`:

```typescript
// Adicionar estado
const [historicoBp, setHistoricoBp] = useState<Array<{
  id: string; veredito: string | null; quality_score: number | null; updated_at: string | null;
}>>([]);

// Dentro do useEffect que reage ao canalId:
fetch(`/api/blueprints?canal_id=${canalId}`)
  .then(r => r.ok ? r.json() : [])
  .then((data) => {
    if (Array.isArray(data)) setHistoricoBp(data.slice(0, 3));
  })
  .catch(() => {});
```

### 5. Feedback de Save

```typescript
const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

async function salvarBlueprint() {
  if (!canalId) return;
  setSaveStatus('saving');
  try {
    const res = await fetch(`/api/blueprints/${canalId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hook,
        tipo_narrativa: desenvolvimento,
        estrutura_emocional: cta,
        emocao_dominante: emocao,
        voz_narrador: voz,
        veredito: 'ativo',
        quality_score: 8.5,
      }),
    });
    if (!res.ok) throw new Error(await res.text());
    setSaveStatus('saved');
    // Atualizar histórico após save
    fetch(`/api/blueprints?canal_id=${canalId}`)
      .then(r => r.ok ? r.json() : [])
      .then((data) => Array.isArray(data) && setHistoricoBp(data.slice(0, 3)));
    setTimeout(() => setSaveStatus('idle'), 2000);
  } catch (err) {
    console.error('[Studio Save Error]:', err);
    setSaveStatus('error');
    setTimeout(() => setSaveStatus('idle'), 3000);
  }
}
```

### 6. Estrutura de Arquivos Afetados

```
src/
├── app/
│   ├── api/
│   │   └── blueprints/
│   │       ├── route.ts           ← Sem alterações (GET list já ok)
│   │       └── [id]/
│   │           └── route.ts       ← [MODIFICAR] Garantir UPSERT + .maybeSingle()
│   └── (dashboard)/
│       └── studio/
│           └── page.tsx           ← [MODIFICAR] CTA state, historico real, saveStatus
└── supabase/
    └── migrations/
        └── [NOVO se necessário]   ← Adicionar UNIQUE(canal_id) em blueprints se ausente
```

---

## 📋 Tasks / Subtasks

### Task 1 — Auditar e corrigir rota `GET /api/blueprints/[id]` (AC1, AC2)
**Arquivo:** `src/app/api/blueprints/[id]/route.ts`
- [x] 1.1 Verificar se a rota filtra por `canal_id` ou `blueprint.id`
- [x] 1.2 Trocar `.single()` por `.maybeSingle()` para evitar erro 404 em canal sem blueprint
- [x] 1.3 Retornar `null` (HTTP 200) quando não houver blueprint — não lançar erro

### Task 2 — Corrigir rota `PUT /api/blueprints/[id]` para UPSERT (AC3)
**Arquivo:** `src/app/api/blueprints/[id]/route.ts`
- [x] 2.1 Substituir `UPDATE` por `UPSERT` com `onConflict: 'canal_id'`
- [x] 2.2 Incluir todos os campos mapeados: `hook`, `tipo_narrativa`, `estrutura_emocional`, `emocao_dominante`, `voz_narrador`, `veredito`, `quality_score`
- [x] 2.3 Verificar se constraint UNIQUE(canal_id) existe — se não, criar migração

### Task 3 — Adicionar estado `cta` e corrigir load no `page.tsx` (AC1, AC2, AC5)
**Arquivo:** `src/app/(dashboard)/studio/page.tsx`
- [x] 3.1 Adicionar `const [cta, setCta] = useState(DEFAULT_CTA)` onde `DEFAULT_CTA` é o valor atual hardcoded
- [x] 3.2 No `useEffect` de carregamento do blueprint: adicionar `if (bp.estrutura_emocional) setCta(bp.estrutura_emocional)`
- [x] 3.3 Conectar o `<textarea>` da Seção C ao state `cta` (já existe o textarea, só falta ligar ao state correto)

### Task 4 — Implementar feedback de save `saveStatus` (AC4)
**Arquivo:** `src/app/(dashboard)/studio/page.tsx`
- [x] 4.1 Adicionar state `saveStatus: 'idle' | 'saving' | 'saved' | 'error'`
- [x] 4.2 Atualizar `salvarBlueprint()` com os campos completos e tratamento de erro
- [x] 4.3 Alterar o label do botão de Save conforme `saveStatus` (spinner, "✅ Salvo!", "❌ Erro")

### Task 5 — Histórico de Blueprints Real (AC6)
**Arquivo:** `src/app/(dashboard)/studio/page.tsx`
- [x] 5.1 Adicionar state `historicoBp[]` com tipo correto
- [x] 5.2 Buscar `GET /api/blueprints?canal_id=X` no `useEffect` do `canalId`
- [x] 5.3 Renderizar histórico real na sidebar (substituir array hardcoded)
- [x] 5.4 Exibir `"Nenhum blueprint salvo ainda."` se lista vazia

### Task 6 — Migração DB (se necessário) (AC3)
**Arquivo:** `supabase/migrations/[timestamp]_add_blueprint_unique_canal.sql`
- [x] 6.1 Verificar via SQL: `SELECT constraint_name FROM information_schema.table_constraints WHERE table_name='blueprints' AND constraint_type='UNIQUE'`
- [x] 6.2 Se UNIQUE(canal_id) ausente: criar migração com `ALTER TABLE blueprints ADD CONSTRAINT blueprints_canal_id_unique UNIQUE (canal_id);`

### Task 7 — Testes e Validação (QA Gate)
- [x] 7.1 `npm run build` — exit code 0, zero erros TypeScript
- [x] 7.2 Testar save: carregar Studio → editar Hook → clicar "Injetar" → recarregar → Hook persiste
- [x] 7.3 Testar CTA: editar Seção C → salvar → recarregar → CTA persiste (campo `estrutura_emocional`)
- [x] 7.4 Testar canal sem blueprint: selecionar canal novo → sem erro 404 no console → defaults exibidos
- [x] 7.5 Testar UPSERT: salvar duas vezes no mesmo canal → sem erro de constraint duplicada
- [x] 7.6 Validar fluxo completo MVP: Laboratório → aprovar ideia → conferir no Kanban de Canais (status `producao`) → abrir Studio → salvar Blueprint → AC7 validado
- [x] 7.7 Verificar histórico: após salvar → sidebar "Histórico" mostra o blueprint recém-salvo

---

## 🤖 CodeRabbit Integration (Quality Planning)

**Story Type Analysis:**
- **Primary Type:** Full-Stack (API Route + Client Component)
- **Complexity:** Médio-Baixo — refatoração de estado existente + correção de UPSERT

**Specialized Agent Assignment:**
- Primary: `@dev` (implementação), `@qa` (validação fluxo completo + MVP Gate)
- Supporting: `@architect` se necessário discutir UPSERT vs relação blueprint:canal (1:1 já validada)

**Quality Gate Tasks:**
- [ ] Pre-Commit (`@dev`): `npm run build` + `npx tsc --noEmit`
- [ ] Pre-PR (`@github-devops`): `npm run lint` zero erros

**CodeRabbit Focus Areas:**
- **Primary:**
  - UPSERT correto (sem duplicação, sem 404 silencioso)
  - `.maybeSingle()` para evitar throw em canal sem blueprint
  - CTA mapeado corretamente para `estrutura_emocional`
- **Secondary:**
  - Cleanup de mock hardcoded no histórico da sidebar
  - Feedback de save com timeout de limpeza de estado

**Self-Healing Configuration:**
- Primary Agent: `@dev` (light mode)
- Max Iterations: 2
- Severity Filter: CRITICAL only
- AUTO_FIX: Erros TypeScript em `maybeSingle()` e type de `saveStatus`

---

## 🚨 Riscos e Pontos de Atenção

1. **Constraint UNIQUE(canal_id) ausente:** O `isOneToOne: true` nos types TypeScript indica que a relação é 1:1, mas pode não ter constraint no banco real. Se o UPSERT fizer INSERT duplicado, haverá 2 registros para o mesmo canal. **Verificar antes de implementar.**
2. **Rota `[id]` vs `canal_id`:** A URL `/api/blueprints/${canalId}` usa o UUID do **canal** como parâmetro `id` da rota dinâmica. Se o handler atual trata isso como `blueprint.id`, a GET retorna 404 e a PUT tenta atualizar um blueprint inexistente por ID errado. **Inspecionar o handler antes de qualquer mudança.**
3. **CTA state vs `cta` antigo:** O componente original pode já ter um state `cta` — verificar antes de adicionar novo estado. Sem leitura completa do arquivo, pode haver duplicação.
4. **Sem `'use server'`:** Esta story usa `fetch` client-side (padrão pré-existente no Studio). **Não migrar para Server Actions** — seria regressão de arquitetura sem benefício claro aqui.

---

## 📁 File Summary

| Arquivo | Ação | Motivo |
|---------|------|--------|
| `src/app/api/blueprints/[id]/route.ts` | ✏️ MODIFICAR | UPSERT + .maybeSingle() + campo estrutura_emocional |
| `src/app/(dashboard)/studio/page.tsx` | ✏️ MODIFICAR | Estado CTA, saveStatus, histórico real do banco |
| `supabase/migrations/[ts]_blueprint_unique.sql` | 🆕 CRIAR (se necessário) | Garantir UNIQUE(canal_id) para o UPSERT funcionar |

---

## 🚦 Status

**✅ QA Aprovado — MVP Gate 100% atingido por @qa**

---

## 🔬 QA Results (Review Gate)

### 1. Requirements Traceability
| ID | Requirement | Test Target | Status | Note |
|---|---|---|---|---|
| AC1 | Load Blueprint fields | `GET /api/blueprints/[id]` + UI state binding | PASS | `.maybeSingle()` prevents 404 block. |
| AC2 | Canal sem BP | Fallbacks na renderização | PASS | Constantes defaults implementadas. |
| AC3 | Save / UPSERT | `PUT /api/blueprints/[id]` | PASS | Payload completo (`tipo_narrativa`, etc) verificado. `UNIQUE` migrate aplicada. |
| AC4 | Feedback Visual | `maestro-verdict` status | PASS | `SaveStatus` union property implementada. |
| AC5 | CTA persistence | `estrutura_emocional` field | PASS | Database sync ok. |
| AC6 | Histórico Real | `GET /api/blueprints?canal_id=X` | PASS | UI binding atualizado com fetcher próprio. |
| AC7 | E2E MVP Flow | Tendencias → Laboratório → Studio → Canais | PASS | Fluxo interligado por banco de dados testado. Sem hydration errors notados. |
| AC8 | Build Integrity | Compile-time Checks | PASS | `npm run build` e `eslint` zerados. |

### 2. Quality Gate Decision
- **Decision:** PASS ✅
- **Rationale:** The integration code satisfies all acceptance criteria safely. Using `.maybeSingle()` handles missing data cleanly and `UPSERT` correctly saves the work. Full DB data pipelines validate the MVP requirements across Laboratório, Tendências, Studio, and Kanban Canais.
- **Notes:** Greenfield project is maintaining stability while transitioning fully from local fake data to Supabase.

*- Quinn, Test Architect*


---

## 🏁 MVP Gate

Esta é a **última story do EPIC-02**. Quando o QA aprovar esta story, o critério de sucesso do EPIC-02 estará oficialmente validado:

> ✅ Logar → Laboratório (aprovar ideia) → Studio (salvar blueprint) → Kanban de Canais (ideia em `producao`) — **ciclo completo end-to-end funcionando com dados reais do Supabase.**

Após o commit desta story, acionar:
```
@[.agent/workflows/pm.md] O EPIC-02 foi 100% implementado. Feche as pendências no guia e inicie o briefing do próximo grande objetivo do projeto no contexto AIOX.
```

---

*Story gerada por @sm (River) — AIOX Workflows — 2026-04-19*
