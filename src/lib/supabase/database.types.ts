export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          role: 'admin' | 'editor' | 'viewer'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'editor' | 'viewer'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'editor' | 'viewer'
          updated_at?: string
        }
      }
      canais: {
        Row: {
          id: string
          user_id: string
          nome: string
          descricao: string | null
          avatar_url: string | null
          banner_url: string | null
          idioma: string
          pais: string
          categoria: string
          privacidade_padrao: 'public' | 'unlisted' | 'private'
          frequencia_dia: number
          horario_padrao: string
          email_contato: string | null
          conteudo_sintetico: boolean
          mare_status: 'aguardando' | 'testando' | 'ativa' | 'pausada'
          mare_eixo_ativo: string | null
          youtube_channel_id: string | null
          youtube_access_token: string | null
          youtube_refresh_token: string | null
          youtube_token_expires_at: string | null
          motor_ativo: boolean
          estoque_minimo_planejamento: number
          estoque_minimo_producao: number
          auto_aprovacao_titulos: boolean
          auto_aprovacao_roteiros: boolean
          auto_post: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nome: string
          descricao?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          idioma?: string
          pais?: string
          categoria?: string
          privacidade_padrao?: 'public' | 'unlisted' | 'private'
          frequencia_dia?: number
          horario_padrao?: string
          email_contato?: string | null
          conteudo_sintetico?: boolean
          mare_status?: 'aguardando' | 'testando' | 'ativa' | 'pausada'
          mare_eixo_ativo?: string | null
          youtube_channel_id?: string | null
          motor_ativo?: boolean
          estoque_minimo_planejamento?: number
          estoque_minimo_producao?: number
          auto_aprovacao_titulos?: boolean
          auto_aprovacao_roteiros?: boolean
          auto_post?: boolean
        }
        Update: Partial<Database['public']['Tables']['canais']['Insert']>; Relationships: any[]; }
      videos: {
        Row: {
          id: string
          canal_id: string
          user_id: string
          titulo: string
          titulo_oficial: string | null
          eixo: string | null
          status: 'planejamento' | 'producao' | 'pronto' | 'agendado' | 'publicado' | 'erro'
          data_previsao: string | null
          data_publicacao: string | null
          roteiro: string | null
          roteiro_aprovado: boolean
          audio_url: string | null
          audio_aprovado: boolean
          thumb_url: string | null
          thumb_aprovada: boolean
          youtube_video_id: string | null
          youtube_upload_status: 'pendente' | 'processando' | 'concluido' | 'erro' | null
          step_titulo: boolean
          step_roteiro: boolean
          step_audio: boolean
          step_imagens: boolean
          step_montagem: boolean
          step_thumb: boolean
          step_agendado: boolean
          aprovado_por: string | null
          aprovado_via: 'humano' | 'automacao' | null
          descricao_youtube: string | null
          tags: string[] | null
          criado_por: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          canal_id: string
          user_id: string
          titulo: string
          titulo_oficial?: string | null
          eixo?: string | null
          status?: 'planejamento' | 'producao' | 'pronto' | 'agendado' | 'publicado' | 'erro'
          data_previsao?: string | null
          roteiro?: string | null
          roteiro_aprovado?: boolean
          audio_url?: string | null
          audio_aprovado?: boolean
          thumb_url?: string | null
          thumb_aprovada?: boolean
          step_titulo?: boolean
          step_roteiro?: boolean
          step_audio?: boolean
          step_imagens?: boolean
          step_montagem?: boolean
          step_thumb?: boolean
          step_agendado?: boolean
          aprovado_por?: string | null
          aprovado_via?: 'humano' | 'automacao' | null
          descricao_youtube?: string | null
          tags?: string[] | null
          criado_por?: string | null
        }
        Update: Partial<Database['public']['Tables']['videos']['Insert']>; Relationships: any[]; }
      eixos: {
        Row: {
          id: string
          canal_id: string
          nome: string
          premissa: string | null
          publico_alvo: string | null
          sentimento_dominante: string | null
          gatilho_curiosidade: string | null
          arquetipo_protagonista: string | null
          arquetipo_antagonista: string | null
          tipo_conflito: string | null
          cenario_recorrente: string | null
          payoff: string | null
          estilo_narrativo: string | null
          taxa_concorrencia: 'alta' | 'media' | 'baixa' | null
          score_retencao: number | null
          rpm_estimado: number | null
          formula_titulo: string | null
          palavras_negativas: string[] | null
          cores_thumb: string | null
          elemento_visual: string | null
          complexidade_edicao: number | null
          duracao_min: number | null
          duracao_max: number | null
          status: 'testando' | 'aguardando' | 'venceu' | 'cancelado'
          views_acumuladas: number
          score_mare: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          canal_id: string
          nome: string
          status?: 'testando' | 'aguardando' | 'venceu' | 'cancelado'
        }
        Update: Partial<Database['public']['Tables']['eixos']['Insert']>; Relationships: any[]; }
      blueprints: {
        Row: {
          id: string
          canal_id: string
          titulo_benchmark: string | null
          canal_benchmark: string | null
          performance_score: number | null
          hook: string | null
          voz_narrador: string | null
          emocao_dominante: string | null
          retention_loop: string | null
          conflito_central: string | null
          plot_twist: string | null
          estrutura_emocional: string | null
          tipo_narrativa: string | null
          estetica_visual: string | null
          ritmo_edicao: string | null
          formula_emocional: string | null
          quality_score: number | null
          market_signal: string | null
          veredito: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          canal_id: string
        }
        Update: Partial<Database['public']['Tables']['blueprints']['Insert']>; Relationships: any[]; }
      alertas: {
        Row: {
          id: string
          user_id: string
          canal_id: string | null
          tipo: 'erro' | 'aviso' | 'mare' | 'info'
          titulo: string
          mensagem: string
          lido: boolean
          link_acao: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          canal_id?: string | null
          tipo: 'erro' | 'aviso' | 'mare' | 'info'
          titulo: string
          mensagem: string
          lido?: boolean
          link_acao?: string | null
        }
        Update: Partial<Database['public']['Tables']['alertas']['Insert']>; Relationships: any[]; }
      api_keys: {
        Row: {
          id: string
          user_id: string
          provedor: string
          label: string
          chave_criptografada: string
          status: 'ativo' | 'erro' | 'inativo'
          ultimo_uso: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          provedor: string
          label: string
          chave_criptografada: string
          status?: 'ativo' | 'erro' | 'inativo'
        }
        Update: Partial<Database['public']['Tables']['api_keys']['Insert']>; Relationships: any[]; }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
