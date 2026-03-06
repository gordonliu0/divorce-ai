import { type NextRequest, NextResponse } from "next/server";
import type { Database } from "@/database.types";
import { transformInvitations } from "@/features/team/lib/team";
import { sendInvitationEmail } from "@/shared/lib/email/resend/invitations";
import { createClient } from "@/shared/lib/supabase/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SendInvitationsRequest {
  customMessage?: string;
  emails: string[];
  role: "admin" | "member";
}

interface ValidationError {
  email: string;
  error: string;
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: API route with validation, auth, and batch processing logic
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  const supabase = await createClient();
  const { orgId } = await params;

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
      .from("organization_members")
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
        { error: "Insufficient permissions to send invitations" },
        { status: 403 }
      );
    }

    // Parse request body
    const body: SendInvitationsRequest = await request.json();
    const { emails, role, customMessage } = body;

    // Validate batch size
    if (emails.length > 50) {
      return NextResponse.json(
        { error: "Maximum 50 invitations per batch" },
        { status: 400 }
      );
    }

    // Validate role
    if (!["admin", "member"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be admin or member" },
        { status: 400 }
      );
    }

    // Check daily rate limit (200 per org per day)
    const { count, error: countError } = await supabase
      .from("organization_invitations")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", orgId)
      .gte("sent_at", new Date().toISOString().split("T")[0]);

    if (countError) {
      throw countError;
    }

    if ((count || 0) + emails.length > 200) {
      return NextResponse.json(
        { error: "Daily invitation limit exceeded (200 per day)" },
        { status: 429 }
      );
    }

    // Get existing members and pending invitations for validation
    const { data: members } = await supabase
      .from("organization_members")
      .select("user:users!user_id(email)")
      .eq("organization_id", orgId);

    const { data: pendingInvitations } = await supabase
      .from("organization_invitations")
      .select("email")
      .eq("organization_id", orgId)
      .eq("status", "pending");

    const memberEmails = new Set(
      members?.map((m) => m.user?.email.toLowerCase()).filter(Boolean) || []
    );
    const pendingEmails = new Set(
      pendingInvitations?.map((inv) => inv.email.toLowerCase()) || []
    );

    // Process each email
    const errors: ValidationError[] = [];
    const createdInvitations: (Database["public"]["Tables"]["organization_invitations"]["Row"] & {
      invited_by: { name: string | null };
    })[] = [];
    let sentCount = 0;

    for (const email of emails) {
      const cleanEmail = email.trim().toLowerCase();

      // Email format validation
      if (!EMAIL_REGEX.test(cleanEmail)) {
        errors.push({ email, error: "Invalid email format" });
        continue;
      }

      // Check if already a member
      if (memberEmails.has(cleanEmail)) {
        errors.push({ email, error: "Already a team member" });
        continue;
      }

      // Check if pending invitation exists
      if (pendingEmails.has(cleanEmail)) {
        errors.push({ email, error: "Invitation already sent" });
        continue;
      }

      // Generate secure token (32 bytes)
      const tokenArray = new Uint8Array(32);
      crypto.getRandomValues(tokenArray);
      const token = Array.from(tokenArray)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      // Create invitation
      const { data: invitation, error: insertError } = await supabase
        .from("organization_invitations")
        .insert({
          organization_id: orgId,
          email: cleanEmail,
          role,
          token,
          invited_by_user_id: user.id,
          custom_message: customMessage || null,
          status: "pending",
          sent_at: new Date().toISOString(),
          expires_at: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
        })
        .select(
          `
          *,
          invited_by:users!invited_by_user_id(name)
        `
        )
        .single();

      if (insertError) {
        errors.push({ email, error: insertError.message });
        continue;
      }

      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", cleanEmail)
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
        to: cleanEmail,
        token,
        inviterName: user.user_metadata?.name || user.email || "A team member",
        organizationName: currentOrganization.name, // You'll need to fetch this
        customMessage,
        isExistingUser,
      });

      createdInvitations.push(invitation);
      sentCount++;
    }

    // Transform invitations to frontend format
    const transformedInvitations = transformInvitations(createdInvitations);

    return NextResponse.json({
      success: true,
      sent: sentCount,
      errors,
      invitations: transformedInvitations,
    });
  } catch (error) {
    console.error("Error sending invitations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
