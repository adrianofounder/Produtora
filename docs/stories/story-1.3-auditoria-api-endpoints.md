# Story 1.3 — Auditoria e Hardening dos Endpoints de API

**Story ID:** 1.3
**Epic:** EPIC-01 — Resolução de Débitos Técnicos
**Sprint:** 1 — Segurança & Bloqueadores
**Prioridade:** 🔴 P0 — Crítico
**Estimativa:** 6h
**Assignee:** @dev

---

## User Story

**Como** usuário da plataforma,
**Quero** que as rotas de API validem minha identidade e propriedade dos recursos antes de processar requisições,
**Para que** não seja possível acessar ou modificar dados de outro usuário através de chamadas diretas à API.

---

## Contexto / Problema

**API-01:** Os endpoints internos `/api/ia/gerar-roteiro`, `/api/ia/gerar-titulos`, `/api/videos/[id]` (PATCH) e outros não foram auditados para:
- Validação de ownership (um usuário pode alterar vídeos de outro?)
- Input sanitization antes de persistir
- Tratamento correto de erros HTTP (200 vs 400 vs 401 vs 403 vs 500)
- Proteção contra bypass de RLS via service role

É a camada de integração crítica entre o frontend e o banco de dados.

---

## Acceptance Criteria

- [ ] **AC1:** Todos os endpoints em `/api/` verificam autenticação antes de processar (`getUser()` ou equivalente)
- [ ] **AC2:** Endpoints que operam em recursos com `user_id` verificam ownership explicitamente
- [ ] **AC3:** Inputs recebidos são validados (tipos, tamanhos, formatos) antes de uso
- [ ] **AC4:** Respostas de erro seguem convenção HTTP (401 não autenticado, 403 não autorizado, 404 não encontrado, 422 validação)
- [ ] **AC5:** Um usuário autenticado não pode fazer PATCH em vídeo de outro usuário (teste de segurança)
- [ ] **AC6:** Documento `docs/api/api-security-audit.md` criado listando todos os endpoints e status de validação

---

## Tasks

- [ ] **T1:** Mapear todos os arquivos em `src/app/api/` e listar endpoints existentes
- [ ] **T2:** Para cada endpoint, verificar e implementar checagem de autenticação:
  ```ts
  const { data: { user }, error } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  ```
- [ ] **T3:** Para endpoints que operam em `videos/[id]`, adicionar verificação de ownership:
  ```ts
  const { data: video } = await supabase
    .from('videos').select('user_id').eq('id', params.id).single();
  if (video?.user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  ```
- [ ] **T4:** Adicionar validação de input com Zod ou validação manual nos endpoints críticos
- [ ] **T5:** Padronizar respostas de erro em todos os endpoints
- [ ] **T6:** Criar `docs/api/api-security-audit.md` com inventário de todos os endpoints e status de validação

---

## Testes Requeridos

```bash
# Teste de autorização — PATCH em vídeo de outro usuário deve retornar 403
# (testar com dois usuários diferentes em ambiente de staging)

Cenário: Acesso não autorizado a recurso alheio
  DADO que estou autenticado como Usuário A
  QUANDO faço PATCH /api/videos/{id-do-usuario-b}
  ENTÃO recebo status 403 Forbidden

Cenário: Acesso não autenticado
  DADO que não estou autenticado
  QUANDO faço POST /api/ia/gerar-roteiro
  ENTÃO recebo status 401 Unauthorized

Cenário: Input inválido
  DADO que estou autenticado
  QUANDO envio body vazio para POST /api/ia/gerar-roteiro
  ENTÃO recebo status 422 com mensagem de validação
```

---

## Definition of Done

- [ ] Todos os endpoints auditados e documentados em `docs/api/api-security-audit.md`
- [ ] Testes manuais de autorização executados e aprovados pelo @qa
- [ ] Build sem erros TypeScript
- [ ] Esta story deve ser concluída ANTES da Story 1.6 (DB-07)

---

*Story criada por @pm (Morgan) — EPIC-01, Sprint 1*
