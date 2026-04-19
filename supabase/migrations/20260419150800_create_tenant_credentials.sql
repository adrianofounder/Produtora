-- ============================================================
-- Story 3.1: Cofre de Credenciais e Limites (EPIC-03)
-- Arquitetura Agnóstica: Suporta qualquer provedor de IA
-- ============================================================
-- ATENÇÃO: Se já existir a tabela, use o script de ALTER abaixo.
-- Se for instância limpa, use o CREATE TABLE.
-- ============================================================

-- ---- OPÇÃO A: Instância Limpa (sem tabela prévia) ----
CREATE TABLE IF NOT EXISTS public.tenant_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Identificação Agnóstica do Provedor
    provider_type TEXT NOT NULL,         -- Chave técnica: 'llm_text', 'tts_audio', 'image_gen'
    provider_name TEXT NOT NULL,         -- Nome amigável: 'OpenAI GPT-4o', 'ElevenLabs', 'DeepSeek'

    -- Credencial (armazenada conforme RLS — nunca exposta ao client sem máscara)
    api_key TEXT NOT NULL DEFAULT '',    -- Pode ser vazio se is_system_fallback = TRUE

    -- Configuração Agnóstica (permite trocar de modelo sem código)
    base_url TEXT,                       -- Opcional: URL customizada para proxies ou IAs locais
    model_id TEXT,                       -- Opcional: 'gpt-4o', 'gemini-1.5-flash', 'vicuna-13b'

    -- Controle de Gastos (Teto Diário em Unidades Genéricas)
    max_daily_limit INTEGER DEFAULT 50000,    -- Teto em Unidades (1k tokens = 1k unidades)
    is_limit_active BOOLEAN DEFAULT TRUE,     -- Liga/desliga a trava de segurança
    daily_spend_count INTEGER DEFAULT 0,      -- Contador do dia atual (incrementado a cada chamada)
    last_reset_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()), -- Para reset diário

    -- Fallback para Chave do Sistema
    -- Se TRUE, quando api_key estiver vazia, o sistema usa a chave do .env correspondente
    -- RISCO: Maestro banca os custos. Use com teto baixo.
    is_system_fallback BOOLEAN DEFAULT FALSE,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),

    UNIQUE(user_id, provider_type)
);

-- ---- OPÇÃO B: ALTER TABLE (se a tabela já existe do protótipo anterior) ----
-- Descomente as linhas abaixo se necessário:
--
-- ALTER TABLE public.tenant_credentials 
--   ADD COLUMN IF NOT EXISTS provider_name TEXT NOT NULL DEFAULT 'Provedor IA',
--   ADD COLUMN IF NOT EXISTS base_url TEXT,
--   ADD COLUMN IF NOT EXISTS model_id TEXT,
--   ADD COLUMN IF NOT EXISTS daily_spend_count INTEGER DEFAULT 0,
--   ADD COLUMN IF NOT EXISTS last_reset_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
--   ADD COLUMN IF NOT EXISTS is_system_fallback BOOLEAN DEFAULT FALSE;
--
-- -- Renomear max_daily_tokens → max_daily_limit (se usando protótipo anterior)
-- ALTER TABLE public.tenant_credentials
--   RENAME COLUMN max_daily_tokens TO max_daily_limit;

-- ============================================================
-- RLS (Row Level Security) — Isolamento por Tenant
-- Cada usuário só enxerga as próprias credenciais
-- ============================================================
ALTER TABLE public.tenant_credentials ENABLE ROW LEVEL SECURITY;

-- Remove policies antigas se existirem
DROP POLICY IF EXISTS "Credenciais tenant auth" ON public.tenant_credentials;

-- Política principal: Acesso total APENAS ao próprio dono
CREATE POLICY "tenant_credentials_owner_only"
ON public.tenant_credentials
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- Índices para performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_tenant_credentials_user_id 
ON public.tenant_credentials(user_id);

CREATE INDEX IF NOT EXISTS idx_tenant_credentials_provider_type 
ON public.tenant_credentials(user_id, provider_type);

-- ============================================================
-- Trigger para atualizar updated_at automaticamente
-- ============================================================
CREATE OR REPLACE FUNCTION update_tenant_credentials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_tenant_credentials_updated_at ON public.tenant_credentials;

CREATE TRIGGER trigger_tenant_credentials_updated_at
  BEFORE UPDATE ON public.tenant_credentials
  FOR EACH ROW
  EXECUTE FUNCTION update_tenant_credentials_updated_at();
