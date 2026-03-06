import { redirect } from "next/navigation";
import { OrgLayoutClient } from "@/features/settings/components/OrgLayoutClient";
import { createClient } from "@/shared/lib/supabase/server";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ orgId: string }>;
}

export default async function Layout({ children, params }: LayoutProps) {
  const { orgId } = await params;
  const supabase = await createClient();

  const [{ data: authData, error: authError }, { data: sessionData }] =
    await Promise.all([supabase.auth.getClaims(), supabase.auth.getSession()]);

  if (authError || !authData?.claims) {
    redirect("/auth/login");
  }

  const token = sessionData?.session?.access_token ?? "";

  // Fetch org name and user email in parallel
  const [{ data: org }, { data: userData }] = await Promise.all([
    supabase.from("organizations").select("name").eq("id", orgId).single(),
    supabase.auth.getUser(),
  ]);

  const userId = userData?.user?.id ?? "";
  const userEmail = userData?.user?.email ?? "";

  return (
    <OrgLayoutClient
      orgId={orgId}
      orgName={org?.name ?? "Organization"}
      token={token}
      userEmail={userEmail}
      userId={userId}
    >
      {children}
    </OrgLayoutClient>
  );
}
