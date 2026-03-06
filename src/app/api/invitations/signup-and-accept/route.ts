// app/api/invitations/signup-and-accept/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/service";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_LETTER_REGEX = /[A-Za-z]/;
const PASSWORD_DIGIT_REGEX = /[0-9]/;

function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

function isStrongPassword(password: string): boolean {
  // At least 8 characters, with at least one letter and one number
  return (
    password.length >= 8 &&
    PASSWORD_LETTER_REGEX.test(password) &&
    PASSWORD_DIGIT_REGEX.test(password)
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, fullName, invitationId, invitationToken } = body;

    // Validate required fields
    if (!(email && password && fullName && invitationId && invitationToken)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (!isStrongPassword(password)) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 8 characters with letters and numbers",
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Step 1: Validate invitation
    const { data: invitation, error: inviteError } = await supabase
      .from("invitations")
      .select(
        `
        id,
        email,
        role,
        status,
        expires_at,
        organization_id,
        token
      `
      )
      .eq("id", invitationId)
      .eq("token", invitationToken)
      .single();

    if (inviteError || !invitation) {
      return NextResponse.json(
        { error: "Invalid invitation" },
        { status: 404 }
      );
    }

    // Validate invitation status
    if (invitation.status !== "pending") {
      return NextResponse.json(
        { error: `Invitation already ${invitation.status}` },
        { status: 400 }
      );
    }

    // Validate expiration
    if (new Date(invitation.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "Invitation has expired" },
        { status: 400 }
      );
    }

    // Validate email match
    if (invitation.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { error: "Email does not match invitation" },
        { status: 403 }
      );
    }

    // Step 2: Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json(
        {
          error: "User with this email already exists. Please sign in instead.",
        },
        { status: 409 }
      );
    }

    // Step 3: Create user with email pre-confirmed using Admin API
    const { data: userData, error: createUserError } =
      await supabase.auth.admin.createUser({
        email: email.toLowerCase(),
        password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          full_name: fullName,
        },
      });

    if (createUserError) {
      console.error("Error creating user:", createUserError);
      return NextResponse.json(
        { error: createUserError.message },
        { status: 500 }
      );
    }

    if (!userData.user) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    // Update the users table with the full name
    const { error: updateUserError } = await supabase
      .from("users")
      .update({ name: fullName })
      .eq("id", userData.user.id);

    if (updateUserError) {
      console.error("Error updating user name:", updateUserError);
      // Rollback: delete the user we just created
      await supabase.auth.admin.deleteUser(userData.user.id);
      return NextResponse.json(
        { error: "Failed to update user name" },
        { status: 500 }
      );
    }

    // Step 4: Create organization membership
    const { error: memberError } = await supabase.from("members").insert({
      user_id: userData.user.id,
      organization_id: invitation.organization_id,
      role: invitation.role,
    });

    if (memberError) {
      console.error("Error creating membership:", memberError);

      // Rollback: delete the user we just created
      await supabase.auth.admin.deleteUser(userData.user.id);

      return NextResponse.json(
        { error: "Failed to add user to organization" },
        { status: 500 }
      );
    }

    // Step 5: Update invitation status
    const { error: updateError } = await supabase
      .from("invitations")
      .update({
        status: "accepted",
        accepted_at: new Date().toISOString(),
        accepted_by_user_id: userData.user.id,
      })
      .eq("id", invitationId);

    if (updateError) {
      console.error("Error updating invitation:", updateError);
      // Non-critical error - user is already created and added to org
    }

    // Step 6: Create session for the user
    const { data: sessionData, error: sessionError } =
      await supabase.auth.admin.generateLink({
        type: "magiclink",
        email: email.toLowerCase(),
      });

    if (sessionError || !sessionData) {
      // User is created but we can't auto-login them
      // Return success but indicate they need to sign in
      return NextResponse.json({
        success: true,
        organizationId: invitation.organization_id,
        requiresSignIn: true,
        message: "Account created successfully. Please sign in to continue.",
      });
    }

    return NextResponse.json({
      success: true,
      organizationId: invitation.organization_id,
      session: sessionData,
      requiresSignIn: false,
    });
  } catch (error) {
    console.error("Error in signup-and-accept:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
