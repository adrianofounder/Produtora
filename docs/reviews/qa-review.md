# QA Review — Technical Debt Assessment
**Projeto:** Produtora (AD_LABS)
**Data:** 2026-04-05
**Reviewer:** Quinn (Guardian) — @qa
**Fase:** 7 — Validação: QA Review Geral
**Documentos lidos:**
- `docs/prd/technical-debt-DRAFT.md`
- `docs/reviews/db-specialist-review.md`
- `docs/reviews/ux-specialist-review.md`

---

## Gate Status: ✅ APPROVED

O assessment está suficientemente completo e rigoroso para avançar para a **Fase 8 (Assessment Final)**. Os especialistas foram minuciosos e identificaram débitos adicionais além do DRAFT original. Os gaps identificados abaixo devem ser incorporados ao Assessment Final, mas não bloqueiam o avanço.

---

## 1. Gaps Identificados

### Gap 1 — Camada de API não auditada (Alta Prioridade)
Nenhum dos três reviews analisou os endpoints de API internos:
- `/api/ia/gerar-roteiro`
- `/api/ia/gerar-titulos`
- `/api/videos/[id]` (PATCH)
- `/api/blueprints/`
- `/api/alertas/`, `/api/canais/`, `/api/perfil/`

Esses endpoints são a **ponte crítica entre o VideoDrawer (FE) e o banco de dados (DB)**. Ausência de auditoria nessa camada significa que não sabemos se:
- Há validação de input antes de salvar no DB
- Os endpoints verificam ownership antes de PATCH (autenticação presente mas autorização não auditada)
- Os erros de API são tratados e retornam status codes apropriados

**Impacto:** Alto — é onde FE e DB se encontram. Um endpoint sem validação pode bypassar a RLS do Supabase via service role.

**Recomendação:** Adicionar `API-01` ao epic de débitos:
| ID | Débito | Área | Impacto | Esforço | Prioridade |
|----|--------|------|---------|---------|------------|
| API-01 | Endpoints `/api/` sem auditoria de segurança e validação de input | API | 🔴 Crítico | 🧪 Médio | P0 |

---

### Gap 2 — Observabilidade e Error Tracking ausentes (Média Prioridade)
Nenhum dos três reviews abordou a ausência de instrumentação de erros em produção:
- Sem Sentry, Datadog ou equivalente para captura de exceções
- Sem logs estruturados nas rotas de API
- O sistema de `alertas` no DB é interno (UX) mas não captura erros técnicos de runtime

O `gerarRoteiro()` no VideoDrawer usa `try/finally` sem `catch` visual (identificado pelo UX como FE-06), mas a ausência vai além do visual: **erros silenciosos em produção são invisíveis ao time de engenharia**.

**Impacto:** Médio — dificulta debugging e aumenta MTTR (Mean Time to Resolution).

**Recomendação:** Adicionar `OBS-01` ao epic:
| ID | Débito | Área | Impacto | Esforço | Prioridade |
|----|--------|------|---------|---------|------------|
| OBS-01 | Ausência de error tracking em runtime (Sentry ou equivalente) | Infra/Observabilidade | 🟡 Médio | 🧪 Médio | P2 |

---

### Gap 3 — Bug Funcional sem Story (Bloqueador de Produção)
O bug identificado por @ux-design-expert na aba "Pacote/Exportar" do `VideoDrawer`:
```tsx
// Verifica apenas roteiro, ignorando áudio e thumbnail
{!aprovado.roteiro && (...)}
// Deveria ser:
{(!aprovado.roteiro || !aprovado.audio || !aprovado.thumb) && (...)}
```

Este bug **não foi categorizado como débito técnico** em nenhum dos reviews — foi mencionado como observação. Como QA, classifico isso como **defeito funcional com impacto em produção**: um usuário pode agendar publicação de um vídeo no YouTube com áudio e thumbnail não aprovados/gerados.

**Recomendação:** Criar story separada `BUG-01` com alta prioridade, fora do epic de débitos técnicos (é um fix, não uma melhoria).

---

### Gap 4 — Testes Automatizados: coverage zero documentado
Nenhum dos reviews menciona a existência ou ausência de testes automatizados (unitários, integração, e2e). O `system-architecture.md` lista "Falta de testes" como débito sistêmico (SYS-03 refere linting, não testes diretamente), mas não há nenhum débito explícito sobre:
- Ausência de unit tests para componentes críticos (`VideoDrawer`, `VideoCard`)
- Ausência de integration tests para os endpoints de API
- Ausência de e2e tests para o fluxo principal (Ideia → Roteiro → Narração → Publicar)

