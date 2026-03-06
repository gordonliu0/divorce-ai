export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      cases: {
        Row: {
          case_number: string | null;
          client_name: string;
          created_at: string;
          created_by: string;
          date_of_filing: string | null;
          date_of_marriage: string | null;
          date_of_separation: string | null;
          id: string;
          jurisdiction: string | null;
          name: string;
          notes: string | null;
          opposing_party_name: string | null;
          organization_id: string;
          status: string;
          updated_at: string;
        };
        Insert: {
          case_number?: string | null;
          client_name: string;
          created_at?: string;
          created_by: string;
          date_of_filing?: string | null;
          date_of_marriage?: string | null;
          date_of_separation?: string | null;
          id?: string;
          jurisdiction?: string | null;
          name: string;
          notes?: string | null;
          opposing_party_name?: string | null;
          organization_id: string;
          status?: string;
          updated_at?: string;
        };
        Update: {
          case_number?: string | null;
          client_name?: string;
          created_at?: string;
          created_by?: string;
          date_of_filing?: string | null;
          date_of_marriage?: string | null;
          date_of_separation?: string | null;
          id?: string;
          jurisdiction?: string | null;
          name?: string;
          notes?: string | null;
          opposing_party_name?: string | null;
          organization_id?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cases_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cases_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      documents: {
        Row: {
          account_last_four: string | null;
          case_id: string;
          created_at: string;
          document_type: string | null;
          document_type_confidence: number | null;
          document_type_override: string | null;
          extracted_data: Json | null;
          extraction_confidence: number | null;
          extraction_model_id: string | null;
          extraction_status: string | null;
          file_name: string;
          file_path: string;
          file_size: number;
          id: string;
          institution_name: string | null;
          mime_type: string;
          page_count: number | null;
          period_end: string | null;
          period_start: string | null;
          raw_text: string | null;
          status: string;
          updated_at: string;
          uploaded_by: string;
        };
        Insert: {
          account_last_four?: string | null;
          case_id: string;
          created_at?: string;
          document_type?: string | null;
          document_type_confidence?: number | null;
          document_type_override?: string | null;
          extracted_data?: Json | null;
          extraction_confidence?: number | null;
          extraction_model_id?: string | null;
          extraction_status?: string | null;
          file_name: string;
          file_path: string;
          file_size: number;
          id?: string;
          institution_name?: string | null;
          mime_type: string;
          page_count?: number | null;
          period_end?: string | null;
          period_start?: string | null;
          raw_text?: string | null;
          status?: string;
          updated_at?: string;
          uploaded_by: string;
        };
        Update: {
          account_last_four?: string | null;
          case_id?: string;
          created_at?: string;
          document_type?: string | null;
          document_type_confidence?: number | null;
          document_type_override?: string | null;
          extracted_data?: Json | null;
          extraction_confidence?: number | null;
          extraction_model_id?: string | null;
          extraction_status?: string | null;
          file_name?: string;
          file_path?: string;
          file_size?: number;
          id?: string;
          institution_name?: string | null;
          mime_type?: string;
          page_count?: number | null;
          period_end?: string | null;
          period_start?: string | null;
          raw_text?: string | null;
          status?: string;
          updated_at?: string;
          uploaded_by?: string;
        };
        Relationships: [
          {
            foreignKeyName: "documents_case_id_fkey";
            columns: ["case_id"];
            isOneToOne: false;
            referencedRelation: "cases";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey";
            columns: ["uploaded_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      invitations: {
        Row: {
          accepted_at: string | null;
          accepted_by_user_id: string | null;
          created_at: string | null;
          custom_message: string | null;
          email: string;
          expires_at: string;
          id: string;
          invited_by_name: string | null;
          invited_by_user_id: string;
          last_resent_at: string | null;
          organization_id: string;
          organization_name: string | null;
          resend_count: number | null;
          role: string;
          sent_at: string | null;
          status: string;
          token: string;
          updated_at: string | null;
        };
        Insert: {
          accepted_at?: string | null;
          accepted_by_user_id?: string | null;
          created_at?: string | null;
          custom_message?: string | null;
          email: string;
          expires_at?: string;
          id?: string;
          invited_by_name?: string | null;
          invited_by_user_id: string;
          last_resent_at?: string | null;
          organization_id: string;
          organization_name?: string | null;
          resend_count?: number | null;
          role: string;
          sent_at?: string | null;
          status?: string;
          token: string;
          updated_at?: string | null;
        };
        Update: {
          accepted_at?: string | null;
          accepted_by_user_id?: string | null;
          created_at?: string | null;
          custom_message?: string | null;
          email?: string;
          expires_at?: string;
          id?: string;
          invited_by_name?: string | null;
          invited_by_user_id?: string;
          last_resent_at?: string | null;
          organization_id?: string;
          organization_name?: string | null;
          resend_count?: number | null;
          role?: string;
          sent_at?: string | null;
          status?: string;
          token?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "invitations_accepted_by_user_id_fkey";
            columns: ["accepted_by_user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invitations_invited_by_user_id_fkey";
            columns: ["invited_by_user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invitations_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      line_items: {
        Row: {
          amount: number;
          case_id: string;
          category: string | null;
          counterparty: string | null;
          counterparty_account: string | null;
          created_at: string;
          date: string;
          description: string;
          document_id: string;
          flag_eligible: boolean;
          id: string;
          running_balance: number | null;
          source_page: number | null;
          type: string;
        };
        Insert: {
          amount: number;
          case_id: string;
          category?: string | null;
          counterparty?: string | null;
          counterparty_account?: string | null;
          created_at?: string;
          date: string;
          description: string;
          document_id: string;
          flag_eligible?: boolean;
          id?: string;
          running_balance?: number | null;
          source_page?: number | null;
          type: string;
        };
        Update: {
          amount?: number;
          case_id?: string;
          category?: string | null;
          counterparty?: string | null;
          counterparty_account?: string | null;
          created_at?: string;
          date?: string;
          description?: string;
          document_id?: string;
          flag_eligible?: boolean;
          id?: string;
          running_balance?: number | null;
          source_page?: number | null;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "line_items_case_id_fkey";
            columns: ["case_id"];
            isOneToOne: false;
            referencedRelation: "cases";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "line_items_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "documents";
            referencedColumns: ["id"];
          },
        ];
      };
      members: {
        Row: {
          created_at: string | null;
          id: string;
          joined_at: string | null;
          organization_id: string;
          role: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          joined_at?: string | null;
          organization_id: string;
          role: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          joined_at?: string | null;
          organization_id?: string;
          role?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "members_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      organizations: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
          team_size: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name: string;
          team_size?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
          team_size?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      users: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          email: string;
          id: string;
          name: string | null;
          onboarding_completed_at: string | null;
          onboarding_step: string | null;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          email: string;
          id: string;
          name?: string | null;
          onboarding_completed_at?: string | null;
          onboarding_step?: string | null;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          email?: string;
          id?: string;
          name?: string | null;
          onboarding_completed_at?: string | null;
          onboarding_step?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      org_role: {
        Args: { org_id: string; target_user_id: string };
        Returns: string;
      };
      user_is_org_member: { Args: { org_id: string }; Returns: boolean };
      user_org_role: { Args: { org_id: string }; Returns: string };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
