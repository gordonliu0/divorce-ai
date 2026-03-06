import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { Button } from "../../../shared/components/ui/button";
import { AccountDropdown } from "./account-dropdown";

export function AccountButton({ user }: { user: User }) {
  return user ? (
    <AccountDropdown
      userEmail={user.email ?? ""}
      userName={user?.user_metadata?.name || user?.user_metadata?.full_name}
    />
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
