// app/api/organizations/[orgId]/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const supabase = await createClient();
    const { orgId } = await params;

    // Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check role
    const { data: role } = await supabase.rpc("user_org_role", {
      org_id: orgId,
    });

    if (!role || (role !== "owner" && role !== "admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse body
    const body = await request.json();
    const { name } = body;

    // Validate
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Organization name is required" },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();

    if (trimmedName.length === 0) {
      return NextResponse.json(
        { error: "Organization name cannot be empty" },
        { status: 400 }
      );
    }

    if (trimmedName.length > 100) {
      return NextResponse.json(
        { error: "Organization name must be 100 characters or less" },
        { status: 400 }
      );
    }

    // Update
    const { data: updatedOrg, error: updateError } = await supabase
      .from("organizations")
      .update({ name: trimmedName })
      .eq("id", orgId)
      .select("id, name")
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json(updatedOrg);
  } catch (error) {
    console.error("Error updating organization:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
