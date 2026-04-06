-- Migration: Criptografar Tokens OAuth (Story 1.6)
-- Migration Strategy: Swap columns
-- Author: @data-engineer (Dara)

-- Como não temos tokens oAuth em produção para migrar ainda, 
-- optamos por uma estratégia Greenfield (apenas troca de colunas).
-- A encriptação AES-256-GCM será tratada nativamente pelo backend (Node.js).

-- 1. Adicionamos as colunas com _enc que suportarão ciphertexts grandes
ALTER TABLE public.canais
  ADD COLUMN youtube_access_token_enc TEXT,
  ADD COLUMN youtube_refresh_token_enc TEXT;

-- 2. Dropamos as colunas em plain-text antigas vulneráveis
ALTER TABLE public.canais
  DROP COLUMN youtube_access_token,
  DROP COLUMN youtube_refresh_token;

-- FIM DA MIGRATION
