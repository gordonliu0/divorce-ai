"use client";

import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { createClient } from "@/shared/lib/supabase/client";

interface AccountDropdownProps {
  userEmail: string;
  userName?: string;
}

export function AccountDropdown({ userEmail, userName }: AccountDropdownProps) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  if (!mounted) {
    return null;
  }

  const displayName = userName || userEmail.split("@")[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full p-0 hover:bg-neutral-800/20 dark:hover:bg-neutral-100/20"
          variant="ghost"
        >
          <User className="text-muted-foreground" size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="font-medium text-sm leading-none">{displayName}</p>
            <p className="text-muted-foreground text-xs leading-none">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center gap-2 text-red-600 focus:text-red-600"
          onClick={logout}
        >
          <LogOut size={16} />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
