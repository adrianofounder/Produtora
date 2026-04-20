---
executor: "@dev"
quality_gate: "@architect"
quality_gate_tools: [rls_query_audit, server_action_validation, optimistic_ui_test, kanban_transition_check]
epic: "EPIC-04"
story: "4.2"
sprint: 8
depends_on: "story-4.1"
status: "Ready for Review"
---

# Story 4.2 — Integração da UI do Laboratório com Dados Reais e Master Override

## Como Desenvolvedor @dev, quero…
…substituir a fonte de dados legada (`videos`) do `/laboratorio` pela tabela `ideias` criada na Story 4.1, implementar o **Master Override** (botão que promove manualmente um eixo para `status = 'venceu'`) e corrigir o **Enviar Lote p/ Fábrica** para operar sobre `ideias` com pipeline de status correto, para que o Laboratório exiba dados reais do tenant autenticado com todas as transições de status persistidas no Supabase.

---

## Contexto do Sistema Existente

> **[Source: src/app/(dashboard)/laboratorio/]**

### Estado Atual (o que existe):
- **`page.tsx`** (Server Component): Busca `eixos` ✅ corretamente. Busca ideias ainda na tabela **`videos`** ❌ (legado pré-Story 4.1).
- **`laboratorio-client.tsx`** (Client Component): State management com optimistic updates via `useTransition`. **Sem lógica de Master Override.** `eixos` é `useState` sem setter ativo.
- **`laboratorio-actions.ts`**: Todas as 3 actions apontam para tabela **`videos`** ❌ com status incorretos (`producao` em vez de `planejamento`).
- **Componentes**: `EixoCard`, `IdeiasTable`, `TrendAnalysis` — funcionais, com tipos `EixoData` e `IdeiaData`.

### Tipos Existentes — `EixoData` (`eixo-card.tsx`):
```ts
export interface EixoData {
  id: string | number;
  nome: string;
  nicho: string;
  status: 'testando' | 'aguardando' | 'venceu';
  videos: number;
  mediaViews: string;
  taxaAprovacao: number; // 0–100
}
```

### Tipos Existentes — `IdeiaData` (`ideias-table.tsx`):
```ts
export interface IdeiaData {
  id: string | number;
  titulo: string;
  premissa: string;
  notaIA: number;
  tags: string[];
  status: 'pendente' | 'fabrica' | 'planejamento' | 'publicado';
}
```

### Pipeline de Status — Tabela `ideias` (Story 4.1):
```
pendente  →  planejamento   (enviarParaFabrica — ideia entra no Kanban)
pendente  →  [excluir]      (descartar — removida do Lab; não vai para Kanban)
planejamento → publicado    (fluxo da Fábrica — EPIC-03 / Story 4.4)
```

> ⚠️ **Incompatibilidade detectada:** As actions atuais usam status `producao` / `descartado` que não existem no CHECK constraint de `ideias`. Veja Task 7.

---

## Critérios de Aceitação

### AC1 — `page.tsx`: Fonte de dados migrada de `videos` → `ideias`

```typescript
// REMOVER (legado):
const { data: ideiasData } = await supabase
  .from('videos')              // ❌
  .select('*')
  .eq('status', 'planejamento')

// ADICIONAR (correto — com canal ativo como filtro defensivo):
const { data: canalAtivo } = await supabase
  .from('canais')
  .select('id')
  .eq('user_id', user!.id)
  .order('created_at', { ascending: true })
  .limit(1)
  .single();

const { data: ideiasData } = await supabase
  .from('ideias')              // ✅
  .select('id, titulo, premissa, nota_ia, tags, status, eixo_id, origem')
  .eq('canal_id', canalAtivo!.id)
  .order('nota_ia', { ascending: false });
```

### AC2 — `page.tsx`: Mapeamento de `EixoData` corrigido

Usar campos reais (`videos_count`, `media_views`, `taxa_aprovacao`) adicionados na Story 4.1:

```typescript
const mappedEixos: EixoData[] = (eixosData || []).map((e) => ({
  id: e.id,
  nome: e.nome,
  nicho: e.sentimento_dominante || e.gatilho_curiosidade || 'Geral',
  status: (e.status as EixoData['status']) || 'aguardando',
  videos: e.videos_count ?? 0,
  mediaViews: e.media_views
    ? `${Math.round(e.media_views / 1000)}K`
    : `${Math.floor((e.views_acumuladas || 0) / 1000)}K`,
  taxaAprovacao: e.taxa_aprovacao ?? e.score_mare ?? 0,
}));
```

