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
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          device_type: string | null
          event_data: Json | null
          event_type: string
          id: string
          page: string | null
          referrer: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device_type?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          page?: string | null
          referrer?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          device_type?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          page?: string | null
          referrer?: string | null
          user_id?: string
        }
        Relationships: []
      }
      brand_settings: {
        Row: {
          accent_color: string | null
          brand_voice: string | null
          branding_enabled: boolean
          created_at: string
          font_body: string | null
          font_heading: string | null
          id: string
          logo_url: string | null
          primary_color: string | null
          secondary_color: string | null
          tagline: string | null
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          accent_color?: string | null
          brand_voice?: string | null
          branding_enabled?: boolean
          created_at?: string
          font_body?: string | null
          font_heading?: string | null
          id?: string
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          tagline?: string | null
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          accent_color?: string | null
          brand_voice?: string | null
          branding_enabled?: boolean
          created_at?: string
          font_body?: string | null
          font_heading?: string | null
          id?: string
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          tagline?: string | null
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      content_calendar: {
        Row: {
          calendar_date: string
          content_item_id: string | null
          created_at: string
          day_of_week: number | null
          id: string
          time_slot: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          calendar_date: string
          content_item_id?: string | null
          created_at?: string
          day_of_week?: number | null
          id?: string
          time_slot?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          calendar_date?: string
          content_item_id?: string | null
          created_at?: string
          day_of_week?: number | null
          id?: string
          time_slot?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_calendar_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      content_items: {
        Row: {
          ai_generated: boolean | null
          body: string | null
          created_at: string
          id: string
          platform: string | null
          scheduled_at: string | null
          status: string
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_generated?: boolean | null
          body?: string | null
          created_at?: string
          id?: string
          platform?: string | null
          scheduled_at?: string | null
          status?: string
          title: string
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_generated?: boolean | null
          body?: string | null
          created_at?: string
          id?: string
          platform?: string | null
          scheduled_at?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      discord_connections: {
        Row: {
          bot_added: boolean | null
          bot_installed: boolean | null
          channels: Json | null
          channels_cache: Json | null
          channels_cached_at: string | null
          created_at: string
          guild_icon: string | null
          id: string
          invite_link: string | null
          is_active: boolean | null
          last_welcomed_at: string | null
          selected_channel_name: string | null
          server_id: string | null
          server_name: string | null
          updated_at: string
          user_id: string
          welcome_channel_id: string | null
          welcome_message: string | null
        }
        Insert: {
          bot_added?: boolean | null
          bot_installed?: boolean | null
          channels?: Json | null
          channels_cache?: Json | null
          channels_cached_at?: string | null
          created_at?: string
          guild_icon?: string | null
          id?: string
          invite_link?: string | null
          is_active?: boolean | null
          last_welcomed_at?: string | null
          selected_channel_name?: string | null
          server_id?: string | null
          server_name?: string | null
          updated_at?: string
          user_id: string
          welcome_channel_id?: string | null
          welcome_message?: string | null
        }
        Update: {
          bot_added?: boolean | null
          bot_installed?: boolean | null
          channels?: Json | null
          channels_cache?: Json | null
          channels_cached_at?: string | null
          created_at?: string
          guild_icon?: string | null
          id?: string
          invite_link?: string | null
          is_active?: boolean | null
          last_welcomed_at?: string | null
          selected_channel_name?: string | null
          server_id?: string | null
          server_name?: string | null
          updated_at?: string
          user_id?: string
          welcome_channel_id?: string | null
          welcome_message?: string | null
        }
        Relationships: []
      }
      ebooks: {
        Row: {
          category: string | null
          cover_url: string | null
          created_at: string
          description: string | null
          download_count: number | null
          file_url: string | null
          id: string
          is_published: boolean | null
          pages_count: number | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          download_count?: number | null
          file_url?: string | null
          id?: string
          is_published?: boolean | null
          pages_count?: number | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          download_count?: number | null
          file_url?: string | null
          id?: string
          is_published?: boolean | null
          pages_count?: number | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_send_logs: {
        Row: {
          bcc_emails: string[] | null
          body_preview: string | null
          cc_emails: string[] | null
          content_item_id: string | null
          created_at: string
          error_message: string | null
          from_email: string
          gmail_message_id: string | null
          id: string
          is_html: boolean
          status: string
          subject: string
          to_emails: string[]
          user_id: string
        }
        Insert: {
          bcc_emails?: string[] | null
          body_preview?: string | null
          cc_emails?: string[] | null
          content_item_id?: string | null
          created_at?: string
          error_message?: string | null
          from_email: string
          gmail_message_id?: string | null
          id?: string
          is_html?: boolean
          status?: string
          subject: string
          to_emails: string[]
          user_id: string
        }
        Update: {
          bcc_emails?: string[] | null
          body_preview?: string | null
          cc_emails?: string[] | null
          content_item_id?: string | null
          created_at?: string
          error_message?: string | null
          from_email?: string
          gmail_message_id?: string | null
          id?: string
          is_html?: boolean
          status?: string
          subject?: string
          to_emails?: string[]
          user_id?: string
        }
        Relationships: []
      }
      gmail_connections: {
        Row: {
          access_token: string
          created_at: string
          email: string
          id: string
          is_active: boolean
          last_error: string | null
          refresh_token: string
          scope: string | null
          token_expires_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          last_error?: string | null
          refresh_token: string
          scope?: string | null
          token_expires_at: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          last_error?: string | null
          refresh_token?: string
          scope?: string | null
          token_expires_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          alt_text: string | null
          created_at: string
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          folder: string | null
          id: string
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          folder?: string | null
          id?: string
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          folder?: string | null
          id?: string
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          business_name: string | null
          country: string | null
          created_at: string
          full_name: string | null
          id: string
          language: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          business_name?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          language?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          business_name?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          language?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_tier: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_tier?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_tier?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
  public: {
    Enums: {},
  },
} as const
