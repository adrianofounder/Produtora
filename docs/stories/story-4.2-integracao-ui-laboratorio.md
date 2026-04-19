---
executor: "@dev"
quality_gate: "@architect"
quality_gate_tools: [code_review, pattern_validation, rls_query_check, ui_state_validation]
epic: "EPIC-04"
story: "4.2"
sprint: 8
depends_on: "story-4.1"
---

# Story 4.2 — Integração da UI do Laboratório com Dados Reais e Master Override

## Objetivo
Substituir todo o mock data estático dos componentes do `/laboratorio` por consultas reais ao Supabase. Implementar as duas mutações críticas de negócio: (1) **Master Override** — botão que anula o `score_mare` e força um Eixo como vencedor manualmente; (2) **Disparo de Lote** — botão que transiciona 5 Ideias para `status = 'planejamento'`, alimentando o Kanban de Canais.

---

## Contexto do Sistema Existente

- **Página alvo:** `src/app/(dashboard)/laboratorio/page.tsx`
- **Componentes existentes:** `EixoCard`, `IdeiasTable`, `TrendAnalysis` (todos com mock data inline).
- **Auth:** Usar `createServerComponentClient` para Server Components, `createClientComponentClient` para Client Components (padrão do projeto).
- **Dependência:** Story 4.1 concluída (tabelas `eixos` e `ideias` existem no banco).

---

## Critérios de Aceitação

### AC1 — Mock data removido

- Nenhum array estático (`const EIXOS = [...]`, `const IDEIAS = [...]`, `const TRENDS = [...]`) permanece nos componentes.
- Todo dado vem do Supabase via Server Actions ou Server Components.

### AC2 — Carregamento de Eixos (Server Component)

```tsx
// Exemplo esperado em page.tsx
const { data: eixos } = await supabase
  .from('eixos')
  .select('*')
  .order('score_mare', { ascending: false });
```

- Eixos ordenados por `score_mare` descendente.
- O eixo com `status = 'venceu'` recebe classe `.card-accent` automáticamente.

### AC3 — Master Override implementado

- Botão presente em cada `EixoCard`: "⚡ Forçar como Vencedor".
- Ao clicar: Server Action que executa:
  1. `UPDATE eixos SET status = 'aguardando' WHERE tenant_id = auth.uid()` (reset todos)
  2. `UPDATE eixos SET status = 'venceu' WHERE id = $eixoId AND tenant_id = auth.uid()`
- UI atualizada (revalidação de path) após mutação.
- Auditoria: não necessária (é ação humana direta).

### AC4 — Ideias filtradas por Eixo ativo

- `useState` controla qual `eixo_id` está selecionado.
- Ao selecionar um eixo, `useEffect` ou passagem de prop refiltra a tabela de ideias para mostrar apenas as do eixo clicado.
- Default: exibe ideias do eixo com `status = 'venceu'`.

### AC5 — Botão "Enviar Lote de 5 P/ Fábrica" funcional

- Server Action `enviarLoteParaFabrica(eixoId: string)`:
  1. Busca as 5 Ideias com `status = 'pendente'` e maior `nota_ia` do eixo selecionado.
  2. Para cada uma: `UPDATE ideias SET status = 'fabrica'`.
  3. `INSERT INTO videos (tenant_id, ideia_id, status, ...) VALUES (...)` criando os registros no Kanban com `status = 'planejamento'`.
- Toast/feedback visual de sucesso ou erro para o usuário.
- Botão desabilitado se não houver ao menos 5 ideias pendentes.

### AC6 — Estados de loading e erro tratados (Anti-Happy Path)

- Enquanto carrega: skeleton loader nas seções (não spinner genérico).
- Se Supabase retorna erro: mensagem descritiva inline (não alert nativo).
- Se nenhum eixo encontrado: estado vazio com mensagem orientativa.

---

## Arquivos a Criar/Modificar

| Arquivo | Ação |
|---------|------|
| `src/app/(dashboard)/laboratorio/page.tsx` | MODIFICAR — Server Component com fetch real |
| `src/components/laboratorio/eixo-card.tsx` | MODIFICAR — botão Master Override + tipagem real |
| `src/components/laboratorio/ideias-table.tsx` | MODIFICAR — props com tipagem `Ideia[]` real |
| `src/app/actions/laboratorio.ts` | CRIAR — Server Actions (override + enviar lote) |

---

## Notas de Implementação Críticas

> **NFR03 (RLS):** Todo query DEVE filtrar pelo `tenant_id` via RLS (automático quando usando o client autenticado do Supabase). NUNCA usar `.from('eixos').select('*')` sem o client de sessão.

> **Padrão do Projeto:** Usar `revalidatePath('/laboratorio')` após mutações para re-renderizar o Server Component e refletir os dados atualizados na UI.

> **Sem Vendor Lock-in:** As Server Actions não devem conter lógica de negócio complexa — apenas orquestrar. Lógica de seleção de "Top 5 ideias" deve ser centralizada em uma função utilitária em `src/lib/laboratorio.ts`.

---

## Definition of Done

- [ ] Nenhum mock data nos componentes do Laboratório
- [ ] Master Override atualiza o banco e reordena os cards na UI
- [ ] Enviar Lote cria registros reais em `videos` com `status = 'planejamento'`
- [ ] Estados de loading, erro e vazio implementados
- [ ] Build (`npm run build`) passa sem erros TypeScript
- [ ] Review de @architect aprovado nos padrões de Server Action e RLS
