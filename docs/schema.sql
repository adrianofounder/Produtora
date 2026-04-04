-- ============================================================
-- AD_LABS — Schema Supabase (PostgreSQL)
-- Execute este script no SQL Editor do Supabase Dashboard
-- https://supabase.com/dashboard/project/ahntcswcfuscmuyiadre/sql
-- ============================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- PROFILES (espelho de auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para criar profile automaticamente no signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================
-- CANAIS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.canais (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  descricao TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  idioma TEXT NOT NULL DEFAULT 'pt-BR',
  pais TEXT NOT NULL DEFAULT 'BR',
  categoria TEXT NOT NULL DEFAULT 'Entretenimento',
  privacidade_padrao TEXT NOT NULL DEFAULT 'unlisted' CHECK (privacidade_padrao IN ('public', 'unlisted', 'private')),
  frequencia_dia INTEGER NOT NULL DEFAULT 1,
  horario_padrao TEXT NOT NULL DEFAULT '18:00',
  email_contato TEXT,
  conteudo_sintetico BOOLEAN NOT NULL DEFAULT TRUE,
  mare_status TEXT NOT NULL DEFAULT 'aguardando' CHECK (mare_status IN ('aguardando', 'testando', 'ativa', 'pausada')),
  mare_eixo_ativo TEXT,
  -- YouTube OAuth
  youtube_channel_id TEXT,
  youtube_access_token TEXT,
  youtube_refresh_token TEXT,
  youtube_token_expires_at TIMESTAMPTZ,
  -- Auto-Refill Motor
  motor_ativo BOOLEAN NOT NULL DEFAULT FALSE,
  estoque_minimo_planejamento INTEGER NOT NULL DEFAULT 10,
  estoque_minimo_producao INTEGER NOT NULL DEFAULT 5,
  auto_aprovacao_titulos BOOLEAN NOT NULL DEFAULT FALSE,
  auto_aprovacao_roteiros BOOLEAN NOT NULL DEFAULT FALSE,
  auto_post BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- VIDEOS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  canal_id UUID REFERENCES public.canais(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  titulo TEXT NOT NULL,
  titulo_oficial TEXT,
  eixo TEXT,
  status TEXT NOT NULL DEFAULT 'planejamento' CHECK (status IN ('planejamento', 'producao', 'pronto', 'agendado', 'publicado', 'erro')),
  data_previsao DATE,
  data_publicacao TIMESTAMPTZ,
  -- Conteúdo
  roteiro TEXT,
  roteiro_aprovado BOOLEAN NOT NULL DEFAULT FALSE,
  audio_url TEXT,
  audio_aprovado BOOLEAN NOT NULL DEFAULT FALSE,
  thumb_url TEXT,
  thumb_aprovada BOOLEAN NOT NULL DEFAULT FALSE,
  -- YouTube
  youtube_video_id TEXT,
  youtube_upload_status TEXT CHECK (youtube_upload_status IN ('pendente', 'processando', 'concluido', 'erro')),
  -- Checklist operacional (7 steps)
  step_titulo BOOLEAN NOT NULL DEFAULT FALSE,
  step_roteiro BOOLEAN NOT NULL DEFAULT FALSE,
  step_audio BOOLEAN NOT NULL DEFAULT FALSE,
  step_imagens BOOLEAN NOT NULL DEFAULT FALSE,
  step_montagem BOOLEAN NOT NULL DEFAULT FALSE,
  step_thumb BOOLEAN NOT NULL DEFAULT FALSE,
  step_agendado BOOLEAN NOT NULL DEFAULT FALSE,
  -- Audit trail (NFR06)
  aprovado_por UUID REFERENCES auth.users(id),
  aprovado_via TEXT CHECK (aprovado_via IN ('humano', 'automacao')),
  -- Metadados YouTube
  descricao_youtube TEXT,
  tags TEXT[],
  -- Origem
  criado_por UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- EIXOS (Motor de Marés)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.eixos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  canal_id UUID REFERENCES public.canais(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  premissa TEXT,
  publico_alvo TEXT,
  sentimento_dominante TEXT,
  gatilho_curiosidade TEXT,
  arquetipo_protagonista TEXT,
  arquetipo_antagonista TEXT,
  tipo_conflito TEXT,
  cenario_recorrente TEXT,
  payoff TEXT,
  estilo_narrativo TEXT,
  taxa_concorrencia TEXT CHECK (taxa_concorrencia IN ('alta', 'media', 'baixa')),
  score_retencao NUMERIC(3,1),
  rpm_estimado NUMERIC(10,2),
  formula_titulo TEXT,
  palavras_negativas TEXT[],
  cores_thumb TEXT,
  elemento_visual TEXT,
  complexidade_edicao INTEGER CHECK (complexidade_edicao BETWEEN 1 AND 5),
  duracao_min INTEGER,
  duracao_max INTEGER,
  status TEXT NOT NULL DEFAULT 'testando' CHECK (status IN ('testando', 'aguardando', 'venceu', 'cancelado')),
  views_acumuladas BIGINT NOT NULL DEFAULT 0,
  score_mare NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BLUEPRINTS (Studio)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.blueprints (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  canal_id UUID REFERENCES public.canais(id) ON DELETE CASCADE NOT NULL UNIQUE,
  titulo_benchmark TEXT,
  canal_benchmark TEXT,
  performance_score NUMERIC(4,2),
  hook TEXT,
  voz_narrador TEXT,
  emocao_dominante TEXT,
  retention_loop TEXT,
  conflito_central TEXT,
  plot_twist TEXT,
  estrutura_emocional TEXT,
  tipo_narrativa TEXT,
  estetica_visual TEXT,
  ritmo_edicao TEXT,
  formula_emocional TEXT,
  quality_score NUMERIC(3,1),
  market_signal TEXT,
  veredito TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ALERTAS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.alertas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  canal_id UUID REFERENCES public.canais(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('erro', 'aviso', 'mare', 'info')),
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  lido BOOLEAN NOT NULL DEFAULT FALSE,
  link_acao TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- API KEYS (criptografadas)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  provedor TEXT NOT NULL,
  label TEXT NOT NULL,
  chave_criptografada TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'erro', 'inativo')),
  ultimo_uso TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (NFR03 — Multi-Tenant Isolation)
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eixos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blueprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alertas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Profiles: usuário só vê o próprio
CREATE POLICY "profiles_own" ON public.profiles FOR ALL USING (auth.uid() = id);

-- Canais: usuário só vê os próprios
CREATE POLICY "canais_own" ON public.canais FOR ALL USING (auth.uid() = user_id);

-- Videos: usuário só vê os próprios
CREATE POLICY "videos_own" ON public.videos FOR ALL USING (auth.uid() = user_id);

-- Eixos: via canal do usuário
CREATE POLICY "eixos_own" ON public.eixos FOR ALL
  USING (canal_id IN (SELECT id FROM public.canais WHERE user_id = auth.uid()));

-- Blueprints: via canal do usuário
CREATE POLICY "blueprints_own" ON public.blueprints FOR ALL
  USING (canal_id IN (SELECT id FROM public.canais WHERE user_id = auth.uid()));

-- Alertas: usuário só vê os próprios
CREATE POLICY "alertas_own" ON public.alertas FOR ALL USING (auth.uid() = user_id);

-- API Keys: usuário só vê as próprias
CREATE POLICY "api_keys_own" ON public.api_keys FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- ÍNDICES DE PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_canais_user_id ON public.canais(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_canal_id ON public.videos(canal_id);
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON public.videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_status ON public.videos(status);
CREATE INDEX IF NOT EXISTS idx_eixos_canal_id ON public.eixos(canal_id);
CREATE INDEX IF NOT EXISTS idx_alertas_user_lido ON public.alertas(user_id, lido);

-- ============================================================
-- FUNÇÃO: updated_at automático
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_canais_updated_at BEFORE UPDATE ON public.canais
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

CREATE TRIGGER set_videos_updated_at BEFORE UPDATE ON public.videos
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

CREATE TRIGGER set_eixos_updated_at BEFORE UPDATE ON public.eixos
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

CREATE TRIGGER set_blueprints_updated_at BEFORE UPDATE ON public.blueprints
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
