# Story 1.5 — Refatorar VideoDrawer — Decomposição em Componentes

**Story ID:** 1.5
**Epic:** EPIC-01 — Resolução de Débitos Técnicos
**Sprint:** 1 — Segurança & Bloqueadores
**Prioridade:** 🔴 P0 — Crítico
**Estimativa:** 12h
**Assignee:** @dev

---

## User Story

**Como** desenvolvedor da plataforma,
**Quero** que o componente VideoDrawer seja dividido em partes menores e coesas,
**Para que** modificações futuras em uma aba não afetem as outras e o código seja fácil de entender e testar.

---

## Contexto / Problema

**FE-01:** `VideoDrawer.tsx` tem 444 linhas com múltiplas responsabilidades misturadas: gerenciamento de estado de 5 abas, chamadas de API para IA, lógica de aprovação, renderização de todos os tabs, e controle do drawer. Qualquer modificação tem alto risco de regressão.

**FE-02:** Existem ~19 ocorrências de `style={{}}` no componente. Aproximadamente 40% são dinâmicas (manter), mas ~60% são estáticas e devem ser substituídas por classes CSS do design system.

> **Referência de arquitetura validada por @ux-design-expert (Fase 6).**

---

## Acceptance Criteria

- [ ] **AC1:** `VideoDrawer.tsx` possui ≤ 100 linhas (apenas orquestração e composição)
- [ ] **AC2:** Existem 5 arquivos de aba em `src/components/canais/tabs/`: `IdeiaTab.tsx`, `RoteiroTab.tsx`, `NarracaoTab.tsx`, `ThumbTab.tsx`, `PacoteTab.tsx`
- [ ] **AC3:** `VideoDrawerHeader.tsx` e `VideoDrawerTabs.tsx` existem como componentes separados
- [ ] **AC4:** O hook `useVideoDrawer.ts` em `src/components/canais/hooks/` centraliza o estado compartilhado (`aprovado`, `abaAtiva`, estados de loading)
- [ ] **AC5:** `style={{}}` estáticos substituídos por classes CSS — apenas `style={{}}` com valores dinâmicos (ex: `width: ${pct}%`) são mantidos
- [ ] **AC6:** Todas as funcionalidades das 5 abas continuam funcionando sem regressão

---

## Arquitetura Alvo

```
src/components/canais/
├── video-drawer.tsx              ← ≤ 100 linhas (container)
├── VideoDrawerHeader.tsx         ← header + barra de progresso
├── VideoDrawerTabs.tsx           ← navegação entre abas
├── tabs/
│   ├── IdeiaTab.tsx              ← geração de títulos
│   ├── RoteiroTab.tsx            ← geração + aprovação de roteiro
│   ├── NarracaoTab.tsx           ← seleção de voz + aprovação
│   ├── ThumbTab.tsx              ← grid de thumbnails + aprovação
│   └── PacoteTab.tsx             ← metadados finais + agendamento
└── hooks/
    └── useVideoDrawer.ts         ← estado compartilhado
```

---

## Tasks

- [ ] **T1:** Criar hook `useVideoDrawer.ts` extraindo estado `aprovado`, `abaAtiva`, `loading`, `video`
- [ ] **T2:** Criar `VideoDrawerHeader.tsx` — extrair header, título e barra de progresso
- [ ] **T3:** Criar `VideoDrawerTabs.tsx` — extrair navegação/botões de aba com `role="tablist"`
- [ ] **T4:** Criar `tabs/IdeiaTab.tsx` — extrair bloco `{abaAtiva === 'ideia' && (...)}` completo
- [ ] **T5:** Criar `tabs/RoteiroTab.tsx` — extrair bloco de roteiro
- [ ] **T6:** Criar `tabs/NarracaoTab.tsx` — extrair bloco de narração
- [ ] **T7:** Criar `tabs/ThumbTab.tsx` — extrair bloco de thumbnails
- [ ] **T8:** Criar `tabs/PacoteTab.tsx` — extrair bloco de exportação/agendamento
- [ ] **T9:** Refatorar `video-drawer.tsx` para orquestrar os subcomponentes
- [ ] **T10:** Substituir `style={{}}` estáticos por classes CSS correspondentes
  - Categorizar: estáticos (substituir) | dinâmicos (manter) | tokens CSS (manter)
- [ ] **T11:** Verificar que build compila sem erros após refatoração

---

## Testes Requeridos

```
Cenário: Funcionalidade preservada após decomposição
  PARA CADA aba [Ideia, Roteiro, Narração, Thumbnail, Exportar]:
    DADO que abro o VideoDrawer de um vídeo
    QUANDO navego para a aba X
    ENTÃO a aba renderiza corretamente e funciona como antes

Cenário: Aprovação de etapas funciona end-to-end
  DADO que tenho um vídeo sem etapas aprovadas
  QUANDO aprovo o roteiro na aba Roteiro
  ENTÃO a barra de progresso atualiza
  E a aba Narração fica desbloqueada
```

---

## Definition of Done

- [ ] `VideoDrawer.tsx` ≤ 100 linhas
- [ ] 7 novos arquivos criados em `tabs/` e `hooks/`
- [ ] `style={{}}` estáticos substituídos — apenas dinâmicos mantidos
- [ ] Build TypeScript sem erros (`npx tsc --noEmit`)
- [ ] Todas as 5 abas funcionando em teste manual
- [ ] @qa validou acceptance criteria

---

*Story criada por @pm (Morgan) — EPIC-01, Sprint 1*
