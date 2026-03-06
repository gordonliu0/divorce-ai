import { NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";
import { createClient as createServiceClient } from "@/shared/lib/supabase/service";

export async function POST(request: Request) {
  try {
    const serviceSupabase = await createServiceClient();
    const supabase = await createClient();
    const { name } = await request.json();

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Organization name is required" },
        { status: 400 }
      );
    }

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) {
      throw userError;
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Insert new organization
    const { data: org, error: orgError } = await serviceSupabase
      .from("organizations")
      .insert({ name })
      .select()
      .single();

    if (orgError) {
      console.error("Failed to create organization:", orgError);
      throw orgError;
    }

    // Add creator as owner using service role to bypass RLS
    const { error: memberError } = await serviceSupabase
      .from("members")
      .insert([
        {
          organization_id: org.id,
          user_id: user.id,
          role: "owner",
        },
      ]);

    if (memberError) {
      throw memberError;
    }

    return NextResponse.json({
      success: true,
      organization: org,
    });
  } catch (error) {
    console.error("Error in create organization route:", error);
    return NextResponse.json(
      { error: "Failed to create organization" },
      { status: 500 }
    );
  }
}
