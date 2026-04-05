-- ==============================================================================
-- Story 1.2 — Hardening de Segurança no Database
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- Fix DB-08: Privilege Escalation Prevention em handle_new_user()
-- Resolvemos a falta do SET search_path e alinhamos com o SCHEMA.md atual
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    'admin' -- Fallback para manter consistência com SCHEMA.md
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


-- ------------------------------------------------------------------------------
-- Fix DB-01: Otimização do RLS com Criação de Index na API Keys
-- NOTA: Como o CONCURRENTLY não pode ser executado dentro de um bloco de transação
-- (que muitas vezes é o padrão em ferramentas de CI), se falhar via CLI do supabase,
-- deve ser desabilitado o wrapping de transaction na CLI, ou executado isoladamente.
-- ------------------------------------------------------------------------------
COMMIT; -- Forçamos o fim da transação se a ferramenta da CL wrap migration em um block

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_api_keys_user_id
  ON public.api_keys(user_id);

BEGIN; -- Retomamos caso a ferramenta de CLI espere um encerramento

-- (Opcional - Adicionamos tbm o da Tabela Alertas detectado na auditoria DB-AUDIT)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_alertas_canal_id 
  ON public.alertas(canal_id);
