# Story 1.6 — Criptografar Tokens OAuth do YouTube

**Story ID:** 1.6
**Epic:** EPIC-01 — Resolução de Débitos Técnicos
**Sprint:** 1 — Segurança & Bloqueadores
**Prioridade:** 🔴 P0 — Crítico (⚠️ EXECUTAR APÓS Story 1.3)
**Estimativa:** 6h
**Assignee:** @data-engineer + @dev

---

## User Story

**Como** usuário que conectou meu canal do YouTube à plataforma,
**Quero** que minhas credenciais de acesso sejam armazenadas com criptografia,
**Para que** nenhuma pessoa com acesso ao banco de dados possa usar meu token para controlar meu canal.

---

## Contexto / Problema

**DB-07:** As colunas `youtube_access_token` e `youtube_refresh_token` na tabela `public.canais` armazenam tokens OAuth do YouTube como `TEXT NOT NULL` sem criptografia. Qualquer pessoa com acesso ao banco (export, backup, inspeção pelo Supabase Dashboard) consegue extrair esses tokens e usá-los para publicar, editar ou deletar vídeos nos canais dos usuários.

O projeto já possui `pgcrypto` instalado — criptografia via `pgp_sym_encrypt/pgp_sym_decrypt` é o caminho.

> ⚠️ **Dependência crítica:** Esta story DEVE ser executada APÓS a Story 1.3 (API-01). A migration que renomeia as colunas irá quebrar qualquer código que ainda referencie `youtube_access_token` sem `_enc`. O deploy deve ser atômico: código atualizado + migration ao mesmo tempo.

---

## Acceptance Criteria

- [ ] **AC1:** As colunas `youtube_access_token` e `youtube_refresh_token` não existem mais na tabela `canais`
- [ ] **AC2:** Existem as colunas `youtube_access_token_enc` e `youtube_refresh_token_enc` com valores criptografados
- [ ] **AC3:** A aplicação consegue fazer encrypt ao salvar e decrypt ao ler tokens OAuth
- [ ] **AC4:** A chave de criptografia é armazenada em variável de ambiente (não hardcoded)
- [ ] **AC5:** Tokens existentes (se houver) são migrados e criptografados durante a migration
- [ ] **AC6:** O fluxo de autenticação OAuth com o YouTube continua funcionando após a migration

---

## Tasks

**DB (Parte 1 — Migration):**
- [ ] **T1:** Criar migration SQL:
  ```sql
  -- Adicionar colunas criptografadas
  ALTER TABLE public.canais
    ADD COLUMN youtube_access_token_enc TEXT,
    ADD COLUMN youtube_refresh_token_enc TEXT;

  -- Migrar dados existentes (criptografar com pgcrypto)
  UPDATE public.canais
    SET youtube_access_token_enc = pgp_sym_encrypt(youtube_access_token, current_setting('app.encryption_key')),
        youtube_refresh_token_enc = pgp_sym_encrypt(youtube_refresh_token, current_setting('app.encryption_key'))
    WHERE youtube_access_token IS NOT NULL;

  -- Remover colunas antigas
  ALTER TABLE public.canais
    DROP COLUMN youtube_access_token,
    DROP COLUMN youtube_refresh_token;
  ```
- [ ] **T2:** Configurar `app.encryption_key` via Supabase Vault ou `ALTER DATABASE SET`

**App (Parte 2 — Código):**
- [ ] **T3:** Criar utilitário `src/lib/crypto.ts` com funções `encryptToken(token)` e `decryptToken(encrypted)` usando a chave de env
- [ ] **T4:** Atualizar todos os pontos do código que leem `youtube_access_token` para usar decrypt
- [ ] **T5:** Atualizar todos os pontos que escrevem `youtube_access_token` para usar encrypt
- [ ] **T6:** Garantir que `ENCRYPTION_KEY` está configurada em `.env.local` e nas variáveis de ambiente do Supabase/Vercel

**Deploy Atômico:**
- [ ] **T7:** Deploy do código atualizado (T3-T6) ANTES de aplicar a migration (T1)
- [ ] **T8:** Aplicar migration e validar
- [ ] **T9:** Smoke test do fluxo OAuth após migration

---

## Testes Requeridos

```sql
-- Verificar que colunas antigas não existem
SELECT column_name FROM information_schema.columns
  WHERE table_name = 'canais' AND column_name IN ('youtube_access_token', 'youtube_refresh_token');
-- Expected: 0 rows

-- Verificar que colunas enc existem e têm dados (não nulos se havia tokens antes)
SELECT youtube_access_token_enc IS NOT NULL FROM canais LIMIT 1;
-- Expected: true (se havia canal conectado)
```

```
Cenário: Token criptografado não legível em texto puro
  DADO que exporto um dump da tabela canais
  QUANDO inspeciono youtube_access_token_enc
  ENTÃO o valor é texto cifrado (não um token JWT legível)

Cenário: Fluxo OAuth continua funcionando
  DADO que um canal está conectado ao YouTube
  QUANDO a plataforma usa o token para publicar um vídeo
  ENTÃO a publicação é bem-sucedida (decrypt funciona corretamente)
```

---

## Definition of Done

- [ ] Migration aplicada em produção com sucesso
- [ ] Zero referências a `youtube_access_token` (sem `_enc`) no código
- [ ] `ENCRYPTION_KEY` configurada em produção e não exposta em logs
- [ ] Fluxo OAuth testado end-to-end após migration
- [ ] @qa validou acceptance criteria

---

*Story criada por @pm (Morgan) — EPIC-01, Sprint 1*
*⚠️ Executar SOMENTE APÓS conclusão de Story 1.3 (API-01).*
