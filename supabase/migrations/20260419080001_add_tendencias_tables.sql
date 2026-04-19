-- ============================================================
-- AD_LABS — Migração: Tabelas de Tendências e Garimpos (Worker OpenCLI-rs)
-- ============================================================

-- Tabela para os pontos do Gráfico de Dispersão (Matriz Oceano Azul)
CREATE TABLE IF NOT EXISTS public.matriz_nichos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  label TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('lotado', 'gap')),
  x NUMERIC(5,2) NOT NULL, -- Coordenada X (ex: Sentimento Dominante / Dificuldade)
  y NUMERIC(5,2) NOT NULL, -- Coordenada Y (ex: Concorrência / Demanda)
  opacity NUMERIC(3,2),
  pulse BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela para os vídeos garimpados (Resultados de pesquisa virais)
CREATE TABLE IF NOT EXISTS public.garimpos_minados (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  titulo TEXT NOT NULL,
  canal TEXT NOT NULL,
  views_text TEXT NOT NULL,
  views_count BIGINT DEFAULT 0,
  thumbnail_url TEXT,
  tag TEXT,
  publish_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.matriz_nichos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.garimpos_minados ENABLE ROW LEVEL SECURITY;

-- As tendências são globais (descobertas pelo OpenCLI-rs) e lidas por qualquer usuário autenticado
CREATE POLICY "matriz_nichos_read_all" ON public.matriz_nichos FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "garimpos_read_all" ON public.garimpos_minados FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================================
-- ATUALIZAÇÃO DE UPDATED_AT
-- ============================================================
CREATE TRIGGER set_matriz_nichos_updated_at BEFORE UPDATE ON public.matriz_nichos
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
