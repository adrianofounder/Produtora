# Story 2.5 — Responsividade Mobile do VideoDrawer

**Story ID:** 2.5
**Epic:** EPIC-01 — Resolução de Débitos Técnicos
**Sprint:** 2 — Qualidade & Consistência
**Prioridade:** 🟡 P1
**Estimativa:** 2h
**Assignee:** @dev

---

## User Story

**Como** usuário acessando a plataforma pelo celular,
**Quero** que o painel de edição de vídeos seja utilizável em tela mobile,
**Para que** eu possa gerenciar meus vídeos de qualquer dispositivo.

---

## Contexto / Problema

**FE-09:** O `VideoDrawer` usa `max-w-2xl` sem breakpoints responsivos. Em viewports < 640px, o drawer ocupa 100vw mas as abas horizontais não têm suporte a swipe touch e o overlay não fecha ao deslizar para baixo (padrão mobile esperado para bottom sheets).

---

## Acceptance Criteria

- [ ] **AC1:** Em viewport < 640px (mobile), o drawer ocupa a tela cheia e comporta-se como bottom sheet
- [ ] **AC2:** Em viewport ≥ 640px (desktop/tablet), o drawer mantém o comportamento atual de side panel
- [ ] **AC3:** As abas horizontais são navegáveis por scroll horizontal no mobile
- [ ] **AC4:** Um swipe down no header do drawer fecha o drawer em mobile
- [ ] **AC5:** Nenhuma regressão visual em desktop após as mudanças

---

## Tasks

- [ ] **T1:** Atualizar classe do container principal do drawer:
  ```tsx
  // Antes
  <div className="h-full w-full max-w-2xl flex flex-col overflow-hidden">
  // Depois
  <div className="h-full w-full sm:max-w-2xl flex flex-col overflow-hidden sm:ml-auto">
  ```
- [ ] **T2:** Adicionar gesture handler para swipe down em mobile (usando touch events nativos ou lib leve)
- [ ] **T3:** Garantir que `overflow-x-auto` nas abas funciona em mobile com scroll touch natural
- [ ] **T4:** Testar em viewport 375px (iPhone SE) e 390px (iPhone 14)
- [ ] **T5:** Testar em viewport 1280px (desktop) para verificar que não há regressão

---

## Definition of Done

- [ ] Drawer funciona como bottom sheet em mobile
- [ ] Side panel mantido em desktop sem regressão
- [ ] Swipe down fecha o drawer em mobile
- [ ] Testado em pelo menos 2 tamanhos de viewport mobile
- [ ] @qa validou acceptance criteria

---

*Story criada por @pm (Morgan) — EPIC-01, Sprint 2*
