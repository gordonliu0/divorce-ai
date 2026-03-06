// app/api/o/[orgId]/members/[userId]/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";

export async function DELETE(
  _request: NextRequest,
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

    // Cannot remove self
    if (user.id === userId) {
      return NextResponse.json(
        { error: "Cannot remove yourself from the organization" },
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

    // Check permissions: only owner and admin can remove members
    if (!["owner", "admin"].includes(currentUserMembership.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions to remove members" },
        { status: 403 }
      );
    }

    // Get target member
    const { data: targetMember, error: targetError } = await supabase
      .from("organization_members")
      .select("id, role")
      .eq("organization_id", orgId)
      .eq("user_id", userId)
      .single();

    if (targetError || !targetMember) {
      return NextResponse.json(
        { error: "Target member not found" },
        { status: 404 }
      );
    }

    // Admin can only remove members (not other admins or owners)
    if (
      currentUserMembership.role === "admin" &&
      targetMember.role !== "member"
    ) {
      return NextResponse.json(
        {
          error: "Admins can only remove members, not other admins or owners",
        },
        { status: 403 }
      );
    }

    // If removing an owner, check if they're the last owner
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
          { error: "Cannot remove the last owner" },
          { status: 400 }
        );
      }
    }

    // Delete the member (CASCADE will handle related records)
    const { error: deleteError } = await supabase
      .from("organization_members")
      .delete()
      .eq("id", targetMember.id);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({
      success: true,
      removedUserId: userId,
    });
  } catch (error) {
    console.error("Error removing member:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
