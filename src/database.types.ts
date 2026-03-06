export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      account_deletion_requests: {
        Row: {
          confirmation_token: string;
          confirmed_at: string | null;
          expires_at: string;
          id: string;
          requested_at: string | null;
          status: string;
          user_id: string;
        };
        Insert: {
          confirmation_token: string;
          confirmed_at?: string | null;
          expires_at?: string;
          id?: string;
          requested_at?: string | null;
          status?: string;
          user_id: string;
        };
        Update: {
          confirmation_token?: string;
          confirmed_at?: string | null;
          expires_at?: string;
          id?: string;
          requested_at?: string | null;
          status?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "account_deletion_requests_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      app_settings: {
        Row: {
          app_id: string | null;
          created_at: string | null;
          id: string;
          organization_id: string | null;
          settings: Json | null;
          updated_at: string | null;
        };
        Insert: {
          app_id?: string | null;
          created_at?: string | null;
          id?: string;
          organization_id?: string | null;
          settings?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          app_id?: string | null;
          created_at?: string | null;
          id?: string;
          organization_id?: string | null;
          settings?: Json | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "app_settings_app_id_fkey";
            columns: ["app_id"];
            isOneToOne: false;
            referencedRelation: "apps";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "app_settings_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      apps: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          key: string;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          key: string;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          key?: string;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      asset_sources: {
        Row: {
          asset_id: string;
          created_at: string | null;
          device_activation_id: string | null;
          drive_folder_id: string | null;
          file_size_bytes: number | null;
          filename: string | null;
          id: string;
          is_primary: boolean | null;
          last_synced_at: string | null;
          metadata: Json | null;
          mime_type: string | null;
          source_identifier: string;
          source_type: string;
          sync_error: string | null;
          sync_status: string | null;
          updated_at: string | null;
        };
        Insert: {
          asset_id: string;
          created_at?: string | null;
          device_activation_id?: string | null;
          drive_folder_id?: string | null;
          file_size_bytes?: number | null;
          filename?: string | null;
          id?: string;
          is_primary?: boolean | null;
          last_synced_at?: string | null;
          metadata?: Json | null;
          mime_type?: string | null;
          source_identifier: string;
          source_type: string;
          sync_error?: string | null;
          sync_status?: string | null;
          updated_at?: string | null;
        };
        Update: {
          asset_id?: string;
          created_at?: string | null;
          device_activation_id?: string | null;
          drive_folder_id?: string | null;
          file_size_bytes?: number | null;
          filename?: string | null;
          id?: string;
          is_primary?: boolean | null;
          last_synced_at?: string | null;
          metadata?: Json | null;
          mime_type?: string | null;
          source_identifier?: string;
          source_type?: string;
          sync_error?: string | null;
          sync_status?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "asset_sources_asset_id_fkey";
            columns: ["asset_id"];
            isOneToOne: false;
            referencedRelation: "assets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "asset_sources_device_activation_id_fkey";
            columns: ["device_activation_id"];
            isOneToOne: false;
            referencedRelation: "device_activations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "asset_sources_drive_folder_id_fkey";
            columns: ["drive_folder_id"];
            isOneToOne: false;
            referencedRelation: "drive_folders";
            referencedColumns: ["id"];
          },
        ];
      };
      assets: {
        Row: {
          asset_type: string;
          created_at: string | null;
          id: string;
          is_available: boolean | null;
          name: string | null;
          organization_id: string;
          updated_at: string | null;
        };
        Insert: {
          asset_type: string;
          created_at?: string | null;
          id?: string;
          is_available?: boolean | null;
          name?: string | null;
          organization_id: string;
          updated_at?: string | null;
        };
        Update: {
          asset_type?: string;
          created_at?: string | null;
          id?: string;
          is_available?: boolean | null;
          name?: string | null;
          organization_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "assets_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      collection_items: {
        Row: {
          asset_id: string;
          collection_id: string;
          created_at: string;
          frame_id: string | null;
          id: string;
        };
        Insert: {
          asset_id: string;
          collection_id: string;
          created_at?: string;
          frame_id?: string | null;
          id?: string;
        };
        Update: {
          asset_id?: string;
          collection_id?: string;
          created_at?: string;
          frame_id?: string | null;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "collection_items_asset_id_fkey";
            columns: ["asset_id"];
            isOneToOne: false;
            referencedRelation: "assets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "collection_items_collection_id_fkey";
            columns: ["collection_id"];
            isOneToOne: false;
            referencedRelation: "collections";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "collection_items_frame_id_fkey";
            columns: ["frame_id"];
            isOneToOne: false;
            referencedRelation: "video_frames";
            referencedColumns: ["id"];
          },
        ];
      };
      collections: {
        Row: {
          created_at: string;
          creator_id: string;
          description: string | null;
          id: string;
          is_public: boolean;
          name: string;
          org_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          creator_id: string;
          description?: string | null;
          id?: string;
          is_public?: boolean;
          name: string;
          org_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          creator_id?: string;
          description?: string | null;
          id?: string;
          is_public?: boolean;
          name?: string;
          org_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "collections_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      credit_ledger: {
        Row: {
          created_at: string | null;
          id: string;
          org_id: string;
          period_end: string;
          period_start: string;
          processing_credits_allocated: number;
          processing_credits_consumed: number;
          processing_credits_reserved: number;
          storage_credits_allocated: number;
          storage_footprint_bytes: number;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          org_id: string;
          period_end: string;
          period_start: string;
          processing_credits_allocated?: number;
          processing_credits_consumed?: number;
          processing_credits_reserved?: number;
          storage_credits_allocated?: number;
          storage_footprint_bytes?: number;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          org_id?: string;
          period_end?: string;
          period_start?: string;
          processing_credits_allocated?: number;
          processing_credits_consumed?: number;
          processing_credits_reserved?: number;
          storage_credits_allocated?: number;
          storage_footprint_bytes?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "credit_ledger_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      credit_reservations: {
        Row: {
          asset_id: string;
          created_at: string | null;
          estimated_cost: number;
          id: string;
          ledger_id: string;
          org_id: string;
          processing_job_id: string;
          settled_at: string | null;
          status: string;
        };
        Insert: {
          asset_id: string;
          created_at?: string | null;
          estimated_cost?: number;
          id?: string;
          ledger_id: string;
          org_id: string;
          processing_job_id: string;
          settled_at?: string | null;
          status?: string;
        };
        Update: {
          asset_id?: string;
          created_at?: string | null;
          estimated_cost?: number;
          id?: string;
          ledger_id?: string;
          org_id?: string;
          processing_job_id?: string;
          settled_at?: string | null;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "credit_reservations_asset_id_fkey";
            columns: ["asset_id"];
            isOneToOne: false;
            referencedRelation: "assets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "credit_reservations_ledger_id_fkey";
            columns: ["ledger_id"];
            isOneToOne: false;
            referencedRelation: "credit_ledger";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "credit_reservations_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "credit_reservations_processing_job_id_fkey";
            columns: ["processing_job_id"];
            isOneToOne: false;
            referencedRelation: "processing_jobs";
            referencedColumns: ["id"];
          },
        ];
      };
      device_activations: {
        Row: {
          activated_at: string | null;
          created_at: string | null;
          device_id: string;
          id: string;
          is_active: boolean | null;
          last_seen: string | null;
          name: string | null;
          organization_id: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          activated_at?: string | null;
          created_at?: string | null;
          device_id: string;
          id?: string;
          is_active?: boolean | null;
          last_seen?: string | null;
          name?: string | null;
          organization_id: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          activated_at?: string | null;
          created_at?: string | null;
          device_id?: string;
          id?: string;
          is_active?: boolean | null;
          last_seen?: string | null;
          name?: string | null;
          organization_id?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "device_activations_device_id_fkey";
            columns: ["device_id"];
            isOneToOne: false;
            referencedRelation: "devices";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "device_activations_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "device_activations_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      devices: {
        Row: {
          created_at: string | null;
          hostname: string;
          id: string;
          os_type: string | null;
          os_version: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          hostname: string;
          id: string;
          os_type?: string | null;
          os_version?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          hostname?: string;
          id?: string;
          os_type?: string | null;
          os_version?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      drive_folders: {
        Row: {
          created_at: string | null;
          files_count: number | null;
          folder_id: string;
          folder_name: string | null;
          id: string;
          initial_sync_completed_at: string | null;
          last_sync_at: string | null;
          last_sync_error: string | null;
          last_sync_files_count: number | null;
          organization_id: string | null;
          page_token: string | null;
          status: string | null;
          sync_status: string | null;
          updated_at: string | null;
          webhook_channel_id: string | null;
          webhook_expiration: string | null;
          webhook_resource_id: string | null;
          webhook_status: string | null;
          webhook_token: string | null;
          webhook_url: string | null;
        };
        Insert: {
          created_at?: string | null;
          files_count?: number | null;
          folder_id: string;
          folder_name?: string | null;
          id?: string;
          initial_sync_completed_at?: string | null;
          last_sync_at?: string | null;
          last_sync_error?: string | null;
          last_sync_files_count?: number | null;
          organization_id?: string | null;
          page_token?: string | null;
          status?: string | null;
          sync_status?: string | null;
          updated_at?: string | null;
          webhook_channel_id?: string | null;
          webhook_expiration?: string | null;
          webhook_resource_id?: string | null;
          webhook_status?: string | null;
          webhook_token?: string | null;
          webhook_url?: string | null;
        };
        Update: {
          created_at?: string | null;
          files_count?: number | null;
          folder_id?: string;
          folder_name?: string | null;
          id?: string;
          initial_sync_completed_at?: string | null;
          last_sync_at?: string | null;
          last_sync_error?: string | null;
          last_sync_files_count?: number | null;
          organization_id?: string | null;
          page_token?: string | null;
          status?: string | null;
          sync_status?: string | null;
          updated_at?: string | null;
          webhook_channel_id?: string | null;
          webhook_expiration?: string | null;
          webhook_resource_id?: string | null;
          webhook_status?: string | null;
          webhook_token?: string | null;
          webhook_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "drive_folders_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      embedding_strategies: {
        Row: {
          created_at: string | null;
          description: string | null;
          dim: number;
          id: string;
          model: string;
          name: string;
          parameters: Json | null;
          version: number;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          dim: number;
          id?: string;
          model: string;
          name: string;
          parameters?: Json | null;
          version: number;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          dim?: number;
          id?: string;
          model?: string;
          name?: string;
          parameters?: Json | null;
          version?: number;
        };
        Relationships: [];
      };
      embeddings: {
        Row: {
          asset_id: string;
          audio_segment_id: string | null;
          created_at: string | null;
          dim: number;
          embedding: string | null;
          id: string;
          image_id: string | null;
          metadata: Json | null;
          strategy_id: string;
          video_frame_id: string | null;
          video_id: string | null;
        };
        Insert: {
          asset_id: string;
          audio_segment_id?: string | null;
          created_at?: string | null;
          dim?: number;
          embedding?: string | null;
          id?: string;
          image_id?: string | null;
          metadata?: Json | null;
          strategy_id: string;
          video_frame_id?: string | null;
          video_id?: string | null;
        };
        Update: {
          asset_id?: string;
          audio_segment_id?: string | null;
          created_at?: string | null;
          dim?: number;
          embedding?: string | null;
          id?: string;
          image_id?: string | null;
          metadata?: Json | null;
          strategy_id?: string;
          video_frame_id?: string | null;
          video_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "embeddings_asset_id_fkey";
            columns: ["asset_id"];
            isOneToOne: false;
            referencedRelation: "assets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "embeddings_strategy_id_fkey";
            columns: ["strategy_id"];
            isOneToOne: false;
            referencedRelation: "embedding_strategies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "embeddings_video_frame_id_fkey";
            columns: ["video_frame_id"];
            isOneToOne: false;
            referencedRelation: "video_frames";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "embeddings_video_id_fkey";
            columns: ["video_id"];
            isOneToOne: false;
            referencedRelation: "videos";
            referencedColumns: ["id"];
          },
        ];
      };
      jobs: {
        Row: {
          completed_at: string | null;
          created_at: string | null;
          error_message: string | null;
          id: string;
          job_type: string;
          lease_expires_at: string | null;
          organization_id: string;
          payload: Json;
          progress: number | null;
          queued_at: string | null;
          result_data: Json | null;
          retry_count: number | null;
          started_at: string | null;
          status: string;
          status_message: string | null;
          updated_at: string | null;
          worker_id: string | null;
        };
        Insert: {
          completed_at?: string | null;
          created_at?: string | null;
          error_message?: string | null;
          id?: string;
          job_type: string;
          lease_expires_at?: string | null;
          organization_id: string;
          payload?: Json;
          progress?: number | null;
          queued_at?: string | null;
          result_data?: Json | null;
          retry_count?: number | null;
          started_at?: string | null;
          status?: string;
          status_message?: string | null;
          updated_at?: string | null;
          worker_id?: string | null;
        };
        Update: {
          completed_at?: string | null;
          created_at?: string | null;
          error_message?: string | null;
          id?: string;
          job_type?: string;
          lease_expires_at?: string | null;
          organization_id?: string;
          payload?: Json;
          progress?: number | null;
          queued_at?: string | null;
          result_data?: Json | null;
          retry_count?: number | null;
          started_at?: string | null;
          status?: string;
          status_message?: string | null;
          updated_at?: string | null;
          worker_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "jobs_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      metering_events: {
        Row: {
          asset_id: string;
          cost_cents: number;
          created_at: string | null;
          details: Json | null;
          generator_type: string;
          id: string;
          org_id: string;
          processing_job_id: string;
          status: string;
        };
        Insert: {
          asset_id: string;
          cost_cents?: number;
          created_at?: string | null;
          details?: Json | null;
          generator_type: string;
          id?: string;
          org_id: string;
          processing_job_id: string;
          status?: string;
        };
        Update: {
          asset_id?: string;
          cost_cents?: number;
          created_at?: string | null;
          details?: Json | null;
          generator_type?: string;
          id?: string;
          org_id?: string;
          processing_job_id?: string;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "metering_events_asset_id_fkey";
            columns: ["asset_id"];
            isOneToOne: false;
            referencedRelation: "assets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "metering_events_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "metering_events_processing_job_id_fkey";
            columns: ["processing_job_id"];
            isOneToOne: false;
            referencedRelation: "processing_jobs";
            referencedColumns: ["id"];
          },
        ];
      };
      organization_invitations: {
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
            foreignKeyName: "organization_invitations_accepted_by_user_id_fkey";
            columns: ["accepted_by_user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "organization_invitations_invited_by_user_id_fkey";
            columns: ["invited_by_user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "organization_invitations_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      organization_members: {
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
            foreignKeyName: "organization_members_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "organization_members_user_id_fkey";
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
          status: string | null;
          stripe_customer_id: string | null;
          team_size: string | null;
          updated_at: string | null;
          use_case: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name: string;
          status?: string | null;
          stripe_customer_id?: string | null;
          team_size?: string | null;
          updated_at?: string | null;
          use_case?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
          status?: string | null;
          stripe_customer_id?: string | null;
          team_size?: string | null;
          updated_at?: string | null;
          use_case?: string | null;
        };
        Relationships: [];
      };
      processing_jobs: {
        Row: {
          asset_id: string;
          cleared: boolean;
          completed_at: string | null;
          created_at: string | null;
          error_message: string | null;
          id: string;
          job_type: string;
          lease_expires_at: string | null;
          organization_id: string;
          progress_percentage: number | null;
          queued_at: string | null;
          result_data: Json | null;
          retry_count: number | null;
          started_at: string | null;
          status: string;
          status_message: string | null;
          updated_at: string | null;
          worker_id: string | null;
        };
        Insert: {
          asset_id: string;
          cleared?: boolean;
          completed_at?: string | null;
          created_at?: string | null;
          error_message?: string | null;
          id?: string;
          job_type?: string;
          lease_expires_at?: string | null;
          organization_id: string;
          progress_percentage?: number | null;
          queued_at?: string | null;
          result_data?: Json | null;
          retry_count?: number | null;
          started_at?: string | null;
          status?: string;
          status_message?: string | null;
          updated_at?: string | null;
          worker_id?: string | null;
        };
        Update: {
          asset_id?: string;
          cleared?: boolean;
          completed_at?: string | null;
          created_at?: string | null;
          error_message?: string | null;
          id?: string;
          job_type?: string;
          lease_expires_at?: string | null;
          organization_id?: string;
          progress_percentage?: number | null;
          queued_at?: string | null;
          result_data?: Json | null;
          retry_count?: number | null;
          started_at?: string | null;
          status?: string;
          status_message?: string | null;
          updated_at?: string | null;
          worker_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "processing_jobs_asset_id_fkey";
            columns: ["asset_id"];
            isOneToOne: false;
            referencedRelation: "assets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "processing_jobs_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          active: boolean;
          created_at: string | null;
          id: string;
          name: string;
          stripe_price_id: string | null;
          stripe_product_id: string | null;
          type: string;
          updated_at: string | null;
        };
        Insert: {
          active?: boolean;
          created_at?: string | null;
          id?: string;
          name: string;
          stripe_price_id?: string | null;
          stripe_product_id?: string | null;
          type: string;
          updated_at?: string | null;
        };
        Update: {
          active?: boolean;
          created_at?: string | null;
          id?: string;
          name?: string;
          stripe_price_id?: string | null;
          stripe_product_id?: string | null;
          type?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean;
          created_at: string | null;
          current_period_end: string | null;
          current_period_start: string | null;
          id: string;
          org_id: string;
          product_id: string;
          status: string;
          stripe_subscription_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          cancel_at_period_end?: boolean;
          created_at?: string | null;
          current_period_end?: string | null;
          current_period_start?: string | null;
          id?: string;
          org_id: string;
          product_id: string;
          status?: string;
          stripe_subscription_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          cancel_at_period_end?: boolean;
          created_at?: string | null;
          current_period_end?: string | null;
          current_period_start?: string | null;
          id?: string;
          org_id?: string;
          product_id?: string;
          status?: string;
          stripe_subscription_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "subscriptions_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      user_onboarding_progress: {
        Row: {
          completed_at: string | null;
          created_at: string | null;
          current_step: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          completed_at?: string | null;
          created_at?: string | null;
          current_step?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          completed_at?: string | null;
          created_at?: string | null;
          current_step?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_onboarding_progress_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      user_tour_progress: {
        Row: {
          asset_library_completed_at: string | null;
          created_at: string | null;
          current_step: number | null;
          skipped: boolean | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          asset_library_completed_at?: string | null;
          created_at?: string | null;
          current_step?: number | null;
          skipped?: boolean | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          asset_library_completed_at?: string | null;
          created_at?: string | null;
          current_step?: number | null;
          skipped?: boolean | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_tour_progress_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          editing_tool: string | null;
          email: string;
          footage_ownership: string | null;
          id: string;
          name: string | null;
          publishing_cadence: string | null;
          role: string | null;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          editing_tool?: string | null;
          email: string;
          footage_ownership?: string | null;
          id: string;
          name?: string | null;
          publishing_cadence?: string | null;
          role?: string | null;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          editing_tool?: string | null;
          email?: string;
          footage_ownership?: string | null;
          id?: string;
          name?: string | null;
          publishing_cadence?: string | null;
          role?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      video_frames: {
        Row: {
          created_at: string | null;
          description: string | null;
          frame_number: number;
          id: string;
          metadata: Json | null;
          storage_path: string | null;
          video_id: string;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          frame_number: number;
          id?: string;
          metadata?: Json | null;
          storage_path?: string | null;
          video_id: string;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          frame_number?: number;
          id?: string;
          metadata?: Json | null;
          storage_path?: string | null;
          video_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "video_frames_video_id_fkey";
            columns: ["video_id"];
            isOneToOne: false;
            referencedRelation: "videos";
            referencedColumns: ["id"];
          },
        ];
      };
      videos: {
        Row: {
          asset_id: string;
          created_at: string | null;
          duration_seconds: number | null;
          extracted_frame_count: number | null;
          fps: number | null;
          height: number | null;
          id: string;
          metadata: Json | null;
          tags: Json | null;
          tags_fts: unknown;
          transcript: string | null;
          updated_at: string | null;
          width: number | null;
        };
        Insert: {
          asset_id: string;
          created_at?: string | null;
          duration_seconds?: number | null;
          extracted_frame_count?: number | null;
          fps?: number | null;
          height?: number | null;
          id?: string;
          metadata?: Json | null;
          tags?: Json | null;
          tags_fts?: unknown;
          transcript?: string | null;
          updated_at?: string | null;
          width?: number | null;
        };
        Update: {
          asset_id?: string;
          created_at?: string | null;
          duration_seconds?: number | null;
          extracted_frame_count?: number | null;
          fps?: number | null;
          height?: number | null;
          id?: string;
          metadata?: Json | null;
          tags?: Json | null;
          tags_fts?: unknown;
          transcript?: string | null;
          updated_at?: string | null;
          width?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "videos_asset_id_fkey";
            columns: ["asset_id"];
            isOneToOne: true;
            referencedRelation: "assets";
            referencedColumns: ["id"];
          },
        ];
      };
      waitlist: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          referral_code: string | null;
          referred_by: string | null;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          referral_code?: string | null;
          referred_by?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          referral_code?: string | null;
          referred_by?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      user_invitations_view: {
        Row: {
          accepted_at: string | null;
          custom_message: string | null;
          email: string | null;
          expires_at: string | null;
          id: string | null;
          invited_by_name: string | null;
          organization_id: string | null;
          organization_name: string | null;
          role: string | null;
          sent_at: string | null;
          status: string | null;
          token: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "organization_invitations_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Functions: {
      add_collection_items: {
        Args: { p_collection_id: string; p_items: Json };
        Returns: {
          asset_id: string;
          collection_id: string;
          created_at: string;
          frame_id: string | null;
          id: string;
        }[];
        SetofOptions: {
          from: "*";
          to: "collection_items";
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      can_process_video: {
        Args: { estimated_tokens: number; org_id: string };
        Returns: {
          allowed: boolean;
          current_usage: number;
          limit_tokens: number;
          plan_id: string;
          remaining_tokens: number;
        }[];
      };
      claim_next_generic_job: {
        Args: {
          p_job_type: string;
          p_lease_minutes?: number;
          p_worker_id: string;
        };
        Returns: {
          completed_at: string | null;
          created_at: string | null;
          error_message: string | null;
          id: string;
          job_type: string;
          lease_expires_at: string | null;
          organization_id: string;
          payload: Json;
          progress: number | null;
          queued_at: string | null;
          result_data: Json | null;
          retry_count: number | null;
          started_at: string | null;
          status: string;
          status_message: string | null;
          updated_at: string | null;
          worker_id: string | null;
        }[];
        SetofOptions: {
          from: "*";
          to: "jobs";
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      claim_next_job:
        | {
            Args: { p_max_running_jobs?: number; p_worker_id: string };
            Returns: {
              completed_at: string;
              created_at: string;
              error_message: string;
              id: string;
              job_type: string;
              media_asset_id: string;
              organization_id: string;
              progress_percentage: number;
              queued_at: string;
              result_data: Json;
              retry_count: number;
              started_at: string;
              status: string;
              status_message: string;
              updated_at: string;
              worker_id: string;
            }[];
          }
        | {
            Args: { p_lease_minutes?: number; p_worker_id: string };
            Returns: {
              asset_id: string;
              cleared: boolean;
              completed_at: string | null;
              created_at: string | null;
              error_message: string | null;
              id: string;
              job_type: string;
              lease_expires_at: string | null;
              organization_id: string;
              progress_percentage: number | null;
              queued_at: string | null;
              result_data: Json | null;
              retry_count: number | null;
              started_at: string | null;
              status: string;
              status_message: string | null;
              updated_at: string | null;
              worker_id: string | null;
            }[];
            SetofOptions: {
              from: "*";
              to: "processing_jobs";
              isOneToOne: false;
              isSetofReturn: true;
            };
          };
      create_demo_folder_for_organization: {
        Args: { org_id: string };
        Returns: string;
      };
      decrement_ledger_reserved: {
        Args: { p_amount: number; p_ledger_id: string };
        Returns: undefined;
      };
      extend_generic_job_lease: {
        Args: { p_job_id: string; p_lease_minutes?: number };
        Returns: undefined;
      };
      extend_job_lease: {
        Args: { p_job_id: string; p_lease_minutes?: number };
        Returns: undefined;
      };
      extract_tags_text: { Args: { tags_jsonb: Json }; Returns: string };
      fulltext_search_assets: {
        Args: {
          organization_id: string;
          search_mode?: string;
          search_terms: string;
        };
        Returns: {
          created_at: string;
          file_size_bytes: number;
          filename: string;
          highlight: string;
          id: string;
          mime_type: string;
          rank: number;
          tags: Json;
        }[];
      };
      get_asset_organization_id: {
        Args: { asset_id: string };
        Returns: string;
      };
      get_current_billing_period: {
        Args: { org_id: string };
        Returns: {
          period_end: string;
          period_start: string;
        }[];
      };
      get_current_ledger: { Args: { p_org_id: string }; Returns: string };
      get_effective_limit: {
        Args: { app_name: string; org_id: string; resource: string };
        Returns: {
          hard_cap: boolean;
          is_custom: boolean;
          limit_quantity: number;
          limit_unit: string;
        }[];
      };
      get_org_media_assets: {
        Args: { org_id?: string };
        Returns: {
          created_at: string;
          drive_created_time: string;
          drive_file_id: string;
          drive_folder_id: string;
          drive_modified_time: string;
          file_size_bytes: number;
          filename: string;
          first_discovered_at: string;
          id: string;
          is_available: boolean;
          is_trashed: boolean;
          last_seen_at: string;
          last_synced_at: string;
          metadata: Json;
          mime_type: string;
          organization_id: string;
          sync_error: string;
          sync_status: string;
          tags: Json;
          tags_fts: unknown;
          total_frames: number;
          transcript: string;
          trashed_time: string;
          updated_at: string;
          url: string;
          web_view_link: string;
        }[];
      };
      get_organization_usage: {
        Args: { end_date: string; org_id: string; start_date: string };
        Returns: {
          embedding_tokens: number;
          processing_minutes: number;
          total_tokens: number;
          transcription_tokens: number;
          vision_tokens: number;
        }[];
      };
      has_active_subscription: { Args: { org_id: string }; Returns: boolean };
      increment_ledger_reserved: {
        Args: { p_amount: number; p_ledger_id: string };
        Returns: undefined;
      };
      media_asset_belongs_to_org: {
        Args: { asset_id: string; org_id: string };
        Returns: boolean;
      };
      org_role: {
        Args: { org_id: string; target_user_id: string };
        Returns: string;
      };
      provision_ledger: {
        Args: {
          p_allocation: number;
          p_org_id: string;
          p_period_end: string;
          p_period_start: string;
        };
        Returns: string;
      };
      register_and_activate_device: {
        Args: {
          p_device_id: string;
          p_hostname: string;
          p_name?: string;
          p_organization_id: string;
          p_os_type: string;
          p_os_version: string;
        };
        Returns: string;
      };
      search_frames: {
        Args: {
          p_count?: number;
          p_organization_id: string;
          p_query_embedding: string;
          p_strategy_id: string;
          p_threshold?: number;
        };
        Returns: {
          asset_id: string;
          asset_name: string;
          description: string;
          fps: number;
          frame_id: string;
          frame_number: number;
          similarity: number;
          storage_path: string;
        }[];
      };
      search_fulltext: {
        Args: { p_count?: number; p_organization_id: string; p_query: string };
        Returns: {
          asset_id: string;
          asset_name: string;
          rank: number;
          tags: Json;
          transcript_snippet: string;
        }[];
      };
      search_rediscover: {
        Args: { p_count?: number; p_organization_id: string };
        Returns: {
          asset_id: string;
          asset_name: string;
          description: string;
          fps: number;
          frame_id: string;
          frame_number: number;
          score: number;
          storage_path: string;
        }[];
      };
      search_similar_frames: {
        Args: {
          p_count?: number;
          p_frame_id: string;
          p_organization_id: string;
          p_strategy_id: string;
          p_threshold?: number;
        };
        Returns: {
          asset_id: string;
          asset_name: string;
          description: string;
          fps: number;
          frame_id: string;
          frame_number: number;
          similarity: number;
          storage_path: string;
        }[];
      };
      search_video_clips: {
        Args: { search_mode?: string; search_terms: string };
        Returns: {
          filename: string;
          id: string;
          relevance_score: number;
          tags: Json;
          url: string;
        }[];
      };
      search_videos: {
        Args: {
          p_count?: number;
          p_organization_id: string;
          p_query_embedding: string;
          p_strategy_id: string;
          p_threshold?: number;
        };
        Returns: {
          asset_id: string;
          asset_name: string;
          similarity: number;
          tags: Json;
          transcript_snippet: string;
        }[];
      };
      semantic_search: {
        Args: {
          match_count: number;
          match_threshold: number;
          query_embedding: string;
          search_mode?: string;
        };
        Returns: {
          embedding_id: string;
          media_asset_id: string;
          similarity: number;
        }[];
      };
      semantic_search_assets: {
        Args: {
          match_count?: number;
          match_threshold?: number;
          organization_id?: string;
          query_embedding: string;
          search_mode?: string;
        };
        Returns: {
          created_at: string;
          file_size_bytes: number;
          filename: string;
          id: string;
          mime_type: string;
          similarity: number;
          tags: Json;
          transcript_snippet: string;
        }[];
      };
      semantic_search_frames: {
        Args: {
          match_count?: number;
          match_threshold?: number;
          p_organization_id?: string;
          query_embedding: string;
        };
        Returns: {
          asset_id: string;
          asset_name: string;
          description: string;
          fps: number;
          frame_id: string;
          frame_number: number;
          mime_type: string;
          similarity: number;
          storage_path: string;
          tags: Json;
          video_id: string;
        }[];
      };
      settle_ledger_credits: {
        Args: {
          p_actual_cost: number;
          p_ledger_id: string;
          p_reserved_amount: number;
        };
        Returns: undefined;
      };
      user_can_access_asset: { Args: { asset_id: string }; Returns: boolean };
      user_can_access_folder: {
        Args: { drive_folder_id: string };
        Returns: boolean;
      };
      user_has_onboarding_org: { Args: never; Returns: boolean };
      user_is_org_member: { Args: { org_id: string }; Returns: boolean };
      user_needs_onboarding: { Args: never; Returns: boolean };
      user_org_role: { Args: { org_id: string }; Returns: string };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