### AC3 — `page.tsx`: Mapeamento de `IdeiaData` corrigido

```typescript
const mappedIdeias: IdeiaData[] = (ideiasData || []).map((i) => ({
  id: i.id,
  titulo: i.titulo,
  premissa: i.premissa || 'Sem premissa definida',
  notaIA: i.nota_ia ?? 0,
  tags: i.tags ?? [],
  status: i.status as IdeiaData['status'],
}));
```

### AC4 — `laboratorio-actions.ts`: 3 Actions migradas para `ideias`

| Action | Tabela | De → Para (status) |
|--------|--------|---------------------|
| `enviarIdeiaParaFabrica` | `videos` → `ideias` | `planejamento → producao` ❌ → `pendente → planejamento` ✅ |
| `enviarLoteParaFabrica` | `videos` → `ideias` | `planejamento → producao` ❌ → `pendente → planejamento` ✅ |
| `descartarIdeia` | `videos` → `ideias` | `planejamento → descartado` ❌ → ver Task 7 |

Exemplo corrigido:
```typescript
export async function enviarIdeiaParaFabrica(ideiaId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('ideias')                            // ✅
    .update({ status: 'planejamento' })         // ✅ entra no Kanban
    .eq('id', ideiaId)
    .eq('status', 'pendente');                  // Guard: só transiciona pendentes

  if (error) return { success: false, error: 'Falha ao enviar ideia.' };
  revalidatePath('/laboratorio');
  revalidatePath('/canais');                    // Sincroniza o Kanban
  return { success: true };
}
```

### AC5 — Novo Server Action: `setEixoVencedor` (Master Override)

Criar action que promove um eixo para `'venceu'` garantindo **unicidade por canal** (regra de negócio obrigatória — apenas 1 eixo vencedor por canal ao mesmo tempo):

```typescript
export async function setEixoVencedor(eixoId: string): Promise<ActionResult> {
  const supabase = await createClient();

  // Obter canal_id para garantir escopo correto
  const { data: eixo } = await supabase
    .from('eixos').select('canal_id').eq('id', eixoId).single();
  if (!eixo) return { success: false, error: 'Eixo não encontrado.' };

  // Passo 1: Rebaixar todos os eixos do canal para 'aguardando'
  const { error: resetError } = await supabase
    .from('eixos')
    .update({ status: 'aguardando' })
    .eq('canal_id', eixo.canal_id)
    .neq('id', eixoId);
  if (resetError) return { success: false, error: 'Falha ao resetar eixos.' };

  // Passo 2: Promover o eixo alvo
  const { error } = await supabase
    .from('eixos').update({ status: 'venceu' }).eq('id', eixoId);
  if (error) return { success: false, error: 'Falha ao definir vencedor.' };

  revalidatePath('/laboratorio');
  return { success: true };
}
```

> ⚠️ **NFR03:** O RLS garante que `canal_id` pertence ao usuário autenticado. O filtro explícito é uma segunda camada defensiva (anti-happy path).

### AC6 — `laboratorio-client.tsx`: Handler do Master Override

```typescript
// 1. Tornar eixos mutável (linha 21 — MODIFICAR):
const [eixos, setEixos] = useState<EixoData[]>(initialEixos); // adicionar setEixos

// 2. Adicionar handler:
const handleMasterOverride = (eixoId: string | number) => {
  const strId = String(eixoId);
  if (eixos.find(e => String(e.id) === strId)?.status === 'venceu') return; // Já é vencedor

  // Optimistic update
  setEixos(prev => prev.map(e => ({
    ...e,
    status: String(e.id) === strId ? 'venceu' :
            e.status === 'venceu'  ? 'aguardando' : e.status,
  })));

  startTransition(async () => {
    const result = await setEixoVencedor(strId);
    if (!result.success) {
      setEixos(initialEixos); // Rollback
      console.error('[Master Override Error]', result.error);
    }
  });
};

// 3. Passar prop para EixoCard no JSX:
<EixoCard
  key={eixo.id}
  eixo={eixo}
  isActive={activeEixoId === eixo.id}
  onClick={() => setActiveEixoId(eixo.id)}
  onMasterOverride={() => handleMasterOverride(eixo.id)}  // NOVO
/>
```

### AC7 — `eixo-card.tsx`: Botão "👑 Definir Vencedor" em hover

