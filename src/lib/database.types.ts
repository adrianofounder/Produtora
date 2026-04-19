export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      alertas: {
        Row: {
          canal_id: string | null
          created_at: string | null
          id: string
          lido: boolean
          link_acao: string | null
          mensagem: string
          tipo: string
          titulo: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          canal_id?: string | null
          created_at?: string | null
          id?: string
          lido?: boolean
          link_acao?: string | null
          mensagem: string
          tipo: string
          titulo: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          canal_id?: string | null
          created_at?: string | null
          id?: string
          lido?: boolean
          link_acao?: string | null
          mensagem?: string
          tipo?: string
          titulo?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alertas_canal_id_fkey"
            columns: ["canal_id"]
            isOneToOne: false
            referencedRelation: "canais"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          chave_criptografada: string
          created_at: string | null
          id: string
          label: string
          provedor: string
          status: string
          ultimo_uso: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          chave_criptografada: string
          created_at?: string | null
          id?: string
          label: string
          provedor: string
          status?: string
          ultimo_uso?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          chave_criptografada?: string
          created_at?: string | null
          id?: string
          label?: string
          provedor?: string
          status?: string
          ultimo_uso?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      blueprints: {
        Row: {
          canal_benchmark: string | null
          canal_id: string
          conflito_central: string | null
          created_at: string | null
          emocao_dominante: string | null
          estetica_visual: string | null
          estrutura_emocional: string | null
          formula_emocional: string | null
          hook: string | null
          id: string
          market_signal: string | null
          performance_score: number | null
          plot_twist: string | null
          quality_score: number | null
          retention_loop: string | null
          ritmo_edicao: string | null
          tipo_narrativa: string | null
          titulo_benchmark: string | null
          updated_at: string | null
          veredito: string | null
          voz_narrador: string | null
        }
        Insert: {
          canal_benchmark?: string | null
          canal_id: string
          conflito_central?: string | null
          created_at?: string | null
          emocao_dominante?: string | null
          estetica_visual?: string | null
          estrutura_emocional?: string | null
          formula_emocional?: string | null
          hook?: string | null
          id?: string
          market_signal?: string | null
          performance_score?: number | null
          plot_twist?: string | null
          quality_score?: number | null
          retention_loop?: string | null
          ritmo_edicao?: string | null
          tipo_narrativa?: string | null
          titulo_benchmark?: string | null
          updated_at?: string | null
          veredito?: string | null
          voz_narrador?: string | null
        }
        Update: {
          canal_benchmark?: string | null
          canal_id?: string
          conflito_central?: string | null
          created_at?: string | null
          emocao_dominante?: string | null
          estetica_visual?: string | null
          estrutura_emocional?: string | null
          formula_emocional?: string | null
          hook?: string | null
          id?: string
          market_signal?: string | null
          performance_score?: number | null
          plot_twist?: string | null
          quality_score?: number | null
          retention_loop?: string | null
          ritmo_edicao?: string | null
          tipo_narrativa?: string | null
          titulo_benchmark?: string | null
          updated_at?: string | null
          veredito?: string | null
          voz_narrador?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blueprints_canal_id_fkey"
            columns: ["canal_id"]
            isOneToOne: true
            referencedRelation: "canais"
            referencedColumns: ["id"]
          },
        ]
      }
      canais: {
        Row: {
          auto_aprovacao_roteiros: boolean
          auto_aprovacao_titulos: boolean
          auto_post: boolean
          avatar_url: string | null
          banner_url: string | null
          categoria: string
          conteudo_sintetico: boolean
          created_at: string | null
          descricao: string | null
          email_contato: string | null
          estoque_minimo_planejamento: number
          estoque_minimo_producao: number
          frequencia_dia: number
          horario_padrao: string
          id: string
          idioma: string
          mare_eixo_ativo: string | null
          mare_status: string
          motor_ativo: boolean
          nome: string
          pais: string
          privacidade_padrao: string
          updated_at: string | null
          user_id: string
          youtube_access_token_enc: string | null
          youtube_channel_id: string | null
          youtube_refresh_token_enc: string | null
          youtube_token_expires_at: string | null
        }
        Insert: {
          auto_aprovacao_roteiros?: boolean
          auto_aprovacao_titulos?: boolean
          auto_post?: boolean
          avatar_url?: string | null
          banner_url?: string | null
          categoria?: string
          conteudo_sintetico?: boolean
          created_at?: string | null
          descricao?: string | null
          email_contato?: string | null
          estoque_minimo_planejamento?: number
          estoque_minimo_producao?: number
          frequencia_dia?: number
          horario_padrao?: string
          id?: string
          idioma?: string
          mare_eixo_ativo?: string | null
          mare_status?: string
          motor_ativo?: boolean
          nome: string
          pais?: string
          privacidade_padrao?: string
          updated_at?: string | null
          user_id: string
          youtube_access_token_enc?: string | null
          youtube_channel_id?: string | null
          youtube_refresh_token_enc?: string | null
          youtube_token_expires_at?: string | null
        }
        Update: {
          auto_aprovacao_roteiros?: boolean
          auto_aprovacao_titulos?: boolean
          auto_post?: boolean
          avatar_url?: string | null
          banner_url?: string | null
          categoria?: string
          conteudo_sintetico?: boolean
          created_at?: string | null
          descricao?: string | null
          email_contato?: string | null
          estoque_minimo_planejamento?: number
          estoque_minimo_producao?: number
          frequencia_dia?: number
          horario_padrao?: string
          id?: string
          idioma?: string
          mare_eixo_ativo?: string | null
          mare_status?: string
          motor_ativo?: boolean
          nome?: string
          pais?: string
          privacidade_padrao?: string
          updated_at?: string | null
          user_id?: string
          youtube_access_token_enc?: string | null
          youtube_channel_id?: string | null
          youtube_refresh_token_enc?: string | null
          youtube_token_expires_at?: string | null
        }
        Relationships: []
      }
      eixos: {
        Row: {
          arquetipo_antagonista: string | null
          arquetipo_protagonista: string | null
          canal_id: string
          cenario_recorrente: string | null
          complexidade_edicao: number | null
          cores_thumb: string | null
          created_at: string | null
          duracao_max: number | null
          duracao_min: number | null
          elemento_visual: string | null
          estilo_narrativo: string | null
          formula_titulo: string | null
          gatilho_curiosidade: string | null
          id: string
          nome: string
          palavras_negativas: string[] | null
          payoff: string | null
          premissa: string | null
          publico_alvo: string | null
          rpm_estimado: number | null
          score_mare: number | null
          score_retencao: number | null
          sentimento_dominante: string | null
          status: string
          taxa_concorrencia: string | null
          tipo_conflito: string | null
          updated_at: string | null
          views_acumuladas: number
        }
        Insert: {
          arquetipo_antagonista?: string | null
          arquetipo_protagonista?: string | null
          canal_id: string
          cenario_recorrente?: string | null
          complexidade_edicao?: number | null
          cores_thumb?: string | null
          created_at?: string | null
          duracao_max?: number | null
          duracao_min?: number | null
          elemento_visual?: string | null
          estilo_narrativo?: string | null
          formula_titulo?: string | null
          gatilho_curiosidade?: string | null
          id?: string
          nome: string
          palavras_negativas?: string[] | null
          payoff?: string | null
          premissa?: string | null
          publico_alvo?: string | null
          rpm_estimado?: number | null
          score_mare?: number | null
          score_retencao?: number | null
          sentimento_dominante?: string | null
          status?: string
          taxa_concorrencia?: string | null
          tipo_conflito?: string | null
          updated_at?: string | null
          views_acumuladas?: number
        }
        Update: {
          arquetipo_antagonista?: string | null
          arquetipo_protagonista?: string | null
          canal_id?: string
          cenario_recorrente?: string | null
          complexidade_edicao?: number | null
          cores_thumb?: string | null
          created_at?: string | null
          duracao_max?: number | null
          duracao_min?: number | null
          elemento_visual?: string | null
          estilo_narrativo?: string | null
          formula_titulo?: string | null
          gatilho_curiosidade?: string | null
          id?: string
          nome?: string
          palavras_negativas?: string[] | null
          payoff?: string | null
          premissa?: string | null
          publico_alvo?: string | null
          rpm_estimado?: number | null
          score_mare?: number | null
          score_retencao?: number | null
          sentimento_dominante?: string | null
          status?: string
          taxa_concorrencia?: string | null
          tipo_conflito?: string | null
          updated_at?: string | null
          views_acumuladas?: number
        }
        Relationships: [
          {
            foreignKeyName: "eixos_canal_id_fkey"
            columns: ["canal_id"]
            isOneToOne: false
            referencedRelation: "canais"
            referencedColumns: ["id"]
          },
        ]
      }
      garimpos_minados: {
        Row: {
          canal: string
          created_at: string | null
          id: string
          publish_date: string | null
          tag: string | null
          thumbnail_url: string | null
          titulo: string
          views_count: number | null
          views_text: string
        }
        Insert: {
          canal: string
          created_at?: string | null
          id?: string
          publish_date?: string | null
          tag?: string | null
          thumbnail_url?: string | null
          titulo: string
          views_count?: number | null
          views_text: string
        }
        Update: {
          canal?: string
          created_at?: string | null
          id?: string
          publish_date?: string | null
          tag?: string | null
          thumbnail_url?: string | null
          titulo?: string
          views_count?: number | null
          views_text?: string
        }
        Relationships: []
      }
      matriz_nichos: {
        Row: {
          created_at: string | null
          id: string
          label: string
          opacity: number | null
          pulse: boolean | null
          tipo: string
          updated_at: string | null
          x: number
          y: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          label: string
          opacity?: number | null
          pulse?: boolean | null
          tipo: string
          updated_at?: string | null
          x: number
          y: number
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string
          opacity?: number | null
          pulse?: boolean | null
          tipo?: string
          updated_at?: string | null
          x?: number
          y?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      videos: {
        Row: {
          aprovado_por: string | null
          aprovado_via: string | null
          audio_aprovado: boolean
          audio_url: string | null
          canal_id: string
          created_at: string | null
          criado_por: string | null
          data_previsao: string | null
          data_publicacao: string | null
          descricao_youtube: string | null
          eixo: string | null
          id: string
          roteiro: string | null
          roteiro_aprovado: boolean
          status: string
          step_agendado: boolean
          step_audio: boolean
          step_imagens: boolean
          step_montagem: boolean
          step_roteiro: boolean
          step_thumb: boolean
          step_titulo: boolean
          tags: string[] | null
          thumb_aprovada: boolean
          thumb_url: string | null
          titulo: string
          titulo_oficial: string | null
          updated_at: string | null
          user_id: string
          youtube_upload_status: string | null
          youtube_video_id: string | null
        }
        Insert: {
          aprovado_por?: string | null
          aprovado_via?: string | null
          audio_aprovado?: boolean
          audio_url?: string | null
          canal_id: string
          created_at?: string | null
          criado_por?: string | null
          data_previsao?: string | null
          data_publicacao?: string | null
          descricao_youtube?: string | null
          eixo?: string | null
          id?: string
          roteiro?: string | null
          roteiro_aprovado?: boolean
          status?: string
          step_agendado?: boolean
          step_audio?: boolean
          step_imagens?: boolean
          step_montagem?: boolean
          step_roteiro?: boolean
          step_thumb?: boolean
          step_titulo?: boolean
          tags?: string[] | null
          thumb_aprovada?: boolean
          thumb_url?: string | null
          titulo: string
          titulo_oficial?: string | null
          updated_at?: string | null
          user_id: string
          youtube_upload_status?: string | null
          youtube_video_id?: string | null
        }
        Update: {
          aprovado_por?: string | null
          aprovado_via?: string | null
          audio_aprovado?: boolean
          audio_url?: string | null
          canal_id?: string
          created_at?: string | null
          criado_por?: string | null
          data_previsao?: string | null
          data_publicacao?: string | null
          descricao_youtube?: string | null
          eixo?: string | null
          id?: string
          roteiro?: string | null
          roteiro_aprovado?: boolean
          status?: string
          step_agendado?: boolean
          step_audio?: boolean
          step_imagens?: boolean
          step_montagem?: boolean
          step_roteiro?: boolean
          step_thumb?: boolean
          step_titulo?: boolean
          tags?: string[] | null
          thumb_aprovada?: boolean
          thumb_url?: string | null
          titulo?: string
          titulo_oficial?: string | null
          updated_at?: string | null
          user_id?: string
          youtube_upload_status?: string | null
          youtube_video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "videos_canal_id_fkey"
            columns: ["canal_id"]
            isOneToOne: false
            referencedRelation: "canais"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
