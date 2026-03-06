"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/shared/lib/supabase/client";
import type { TeamMember } from "../types/types";

type UserRole = "owner" | "admin" | "member";

interface TeamPermissions {
  canChangeRole: (targetMember: TeamMember) => boolean;
  canInvite: boolean;
  canManageInvitations: boolean;
  canRemoveMember: (targetMember: TeamMember, isLastOwner: boolean) => boolean;
  canTransferOwnership: () => boolean;
  currentUserId: string | null;
  error: string | null;
  loading: boolean;
  role: UserRole | null;
}

export function useTeamPermissions(orgId: string): TeamPermissions {
  const [role, setRole] = useState<UserRole | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function fetchUserPermissions() {
      try {
        setLoading(true);
        setError(null);

        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          throw new Error("User not authenticated");
        }

        // Get user's role in this organization
        const { data: membership, error: membershipError } = await supabase
          .from("organization_members")
          .select("role")
          .eq("organization_id", orgId)
          .eq("user_id", user.id)
          .single();

        if (membershipError) {
          throw new Error("Failed to fetch user role in organization");
        }

        if (!membership) {
          throw new Error("User is not a member of this organization");
        }

        setRole(membership.role as UserRole);
        setCurrentUserId(user.id);
        setLoading(false);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to fetch permissions";
        setRole(null);
        setCurrentUserId(null);
        setError(errorMessage);
        setLoading(false);
      }
    }

    if (orgId) {
      fetchUserPermissions();
    }
  }, [orgId, supabase]);

  // Permission check functions
  const canInvite = role === "owner" || role === "admin";
  const canManageInvitations = role === "owner" || role === "admin";

  const canChangeRole = (targetMember: TeamMember): boolean => {
    if (!(role && currentUserId)) {
      return false;
    }

    // Cannot change own role
    if (targetMember.user_id === currentUserId) {
      return false;
    }

    // Only owners can change roles
    return role === "owner";
  };

  const canRemoveMember = (
    targetMember: TeamMember,
    isLastOwner: boolean
  ): boolean => {
    if (!(role && currentUserId)) {
      return false;
    }

    // Cannot remove self
    if (targetMember.user_id === currentUserId) {
      return false;
    }

    // Cannot remove last owner
    if (targetMember.role === "owner" && isLastOwner) {
      return false;
    }

    // Owner can remove anyone (except self and last owner)
    if (role === "owner") {
      return true;
    }

    // Admin can only remove members (not other admins or owners)
    if (role === "admin") {
      return targetMember.role === "member";
    }

    return false;
  };

  const canTransferOwnership = (): boolean => {
    return role === "owner";
  };

  return {
    role,
    currentUserId,
    canInvite,
    canManageInvitations,
    canChangeRole,
    canRemoveMember,
    canTransferOwnership,
    loading,
    error,
  };
}
