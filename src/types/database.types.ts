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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          browser: string | null
          city: string | null
          country: string | null
          country_code: string | null
          created_at: string | null
          device_type: string | null
          duration_seconds: number | null
          event_name: string
          id: number
          meta: Json | null
          os: string | null
          path: string | null
          referrer: string | null
          region: string | null
          session_id: string
        }
        Insert: {
          browser?: string | null
          city?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string | null
          device_type?: string | null
          duration_seconds?: number | null
          event_name: string
          id?: never
          meta?: Json | null
          os?: string | null
          path?: string | null
          referrer?: string | null
          region?: string | null
          session_id: string
        }
        Update: {
          browser?: string | null
          city?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string | null
          device_type?: string | null
          duration_seconds?: number | null
          event_name?: string
          id?: never
          meta?: Json | null
          os?: string | null
          path?: string | null
          referrer?: string | null
          region?: string | null
          session_id?: string
        }
        Relationships: []
      }
      analytics_visitors: {
        Row: {
          country: string | null
          device_type: string | null
          first_seen_at: string | null
          last_seen_at: string | null
          referrer: string | null
          visitor_id: string
        }
        Insert: {
          country?: string | null
          device_type?: string | null
          first_seen_at?: string | null
          last_seen_at?: string | null
          referrer?: string | null
          visitor_id: string
        }
        Update: {
          country?: string | null
          device_type?: string | null
          first_seen_at?: string | null
          last_seen_at?: string | null
          referrer?: string | null
          visitor_id?: string
        }
        Relationships: []
      }
      contact_leads: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          message: string
          service: string
          source: string | null
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          message: string
          service: string
          source?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          message?: string
          service?: string
          source?: string | null
        }
        Relationships: []
      }
      contactos_cualificados: {
        Row: {
          cargo_contacto: string | null
          contexto_actual: string | null
          contexto_general: string | null
          contexto_temporal: string | null
          disposicion_inversion: string | null
          email: string | null
          formulario_rellenado: string | null
          nicho_empresa: string | null
          nombre_contacto: string | null
          nombre_empresa: string | null
          oportunidades_clave: string | null
          problema_prioritario: string | null
          problemas_principales: string | null
          telefono: string
          valor_automatizacion: string | null
        }
        Insert: {
          cargo_contacto?: string | null
          contexto_actual?: string | null
          contexto_general?: string | null
          contexto_temporal?: string | null
          disposicion_inversion?: string | null
          email?: string | null
          formulario_rellenado?: string | null
          nicho_empresa?: string | null
          nombre_contacto?: string | null
          nombre_empresa?: string | null
          oportunidades_clave?: string | null
          problema_prioritario?: string | null
          problemas_principales?: string | null
          telefono: string
          valor_automatizacion?: string | null
        }
        Update: {
          cargo_contacto?: string | null
          contexto_actual?: string | null
          contexto_general?: string | null
          contexto_temporal?: string | null
          disposicion_inversion?: string | null
          email?: string | null
          formulario_rellenado?: string | null
          nicho_empresa?: string | null
          nombre_contacto?: string | null
          nombre_empresa?: string | null
          oportunidades_clave?: string | null
          problema_prioritario?: string | null
          problemas_principales?: string | null
          telefono?: string
          valor_automatizacion?: string | null
        }
        Relationships: []
      }
      learning_attempts: {
        Row: {
          accuracy: number | null
          completed_at: string | null
          correct_count: number
          id: string
          lesson_id: string
          mistake_count: number
          requires_review: boolean
          score: number
          started_at: string
          status: string
          time_spent_seconds: number
          user_id: string
          xp_awarded: number
        }
        Insert: {
          accuracy?: number | null
          completed_at?: string | null
          correct_count?: number
          id?: string
          lesson_id: string
          mistake_count?: number
          requires_review?: boolean
          score?: number
          started_at?: string
          status: string
          time_spent_seconds?: number
          user_id: string
          xp_awarded?: number
        }
        Update: {
          accuracy?: number | null
          completed_at?: string | null
          correct_count?: number
          id?: string
          lesson_id?: string
          mistake_count?: number
          requires_review?: boolean
          score?: number
          started_at?: string
          status?: string
          time_spent_seconds?: number
          user_id?: string
          xp_awarded?: number
        }
        Relationships: [
          {
            foreignKeyName: "learning_attempts_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "learning_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_lessons: {
        Row: {
          active: boolean
          estimated_minutes: number
          id: string
          module_id: string
          objective: string | null
          order_index: number
          slug: string
          title: string
          xp_reward: number
        }
        Insert: {
          active?: boolean
          estimated_minutes?: number
          id?: string
          module_id: string
          objective?: string | null
          order_index?: number
          slug: string
          title: string
          xp_reward?: number
        }
        Update: {
          active?: boolean
          estimated_minutes?: number
          id?: string
          module_id?: string
          objective?: string | null
          order_index?: number
          slug?: string
          title?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "learning_lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "learning_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_modules: {
        Row: {
          active: boolean
          description: string | null
          id: string
          level: string
          order_index: number
          slug: string
          title: string
          track_id: string
        }
        Insert: {
          active?: boolean
          description?: string | null
          id?: string
          level: string
          order_index?: number
          slug: string
          title: string
          track_id: string
        }
        Update: {
          active?: boolean
          description?: string | null
          id?: string
          level?: string
          order_index?: number
          slug?: string
          title?: string
          track_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_modules_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "learning_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_progress: {
        Row: {
          attempts_count: number
          best_score: number
          completed: boolean
          completed_at: string | null
          lesson_id: string
          needs_review: boolean
          user_id: string
        }
        Insert: {
          attempts_count?: number
          best_score?: number
          completed?: boolean
          completed_at?: string | null
          lesson_id: string
          needs_review?: boolean
          user_id: string
        }
        Update: {
          attempts_count?: number
          best_score?: number
          completed?: boolean
          completed_at?: string | null
          lesson_id?: string
          needs_review?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "learning_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_step_answers: {
        Row: {
          answer: Json
          attempt_id: string
          created_at: string
          hint_used: boolean
          id: string
          is_correct: boolean
          step_id: string
          time_spent_seconds: number
        }
        Insert: {
          answer: Json
          attempt_id: string
          created_at?: string
          hint_used?: boolean
          id?: string
          is_correct: boolean
          step_id: string
          time_spent_seconds?: number
        }
        Update: {
          answer?: Json
          attempt_id?: string
          created_at?: string
          hint_used?: boolean
          id?: string
          is_correct?: boolean
          step_id?: string
          time_spent_seconds?: number
        }
        Relationships: [
          {
            foreignKeyName: "learning_step_answers_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "learning_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_step_answers_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "learning_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_steps: {
        Row: {
          config: Json
          explanation: string | null
          id: string
          lesson_id: string
          media: Json | null
          order_index: number
          prompt: string
          type: string
        }
        Insert: {
          config?: Json
          explanation?: string | null
          id?: string
          lesson_id: string
          media?: Json | null
          order_index?: number
          prompt: string
          type: string
        }
        Update: {
          config?: Json
          explanation?: string | null
          id?: string
          lesson_id?: string
          media?: Json | null
          order_index?: number
          prompt?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_steps_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "learning_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_streaks: {
        Row: {
          current_streak: number
          last_activity_date: string | null
          longest_streak: number
          user_id: string
        }
        Insert: {
          current_streak?: number
          last_activity_date?: string | null
          longest_streak?: number
          user_id: string
        }
        Update: {
          current_streak?: number
          last_activity_date?: string | null
          longest_streak?: number
          user_id?: string
        }
        Relationships: []
      }
      learning_tracks: {
        Row: {
          active: boolean
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          order_index: number
          slug: string
          title: string
        }
        Insert: {
          active?: boolean
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          order_index?: number
          slug: string
          title: string
        }
        Update: {
          active?: boolean
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          order_index?: number
          slug?: string
          title?: string
        }
        Relationships: []
      }
      learning_xp_events: {
        Row: {
          created_at: string
          id: string
          source_id: string | null
          source_type: string
          user_id: string
          xp: number
        }
        Insert: {
          created_at?: string
          id?: string
          source_id?: string | null
          source_type: string
          user_id: string
          xp: number
        }
        Update: {
          created_at?: string
          id?: string
          source_id?: string | null
          source_type?: string
          user_id?: string
          xp?: number
        }
        Relationships: []
      }
      n8n_chat_histories1: {
        Row: {
          fecha_mensaje: string | null
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          fecha_mensaje?: string | null
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          fecha_mensaje?: string | null
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      organizations: {
        Row: {
          branding_config: Json | null
          created_at: string | null
          domain: string | null
          id: string
          name: string
          plan: string | null
          slug: string
        }
        Insert: {
          branding_config?: Json | null
          created_at?: string | null
          domain?: string | null
          id?: string
          name: string
          plan?: string | null
          slug: string
        }
        Update: {
          branding_config?: Json | null
          created_at?: string | null
          domain?: string | null
          id?: string
          name?: string
          plan?: string | null
          slug?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          content_mdx: string | null
          cover_image: string | null
          created_at: string | null
          description: string | null
          id: string
          organization_id: string
          published: boolean | null
          published_at: string | null
          reviewed: boolean | null
          slug: string
          status: Database["public"]["Enums"]["post_status"] | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content_mdx?: string | null
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          organization_id: string
          published?: boolean | null
          published_at?: string | null
          reviewed?: boolean | null
          slug: string
          status?: Database["public"]["Enums"]["post_status"] | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content_mdx?: string | null
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          organization_id?: string
          published?: boolean | null
          published_at?: string | null
          reviewed?: boolean | null
          slug?: string
          status?: Database["public"]["Enums"]["post_status"] | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          organization_id: string
          role: Database["public"]["Enums"]["user_role"] | null
          stripe_customer_id: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          organization_id: string
          role?: Database["public"]["Enums"]["user_role"] | null
          stripe_customer_id?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          organization_id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          stripe_customer_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      seguimiento_digitaistudios: {
        Row: {
          fase1: boolean | null
          fase2: boolean | null
          fase3: boolean | null
          fecha_mensaje: string | null
          phone: string
        }
        Insert: {
          fase1?: boolean | null
          fase2?: boolean | null
          fase3?: boolean | null
          fecha_mensaje?: string | null
          phone: string
        }
        Update: {
          fase1?: boolean | null
          fase2?: boolean | null
          fase3?: boolean | null
          fecha_mensaje?: string | null
          phone?: string
        }
        Relationships: []
      }
      social_connections: {
        Row: {
          access_token: string
          created_at: string
          expires_at: number | null
          id: string
          organization_id: string | null
          provider: string
          provider_account_id: string | null
          provider_avatar_url: string | null
          provider_page_id: string | null
          provider_page_name: string | null
          refresh_token: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at?: number | null
          id?: string
          organization_id?: string | null
          provider: string
          provider_account_id?: string | null
          provider_avatar_url?: string | null
          provider_page_id?: string | null
          provider_page_name?: string | null
          refresh_token?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: number | null
          id?: string
          organization_id?: string | null
          provider?: string
          provider_account_id?: string | null
          provider_avatar_url?: string | null
          provider_page_id?: string | null
          provider_page_name?: string | null
          refresh_token?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_connections_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      social_posts: {
        Row: {
          content: string
          created_at: string
          error_message: string | null
          external_id: string | null
          id: string
          media_url: string | null
          platform: Database["public"]["Enums"]["social_platform"]
          post_id: string
          published_at: string | null
          scheduled_at: string | null
          status: Database["public"]["Enums"]["social_status"]
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          error_message?: string | null
          external_id?: string | null
          id?: string
          media_url?: string | null
          platform: Database["public"]["Enums"]["social_platform"]
          post_id: string
          published_at?: string | null
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["social_status"]
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          error_message?: string | null
          external_id?: string | null
          id?: string
          media_url?: string | null
          platform?: Database["public"]["Enums"]["social_platform"]
          post_id?: string
          published_at?: string | null
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["social_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_posts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      web_audits: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          organization_id: string | null
          performance_score: number | null
          report_data: Json | null
          seo_score: number | null
          status: Database["public"]["Enums"]["audit_status"] | null
          url: string
          user_id: string | null
          visitor_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          organization_id?: string | null
          performance_score?: number | null
          report_data?: Json | null
          seo_score?: number | null
          status?: Database["public"]["Enums"]["audit_status"] | null
          url: string
          user_id?: string | null
          visitor_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          organization_id?: string | null
          performance_score?: number | null
          report_data?: Json | null
          seo_score?: number | null
          status?: Database["public"]["Enums"]["audit_status"] | null
          url?: string
          user_id?: string | null
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "web_audits_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      mv_analytics_top_pages: {
        Row: {
          last_visit: string | null
          path: string | null
          unique_visitors: number | null
          visits: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      admin_delete_public_user_data: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      admin_delete_user_everywhere: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      admin_delete_user_everywhere_by_email: {
        Args: { p_email: string }
        Returns: undefined
      }
      get_analytics_browsers: {
        Args: { date_from: string }
        Returns: {
          name: string
          value: number
        }[]
      }
      get_analytics_countries: {
        Args: { date_from: string }
        Returns: {
          name: string
          value: number
        }[]
      }
      get_analytics_devices: {
        Args: { date_from: string }
        Returns: {
          name: string
          value: number
        }[]
      }
      get_analytics_os: {
        Args: { date_from: string }
        Returns: {
          name: string
          value: number
        }[]
      }
      get_analytics_referrers: {
        Args: { date_from: string }
        Returns: {
          name: string
          value: number
        }[]
      }
      get_auth_org_id: { Args: never; Returns: string }
      get_my_org_ids: { Args: never; Returns: string[] }
      is_admin: { Args: never; Returns: boolean }
      refresh_analytics_views: { Args: never; Returns: undefined }
    }
    Enums: {
      audit_status: "processing" | "completed" | "failed"
      content_status: "queued" | "generating" | "review" | "published"
      post_status: "draft" | "published" | "archived"
      project_status: "pending" | "active" | "maintenance" | "archived"
      social_platform: "linkedin" | "facebook" | "instagram"
      social_status: "draft" | "approved" | "scheduled" | "published" | "failed"
      user_role: "admin" | "client" | "lead" | "staff"
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
  public: {
    Enums: {
      audit_status: ["processing", "completed", "failed"],
      content_status: ["queued", "generating", "review", "published"],
      post_status: ["draft", "published", "archived"],
      project_status: ["pending", "active", "maintenance", "archived"],
      social_platform: ["linkedin", "facebook", "instagram"],
      social_status: ["draft", "approved", "scheduled", "published", "failed"],
      user_role: ["admin", "client", "lead", "staff"],
    },
  },
} as const
