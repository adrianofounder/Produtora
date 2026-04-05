# Story 3.3 — Implementar Error Tracking em Produção

**Story ID:** 3.3
**Epic:** EPIC-01 — Resolução de Débitos Técnicos
**Sprint:** 3 — Performance & Excelência
**Prioridade:** 🔵 P2
**Estimativa:** 4h
**Assignee:** @devops + @dev

---

## User Story

**Como** engenheiro responsável pelo sistema em produção,
**Quero** ser notificado automaticamente quando erros ocorrem em runtime,
**Para que** problemas sejam detectados e corrigidos antes que os usuários percebam.

---

## Contexto / Problema

**OBS-01:** Não existe nenhum sistema de error tracking em produção. Erros silenciosos (como o `try/finally` sem `catch` identificado no VideoDrawer) passam despercebidos. O MTTR (tempo para resolver um incidente) é alto porque o time só descobre os problemas quando um usuário reporta.

---

## Acceptance Criteria

- [ ] **AC1:** Sentry (ou equivalente) está integrado e capturando exceções JavaScript no cliente
- [ ] **AC2:** Erros de runtime nas rotas de API (`/api/`) são capturados e enviados ao Sentry
- [ ] **AC3:** O DSN do Sentry está configurado via variável de ambiente (não hardcoded)
- [ ] **AC4:** Um erro de teste gerado manualmente aparece no dashboard do Sentry
- [ ] **AC5:** User context (id do usuário autenticado) é enviado junto com os erros

---

## Tasks

- [ ] **T1:** Criar conta/projeto no Sentry (ou usar plano free existente)
- [ ] **T2:** Instalar e configurar Sentry SDK para Next.js:
  ```bash
  npm install @sentry/nextjs
  npx @sentry/wizard@latest -i nextjs
  ```
- [ ] **T3:** Configurar `SENTRY_DSN` em `.env.local` e nas variáveis de ambiente do Vercel
- [ ] **T4:** Adicionar user context no Sentry após autenticação:
  ```ts
  Sentry.setUser({ id: user.id, email: user.email });
  ```
- [ ] **T5:** Testar com erro proposital: `throw new Error('Sentry test')` e verificar no dashboard
- [ ] **T6:** Configurar alertas de notificação (email/Slack) para nível "error" e "critical"

---

## Definition of Done

- [ ] Sentry capturando erros em produção (cliente + servidor)
- [ ] Variável de ambiente configurada sem hardcode
- [ ] Erro de teste confirmado no dashboard do Sentry
- [ ] Alertas configurados para erros críticos
- [ ] @qa validou acceptance criteria

---

*Story criada por @pm (Morgan) — EPIC-01, Sprint 3*
