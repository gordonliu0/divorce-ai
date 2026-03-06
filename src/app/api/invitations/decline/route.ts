// app/api/invitations/decline/route.ts

import { createClient as createServerClient } from "@/shared/lib/supabase/server";
import { createClient } from "@/shared/lib/supabase/service";

export async function POST(request: Request) {
  const supabase = createClient();
  const supabaseServer = await createServerClient();
  const { invitationId } = await request.json();

  // Verify user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabaseServer.auth.getUser();

  if (authError || !user) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Get invitation
  const { data: invitation, error: inviteError } = await supabase
    .from("organization_invitations")
    .select("*")
    .eq("id", invitationId)
    .single();

  if (inviteError || !invitation) {
    return Response.json({ error: "Invalid invitation" }, { status: 404 });
  }

  // Validate invitation belongs to user
  if (user.email?.toLowerCase() !== invitation.email.toLowerCase()) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Validate invitation can be declined (pending only)
  if (invitation.status !== "pending") {
    return Response.json(
      { error: `Cannot decline ${invitation.status} invitation` },
      { status: 400 }
    );
  }

  // Update invitation status to declined
  const { error: updateError } = await supabase
    .from("organization_invitations")
    .update({
      status: "declined",
      accepted_at: new Date().toISOString(), // Track when declined
      accepted_by_user_id: user.id,
    })
    .eq("id", invitationId);

  if (updateError) {
    return Response.json(
      { error: "Failed to decline invitation" },
      { status: 500 }
    );
  }

  return Response.json({ success: true });
}
