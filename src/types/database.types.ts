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
      blocked_dates: {
        Row: {
          created_at: string | null
          date: string
          id: string
          organization_id: string
          reason: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          organization_id: string
          reason?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          organization_id?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blocked_dates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          created_at: string | null
          customer_email: string
          customer_name: string
          end_time: string
          form_data: Json | null
          id: string
          organization_id: string
          service_id: string
          start_time: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          customer_email: string
          customer_name: string
          end_time: string
          form_data?: Json | null
          id?: string
          organization_id: string
          service_id: string
          start_time: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          customer_email?: string
          customer_name?: string
          end_time?: string
          form_data?: Json | null
          id?: string
          organization_id?: string
          service_id?: string
          start_time?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_summary"
            referencedColumns: ["id"]
          },
        ]
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
      content_queue: {
        Row: {
          created_at: string | null
          generated_mdx: string | null
          id: string
          image_prompt: string | null
          organization_id: string
          prompt_context: string | null
          status: Database["public"]["Enums"]["content_status"] | null
          target_keywords: string[] | null
          topic: string
        }
        Insert: {
          created_at?: string | null
          generated_mdx?: string | null
          id?: string
          image_prompt?: string | null
          organization_id: string
          prompt_context?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
          target_keywords?: string[] | null
          topic: string
        }
        Update: {
          created_at?: string | null
          generated_mdx?: string | null
          id?: string
          image_prompt?: string | null
          organization_id?: string
          prompt_context?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
          target_keywords?: string[] | null
          topic?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_queue_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          unit_price: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          quantity: number
          unit_price: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          customer_details: Json | null
          customer_email: string
          id: string
          organization_id: string
          payment_id: string | null
          payment_method: string | null
          status: string | null
          total_amount: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          customer_details?: Json | null
          customer_email: string
          id?: string
          organization_id: string
          payment_id?: string | null
          payment_method?: string | null
          status?: string | null
          total_amount: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          customer_details?: Json | null
          customer_email?: string
          id?: string
          organization_id?: string
          payment_id?: string | null
          payment_method?: string | null
          status?: string | null
          total_amount?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_summary"
            referencedColumns: ["id"]
          },
        ]
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
      post_reactions: {
        Row: {
          created_at: string | null
          id: string
          post_slug: string
          reaction_type: string
          visitor_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_slug: string
          reaction_type: string
          visitor_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_slug?: string
          reaction_type?: string
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_reactions_post_slug_fkey"
            columns: ["post_slug"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["slug"]
          },
        ]
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
      products: {
        Row: {
          active: boolean | null
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          images: string[] | null
          metadata: Json | null
          name: string
          organization_id: string
          price: number
          slug: string
          stock: number | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          metadata?: Json | null
          name: string
          organization_id: string
          price?: number
          slug: string
          stock?: number | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          metadata?: Json | null
          name?: string
          organization_id?: string
          price?: number
          slug?: string
          stock?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_organization_id_fkey"
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
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: false
            referencedRelation: "users_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      project_members: {
        Row: {
          added_at: string | null
          project_id: string
          role: string | null
          user_id: string
        }
        Insert: {
          added_at?: string | null
          project_id: string
          role?: string | null
          user_id: string
        }
        Update: {
          added_at?: string | null
          project_id?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_project_members_users"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          branding_config: Json | null
          client_id: string
          created_at: string | null
          domain: string | null
          features_config: Json | null
          features_enabled: Json | null
          github_repo_url: string | null
          hosting_url: string | null
          id: string
          name: string
          organization_id: string | null
          repository_url: string | null
          status: Database["public"]["Enums"]["project_status"] | null
        }
        Insert: {
          branding_config?: Json | null
          client_id: string
          created_at?: string | null
          domain?: string | null
          features_config?: Json | null
          features_enabled?: Json | null
          github_repo_url?: string | null
          hosting_url?: string | null
          id?: string
          name: string
          organization_id?: string | null
          repository_url?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
        }
        Update: {
          branding_config?: Json | null
          client_id?: string
          created_at?: string | null
          domain?: string | null
          features_config?: Json | null
          features_enabled?: Json | null
          github_repo_url?: string | null
          hosting_url?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          repository_url?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      schedules: {
        Row: {
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean | null
          organization_id: string
          start_time: string
        }
        Insert: {
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean | null
          organization_id: string
          start_time: string
        }
        Update: {
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean | null
          organization_id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedules_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          form_schema: Json | null
          id: string
          organization_id: string
          price: number | null
          title: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          form_schema?: Json | null
          id?: string
          organization_id: string
          price?: number | null
          title: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          form_schema?: Json | null
          id?: string
          organization_id?: string
          price?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
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
          {
            foreignKeyName: "social_connections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_summary"
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
      test_assignments: {
        Row: {
          assigned_at: string | null
          campaign_id: string
          id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          campaign_id: string
          id?: string
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          campaign_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_assignments_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "test_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_assignments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      test_campaigns: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          instructions: string | null
          project_id: string
          status: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          instructions?: string | null
          project_id: string
          status?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          instructions?: string | null
          project_id?: string
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_campaigns_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      test_results: {
        Row: {
          comment: string | null
          created_at: string | null
          device_info: string | null
          id: string
          status: string
          task_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          device_info?: string | null
          id?: string
          status: string
          task_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          device_info?: string | null
          id?: string
          status?: string
          task_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_results_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "test_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      test_tasks: {
        Row: {
          campaign_id: string
          description: string | null
          expected_result: string | null
          id: string
          order_index: number | null
          title: string
        }
        Insert: {
          campaign_id: string
          description?: string | null
          expected_result?: string | null
          id?: string
          order_index?: number | null
          title: string
        }
        Update: {
          campaign_id?: string
          description?: string | null
          expected_result?: string | null
          id?: string
          order_index?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_tasks_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "test_campaigns"
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
          {
            foreignKeyName: "web_audits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_summary"
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
      users_summary: {
        Row: {
          avatar_url: string | null
          email: string | null
          full_name: string | null
          id: string | null
        }
        Insert: {
          avatar_url?: never
          email?: string | null
          full_name?: never
          id?: string | null
        }
        Update: {
          avatar_url?: never
          email?: string | null
          full_name?: never
          id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      decrement_stock: {
        Args: { p_product_id: string; p_quantity: number }
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
  graphql_public: {
    Enums: {},
  },
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
