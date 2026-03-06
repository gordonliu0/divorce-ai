// app/api/o/[orgId]/transfer-ownership/route.ts

import { type NextRequest, NextResponse } from "next/server";
import type { Database } from "@/database.types";
import { createClient } from "@/shared/lib/supabase/server";

interface TransferOwnershipRequest {
  newOwnerId: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  const supabase = await createClient();
  const { orgId } = await params;

  try {
    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body: TransferOwnershipRequest = await request.json();
    const { newOwnerId } = body;

    // Cannot transfer to self
    if (user.id === newOwnerId) {
      return NextResponse.json(
        { error: "Cannot transfer ownership to yourself" },
        { status: 400 }
      );
    }

    // Check current user is the owner
    const { data: currentUserMembership, error: currentUserError } =
      await supabase
        .from("organization_members")
        .select("id, role")
        .eq("organization_id", orgId)
        .eq("user_id", user.id)
        .single();

    if (currentUserError || !currentUserMembership) {
      return NextResponse.json(
        { error: "Not a member of this organization" },
        { status: 403 }
      );
    }

    if (currentUserMembership.role !== "owner") {
      return NextResponse.json(
        { error: "Only the current owner can transfer ownership" },
        { status: 403 }
      );
    }

    // Check new owner exists and is a member
    const { data: newOwnerMembership, error: newOwnerError } = await supabase
      .from("organization_members")
      .select("id, role, user:users!user_id(*)")
      .eq("organization_id", orgId)
      .eq("user_id", newOwnerId)
      .single();

    if (newOwnerError || !newOwnerMembership) {
      return NextResponse.json(
        { error: "New owner must be a current member of the organization" },
        { status: 404 }
      );
    }

    // New owner must be admin or member (not already owner)
    if (newOwnerMembership.role === "owner") {
      return NextResponse.json(
        { error: "Target member is already an owner" },
        { status: 400 }
      );
    }

    // Perform the transfer: update both members

    // Update new owner to owner
    const { error: promoteError } = await supabase
      .from("organization_members")
      .update({ role: "owner", updated_at: new Date().toISOString() })
      .eq("id", newOwnerMembership.id);

    if (promoteError) {
      throw promoteError;
    }

    // Update current owner to admin
    const { error: demoteError } = await supabase
      .from("organization_members")
      .update({ role: "admin", updated_at: new Date().toISOString() })
      .eq("id", currentUserMembership.id);

    if (demoteError) {
      // Rollback: restore original owner
      await supabase
        .from("organization_members")
        .update({ role: "admin", updated_at: new Date().toISOString() })
        .eq("id", newOwnerMembership.id);
      throw demoteError;
    }

    // Get fresh data for both members
    const { data: formerOwner } = await supabase
      .from("organization_members")
      .select(
        `
        id,
        user_id,
        organization_id,
        role,
        joined_at,
        created_at,
        updated_at,
        user:users!user_id (
          *
        )
      `
      )
      .eq("id", currentUserMembership.id)
      .single();

    const { data: newOwner } = await supabase
      .from("organization_members")
      .select(
        `
        id,
        user_id,
        organization_id,
        role,
        joined_at,
        created_at,
        updated_at,
        user:users!user_id (
          *
        )
      `
      )
      .eq("id", newOwnerMembership.id)
      .single();

    // Transform to frontend format
    const transformMember = (
      member: Database["public"]["Tables"]["organization_members"]["Row"] & {
        user: Database["public"]["Tables"]["users"]["Row"];
      }
    ) => ({
      id: member.id,
      user_id: member.user_id,
      email: member.user.email,
      name: member.user.name || member.user.email,
      role: member.role as "owner" | "admin" | "member",
      avatar_url: member.user.avatar_url || undefined,
      joined_at: member.joined_at || new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      newOwner: newOwner ? transformMember(newOwner) : null,
      formerOwner: formerOwner ? transformMember(formerOwner) : null,
    });
  } catch (error) {
    console.error("Error transferring ownership:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
