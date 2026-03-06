// app/api/onboarding/update-progress/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";
import { createServiceClient } from "@/shared/lib/supabase/service";

export async function POST(request: Request) {
  try {
    const supabaseAuth = await createClient();

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabaseAuth.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { step } = body;

    // Validate step
    const validSteps = [
      "welcome",
      "account-setup",
      "organization-setup",
      "invite-team",
      "ready",
    ];
    if (!validSteps.includes(step)) {
      return NextResponse.json({ error: "Invalid step" }, { status: 400 });
    }

    // Now use service role client for the update
    const supabaseServiceRole = await createServiceClient();

    // Simple update - just current_step
    const { data, error } = await supabaseServiceRole
      .from("user_onboarding_progress")
      .update({
        current_step: step,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error updating onboarding progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
