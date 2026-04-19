# Story 2.1 — Supabase Seeding & Data Fetching Base

**Story ID:** 2.1
**Epic:** EPIC-02 — Validação de Fluxos e MVP
**Sprint:** 4 — Fundação de Dados (Integração Core)
**Prioridade:** 🔴 P0 (Bloqueadora para o restante do Epic)
**Estimativa:** 4h
**Assignee:** @dev

---

## 📖 User Story

**Como** usuário do AD_LABS (Operador/Estrategista),
**Quero** que as abas de "Laboratório", "Canais" e "Tendências" carreguem dados reais do meu banco de dados na nuvem,
**Para que** eu possa interagir com dados persistentes ao invés de protótipos estáticos e provar que o motor de conteúdo funciona de ponta a ponta.

---

## 🧠 Contexto / Problema

- Hoje, as rotas `/laboratorio`, `/tendencias` e `/canais` utilizam vetores mockados no próprio client (`const EIXOS = [...]`, `const IDEIAS = [...]`). 
- **O Objetivo Principal** é eliminar o dado "hardcoded" e fazer as rotas baterem no banco real (`eixos`, `canais`, `videos` com status `planejamento`).
- Como o banco está vazio, precisamos iniciar construindo um script de seeder que irá pré-popular as tabelas de referência (`canal` default, `eixos` básicos, e alguns `vídeos` em fase de rascunho/planejamento) para que tenhamos ambiente de testes.

---

## ✅ Acceptance Criteria (Definition of Done)

- [x] **AC1 (Seeder):** Script `supabase/seed.sql` criado com 1 usuário mock, 1 Canal (Histórias Ocultas), 5 Eixos (DNA completo de 20 campos conforme Doutrina Epic-4) e 7 Vídeos em `status='planejamento'`.
- [x] **AC2 (Data Fetching Eixos):** Rota `/laboratorio` refatorada para Server Component — busca eixos via `supabase.from('eixos').order('score_mare')`. `taxaAprovacao` usa `score_mare` (0-100) conforme Doutrina.
- [x] **AC3 (Data Fetching Ideias):** Busca `videos` com `status='planejamento'`. Sem tabela `ideias` no banco — regra de mapeamento respeitada.
- [x] **AC4 (Clean Code):** Constantes mock removidas de `/laboratorio` e `/tendencias`. Ambas as rotas são agora `async function` SSR puras. Sem erros de hidratação (arquitetura Client/Server correta via `LaboratorioClient`).

---

## 🛠️ Detalhamento Técnico para o @dev (Instruções de Handoff)

> **Regra de Mapeamento**: Note que no banco de dados **não existe a tabela `ideias`**. Ideias se transformam na tabela `videos`, usando campo `status = 'planejamento'`. 

**1. Criação do Script de Seed:**
- Crie um arquivo para popular os dados localmente ou via admin client, exemplo `supabase/seed.sql`.
- Insira o "Canal", "Eixos" (ex. Escola, Trabalhador, Hospital, Rua, Igreja) e "Videos" atrelados ao Eixo "Trabalho" (que era o eixo vencedor no mock antigo).
- Atenção às `UUIDs` genéricas para relacionamentos fáceis nos testes locais. Se estiver integrado localmente, alinhe com `auth.uid()`.

**2. Integração no Next.js (Client vs Server):**
- Atualize a rota `/laboratorio` (`src/app/(dashboard)/laboratorio/page.tsx`). Puxe `const supabase = await createClient(); const { data } = supabase.from('eixos')...`.
- Passe essas informações via props para as tabelas como Client/Server Components. Repita a operação para a rota de `/tendencias` ou crie os devidos Server Actions para requisições sob demanda se necessário.

**3. Manter o Padrão Lendária Dark Mode:**
- Como definido em `docs/agent-context.md`, você deve persistir as classes de cor do design system `.card-accent`, `var(--color-success)` e etc. Em nenhum momento escreva HEX raw.

---

## 🤖 CodeRabbit Integration (Quality Planning)

- **Agent Prediction**: Esta tarefa exige muito back-end integration. Idealmente revisada por `@architect` ou `@qa` para testes no final do Sprint 4.
- **Risco Primário**: Hydration Mismatch por conta de Server fetching mal sincronizado com UI; ou Policies do RLS bloqueando o fetch de eixos sem permissão correta após o seeder. O script de seed deve garantir policies contornadas via service-role, ou amarradas corretamente ao mock `auth.uid()`.

---

*Detailed by @sm (River) — Sprint 4 / EPIC-02*

---

## 🤖 Dev Agent Record

**Status:** `Ready for Review`
**Agent Model Used:** Claude Sonnet 4.6 (Thinking)

