-- ==============================================================================
-- Story 3.1 — Otimização de Performance no Database
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- T1 & T2: Migrar policy RLS de eixos e blueprints para usar EXISTS em vez de IN
-- ------------------------------------------------------------------------------

-- Eixos
DROP POLICY IF EXISTS "eixos_own" ON public.eixos;
CREATE POLICY "eixos_own" ON public.eixos FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.canais
    WHERE canais.id = eixos.canal_id
      AND canais.user_id = auth.uid()
  ));

-- Blueprints
DROP POLICY IF EXISTS "blueprints_own" ON public.blueprints;
CREATE POLICY "blueprints_own" ON public.blueprints FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.canais
    WHERE canais.id = blueprints.canal_id
      AND canais.user_id = auth.uid()
  ));

-- ------------------------------------------------------------------------------
-- T3: Criar índice composto em canais para otimizar dashboard e filtros MARE
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_canais_user_mare
  ON public.canais(user_id, mare_status);

-- Condição T4: Índice GIN ausente porque nenhuma query de tag (operadores @> ou &&) foi encontrada no código.
