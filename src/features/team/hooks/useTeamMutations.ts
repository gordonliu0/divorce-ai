"use client";

import { useState } from "react";
import { createClient } from "@/shared/lib/supabase/client";
import { useTeamData } from "../contexts/TeamDataContext";
import type {
  PendingInvitation,
  TeamMember,
  ValidationError,
} from "../types/types";

interface SendInvitationsResult {
  errors: ValidationError[];
  invitations?: PendingInvitation[];
  sent: number;
  success: boolean;
}

interface MutationResult {
  error?: string;
  success: boolean;
}

const TEAM_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useTeamMutations(orgId: string) {
  const { state, actions, selectors } = useTeamData();
  const supabase = createClient();

  // Per-mutation loading states
  const [sendingInvitations, setSendingInvitations] = useState(false);
  const [resending, setResending] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [updatingRole, setUpdatingRole] = useState(false);
  const [removingMember, setRemovingMember] = useState(false);
  const [transferringOwnership, setTransferringOwnership] = useState(false);

  // Per-mutation errors
  const [sendError, setSendError] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [updateRoleError, setUpdateRoleError] = useState<string | null>(null);
  const [removeMemberError, setRemoveMemberError] = useState<string | null>(
    null
  );
  const [transferOwnershipError, setTransferOwnershipError] = useState<
    string | null
  >(null);

  const validateEmailsClientSide = (emails: string[]): ValidationError[] => {
    const errors: ValidationError[] = [];

    // Check batch size limit
    if (emails.length > 50) {
      return [{ email: "", error: "Maximum 50 invitations per batch" }];
    }

    for (const email of emails) {
      const cleanEmail = email.trim().toLowerCase();

      // Email format validation
      if (!TEAM_EMAIL_REGEX.test(cleanEmail)) {
        errors.push({ email, error: "Invalid email format" });
        continue;
      }

      // Check if already a member
      const existingMember = selectors.getMemberByEmail(cleanEmail);
      if (existingMember) {
        errors.push({ email, error: "Already a team member" });
        continue;
      }

      // Check if pending invitation exists
      const existingInvitation =
        selectors.getPendingInvitationByEmail(cleanEmail);
      if (existingInvitation) {
        errors.push({ email, error: "Invitation already sent" });
      }
    }

    return errors;
  };

  const sendInvitations = async (
    emails: string[],
    role: "admin" | "member",
    customMessage?: string
  ): Promise<SendInvitationsResult> => {
    setSendingInvitations(true);
    setSendError(null);

    try {
      // Client-side validation first
      const clientErrors = validateEmailsClientSide(
        emails
        // role,
        // customMessage
      );
      if (clientErrors.length > 0) {
        return { success: false, sent: 0, errors: clientErrors };
      }

      // Call Edge Function
      const response = await fetch(`/api/o/${orgId}/invitations/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails, role, customMessage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send invitations");
      }

      // Add invitations to context (already transformed by server)
      for (const invitation of data.invitations ?? []) {
        actions.addInvitation(invitation as PendingInvitation);
      }

      return {
        success: true,
        sent: data.sent,
        errors: data.errors || [],
        invitations: data.invitations,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send invitations";
      setSendError(errorMessage);
      return {
        success: false,
        sent: 0,
        errors: [{ email: "", error: errorMessage }],
      };
    } finally {
      setSendingInvitations(false);
    }
  };

  const resendInvitation = async (
    invitationId: string
  ): Promise<MutationResult> => {
    const invitation = [
      ...selectors.getPendingInvitations(),
      ...selectors.getExpiredInvitations(),
    ].find((inv) => inv.id === invitationId);

    if (!invitation) {
      return { success: false, error: "Invitation not found" };
    }

    // Store previous state for potential rollback
    const previousState = { ...invitation };

    // Optimistic update: increment resend_count and update expiry
    const optimisticUpdates = {
      resend_count: invitation.resend_count + 1,
      last_resent_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "pending" as "pending" | "expired" | "cancelled" | undefined,
    };

    actions.updateInvitation(invitationId, optimisticUpdates);
    setResending(true);
    setResendError(null);

    try {
      const response = await fetch(
        `/api/o/${orgId}/invitations/${invitationId}/resend`,
        { method: "POST" }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to resend invitation");
      }

      return { success: true };
    } catch (error) {
      // Revert optimistic update on failure
      actions.updateInvitation(invitationId, previousState);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to resend invitation";
      setResendError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setResending(false);
    }
  };

  const cancelInvitation = async (
    invitationId: string
  ): Promise<MutationResult> => {
    const invitation = selectors
      .getPendingInvitations()
      .find((inv: PendingInvitation) => inv.id === invitationId);
    if (!invitation) {
      return { success: false, error: "Invitation not found" };
    }

    // Store previous state for potential rollback
    const previousState = { ...invitation };

    // Optimistic update: set status = 'cancelled'
    actions.updateInvitation(invitationId, { status: "cancelled" });
    setCancelling(true);
    setCancelError(null);

    try {
      const { error } = await supabase
        .from("invitations")
        .update({ status: "cancelled" })
        .eq("id", invitationId);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      // Revert to previous state on failure
      actions.updateInvitation(invitationId, previousState);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to cancel invitation";
      setCancelError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setCancelling(false);
    }
  };

  const updateMemberRole = async (
    userId: string,
    newRole: "admin" | "member"
  ): Promise<MutationResult> => {
    // Store previous state for rollback
    const member = state.members.find((m: TeamMember) => m.user_id === userId);

    if (!member) {
      return { success: false, error: "Member not found" };
    }

    const previousRole = member.role;

    // Optimistic update
    actions.updateMemberRole(userId, newRole);
    setUpdatingRole(true);
    setUpdateRoleError(null);

    try {
      const response = await fetch(`/api/o/${orgId}/members/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update member role");
      }

      return { success: true };
    } catch (error) {
      // Rollback
      actions.updateMemberRole(userId, previousRole);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update member role";
      setUpdateRoleError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setUpdatingRole(false);
    }
  };

  const removeMember = async (userId: string): Promise<MutationResult> => {
    const member = state.members.find((m: TeamMember) => m.user_id === userId);

    if (!member) {
      return { success: false, error: "Member not found" };
    }

    // Store for potential rollback
    const previousMember = { ...member };

    // Optimistic update
    actions.removeMember(userId);
    setRemovingMember(true);
    setRemoveMemberError(null);

    try {
      const response = await fetch(`/api/o/${orgId}/members/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to remove member");
      }

      return { success: true };
    } catch (error) {
      // Rollback
      actions.addMember(previousMember);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to remove member";
      setRemoveMemberError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setRemovingMember(false);
    }
  };

  const transferOwnership = async (
    newOwnerId: string
  ): Promise<MutationResult> => {
    setTransferringOwnership(true);
    setTransferOwnershipError(null);

    try {
      const response = await fetch(`/api/o/${orgId}/transfer-ownership`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newOwnerId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to transfer ownership");
      }

      const data = await response.json();

      // Update both members in state
      if (data.newOwner) {
        actions.updateMember(data.newOwner.user_id, data.newOwner);
      }
      if (data.formerOwner) {
        actions.updateMember(data.formerOwner.user_id, data.formerOwner);
      }

      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to transfer ownership";
      setTransferOwnershipError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setTransferringOwnership(false);
    }
  };

  return {
    // Loading states
    sendingInvitations,
    resending,
    cancelling,
    updatingRole,
    removingMember,
    transferringOwnership,

    // Error states
    sendError,
    resendError,
    cancelError,
    updateRoleError,
    removeMemberError,
    transferOwnershipError,

    // Mutation functions
    sendInvitations,
    resendInvitation,
    cancelInvitation,
    updateMemberRole,
    removeMember,
    transferOwnership,
  };
}
