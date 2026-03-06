import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const supabase = await createClient();
    const { orgId } = await params;

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

    const { data: cases, error } = await supabase
      .from("cases")
      .select("*, documents(count)")
      .eq("organization_id", orgId)
      .order("updated_at", { ascending: false });

    if (error) {
      throw error;
    }

    const formatted = (cases ?? []).map((c) => ({
      ...c,
      document_count: c.documents?.[0]?.count ?? 0,
      documents: undefined,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching cases:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const supabase = await createClient();
    const { orgId } = await params;

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
    const { name, client_name } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Case name is required" },
        { status: 400 }
      );
    }

    if (
      !client_name ||
      typeof client_name !== "string" ||
      !client_name.trim()
    ) {
      return NextResponse.json(
        { error: "Client name is required" },
        { status: 400 }
      );
    }

    const { data: newCase, error } = await supabase
      .from("cases")
      .insert({
        organization_id: orgId,
        created_by: user.id,
        name: name.trim(),
        client_name: client_name.trim(),
        opposing_party_name: body.opposing_party_name?.trim() || null,
        jurisdiction: body.jurisdiction || null,
        date_of_marriage: body.date_of_marriage || null,
        date_of_separation: body.date_of_separation || null,
        date_of_filing: body.date_of_filing || null,
        case_number: body.case_number?.trim() || null,
        notes: body.notes?.trim() || null,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(newCase, { status: 201 });
  } catch (error) {
    console.error("Error creating case:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
