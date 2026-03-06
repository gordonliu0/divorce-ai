"use server";

import {
  InvalidInvitationPage,
  InvitationAlreadyUsedPage,
  InvitationExpiredPage,
} from "@/features/invitations/components/accept/flow-pages";
import { InvitationAcceptFlow } from "@/features/invitations/components/accept/invitation-acceptance-flow";
import { createClient as createServerClient } from "@/shared/lib/supabase/server";
import { createClient } from "@/shared/lib/supabase/service";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const supabaseServiceClient = await createClient();
  const supabaseServerClient = await createServerClient();

  const { token } = await params;

  // Check 1: Validate the invitation token (bypassing auth w/ service client, no auth needed)
  const { data: invitation, error } = await supabaseServiceClient
    .from("organization_invitations")
    .select(
      `
      id,
      email,
      role,
      status,
      expires_at,
      organization_id,
      token,
      organizations (
        id,
        name
      )
    `
    )
    .eq("token", token)
    .single();

  // Handle invalid/expired/used invitations
  if (error || !invitation) {
    return <InvalidInvitationPage />;
  }

  if (invitation.status !== "pending" && invitation.status !== "expired") {
    return (
      <InvitationAlreadyUsedPage
        status={invitation.status as "accepted" | "cancelled" | "declined"}
      />
    );
  }

  if (invitation.status === "expired") {
    return <InvitationExpiredPage />;
  }

  // Check 2: Get current user (if any)
  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser();

  // Pass everything to client component for interactive handling
  return <InvitationAcceptFlow invitation={invitation} user={user} />;
}
