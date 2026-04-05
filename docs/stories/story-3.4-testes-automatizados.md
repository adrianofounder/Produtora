# Story 3.4 — Estrutura Inicial de Testes Automatizados

**Story ID:** 3.4
**Epic:** EPIC-01 — Resolução de Débitos Técnicos
**Sprint:** 3 — Performance & Excelência
**Prioridade:** 🔵 P2
**Estimativa:** 4h+ (fundação; cobertura completa é trabalho contínuo)
**Assignee:** @qa + @dev

---

## User Story

**Como** desenvolvedor,
**Quero** ter uma estrutura de testes automatizados funcionando,
**Para que** regressões sejam detectadas automaticamente antes de chegarem em produção.

---

## Contexto / Problema

**TEST-01:** O projeto tem zero cobertura de testes automatizados. Não há Unit Tests, Integration Tests nem E2E Tests. Cada deploy carrega risco de regredir funcionalidades críticas sem detecção. Com o fluxo principal (Ideia → Roteiro → Narração → Publicação) completamente manual de testar, qualquer mudança estrutural (como a decomposição do VideoDrawer no Sprint 1) corre risco elevado.

---

## Acceptance Criteria

- [ ] **AC1:** Framework de testes instalado e configurado (`vitest` ou `jest` + `@testing-library/react`)
- [ ] **AC2:** Pelo menos 1 unit test passando para um componente simples (`VideoCard`, `ErrorState`, etc.)
- [ ] **AC3:** Pelo menos 1 integration test para o fluxo de autenticação (mock do Supabase)
- [ ] **AC4:** Script `npm run test` executa e reporta resultados
- [ ] **AC5:** CI pipeline (GitHub Actions ou Vercel) executa os testes em cada PR

---

## Tasks

- [ ] **T1:** Instalar e configurar Vitest + Testing Library:
  ```bash
  npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/user-event jsdom
  ```
- [ ] **T2:** Configurar `vitest.config.ts` com ambiente `jsdom` e paths de aliases
- [ ] **T3:** Adicionar script `"test": "vitest run"` e `"test:watch": "vitest"` ao `package.json`
- [ ] **T4:** Criar teste unitário para `<ErrorState>`:
  ```tsx
  // src/components/ui/__tests__/error-state.test.tsx
  it('exibe mensagem de erro e botão de retry', () => {
    render(<ErrorState message="Erro de IA" onRetry={fn} />)
    expect(screen.getByText('Erro de IA')).toBeInTheDocument()
  })
  ```
- [ ] **T5:** Criar teste para o fix do BUG-01 (gate de publicação):
  ```tsx
  it('botão de agendar fica desabilitado sem áudio aprovado', () => { ... })
  ```
- [ ] **T6:** Configurar GitHub Actions para rodar `npm run test` em PRs para `main`
- [ ] **T7:** Documentar `docs/testing/TESTING-GUIDE.md` com convenções de teste do projeto

---

## Definition of Done

- [ ] `npm run test` executa e passa
- [ ] Pelo menos 3 testes escritos (unit + integração básica)
- [ ] CI rodando testes automaticamente em PRs
- [ ] `docs/testing/TESTING-GUIDE.md` criado com convenções
- [ ] @qa revisou e aprovou a estrutura de testes

---

*Story criada por @pm (Morgan) — EPIC-01, Sprint 3*
