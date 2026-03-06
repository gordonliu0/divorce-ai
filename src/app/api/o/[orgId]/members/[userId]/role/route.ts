// app/api/o/[orgId]/members/[userId]/role/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";

interface UpdateRoleRequest {
  role: "admin" | "member";
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string; userId: string }> }
) {
  const supabase = await createClient();
  const { orgId, userId } = await params;

  try {
    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Cannot change own role
    if (user.id === userId) {
      return NextResponse.json(
        { error: "Cannot change your own role" },
        { status: 403 }
      );
    }

    // Check current user's role in organization
    const { data: currentUserMembership, error: currentUserError } =
      await supabase
        .from("organization_members")
        .select("role")
        .eq("organization_id", orgId)
        .eq("user_id", user.id)
        .single();

    if (currentUserError || !currentUserMembership) {
      return NextResponse.json(
        { error: "Not a member of this organization" },
        { status: 403 }
      );
    }

    // Only owners can change roles (admins cannot)
    if (currentUserMembership.role !== "owner") {
      return NextResponse.json(
        { error: "Only owners can change member roles" },
        { status: 403 }
      );
    }

    // Parse request body
    const body: UpdateRoleRequest = await request.json();
    const { role } = body;

    // Validate role
    if (!["admin", "member"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be admin or member" },
        { status: 400 }
      );
    }

    // Get target member's current role
    const { data: targetMember, error: targetError } = await supabase
      .from("organization_members")
      .select("id, role, user:users!user_id(*)")
      .eq("organization_id", orgId)
      .eq("user_id", userId)
      .single();

    if (targetError || !targetMember) {
      return NextResponse.json(
        { error: "Target member not found" },
        { status: 404 }
      );
    }

    // If demoting from owner to admin/member, check if they're the last owner
    if (targetMember.role === "owner") {
      const { count, error: countError } = await supabase
        .from("organization_members")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", orgId)
        .eq("role", "owner");

      if (countError) {
        throw countError;
      }

      if ((count || 0) <= 1) {
        return NextResponse.json(
          { error: "Cannot demote the last owner" },
          { status: 400 }
        );
      }
    }

    // Update the member's role
    const { data: updatedMember, error: updateError } = await supabase
      .from("organization_members")
      .update({ role, updated_at: new Date().toISOString() })
      .eq("id", targetMember.id)
      .select(
        `
        id,
        user_id,
        organization_id,
        role,
        joined_at,
        user:users!user_id (
          *
        )
      `
      )
      .single();

    if (updateError) {
      throw updateError;
    }

    // Transform to frontend format
    const transformedMember = {
      id: updatedMember.id,
      user_id: updatedMember.user_id,
      email: updatedMember.user.email,
      name: updatedMember.user.name || updatedMember.user.email,
      role: updatedMember.role as "owner" | "admin" | "member",
      avatar_url: updatedMember.user.avatar_url || undefined,
      joined_at: updatedMember.joined_at || new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      member: transformedMember,
    });
  } catch (error) {
    console.error("Error updating member role:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
