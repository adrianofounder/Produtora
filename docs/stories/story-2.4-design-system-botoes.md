# Story 2.4 — Consolidar Design System de Botões

**Story ID:** 2.4
**Epic:** EPIC-01 — Resolução de Débitos Técnicos
**Sprint:** 2 — Qualidade & Consistência
**Prioridade:** 🟡 P1
**Estimativa:** 5h
**Assignee:** @dev

---

## User Story

**Como** desenvolvedor,
**Quero** que todos os botões da plataforma usem classes do design system,
**Para que** a aparência seja consistente e mudanças visuais precisem ser feitas em um único lugar.

---

## Contexto / Problema

**FE-04:** A variant `.btn-danger` não existe em `globals.css`. O botão "Excluir" e similares usam `style={{}}` inline com cores hardcoded. A decisão de **não migrar para shadcn/ui** foi validada pelo @ux-design-expert — o sistema `btn-primary`/`btn-ghost` já é coeso.

**FE-05:** O `statusConfig` em `VideoCard.tsx` define cores de status (`rascunho`, `em_producao`, `publicado`, etc.) duplicando os tokens `.glow-*` já definidos em `globals.css`. Dois sistemas para o mesmo problema.

---

## Acceptance Criteria

- [x] **AC1:** `.btn-danger` existe em `globals.css` com estilos de hover e focus definidos
- [x] **AC2:** Todos os botões de ação destrutiva (Excluir, Cancelar com ênfase) usam `.btn-danger` — sem `style={{color: 'red'}}` ou similar
- [x] **AC3:** `statusConfig` em `VideoCard.tsx` usa os tokens `.glow-*` do CSS em vez de definir cores explícitas
- [x] **AC4:** `npm run build` e `npm run lint` sem erros após as mudanças

---

## Tasks

- [x] **T1:** Adicionar `.btn-danger` em `globals.css`:
  ```css
  .btn-danger {
    background: rgba(239,68,68,0.10);
    border: 1px solid rgba(239,68,68,0.20);
    color: var(--color-error);
    font-size: 13px; font-weight: 600;
    border-radius: 9px; cursor: pointer;
    transition: all 0.18s ease;
    display: inline-flex; align-items: center; gap: 6px;
    padding: 0 14px;
  }
  .btn-danger:hover {
    background: rgba(239,68,68,0.20);
    border-color: rgba(239,68,68,0.40);
    color: #F87171;
  }
  .btn-danger:focus-visible {
    outline: 2px solid var(--color-error);
    outline-offset: 2px;
  }
  ```
- [x] **T2:** Mapear todos os botões de ação destrutiva no codebase e substituir inline styles por `.btn-danger`
- [x] **T3:** Revisar `statusConfig` em `video-card.tsx` e unificar com tokens `.glow-*` de `globals.css`
- [x] **T4:** Verificar visualmente que os botões renderizam corretamente após mudanças

---

## Definition of Done

- [x] `.btn-danger` adicionado ao design system
- [x] Zero botões destrutivos com `style={{color}}` inline
- [x] `statusConfig` unificado com tokens CSS
- [x] Visual testado em todos os estados (default, hover, focus, disabled)
- [x] @qa validou acceptance criteria

---

## QA Results (Quinn)
- **Status**: ✅ PASS
- **Data**: 2026-04-07
- **Evidências**: 
  - `npm run build` & `npm run lint` concluídos com sucesso.
  - Audit de código confirmou remoção de `style={{color: 'red'}}` em botões.
  - Implementação de micro-interações (`active: scale(0.96)`) validada no `.btn-danger`.
  - Fix de build Next.js 15 (Suspense logic) validado em `/canais/perfil`.


---

*Story criada por @pm (Morgan) — EPIC-01, Sprint 2*
