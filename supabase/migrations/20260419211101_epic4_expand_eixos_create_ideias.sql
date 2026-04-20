-- ============================================================
-- EPIC-04 / Story 4.1 — Expand eixos + Create ideias
-- Idempotent migration (safe to run multiple times)
-- RLS pattern: indireção via canal_id (NFR03)
-- ============================================================

BEGIN;

-- ============================================================
-- PARTE 1: EXPANDIR TABELA eixos COM CAMPOS DO DNA TEMÁTICO
-- Apenas colunas genuinamente novas (não duplicar as existentes)
-- Campos existentes preservados:
--   sentimento_dominante, gatilho_curiosidade, publico_alvo,
--   taxa_concorrencia, score_retencao, rpm_estimado,
--   elemento_visual, cores_thumb, formula_titulo,
--   palavras_negativas, arquetipo_protagonista, arquetipo_antagonista,
--   tipo_conflito, cenario_recorrente, payoff,
--   estilo_narrativo, complexidade_edicao, duracao_min, duracao_max,
--   score_mare, views_acumuladas, status
-- ============================================================

ALTER TABLE public.eixos
  -- DNA Temático: campos genuinamente novos
  ADD COLUMN IF NOT EXISTS hook           TEXT,
  ADD COLUMN IF NOT EXISTS safewords      TEXT[],

  -- Analytics agregados (alimentados pelo Motor Marés — Story 4.3)
  ADD COLUMN IF NOT EXISTS media_views        BIGINT        NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS taxa_aprovacao     NUMERIC(5,2)  NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS videos_count       INT           NOT NULL DEFAULT 0,

  -- Motor Marés: campos de cache e histórico (Story 4.3)
  ADD COLUMN IF NOT EXISTS score_mare_anterior  NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS score_calculado_em   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS views_7d             BIGINT        NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ctr                  NUMERIC(5,2)  NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS retencao             NUMERIC(5,2)  NOT NULL DEFAULT 0,

  -- Auto-Refill: kill-switch por eixo (Story 4.4)
  ADD COLUMN IF NOT EXISTS auto_refill_enabled  BOOLEAN       NOT NULL DEFAULT TRUE;

-- Comentários de documentação (padrão Dara)
COMMENT ON COLUMN public.eixos.hook IS 'Frase ou estrutura de gancho usada nos títulos deste eixo';
COMMENT ON COLUMN public.eixos.safewords IS 'Palavras ou temas proibidos para este eixo (filtro de segurança)';
COMMENT ON COLUMN public.eixos.media_views IS 'Média de views acumulada dos vídeos deste eixo (pré-calculada pelo Motor Marés)';
COMMENT ON COLUMN public.eixos.taxa_aprovacao IS '% de ideias deste eixo aprovadas e publicadas';
COMMENT ON COLUMN public.eixos.videos_count IS 'Total de vídeos publicados neste eixo';
COMMENT ON COLUMN public.eixos.score_mare_anterior IS 'Score Marés do período anterior (para cálculo de direção ▲▼→)';
COMMENT ON COLUMN public.eixos.score_calculado_em IS 'Timestamp do último cálculo de score_mare pelo Motor Marés';
COMMENT ON COLUMN public.eixos.views_7d IS 'Views acumuladas nos últimos 7 dias (KPI do TrendAnalysis)';
COMMENT ON COLUMN public.eixos.ctr IS 'Click-Through Rate médio dos vídeos do eixo (%)';
COMMENT ON COLUMN public.eixos.retencao IS 'Taxa de retenção média dos vídeos do eixo (%)';
COMMENT ON COLUMN public.eixos.auto_refill_enabled IS 'Kill-switch por eixo: FALSE desativa geração automática de ideias para este eixo';

-- ============================================================
-- PARTE 2: CRIAR TABELA ideias
-- ============================================================

