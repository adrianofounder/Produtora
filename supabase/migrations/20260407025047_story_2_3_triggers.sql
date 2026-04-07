  -- DB-02b: Trigger em api_keys
  CREATE TRIGGER set_api_keys_updated_at BEFORE UPDATE ON public.api_keys
    FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

  -- DB-02: Trigger em profiles
  CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

  -- DB-03: Coluna + Trigger em alertas
  ALTER TABLE public.alertas
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
  CREATE TRIGGER set_alertas_updated_at BEFORE UPDATE ON public.alertas
    FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

  -- DB-04: Índice em alertas(canal_id)
  CREATE INDEX IF NOT EXISTS idx_alertas_canal_id ON public.alertas(canal_id);