### File List
- `supabase/seed.sql` (NEW) — Script de seeding completo com 5 eixos (DNA 20 campos), 7 vídeos/ideias, 1 canal e 1 usuário mock
- `supabase/migrations/20260419080001_add_tendencias_tables.sql` (NEW) — Migração SQL criando `matriz_nichos` e `garimpos_minados` com RLS
- `src/app/(dashboard)/laboratorio/page.tsx` (MODIFIED) — Refatorado para Server Component async com SSR real
- `src/app/(dashboard)/laboratorio/laboratorio-client.tsx` (NEW) — Client Component com estado interativo (ativo/inativo eixo, envio fábrica)
- `src/app/(dashboard)/tendencias/page.tsx` (MODIFIED) — Refatorado para Server Component async com SSR real
- `src/app/globals.css` (MODIFIED) — Revertido `@theme` para `@theme inline` (Tailwind v4 obrigatório)
- `src/components/laboratorio/eixo-card.tsx` (MODIFIED) — `id` aceita `string | number` (compatível com UUID do Supabase)
- `src/components/laboratorio/ideias-table.tsx` (MODIFIED) — `id` aceita `string | number`; callback `onSendToFabrica` atualizado
- `src/components/tendencias/matriz-oceano.tsx` (MODIFIED) — `id: string | number`; `opacity` e `pulse` aceitam `null`
- `src/components/tendencias/nicho-card.tsx` (MODIFIED) — `id: string | number`; `tag` opcional com `null`; guard `isGap` seguro
- `src/lib/supabase/database.types.ts` (MODIFIED) — Adicionadas tabelas `garimpos_minados` e `matriz_nichos` ao arquivo de tipos do client
- `src/lib/database.types.ts` (MODIFIED) — Idem (arquivo espelho usado por import @/lib/database.types)

### Completion Notes
- **Doutrina Epic-4 respeitada:** `taxaAprovacao` usa `score_mare` (0-100) diretamente, sem multiplicação incorreta
- **Doutrina Epic-5 respeitada:** Queries de Tendências referem Eixo Y = Concorrência, Eixo X = Sentimento nos comentários do código
- **Zero hidratação:** Arquitetura Server Component puro → props → Client Component. Nenhum `useEffect` de fetch.
- **Type-safety completa:** `(supabase as any)` eliminados; types inferidos via `Database['public']['Tables']`
- **SQL seguro:** Variáveis locais com prefixo `v_` evitam ambiguíade com nomes de colunas nas cláusulas WHERE
- **Erros pré-existentes:** TS2582 nos `*.test.tsx` existem antes desta story (config Vitest/tsconfig pendente do @qa)

### Change Log
| Data | Alteração | Arquivo |
|------|-----------|--------|
| 2026-04-19 | Correção `@theme` → `@theme inline` (Tailwind v4) | globals.css |
| 2026-04-19 | Fix logic negócio: `taxaAprovacao` via `score_mare` direto | laboratorio/page.tsx |
| 2026-04-19 | Eliminação de `(supabase as any)` com types corretos | tendencias/page.tsx |
| 2026-04-19 | Tabelas `matriz_nichos` e `garimpos_minados` adicionadas ao types do client | supabase/database.types.ts |

---

## 🛡️ QA Results

**Reviewer:** Quinn (@qa)
**Date:** 2026-04-19
**Gate Decision:** ✅ **PASS**

### 📋 Quality Assessment Summary
A implementação arquitetônica e visual concluiu a transição da Mock Data para produção verídica do App Router (Server-side & Client-side). 

#### 1. Coverage & Defect Validation
- **Hydration / SSR (AC2/AC3/AC4):** Investigado nos logs `GET /tendencias` e `GET /laboratorio`. Next.js constrói corretamente no backend via `createClient`, não há exceptions de Window undef. 
- **Database & RLS (AC1):** A base processa os canais via ID correto. Uma anomalia residual de Redirecionamento 404 por falha no cookie residual do Edge Middleware durante acesso à Home e `/login` foi depurada e neutralizada.
- **Third Party UI Hotlinking:** Restrição visual (Hotlink status 403 Forbidden para os mini-thumbnails do Google) resolvida de forma definitiva pela injeção da `referrerPolicy="no-referrer"` nos Cards de Garimpo, preservando a imersão de UX.

#### 2. Technical Debt Added / Resolved
- 🟢 **Resolved:** Mock Datas estáticos eliminados. Seed completo injetado direto no Supabase Hosted.
- 🟡 **New Debt:** A UI da página de Autenticação não acompanha as diretrizes do Design System Lendária. (Ticket anexado ao Backlog a ser executado pelo UX/UI designer posteriormente).

**Authorization:** *Safe to proceed with Sprint.*
