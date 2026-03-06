// app/api/organizations/[orgId]/invitations/[invitationId]/resend/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { sendInvitationEmail } from "@/shared/lib/email/resend/invitations";
import { createClient } from "@/shared/lib/supabase/server";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ orgId: string; invitationId: string }> }
) {
  const supabase = await createClient();
  const { orgId, invitationId } = await params;

  try {
    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check user's role in organization
    const { data: membership, error: membershipError } = await supabase
      .from("members")
      .select("role")
      .eq("organization_id", orgId)
      .eq("user_id", user.id)
      .single();

    if (membershipError || !membership) {
      return NextResponse.json(
        { error: "Not a member of this organization" },
        { status: 403 }
      );
    }

    if (!["owner", "admin"].includes(membership.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Get invitation
    const { data: invitation, error: invitationError } = await supabase
      .from("invitations")
      .select("*")
      .eq("id", invitationId)
      .eq("organization_id", orgId)
      .single();

    if (invitationError || !invitation) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    // Validate status
    if (!["pending", "expired"].includes(invitation.status)) {
      return NextResponse.json(
        { error: "Can only resend pending or expired invitations" },
        { status: 400 }
      );
    }

    // Check resend limit
    if ((invitation.resend_count || 0) >= 10) {
      return NextResponse.json(
        { error: "Maximum resend limit reached (10 attempts)" },
        { status: 400 }
      );
    }

    // Update invitation
    const { error: updateError } = await supabase
      .from("invitations")
      .update({
        resend_count: (invitation.resend_count || 0) + 1,
        last_resent_at: new Date().toISOString(),
        expires_at: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        status: "pending", // Reset to pending if was expired
      })
      .eq("id", invitationId);

    if (updateError) {
      throw updateError;
    }

    // Check if user exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", invitation.email)
      .single();

    const isExistingUser = !!existingUser;

    const { data: currentOrganization } = await supabase
      .from("organizations")
      .select("name")
      .eq("id", orgId)
      .single();

    if (!currentOrganization) {
      throw new Error("Organization not found");
    }

    // After creating invitation, send email:
    await sendInvitationEmail({
      to: invitation.email,
      token: invitation.token,
      inviterName: user.user_metadata?.name || user.email || "A team member",
      organizationName: currentOrganization.name, // You'll need to fetch this
      customMessage: invitation.custom_message || undefined,
      isExistingUser,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error resending invitation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
