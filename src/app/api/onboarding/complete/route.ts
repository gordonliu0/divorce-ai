// app/api/onboarding/complete/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";
import { createServiceClient } from "@/shared/lib/supabase/service";

export async function POST() {
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

    // Use service role client
    const supabaseServiceRole = await createServiceClient();

    // Mark onboarding as complete
    const { data, error } = await supabaseServiceRole
      .from("user_onboarding_progress")
      .update({
        completed_at: new Date().toISOString(),
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
    console.error("Error completing onboarding:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
