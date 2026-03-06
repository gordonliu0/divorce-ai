"use client";

import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthRequiredAcceptance } from "./auth-required-acceptance";
import { LoggedInAcceptance } from "./logged-in-acceptance";

interface Invitation {
  email: string;
  id: string;
  organizations: {
    name: string;
  };
  token: string;
}

export function InvitationAcceptFlow({
  invitation,
  user,
}: {
  invitation: Invitation;
  user: User | null;
}) {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleAcceptInvitation(invitationId: string, token: string) {
    try {
      await fetch("/api/invitations/accept", {
        method: "POST",
        body: JSON.stringify({ invitationId, token }),
      });
      router.push("/o");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to accept invitation"
      );
    }
  }

  // Path 1: User is logged in
  if (user) {
    return (
      <LoggedInAcceptance
        currentUser={{ email: user.email }}
        error={error}
        invitation={invitation}
        onAccept={handleAcceptInvitation}
      />
    );
  }

  // Path 2 & 3: User not logged in - check if they exist
  return (
    <AuthRequiredAcceptance
      error={error}
      invitation={invitation}
      onComplete={handleAcceptInvitation}
    />
  );
}
