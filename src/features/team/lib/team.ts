import type { Database } from "@/database.types";
import type { PendingInvitation, TeamMember } from "../types/types";

interface TeamMemberRaw {
  id: string;
  joined_at: string | null;
  organization_id: string;
  role: string;
  user: Database["public"]["Tables"]["users"]["Row"];
  user_id: string;
}

type InvitationRaw =
  Database["public"]["Tables"]["organization_invitations"]["Row"] & {
    invited_by: {
      name: string | null;
    } | null;
  };

export function transformMember(raw: TeamMemberRaw): TeamMember {
  return {
    id: raw.id,
    user_id: raw.user_id,
    email: raw.user.email,
    name: raw.user.name || "",
    role: raw.role as "owner" | "admin" | "member",
    avatar_url: raw.user.avatar_url || undefined,
    joined_at: raw.joined_at ?? "",
  };
}

export function transformMembers(raw: TeamMemberRaw[]): TeamMember[] {
  return raw.map(transformMember);
}

export function transformInvitation(raw: InvitationRaw): PendingInvitation {
  return {
    id: raw.id,
    email: raw.email,
    role: raw.role as "admin" | "member",
    invited_by_name: raw.invited_by?.name || "Unknown",
    invited_by_user_id: raw.invited_by_user_id,
    sent_at: raw.sent_at || "",
    expires_at: raw.expires_at,
    status: raw.status as "pending" | "expired" | "cancelled",
    token: raw.token,
    resend_count: raw.resend_count || 0,
    custom_message: raw.custom_message || undefined,
  };
}

export function transformInvitations(
  raw: InvitationRaw[]
): PendingInvitation[] {
  return raw.map(transformInvitation);
}
