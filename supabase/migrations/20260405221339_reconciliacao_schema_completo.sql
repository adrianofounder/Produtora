-- ==============================================================================
-- Migration: Reconciliação Completa do Schema
-- Alinha o banco de dados com database.types.ts (verdade do código)
-- Estratégia: ADD colunass faltando + renomear + mover colunas erradas
-- ==============================================================================

-- ==============================================================================
-- 1. PROFILES — Remover colunas youtube que foram erroneamente criadas aqui
--    (os tokens ficam em `canais`, não em `profiles`)
-- ==============================================================================
ALTER TABLE public.profiles
  DROP COLUMN IF EXISTS youtube_access_token_enc,
  DROP COLUMN IF EXISTS youtube_refresh_token_enc,
  DROP COLUMN IF EXISTS youtube_token_expires_at;


-- ==============================================================================
-- 2. CANAIS — Adicionar todas as colunas faltando
-- ==============================================================================
ALTER TABLE public.canais
  -- Configurações de conteúdo
  ADD COLUMN IF NOT EXISTS categoria             TEXT NOT NULL DEFAULT 'entretenimento',
  ADD COLUMN IF NOT EXISTS privacidade_padrao    TEXT NOT NULL DEFAULT 'public',
  ADD COLUMN IF NOT EXISTS frequencia_dia        INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS horario_padrao        TEXT NOT NULL DEFAULT '10:00',
  ADD COLUMN IF NOT EXISTS email_contato         TEXT,
  ADD COLUMN IF NOT EXISTS conteudo_sintetico    BOOLEAN NOT NULL DEFAULT false,

  -- Sistema MARE
  ADD COLUMN IF NOT EXISTS mare_status           TEXT NOT NULL DEFAULT 'aguardando',
  ADD COLUMN IF NOT EXISTS mare_eixo_ativo       UUID REFERENCES public.eixos(id) ON DELETE SET NULL,

  -- Integração YouTube (OAuth Seguro)
  ADD COLUMN IF NOT EXISTS youtube_channel_id    TEXT,
  ADD COLUMN IF NOT EXISTS youtube_access_token_enc   TEXT,
  ADD COLUMN IF NOT EXISTS youtube_refresh_token_enc  TEXT,
  ADD COLUMN IF NOT EXISTS youtube_token_expires_at   TIMESTAMPTZ,

  -- Motor de automação
  ADD COLUMN IF NOT EXISTS motor_ativo                   BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS estoque_minimo_planejamento   INTEGER NOT NULL DEFAULT 5,
  ADD COLUMN IF NOT EXISTS estoque_minimo_producao       INTEGER NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS auto_aprovacao_titulos        BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS auto_aprovacao_roteiros       BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS auto_post                     BOOLEAN NOT NULL DEFAULT false;

-- Adicionar CHECK constraints de enum (com IF NOT EXISTS manual)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'canais_privacidade_padrao_check') THEN
    ALTER TABLE public.canais ADD CONSTRAINT canais_privacidade_padrao_check CHECK (privacidade_padrao IN ('public', 'unlisted', 'private'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'canais_mare_status_check') THEN
    ALTER TABLE public.canais ADD CONSTRAINT canais_mare_status_check CHECK (mare_status IN ('aguardando', 'testando', 'ativa', 'pausada'));
  END IF;
END $$;


-- ==============================================================================
-- 3. EIXOS — Renomear `titulo` → `nome` e adicionar colunas faltando
-- ==============================================================================

-- 3a. Renomear `titulo` para `nome` se ainda existir com nome antigo
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'eixos' AND column_name = 'titulo'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'eixos' AND column_name = 'nome'
  ) THEN
    ALTER TABLE public.eixos RENAME COLUMN titulo TO nome;
  END IF;
END $$;

-- 3b. Adicionar coluna `nome` se não existir (caso o banco tenha outro nome ancora)
ALTER TABLE public.eixos
  ADD COLUMN IF NOT EXISTS nome TEXT;

