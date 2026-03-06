import type { Database } from "@/database.types";

// Types
export interface TeamMemberRaw {
  membership: Database["public"]["Tables"]["organization_members"]["Row"];
  user: Database["public"]["Tables"]["users"]["Row"];
}

export interface TeamMember {
  avatar_url?: string;
  email: string;
  id: string;
  joined_at: string;
  name: string;
  role: "owner" | "admin" | "member";
  user_id: string;
}

export type PendingInvitationRaw =
  Database["public"]["Tables"]["organization_invitations"]["Row"];

export interface PendingInvitation {
  custom_message?: string;
  email: string;
  expires_at: string;
  id: string;
  invited_by_name: string;
  invited_by_user_id: string;
  resend_count: number;
  role: "admin" | "member";
  sent_at: string;
  status: "pending" | "expired" | "cancelled";
  token: string;
}

export interface ValidationError {
  email: string;
  error: string;
}

export type MemberAction = "changeRole" | "transferOwnership" | "remove";

export interface MemberActionHandlers {
  onChangeRole: (userId: string, newRole: "admin" | "member") => Promise<void>;
  onRemoveMember: (userId: string) => Promise<void>;
  onTransferOwnership: (newOwnerId: string) => Promise<void>;
}
