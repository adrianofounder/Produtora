-- 2.4 - Adiciona constrição UNIQUE à tabela blueprints para o mapeamento 1:1 com canais,
-- possibilitando o UPSERT por canal_id na API de salvar do Studio.

ALTER TABLE public.blueprints
  ADD CONSTRAINT blueprints_canal_id_unique UNIQUE (canal_id);
