import { z } from 'zod';

export const GerarRoteiroSchema = z.object({
  video_id: z.string().uuid().optional(),
  canal_id: z.string().uuid(),
  titulo: z.string().min(1, 'O título é obrigatório'),
  tom: z.string().optional().nullable(),
  gancho: z.string().optional().nullable(),
  narrativa: z.string().optional().nullable()
});

export const GerarTitulosSchema = z.object({
  canal_id: z.string().uuid().optional(),
  eixo: z.string().min(1, 'Eixo é obrigatório'),
  premissa: z.string().min(1, 'Premissa é obrigatória'),
  formula_titulo: z.string().optional().nullable()
});

export const AutoRefillSchema = z.object({
  canal_id: z.string().uuid()
});

export const AnalisarCanalSchema = z.object({
  canal_id: z.string().uuid()
});

export const CreateVideoSchema = z.object({
  canal_id: z.string().uuid(),
  titulo: z.string().min(1, 'O título é obrigatório'),
  eixo: z.string().optional().nullable(),
  status: z.string().optional(),
  data_previsao: z.string().optional().nullable(),
}).passthrough();

export const UpdateVideoSchema = z.object({
  titulo: z.string().optional(),
  eixo: z.string().optional().nullable(),
  status: z.string().optional(),
  data_previsao: z.string().optional().nullable(),
}).passthrough();

export const CreateCanalSchema = z.object({
  nome: z.string().min(1, 'O nome do canal é obrigatório'),
  descricao: z.string().optional().nullable(),
  idioma: z.string().optional(),
  pais: z.string().optional(),
  categoria: z.string().optional(),
  privacidade_padrao: z.string().optional(),
  frequencia_dia: z.number().int().optional(),
  horario_padrao: z.string().optional(),
  conteudo_sintetico: z.boolean().optional(),
}).passthrough();

export const UpdateCanalSchema = z.object({
  nome: z.string().optional(),
  descricao: z.string().optional().nullable(),
  idioma: z.string().optional(),
  pais: z.string().optional(),
  categoria: z.string().optional(),
  privacidade_padrao: z.string().optional(),
  email_contato: z.string().optional().nullable(),
  conteudo_sintetico: z.boolean().optional(),
  frequencia_dia: z.number().int().optional(),
  horario_padrao: z.string().optional(),
}).passthrough();

export const CreateEixoSchema = z.object({
  canal_id: z.string().uuid(),
  nome: z.string().min(1, 'O nome é obrigatório'),
  premissa: z.string().optional().nullable(),
  publico_alvo: z.string().optional().nullable(),
  sentimento_dominante: z.string().optional().nullable(),
  status: z.string().optional(),
}).passthrough();

export const ReadAlertaSchema = z.object({
  id: z.string().uuid(),
});

export const CreateBlueprintSchema = z.object({
  canal_id: z.string().uuid(),
  titulo_benchmark: z.string().optional().nullable(),
  canal_benchmark: z.string().optional().nullable(),
  hook: z.string().optional().nullable(),
  tipo_narrativa: z.string().optional().nullable(),
  estrutura_emocional: z.string().optional().nullable(),
  emocao_dominante: z.string().optional().nullable(),
  voz_narrador: z.string().optional().nullable(),
  quality_score: z.number().optional().nullable(),
  veredito: z.string().optional(),
}).passthrough();

export const UpdateBlueprintSchema = z.object({
  titulo_benchmark: z.string().optional().nullable(),
  canal_benchmark: z.string().optional().nullable(),
  hook: z.string().optional().nullable(),
  tipo_narrativa: z.string().optional().nullable(),
  estrutura_emocional: z.string().optional().nullable(),
  emocao_dominante: z.string().optional().nullable(),
  voz_narrador: z.string().optional().nullable(),
  quality_score: z.number().optional().nullable(),
  veredito: z.string().optional(),
}).passthrough();

export const UpdatePerfilSchema = z.object({
  full_name: z.string().optional(),
  avatar_url: z.string().optional().nullable(),
}).passthrough();
