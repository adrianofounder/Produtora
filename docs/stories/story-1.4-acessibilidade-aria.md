# Story 1.4 — Implementar ARIA e Acessibilidade (WCAG 2.1 AA)

**Story ID:** 1.4
**Epic:** EPIC-01 — Resolução de Débitos Técnicos
**Sprint:** 1 — Segurança & Bloqueadores
**Prioridade:** 🔴 P0 — Crítico
**Estimativa:** 5.5h
**Assignee:** @dev

---

## User Story

**Como** usuário com deficiência visual utilizando tecnologia assistiva (screen reader),
**Quero** que o painel de edição de vídeos seja navegável via teclado e anunciado corretamente,
**Para que** eu possa usar a plataforma com autonomia.

---

## Contexto / Problema

**FE-03:** O `VideoDrawer` (modal/drawer principal) não possui `role="dialog"`, `aria-modal`, `aria-label` e focus trap. Em WCAG 2.1 AA, isso representa falha em 4 critérios de sucesso: SC 1.3.1, SC 2.1.1, SC 2.1.2 e SC 4.1.2.

**FE-08:** Labels de formulário na aba "Narração" e "Exportar" não estão associados aos seus inputs via `htmlFor`/`id`. Screen readers não conseguem descobrir o propósito dos campos.

---

## Acceptance Criteria

- [ ] **AC1 (FE-03):** O `VideoDrawer` possui `role="dialog"` e `aria-modal="true"`
- [ ] **AC2 (FE-03):** O foco é aprisionado dentro do drawer enquanto aberto (focus trap funcional)
- [ ] **AC3 (FE-03):** O drawer pode ser fechado com a tecla `Escape`
- [ ] **AC4 (FE-03):** As abas de navegação possuem `role="tablist"` e cada aba possui `role="tab"` com `aria-selected`
- [ ] **AC5 (FE-03):** O botão de fechar (✕) possui `aria-label="Fechar"`
- [ ] **AC6 (FE-08):** Todos os `<label>` possuem `htmlFor` correspondendo ao `id` do input/select associado
- [ ] **AC7:** `axe-cli` retorna 0 violações WCAG 2.1 AA para o componente VideoDrawer

---

## Tasks

- [ ] **T1:** Adicionar atributos ARIA no container do drawer:
  ```tsx
  <div role="dialog" aria-modal="true" aria-labelledby="video-drawer-title" ...>
    <h2 id="video-drawer-title">{videoTitle}</h2>
  ```
- [ ] **T2:** Implementar focus trap com `useEffect` e listener de teclas
- [ ] **T3:** Adicionar handler para fechar com `Escape`:
  ```tsx
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);
  ```
- [ ] **T4:** Adicionar `role="tablist"` na navegação de abas e `role="tab"` + `aria-selected` em cada aba
- [ ] **T5:** Adicionar `aria-label="Fechar"` no botão ✕
- [ ] **T6:** Associar todos os labels com seus inputs na aba Narração (voz blueprint) e Exportar
- [ ] **T7:** Executar `npx axe-cli http://localhost:3000 --include '[role="dialog"]'` e corrigir violações restantes

---

## Testes Requeridos

```bash
# Auditoria ARIA automatizada
npx axe-cli http://localhost:3000/canais --include '[role="dialog"]'
# Expected: 0 violations

# Teste manual com screen reader
# - Abrir VideoDrawer com teclado (Tab + Enter)
# - Screen reader anuncia "Diálogo: [título do vídeo]"
# - Navegação por Tab percorre apenas elementos dentro do drawer
# - Escape fecha o drawer

Cenário: Focus trap no VideoDrawer
  DADO que o VideoDrawer está aberto
  QUANDO pressiono Tab repetidamente
  ENTÃO o foco percorre apenas elementos dentro do drawer (não escapa para o fundo)

Cenário: Fechamento com Escape
  DADO que o VideoDrawer está aberto
  QUANDO pressiono Escape
  ENTÃO o drawer fecha e o foco retorna ao elemento que o abriu
```

---

## Definition of Done

- [ ] `axe-cli` retorna 0 violações no VideoDrawer
- [ ] Testado manualmente com VoiceOver (macOS) ou NVDA (Windows)
- [ ] Build sem erros TypeScript
- [ ] @qa validou todos os acceptance criteria

---

*Story criada por @pm (Morgan) — EPIC-01, Sprint 1*
