# Story 3.2 — Estados de Feedback de UX (Error, Loading, Empty)

**Story ID:** 3.2
**Epic:** EPIC-01 — Resolução de Débitos Técnicos
**Sprint:** 3 — Performance & Excelência
**Prioridade:** 🔵 P2
**Estimativa:** 5h
**Assignee:** @dev

---

## User Story

**Como** usuário da plataforma,
**Quero** receber feedback visual claro quando algo dá errado ou está carregando,
**Para que** eu saiba o que está acontecendo e não confunda erros com comportamento normal.

---

## Contexto / Problema

- **FE-06:** `gerarRoteiro()` usa `try/finally` sem `catch` visual. Quando a API de IA falha, o usuário não vê nenhuma mensagem de erro — a interface simplesmente volta ao estado anterior silenciosamente
- **FE-07:** Cada aba usa `<Loader2>` ad-hoc de forma diferente. Não existem atoms centralizados `<LoadingState>` e `<EmptyState>` reutilizáveis

---

## Acceptance Criteria

- [ ] **AC1:** Existe um atom `<ErrorState>` em `src/components/ui/error-state.tsx` com title, message e ação de retry
- [ ] **AC2:** Existe um atom `<LoadingState>` em `src/components/ui/loading-state.tsx` com spinner centralizado e label
- [ ] **AC3:** Existe um atom `<EmptyState>` em `src/components/ui/empty-state.tsx` com ícone, mensagem e CTA opcional
- [ ] **AC4:** `gerarRoteiro()` e demais funções de IA exibem `<ErrorState>` quando a chamada falha
- [ ] **AC5:** Todas as abas do VideoDrawer usam `<LoadingState>` durante carregamento
- [ ] **AC6:** Lista de vídeos exibe `<EmptyState>` quando o canal não tem vídeos

---

## Tasks

- [ ] **T1:** Criar `src/components/ui/error-state.tsx`:
  ```tsx
  interface ErrorStateProps { title?: string; message: string; onRetry?: () => void; }
  export function ErrorState({ title = 'Algo deu errado', message, onRetry }: ErrorStateProps) { ... }
  ```
- [ ] **T2:** Criar `src/components/ui/loading-state.tsx` com `<Loader2>` centralizado e label opcional
- [ ] **T3:** Criar `src/components/ui/empty-state.tsx` com ícone, título, descrição e CTA
- [ ] **T4:** Atualizar `gerarRoteiro()` e `gerarTitulos()` para capturar erros e exibir `<ErrorState>`
- [ ] **T5:** Substituir instâncias ad-hoc de `<Loader2>` nas abas por `<LoadingState>`
- [ ] **T6:** Adicionar `<EmptyState>` na lista de vídeos quando `videos.length === 0`

---

## Definition of Done

- [ ] 3 atoms criados e exportados de `src/components/ui/`
- [ ] Erros de API de IA exibem mensagem visual para o usuário
- [ ] Lista de vídeos vazia exibe estado explicativo
- [ ] @qa testou cenário de falha de API e validou exibição do `<ErrorState>`

---

*Story criada por @pm (Morgan) — EPIC-01, Sprint 3*
