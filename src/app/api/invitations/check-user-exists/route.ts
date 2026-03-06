import { NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/service";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

// Validate invitation token to ensure this is a legitimate check
async function validateInvitationContext(
  email: string,
  token?: string
): Promise<boolean> {
  if (!token) {
    return false;
  }

  const supabase = await createClient();

  // Check if there's a pending invitation for this email with this token
  const { data } = await supabase
    .from("invitations")
    .select("id")
    .eq("email", email.toLowerCase())
    .eq("token", token)
    .eq("status", "pending")
    .single();

  return !!data;
}

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    const { email, invitationToken } = body;

    // Validate email presence and format
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // STRATEGY 1: Require invitation token
    // Only allow checks in context of a valid invitation
    if (!invitationToken) {
      return NextResponse.json(
        { error: "Invitation token required" },
        { status: 400 }
      );
    }

    const isValidInvitation = await validateInvitationContext(
      email,
      invitationToken
    );

    if (!isValidInvitation) {
      return NextResponse.json(
        { error: "Invalid invitation context" },
        { status: 403 }
      );
    }

    const supabase = await createClient();

    // Check if user exists
    const { data } = await supabase
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase())
      .maybeSingle(); // Use maybeSingle instead of single to avoid error on no match

    // STRATEGY 4: Don't reveal too much information
    // Return exists/doesn't exist, but don't expose any user details
    const exists = !!data;

    return NextResponse.json({
      exists,
    });
  } catch (error) {
    console.error("Error checking user existence:", error);

    // Generic error messages - don't leak information about what went wrong
    return NextResponse.json(
      { error: "Unable to process request" },
      { status: 500 }
    );
  }
}