**Recomendação:** Adicionar `TEST-01` ao epic:
| ID | Débito | Área | Impacto | Esforço | Prioridade |
|----|--------|------|---------|---------|------------|
| TEST-01 | Ausência de testes automatizados (unit + integration + e2e) | Qualidade | 🟡 Médio | 🏗️ Alto | P2 |

---

## 2. Riscos Cruzados

| Risco | Áreas Afetadas | Probabilidade | Impacto | Mitigação |
|-------|----------------|---------------|---------|-----------|
| **RC-01** DB-07 (OAuth tokens) + API não auditada → leak de tokens via endpoint comprometido | DB + API + FE | Alta | Crítico | Resolver DB-07 e API-01 no mesmo sprint |
| **RC-02** SYS-05 (types desatualizados) + novas migrations DB → build quebrado pós-migration | SYS + DB | Alta | Alto | Regenerar `database.types.ts` imediatamente após cada migration |
| **RC-03** FE-01 (VideoDrawer monolítico) + FE-03 (sem ARIA) → duplo risco em refatoração | FE | Média | Médio | Implementar ARIA antes ou durante a decomposição do Drawer |
| **RC-04** DB-08 (SECURITY DEFINER) em produção + novos usuários criados → privilege escalation ativo | DB + Segurança | Baixa | Crítico | Fix imediato — DB-08 é 0.5h e está em sprint P0 |
| **RC-05** BUG-01 (gate incompleto) + usuários ativos → publicações incompletas no YouTube | FE + Produto | Alta | Alto | Fix emergencial antes de qualquer deploy |

---

## 3. Dependências Validadas

### Ordem de Resolução — Validação da Sequência Proposta

```
✅ Sprint 1 (P0 / Segurança):
  DB-08 (0.5h) → DB-08 é pré-requisito para DB-07 (ambiente seguro antes de migration complexa)
  DB-01 (0.5h) → zero downtime, seguro resolver em paralelo com DB-08
  DB-07 (6h)   → requer deploy coordenado com camada de aplicação
  API-01 (?)   → adicionar aqui: auditar endpoints antes do deploy de DB-07
  FE-03+FE-08  → ARIA não tem dependência de DB, pode ser paralelo
  FE-01 (8h)   → decomposição do Drawer, não tem dependência de DB

⚠️ Dependência crítica identificada:
  DB-07 NÃO PODE ser resolvido sem mudança simultânea na camada de API.
  A migration que renomeia as colunas OAuth vai quebrar qualquer código que
  ainda referencie youtube_access_token (sem _enc). Precisa de deploy atômico:
  1. Atualizar código de aplicação para usar _enc + decrypt
  2. Aplicar migration
  3. Validar + deploy

✅ Sprint 2 (P1 / Auditoria e Qualidade):
  SYS-05 → resolver LOGO APÓS Sprint 1 (migrations novas exigem types atualizados)
  SYS-03 → linting pode ser paralelo
  DB-02/03/04 → sem dependências entre si, paralelos
  FE-04/05/09 → sem dependências críticas

✅ Sprint 3 (P2 / Performance e Excelência):
  DB-05 → corrige RLS, não afeta Sprint 1/2
  DB-09 → índice composto, safe
  FE-06/07 → melhorias de UX, sem bloqueio
  OBS-01/TEST-01 → fundação para qualidade contínua
```

**Bloqueios identificados:**
- `DB-07` bloqueia deploy seguro de qualquer feature que use OAuth do YouTube
- `BUG-01` bloqueia qualquer release para usuários finais (impacto direto em produto)
- `SYS-05` bloqueia desenvolvimento após qualquer migration de Sprint 1

---

## 4. Testes Requeridos por Área

### Database (pós-resolução)
```sql
-- Teste DB-01: Verificar índice criado
SELECT indexname FROM pg_indexes WHERE tablename = 'api_keys' AND indexname = 'idx_api_keys_user_id';

-- Teste DB-08: Verificar search_path fixado
SELECT prosecdef, proconfig FROM pg_proc WHERE proname = 'handle_new_user';
-- Expected: proconfig = {search_path=public}

-- Teste DB-07: Verificar que tokens não retornam em texto puro
-- (via row-level test como usuário auth)

-- Teste DB-02/03: Verificar triggers presentes
SELECT trigger_name FROM information_schema.triggers
  WHERE event_object_table IN ('profiles', 'api_keys', 'alertas');
```

