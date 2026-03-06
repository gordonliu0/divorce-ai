"use client";

import type { User } from "@supabase/supabase-js";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/shared/lib/supabase/client";

export function MarketingNav() {
  const [userData, setUserData] = useState<User | null>(null);
  const pathname = usePathname();
  const firstPath = pathname.split("/")[1];
  const isDashboard = firstPath === "o";
  const isAuth = firstPath === "auth";
  const noHeader = ["privacy", "tos", "cookies", "contact"];

  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setUserData(data.user);
    }
    fetchUser();
  }, []);

  if (isDashboard || isAuth || noHeader.includes(firstPath)) {
    return null;
  }

  return (
    <nav className="fixed top-0 z-50 flex h-16 w-full items-center justify-center bg-[hsl(0_0%_96.5%)]">
      <div className="flex w-full max-w-7xl items-center justify-between px-8">
        <Link href="/" className="font-serif text-lg font-semibold tracking-tight">
          DivorceAI
        </Link>

        <div className="flex items-center gap-6">
          <Link
            className="text-sm text-[hsl(0_0%_45%)] transition-colors hover:text-[hsl(0_0%_12%)]"
            href={userData ? "/o" : "/auth/login"}
          >
            {userData ? "Platform" : "Sign In"}
          </Link>
          <Link
            href="/auth/signup"
            className="group inline-flex items-center gap-1.5 rounded-full bg-[hsl(0_0%_12%)] px-4 py-2 text-sm font-medium text-[hsl(0_0%_96.5%)] transition-colors hover:bg-[hsl(0_0%_20%)]"
          >
            Get Started
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
