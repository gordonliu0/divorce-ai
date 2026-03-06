import { redirect } from "next/navigation";
import { createClient } from "@/shared/lib/supabase/server";
import { ProtectedLayoutWrapper } from "./protected-layout-wrapper";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    redirect("/auth/login");
  }

  return <ProtectedLayoutWrapper>{children}</ProtectedLayoutWrapper>;
}