```tsx
// Adicionar em EixoCardProps:
onMasterOverride?: () => void;

// Renderizar no JSX (dentro do <button> já existente, após o bloco de Métricas):
{eixo.status !== 'venceu' && onMasterOverride && (
  <button
    onClick={(e) => { e.stopPropagation(); onMasterOverride(); }}
    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 
               mt-2 w-full text-[10px] font-bold uppercase tracking-wider 
               text-yellow-500/80 hover:text-yellow-400
               border border-yellow-500/20 hover:border-yellow-500/40 
               rounded px-2 py-1"
  >
    👑 Definir Vencedor
  </button>
)}
```

---

## Arquivos a Criar/Modificar

| Arquivo | Ação | Mudança Principal |
|---------|------|-------------------|
| `src/app/(dashboard)/laboratorio/page.tsx` | MODIFICAR | Query `videos` → `ideias`; campos `videos_count`, `media_views`, `taxa_aprovacao` |
| `src/app/actions/laboratorio-actions.ts` | MODIFICAR | 3 actions: `videos` → `ideias`, status corrigido; + `setEixoVencedor` |
| `src/app/(dashboard)/laboratorio/laboratorio-client.tsx` | MODIFICAR | `eixos` mutável; `handleMasterOverride`; prop para `EixoCard` |
| `src/components/laboratorio/eixo-card.tsx` | MODIFICAR | Prop `onMasterOverride`; botão hover "👑 Definir Vencedor" |

---

## Dev Notes

### NFR03 — Padrão de Query Defensivo (CRÍTICO)
```typescript
// ✅ CORRETO: filtro explícito + RLS como segunda camada
supabase.from('ideias').select('*').eq('canal_id', canalAtivo.id)

// ⚠️ ACEITÁVEL mas não preferível: apenas RLS (sem filtro de canal)
supabase.from('ideias').select('*')

// ❌ ERRADO: ideias não tem campo user_id
supabase.from('ideias').select('*').eq('user_id', user.id)
```

### Task 7 — Decisão sobre `descartarIdeia`
O CHECK constraint de `ideias.status` permite: `'pendente' | 'fabrica' | 'planejamento' | 'publicado'`.
O status `'descartado'` **não existe** no constraint atual.

**Opção A (Recomendada pelo @sm):** Excluir fisicamente com `DELETE FROM ideias WHERE id = $id AND status = 'pendente'`.
- Simples. O RLS garante que só apaga ideias próprias.

**Opção B (Alternativa):** Adicionar migration incremental `ALTER TABLE ideias ... CHECK (status IN (..., 'descartado'))`.
- Mais rastreável. Requer nova migration.

> **@dev:** Escolher Opção A por simplicidade, a menos que @architect indique contrário. Documentar decisão no commit.

### Atomicidade do Master Override
O `setEixoVencedor` executa 2 queries sequenciais. Não há `BEGIN/COMMIT` no Supabase JS Client diretamente.
**Risco:** Se o Passo 2 falhar após o Passo 1, todos os eixos ficam como `'aguardando'`.
**Mitigação:** O Passo 1 é seguro de repetir. Se o Passo 2 falhar, o rollback do optimistic update na UI reflete o estado real do banco.
**Alternativa futura (Story 4.3):** Mover para uma RPC (`CALL set_eixo_vencedor($eixoId)`) para atomicidade real.

---

## Tasks / Subtasks

