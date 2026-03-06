// app/api/organizations/create-with-onboarding/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";
import { createServiceClient } from "@/shared/lib/supabase/service";

export async function POST(request: Request) {
  try {
    // Verify authentication
    const supabaseAuth = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabaseAuth.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { name, teamSize } = body;

    // Validate
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Organization name is required" },
        { status: 400 }
      );
    }

    // Check if user already has an organization (during onboarding, only one allowed)
    const supabaseServiceRole = await createServiceClient();

    const { data: existingMembership } = await supabaseServiceRole
      .from("members")
      .select("id")
      .eq("user_id", user.id)
      .eq("role", "owner")
      .single();

    if (existingMembership) {
      return NextResponse.json(
        { error: "Organization already created during onboarding" },
        { status: 400 }
      );
    }

    // Create organization
    const { data: organization, error: orgError } = await supabaseServiceRole
      .from("organizations")
      .insert({
        name: name.trim(),
        team_size: teamSize || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (orgError) {
      throw orgError;
    }

    // Add user as owner
    const { error: memberError } = await supabaseServiceRole
      .from("members")
      .insert({
        user_id: user.id,
        organization_id: organization.id,
        role: "owner",
        joined_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (memberError) {
      throw memberError;
    }

    return NextResponse.json({ data: organization });
  } catch (error) {
    console.error("Error creating organization:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
