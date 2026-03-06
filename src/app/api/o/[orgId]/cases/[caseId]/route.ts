import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orgId: string; caseId: string }> }
) {
  try {
    const supabase = await createClient();
    const { orgId, caseId } = await params;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: isMember } = await supabase.rpc("user_is_org_member", {
      org_id: orgId,
    });

    if (!isMember) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: caseData, error } = await supabase
      .from("cases")
      .select("*, documents(count)")
      .eq("id", caseId)
      .eq("organization_id", orgId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Case not found" }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({
      ...caseData,
      document_count: caseData.documents?.[0]?.count ?? 0,
      documents: undefined,
    });
  } catch (error) {
    console.error("Error fetching case:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string; caseId: string }> }
) {
  try {
    const supabase = await createClient();
    const { orgId, caseId } = await params;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: role } = await supabase.rpc("user_org_role", {
      org_id: orgId,
    });

    if (!role) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    const allowedFields = [
      "name",
      "client_name",
      "opposing_party_name",
      "jurisdiction",
      "date_of_marriage",
      "date_of_separation",
      "date_of_filing",
      "case_number",
      "notes",
      "status",
    ] as const;

    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (field in body) {
        const value = body[field];
        updates[field] =
          typeof value === "string" ? value.trim() || null : value;
      }
    }

    if ("name" in updates && !updates.name) {
      return NextResponse.json(
        { error: "Case name is required" },
        { status: 400 }
      );
    }

    if ("client_name" in updates && !updates.client_name) {
      return NextResponse.json(
        { error: "Client name is required" },
        { status: 400 }
      );
    }

    if (
      "status" in updates &&
      !["intake", "processing", "review", "complete"].includes(
        updates.status as string
      )
    ) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const { data: updatedCase, error } = await supabase
      .from("cases")
      .update(updates)
      .eq("id", caseId)
      .eq("organization_id", orgId)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Case not found" }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json(updatedCase);
  } catch (error) {
    console.error("Error updating case:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