### Frontend (pós-resolução)
```bash
# Teste FE-03: Auditoria ARIA automatizada
npx axe-cli http://localhost:3000/canais --include '[role="dialog"]'

# Teste WCAG: Lighthouse accessibility score
npx lighthouse http://localhost:3000 --only-categories=accessibility --output=json

# Teste BUG-01: Verificar gate da aba Exportar
# 1. Criar vídeo
# 2. Aprovar apenas roteiro
# 3. Navegar para aba Exportar
# 4. Verificar se botão "Agendar" está DESABILITADO
```

### API (pós-auditoria API-01)
```bash
# Teste de autorização: PATCH em vídeo de outro usuário deve retornar 403/401
curl -X PATCH /api/videos/<outro-user-video-id> \
  -H "Authorization: Bearer <token-usuario-a>" \
  -d '{"status": "publicado"}'
# Expected: 401 ou 403
```

### Critérios de Aceite por Débito (resumo)
| ID | Critério Mínimo de Aceite |
|----|--------------------------|
| DB-01 | `EXPLAIN` em query `SELECT * FROM api_keys WHERE user_id = $1` usa Index Scan |
| DB-07 | `youtube_access_token` coluna não existe mais; `youtube_access_token_enc` é texto cifrado |
| DB-08 | `pg_proc.proconfig` contém `search_path=public` para `handle_new_user` |
| FE-01 | `VideoDrawer.tsx` < 100 linhas; 5 arquivos de aba existem em `tabs/` |
| FE-03 | `axe-cli` retorna 0 violações para `role=dialog` |
| BUG-01 | Não é possível clicar em "Agendar" com áudio ou thumb não aprovados |
| API-01 | Todos os endpoints em `/api/` têm validação de ownership documentada |

---

## 5. Inventário Final Consolidado

### Contagem total após reviews especializados:

| Área | 🔴 Crítico (P0) | 🟡 Médio (P1/P2) | 🔵 Baixo (P3) | Total |
|------|----------------|-------------------|----------------|-------|
| Sistema | 0 | 2 | 3 | **5** |
| Database | 3 *(+2 DB-07/08)* | 4 | 2 | **9** |
| Frontend/UX | 4 *(+FE-08)* | 5 *(+FE-09)* | 0 | **9** |
| API | 1 *(+API-01)* | 0 | 0 | **1** |
| Infra/Obs | 0 | 1 *(+OBS-01)* | 0 | **1** |
| Qualidade | 0 | 1 *(+TEST-01)* | 0 | **1** |
| **TOTAL** | **8** | **13** | **5** | **26** |

> **+8 débitos** vs. 18 do DRAFT original — adicionados pelos especialistas e por este review.

### Horas totais revisadas:
| Área | Horas |
|------|-------|
| Sistema | ~3h |
| Database | 15h |
| Frontend/UX | 29h |
| API | ~6h (estimativa) |
| Infra/Obs + Testes | ~8h (estimativa) |
| **TOTAL** | **~61h** |

---

## 6. Parecer Final

### ✅ APPROVED — O assessment pode avançar para a Fase 8

**Pontos fortes do assessment:**
- Análise linha a linha do schema e dos componentes pelos especialistas (não apenas análise superficial)
- Identificação de 2 vulnerabilidades de segurança críticas não previstas (DB-07, DB-08)
- Respostas precisas e acionáveis às 9 perguntas abertas do @architect
- Script de migration pronto para P0+P1 de DB
- Arquitetura de decomposição do VideoDrawer proposta e validada

**Itens obrigatórios no Assessment Final (Fase 8):**
1. ✅ Incorporar API-01 como débito crítico
2. ✅ Incorporar BUG-01 como defeito funcional (story separada)
3. ✅ Incorporar OBS-01 e TEST-01 como débitos P2
4. ✅ Documentar dependência atômica DB-07 ↔ Camada de API
5. ✅ Atualizar contagem total: 26 débitos / ~61h / R$9.150 (a R$150/h)
6. ✅ Incluir RC-05 (BUG-01) como risco de produto não técnico

**Para o @architect na Fase 8:** O DRAFT pode ser promovido a Assessment Final incorporando os itens acima. A ordem de resolução validada é:
```
P0: DB-08 → DB-01 → BUG-01 → FE-03+FE-08 → FE-01 → DB-07+API-01 (coordenado)
P1: SYS-05 → SYS-03 → DB-02/03/04 → FE-04/05/09
P2: DB-05/09 → FE-06/07 → OBS-01 → TEST-01
P3: SYS-01/02 → DB-06 (condicional)
```

---

**Documento gerado por:** @qa (Quinn)
**Status:** ✅ Completo — Gate APPROVED para Fase 8

*— Quinn, guardião da qualidade 🛡️*
