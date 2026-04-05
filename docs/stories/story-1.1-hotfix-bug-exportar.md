# Story 1.1 — Hotfix: Gate de Publicação Incompleta ✅

**Story ID:** 1.1
**Epic:** EPIC-01 — Resolução de Débitos Técnicos
**Sprint:** 1 — Segurança & Bloqueadores
**Status:** ✅ Ready for Review — commit `3b3e221`
**Prioridade:** 🔴 P0 — HOTFIX EMERGENCIAL
**Estimativa:** 0.5h
**Assignee:** @dev

---

## User Story

**Como** usuário da plataforma Produtora,
**Quero** que o sistema impeça o agendamento de publicação de vídeos incompletos,
**Para que** meu canal no YouTube não publique conteúdo sem áudio ou thumbnail.

---

## Contexto / Problema

O botão "Agendar Publicação no YouTube" na aba Exportar do `VideoDrawer` verifica apenas se o roteiro foi aprovado (`!aprovado.roteiro`), ignorando áudio e thumbnail. Um usuário pode agendar publicação com apenas o roteiro aprovado, resultando em vídeos com defeito sendo enviados ao YouTube.

> **Localização:** `src/components/canais/video-drawer.tsx`, linha 430

---

## Acceptance Criteria

- [ ] **AC1:** O bloco de aviso na aba "Exportar" é exibido quando QUALQUER uma das etapas (roteiro, áudio ou thumbnail) não foi aprovada
- [ ] **AC2:** O botão "Agendar Publicação no YouTube" fica desabilitado visualmente enquanto houver etapas incompletas
- [ ] **AC3:** O aviso exibe quais etapas ainda estão pendentes de aprovação
- [ ] **AC4:** Após aprovação de todas as etapas, o botão fica habilitado normalmente

---

## Tasks

- [ ] **T1:** Atualizar condição na linha 430 de `video-drawer.tsx`:
  ```tsx
  // Antes
  {!aprovado.roteiro && (...)}
  // Depois
  {(!aprovado.roteiro || !aprovado.audio || !aprovado.thumb) && (...)}
  ```
- [ ] **T2:** Atualizar mensagem do bloco de aviso para indicar quais etapas estão pendentes
- [ ] **T3:** Adicionar atributo `disabled` no botão de agendamento com base nas etapas incompletas
- [ ] **T4:** Testar fluxo completo (aprovar apenas roteiro → verificar bloqueio → aprovar tudo → verificar habilitação)

---

## Testes Requeridos

```
Cenário: Agendamento bloqueado com etapas incompletas
  DADO que tenho um vídeo com roteiro aprovado mas sem áudio e thumbnail
  QUANDO navego para a aba "Exportar"
  ENTÃO o botão "Agendar Publicação" deve estar desabilitado
  E o aviso deve indicar as etapas pendentes

Cenário: Agendamento habilitado com todas as etapas concluídas
  DADO que tenho um vídeo com roteiro, áudio e thumbnail aprovados
  QUANDO navego para a aba "Exportar"
  ENTÃO o botão "Agendar Publicação" deve estar habilitado
```

---

## Definition of Done

- [ ] Código alterado e revisado
- [ ] Nenhuma regressão nos outros botões do VideoDrawer
- [ ] Build sem erros TypeScript
- [ ] @qa validou os acceptance criteria

---

*Story criada por @pm (Morgan) — EPIC-01, Sprint 1*
