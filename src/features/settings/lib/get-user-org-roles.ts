// lib/organizations/get-user-org-role.ts
import { createClient } from "@/shared/lib/supabase/server";

export async function getUserOrgRole(
  orgId: string
): Promise<"member" | "owner" | "admin" | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("user_org_role", {
    org_id: orgId,
  });

  if (error) {
    console.error("Error fetching user org role:", error);
    return null;
  }

  return data as "member" | "owner" | "admin" | null;
}