-- 3c. Adicionar todas as colunas especializadas de eixo
ALTER TABLE public.eixos
  ADD COLUMN IF NOT EXISTS premissa               TEXT,
  ADD COLUMN IF NOT EXISTS publico_alvo           TEXT,
  ADD COLUMN IF NOT EXISTS sentimento_dominante   TEXT,
  ADD COLUMN IF NOT EXISTS gatilho_curiosidade    TEXT,
  ADD COLUMN IF NOT EXISTS arquetipo_protagonista TEXT,
  ADD COLUMN IF NOT EXISTS arquetipo_antagonista  TEXT,
  ADD COLUMN IF NOT EXISTS tipo_conflito          TEXT,
  ADD COLUMN IF NOT EXISTS cenario_recorrente     TEXT,
  ADD COLUMN IF NOT EXISTS payoff                 TEXT,
  ADD COLUMN IF NOT EXISTS estilo_narrativo       TEXT,
  ADD COLUMN IF NOT EXISTS taxa_concorrencia      TEXT,
  ADD COLUMN IF NOT EXISTS score_retencao         NUMERIC,
  ADD COLUMN IF NOT EXISTS rpm_estimado           NUMERIC,
  ADD COLUMN IF NOT EXISTS formula_titulo         TEXT,
  ADD COLUMN IF NOT EXISTS palavras_negativas     TEXT[],
  ADD COLUMN IF NOT EXISTS cores_thumb            TEXT,
  ADD COLUMN IF NOT EXISTS elemento_visual        TEXT,
  ADD COLUMN IF NOT EXISTS complexidade_edicao    NUMERIC,
  ADD COLUMN IF NOT EXISTS duracao_min            NUMERIC,
  ADD COLUMN IF NOT EXISTS duracao_max            NUMERIC,
  ADD COLUMN IF NOT EXISTS status                 TEXT NOT NULL DEFAULT 'aguardando';

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'eixos_taxa_concorrencia_check') THEN
    ALTER TABLE public.eixos ADD CONSTRAINT eixos_taxa_concorrencia_check CHECK (taxa_concorrencia IN ('alta', 'media', 'baixa'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'eixos_status_check') THEN
    ALTER TABLE public.eixos ADD CONSTRAINT eixos_status_check CHECK (status IN ('testando', 'aguardando', 'venceu', 'cancelado'));
  END IF;
END $$;


-- ==============================================================================
-- 4. VIDEOS — Adicionar todas as colunas faltando + renomear existentes
-- ==============================================================================

-- 4a. Renomear `descricao` → `descricao_youtube` se existir
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'videos' AND column_name = 'descricao'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'videos' AND column_name = 'descricao_youtube'
  ) THEN
    ALTER TABLE public.videos RENAME COLUMN descricao TO descricao_youtube;
  END IF;
END $$;

-- 4b. Adicionar user_id se não existir
ALTER TABLE public.videos
  ADD COLUMN IF NOT EXISTS user_id          UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS titulo_oficial   TEXT,
  ADD COLUMN IF NOT EXISTS eixo             TEXT,
  ADD COLUMN IF NOT EXISTS data_previsao    DATE,
  ADD COLUMN IF NOT EXISTS data_publicacao  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS roteiro          TEXT,
  ADD COLUMN IF NOT EXISTS roteiro_aprovado BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS audio_url        TEXT,
  ADD COLUMN IF NOT EXISTS audio_aprovado   BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS thumb_url        TEXT,
  ADD COLUMN IF NOT EXISTS thumb_aprovada   BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS youtube_video_id        TEXT,
  ADD COLUMN IF NOT EXISTS youtube_upload_status   TEXT DEFAULT 'pendente',
  ADD COLUMN IF NOT EXISTS step_titulo      BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS step_roteiro     BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS step_audio       BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS step_imagens     BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS step_montagem    BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS step_thumb       BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS step_agendado    BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS aprovado_por     UUID,
  ADD COLUMN IF NOT EXISTS aprovado_via     TEXT,
  ADD COLUMN IF NOT EXISTS descricao_youtube TEXT,
  ADD COLUMN IF NOT EXISTS tags             TEXT[],
  ADD COLUMN IF NOT EXISTS criado_por       UUID;

-- 4c. Atualizar status para o padrão certo
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'videos_status_check') THEN
    ALTER TABLE public.videos ADD CONSTRAINT videos_status_check CHECK (status IN ('planejamento', 'producao', 'pronto', 'agendado', 'publicado', 'erro'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'videos_youtube_upload_status_check') THEN
    ALTER TABLE public.videos ADD CONSTRAINT videos_youtube_upload_status_check CHECK (youtube_upload_status IN ('pendente', 'processando', 'concluido', 'erro'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'videos_aprovado_via_check') THEN
    ALTER TABLE public.videos ADD CONSTRAINT videos_aprovado_via_check CHECK (aprovado_via IN ('humano', 'automacao'));
  END IF;
END $$;


-- ==============================================================================
-- 5. BLUEPRINTS — Adicionar colunas faltando
-- ==============================================================================
ALTER TABLE public.blueprints
  ADD COLUMN IF NOT EXISTS emocao_dominante    TEXT,
  ADD COLUMN IF NOT EXISTS retention_loop      TEXT,
  ADD COLUMN IF NOT EXISTS conflito_central    TEXT,
  ADD COLUMN IF NOT EXISTS plot_twist          TEXT,
  ADD COLUMN IF NOT EXISTS estrutura_emocional TEXT,
  ADD COLUMN IF NOT EXISTS tipo_narrativa      TEXT,
  ADD COLUMN IF NOT EXISTS estetica_visual     TEXT,
  ADD COLUMN IF NOT EXISTS ritmo_edicao        TEXT;


-- ==============================================================================
-- 6. Trigger updated_at para as tabelas que não têm
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar o trigger em todas as tabelas com updated_at
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['canais', 'videos', 'eixos', 'blueprints', 'profiles', 'api_keys'] LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_trigger
      WHERE tgname = 'set_updated_at_' || t AND tgrelid = ('public.' || t)::regclass
    ) THEN
      EXECUTE format(
        'CREATE TRIGGER set_updated_at_%I BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()',
        t, t
      );
    END IF;
  END LOOP;
END $$;