CREATE TABLE IF NOT EXISTS public.ideias (
  id            UUID          DEFAULT uuid_generate_v4() PRIMARY KEY,
  canal_id      UUID          NOT NULL REFERENCES public.canais(id) ON DELETE CASCADE,
  eixo_id       UUID          NOT NULL REFERENCES public.eixos(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ   DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   DEFAULT NOW(),

  -- Conteúdo
  titulo        TEXT          NOT NULL,
  premissa      TEXT,
  nota_ia       NUMERIC(4,2)  CHECK (nota_ia BETWEEN 0 AND 10),
  tags          TEXT[],

  -- Pipeline
  status        TEXT          NOT NULL DEFAULT 'pendente'
                  CHECK (status IN ('pendente', 'fabrica', 'planejamento', 'publicado')),

  -- Auditoria (NFR06)
  origem        TEXT          NOT NULL DEFAULT 'Humano'
                  CHECK (origem IN ('Humano', '[Automação Lvl 3]')),
  origem_uuid   UUID          REFERENCES auth.users(id) ON DELETE SET NULL
);

COMMENT ON TABLE public.ideias IS 'Ideias de vídeo geradas no Laboratório. Alimentam o Kanban da Fábrica quando status = planejamento.';
COMMENT ON COLUMN public.ideias.origem IS 'Humano: ação manual. [Automação Lvl 3]: gerada pelo Auto-Refill (NFR06).';
COMMENT ON COLUMN public.ideias.origem_uuid IS 'UUID do usuário que gerou a ideia. NULL se gerada pelo Auto-Refill.';

-- ============================================================
-- PARTE 3: RLS para ideias (padrão do projeto — indireção via canal)
-- NFR03: Tenant A nunca acessa dados de Tenant B
-- ============================================================

ALTER TABLE public.ideias ENABLE ROW LEVEL SECURITY;

-- Policy única FOR ALL (SELECT + INSERT + UPDATE + DELETE)
-- Padrão: canal_id IN (SELECT id FROM canais WHERE user_id = auth.uid())
CREATE POLICY IF NOT EXISTS "ideias_own" ON public.ideias
  FOR ALL
  USING (
    canal_id IN (
      SELECT id FROM public.canais WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    canal_id IN (
      SELECT id FROM public.canais WHERE user_id = auth.uid()
    )
  );

-- ============================================================
-- PARTE 4: VERIFICAR policy da tabela eixos (garantir cobertura FOR ALL)
-- A policy "eixos_own" existente usa FOR ALL — apenas confirmar
-- Se não existir (ambiente limpo), recriar
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'eixos' AND policyname = 'eixos_own'
  ) THEN
    CREATE POLICY "eixos_own" ON public.eixos
      FOR ALL
      USING (
        canal_id IN (
          SELECT id FROM public.canais WHERE user_id = auth.uid()
        )
      )
      WITH CHECK (
        canal_id IN (
          SELECT id FROM public.canais WHERE user_id = auth.uid()
        )
      );
    RAISE NOTICE 'Policy eixos_own recriada (estava ausente)';
  ELSE
    RAISE NOTICE 'Policy eixos_own já existe — nenhuma ação necessária';
  END IF;
END $$;

-- ============================================================
-- PARTE 5: TRIGGER updated_at para ideias
-- Reutiliza function public.set_updated_at() já existente
-- ============================================================

DROP TRIGGER IF EXISTS set_ideias_updated_at ON public.ideias;
CREATE TRIGGER set_ideias_updated_at
  BEFORE UPDATE ON public.ideias
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- ============================================================
-- PARTE 6: ÍNDICES DE PERFORMANCE para ideias
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_ideias_canal_id ON public.ideias(canal_id);
CREATE INDEX IF NOT EXISTS idx_ideias_eixo_id  ON public.ideias(eixo_id);
CREATE INDEX IF NOT EXISTS idx_ideias_status   ON public.ideias(status);

-- Índice composto para a query do Auto-Refill (Story 4.4):
-- "Top 5 ideias pendentes do eixo vencedor, ordenadas por nota_ia"
CREATE INDEX IF NOT EXISTS idx_ideias_eixo_status_nota
  ON public.ideias(eixo_id, status, nota_ia DESC NULLS LAST);

-- ============================================================
-- PARTE 7: ÍNDICE adicional para Motor Marés (Story 4.3)
-- Query: eixos do canal ordenados por score_mare DESC
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_eixos_canal_score
  ON public.eixos(canal_id, score_mare DESC NULLS LAST);

COMMIT;
