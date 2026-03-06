import { useState } from "react";
import { useInvitations } from "../context/invitations-context";

interface UseInvitationActionsReturn {
  accept: (
    invitationId: string,
    token: string
  ) => Promise<{ success: boolean; organizationId?: string; error?: string }>;
  accepting: boolean;
  decline: (
    invitationId: string
  ) => Promise<{ success: boolean; error?: string }>;
  declining: boolean;
  error: string | null;
}

export function useInvitationActions(): UseInvitationActionsReturn {
  const [accepting, setAccepting] = useState(false);
  const [declining, setDeclining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateInvitation } = useInvitations();

  const accept = async (invitationId: string, token: string) => {
    setAccepting(true);
    setError(null);

    // Optimistic update
    updateInvitation(invitationId, { status: "accepted" });

    try {
      const response = await fetch("/api/invitations/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationId, token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to accept invitation");
      }

      // Update with full accepted data
      updateInvitation(invitationId, {
        status: "accepted",
        accepted_at: new Date().toISOString(),
      });

      return { success: true, organizationId: data.organizationId };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);

      // Rollback optimistic update
      updateInvitation(invitationId, { status: "pending" });

      return { success: false, error: errorMessage };
    } finally {
      setAccepting(false);
    }
  };

  const decline = async (invitationId: string) => {
    setDeclining(true);
    setError(null);

    // Optimistic update
    updateInvitation(invitationId, { status: "declined" });

    try {
      const response = await fetch("/api/invitations/decline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to decline invitation");
      }

      // Update with full declined data
      updateInvitation(invitationId, {
        status: "declined",
        accepted_at: new Date().toISOString(),
      });

      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);

      // Rollback optimistic update
      updateInvitation(invitationId, { status: "pending" });

      return { success: false, error: errorMessage };
    } finally {
      setDeclining(false);
    }
  };

  return {
    accept,
    decline,
    accepting,
    declining,
    error,
  };
}
