-- ============================================================
-- EPIC-04 / Story 4.4 — tenant_settings (Auto-Refill kill-switch)
-- Idempotent migration (safe to run multiple times)
-- NFR03: RLS estrita — cada tenant acessa apenas suas próprias settings
-- ============================================================

BEGIN;

-- ============================================================
-- PARTE 1: CRIAR TABELA tenant_settings
-- Guarda configurações de automação por tenant (usuário)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.tenant_settings (
  id                          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id                   UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Story 4.4: Controle do Auto-Refill
  auto_refill_enabled         BOOLEAN     NOT NULL DEFAULT TRUE,
  auto_refill_last_run_at     TIMESTAMPTZ NULL,
  auto_refill_last_run_status TEXT        NULL
    CHECK (auto_refill_last_run_status IN ('success', 'skipped', 'error')),

  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(tenant_id)
);

COMMENT ON TABLE public.tenant_settings IS
  'Configurações de automação e comportamento por tenant. Uma linha por usuário.';

COMMENT ON COLUMN public.tenant_settings.auto_refill_enabled IS
  'Kill-switch global do Auto-Refill. FALSE = desativa o cronjob completamente para este tenant.';

COMMENT ON COLUMN public.tenant_settings.auto_refill_last_run_at IS
  'Timestamp da última execução do Auto-Refill (sucesso, skip ou erro).';

COMMENT ON COLUMN public.tenant_settings.auto_refill_last_run_status IS
  'Resultado da última execução: success | skipped | error.';

-- ============================================================
-- PARTE 2: ROW LEVEL SECURITY (NFR03)
-- Cada tenant acessa apenas suas próprias configurações
-- ============================================================

ALTER TABLE public.tenant_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tenant_settings_owner_only" ON public.tenant_settings;

CREATE POLICY "tenant_settings_owner_only"
  ON public.tenant_settings
  FOR ALL
  USING (auth.uid() = tenant_id)
  WITH CHECK (auth.uid() = tenant_id);

-- ============================================================
-- PARTE 3: TRIGGER updated_at
-- Reutiliza function public.set_updated_at() já existente no projeto
-- ============================================================

DROP TRIGGER IF EXISTS trg_tenant_settings_updated_at ON public.tenant_settings;

CREATE TRIGGER trg_tenant_settings_updated_at
  BEFORE UPDATE ON public.tenant_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- PARTE 4: ÍNDICE DE PERFORMANCE
-- Query do cron: SELECT * FROM tenant_settings WHERE tenant_id = ?
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_tenant_settings_tenant_id
  ON public.tenant_settings(tenant_id);

COMMIT;