- [ ] **Task 1 (AC1/AC2/AC3):** Em `page.tsx`, buscar `canalAtivo` antes dos fetches. Usar para filtrar `eixos` e `ideias`.
- [ ] **Task 2 (AC1):** Em `page.tsx`, substituir query `from('videos').eq('status','planejamento')` por `from('ideias').eq('canal_id', ...)`.
- [ ] **Task 3 (AC2):** Em `page.tsx`, atualizar `mappedEixos` com `videos_count`, `media_views`, `taxa_aprovacao`.
- [ ] **Task 4 (AC3):** Em `page.tsx`, atualizar `mappedIdeias` com campos reais de `ideias` (`nota_ia`, `tags`, `premissa`).
- [ ] **Task 5 (AC4):** Em `laboratorio-actions.ts`, migrar `enviarIdeiaParaFabrica`: `videos` → `ideias`, status `pendente → planejamento`.
- [ ] **Task 6 (AC4):** Em `laboratorio-actions.ts`, migrar `enviarLoteParaFabrica`: `videos` → `ideias`, status `pendente → planejamento`.
- [ ] **Task 7 (AC4):** Em `laboratorio-actions.ts`, implementar `descartarIdeia` com `DELETE` físico na tabela `ideias` (Opção A — confirmar com @architect).
- [ ] **Task 8 (AC5):** Em `laboratorio-actions.ts`, adicionar `setEixoVencedor` com reset de canal + promoção sequencial + `revalidatePath`.
- [ ] **Task 9 (AC6):** Em `laboratorio-client.tsx`, tornar `eixos` mutável. Adicionar `handleMasterOverride` com optimistic update e rollback em caso de erro.
- [ ] **Task 10 (AC6):** Em `laboratorio-client.tsx`, importar `setEixoVencedor` e passar `onMasterOverride` para cada `EixoCard`.
- [ ] **Task 11 (AC7):** Em `eixo-card.tsx`, adicionar prop `onMasterOverride` e renderizar botão "👑 Definir Vencedor" visível no hover (apenas se `status !== 'venceu'`).
- [ ] **Task 12 (Verificação):** Executar `npm run build` sem erros TypeScript.

---

## 🤖 CodeRabbit Integration

### Story Type Analysis
- **Primary Type:** Frontend Integration + Server Actions
- **Secondary Type:** State Management (optimistic updates) + Business Rule Enforcement
- **Complexity:** Medium — refatoração de fonte de dados + nova funcionalidade crítica (Override).

### Specialized Agent Assignment
- **Primary Agent:** `@dev` (Google Gemini 3.1 Pro High — integrações lineares UI → backend)
- **Quality Gate:** `@architect` (revisar atomicidade do Override e padrão de queries RLS)

### Quality Gate Tasks
- [ ] **@architect Pre-Merge:** Confirmar que `setEixoVencedor` trata falha no Passo 2 (todos eixos resetados sem vencedor).
- [ ] **@architect Pre-Merge:** Confirmar que `ideias` nunca é consultada sem filtro de `canal_id`.
- [ ] **@dev Pre-Commit:** Nenhuma referência a `from('videos')` remanescente nas actions de laboratório.
- [ ] **@dev Pre-Commit:** `npm run build` sem erros TypeScript.

### CodeRabbit Focus Areas
**Primary:**
- Todas as queries em `ideias` param por `canal_id` (defensivo).
- `setEixoVencedor` garante unicidade: reset geral → promoção única.
- Referências a `from('videos')` em `laboratorio-actions.ts` eliminadas.

**Secondary:**
- Optimistic update com rollback correto (`setEixos(initialEixos)` em caso de falha).
- `revalidatePath('/canais')` chamado após `enviarParaFabrica` (sincroniza Kanban).
- Estado vazio tratado (canal sem eixos / sem ideias).

---

## Definition of Done

- [x] /laboratorio exibe eixos e ideias da tabela `ideias` real — sem mock data e sem referência a `videos`
- [x] `videos_count` e `taxa_aprovacao` dos `EixoCard` exibidos a partir dos campos reais do banco
- [x] Botão "👑 Definir Vencedor" visível no hover do `EixoCard` (para eixos não-vencedores)
- [x] Master Override persiste no banco: eixo clicado → `venceu`; demais → `aguardando`
- [x] Optimistic update com rollback correto em caso de falha da action
- [x] Botão "Enviar Lote p/ Fábrica" transiciona ideias `pendente → planejamento`
- [x] Ideias transitadas aparecem no Kanban de `/canais` (verificação cruzada)
- [x] `descartarIdeia` remove a ideia sem deixar estado inconsistente
- [x] `npm run build` passando sem erros TypeScript
- [x] Code review de `@architect` aprovado (RLS defensivo + atomicidade do Override)

---

> ⚠️ **Leis Inquebráveis (@dev) — consulte `docs/prd-core-nfrs.md`:**
> - **NFR01 (Agnosticidade):** Qualquer chamada de geração de texto deve usar `ITextEngine` — nunca SDK direto.
> - **NFR03 (RLS):** Queries com `canal_id` explícito em toda interação com `eixos` e `ideias`.
> - **NFR06 (Auditoria):** Ações automáticas gravam `origem = '[Automação Lvl 3]'`. Esta story é 100% manual — `origem = 'Humano'` é o padrão.

---
*Story gerada por @sm (River) · Sprint 8 · EPIC-04.*
