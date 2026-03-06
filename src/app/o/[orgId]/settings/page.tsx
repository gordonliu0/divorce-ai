// app/o/[orgId]/settings/general/page.tsx

import { redirect } from "next/navigation";
import { GeneralSettingsClient } from "@/features/settings/components/sections/GeneralSettingsClient";
import { createClient } from "@/shared/lib/supabase/server";

export default async function GeneralSettingsPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const supabase = await createClient();
  const { orgId } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user's role in this org
  const { data: roleData } = await supabase.rpc("user_org_role", {
    org_id: orgId,
  });

  if (!roleData) {
    redirect("/organizations");
  }

  // Get organization data
  const { data: org } = await supabase
    .from("organizations")
    .select("id, name")
    .eq("id", orgId)
    .single();

  if (!org) {
    redirect("/organizations");
  }

  return (
    <GeneralSettingsClient
      organization={org}
      role={roleData as "owner" | "admin" | "member"}
    />
  );
}
