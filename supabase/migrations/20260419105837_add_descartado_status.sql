-- ==============================================================================
-- Migration: Adicionar status 'descartado' à tabela videos
-- Correção para Story 2.3 — Permitir descarte de ideias no Laboratório
-- ==============================================================================

-- Remover a constraint antiga
ALTER TABLE public.videos 
  DROP CONSTRAINT IF EXISTS videos_status_check;

-- Adicionar a nova constraint incluindo 'descartado'
ALTER TABLE public.videos 
  ADD CONSTRAINT videos_status_check 
  CHECK (status IN ('planejamento', 'producao', 'pronto', 'agendado', 'publicado', 'erro', 'descartado'));
