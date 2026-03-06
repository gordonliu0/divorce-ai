import { createClient as createServerClient } from "@/shared/lib/supabase/server";
import { createClient } from "@/shared/lib/supabase/service";

// app/api/invitations/accept/route.ts
export async function POST(request: Request) {
  const supabase = await createClient();
  const supabaseServer = await createServerClient();
  const { invitationId, token } = await request.json();
  console.log("Received request:", { invitationId, token });

  // Verify user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabaseServer.auth.getUser();
  console.log("Auth check result:", { user: user?.id, authError });
  if (authError || !user) {
    console.log("Authentication failed");
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Get invitation
  const { data: invitation, error: inviteError } = await supabase
    .from("invitations")
    .select("*")
    .eq("id", invitationId)
    .eq("token", token)
    .single();
  console.log("Invitation lookup result:", { invitation, inviteError });

  if (inviteError || !invitation) {
    console.log("Invalid invitation");
    return Response.json({ error: "Invalid invitation" }, { status: 404 });
  }

  // Validate invitation
  console.log("Validating invitation status and expiry");
  if (invitation.status !== "pending") {
    console.log("Invitation already used:", invitation.status);
    return Response.json({ error: "Invitation already used" }, { status: 400 });
  }

  if (new Date(invitation.expires_at) < new Date()) {
    console.log("Invitation expired:", invitation.expires_at);
    return Response.json({ error: "Invitation expired" }, { status: 400 });
  }

  // Check email match
  console.log("Checking email match:", {
    userEmail: user.email?.toLowerCase(),
    invitationEmail: invitation.email.toLowerCase(),
  });
  if (user.email?.toLowerCase() !== invitation.email.toLowerCase()) {
    console.log("Email mismatch detected");
    return Response.json({ error: "Email mismatch" }, { status: 403 });
  }

  // Create membership
  console.log("Creating organization membership");
  const { error: memberError } = await supabase
    .from("members")
    .insert({
      user_id: user.id,
      organization_id: invitation.organization_id,
      role: invitation.role,
    });

  if (memberError) {
    console.log("Failed to create membership:", memberError);
    return Response.json({ error: "Failed to add member" }, { status: 500 });
  }

  // Update invitation status
  console.log("Updating invitation status to accepted");
  const { error: updateError } = await supabase
    .from("invitations")
    .update({
      status: "accepted",
      accepted_at: new Date().toISOString(),
      accepted_by_user_id: user.id,
    })
    .eq("id", invitationId);

  if (updateError) {
    console.log("Failed to update invitation status:", updateError);
  }

  console.log("Invitation acceptance completed successfully");
  return Response.json({
    success: true,
    organizationId: invitation.organization_id,
  });
}
