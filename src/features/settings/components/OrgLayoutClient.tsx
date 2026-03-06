"use client";

import type React from "react";
import { useState } from "react";
import { AppSidebar } from "@/features/sidebar/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";
import { SettingsDialog } from "./settings-dialog";

interface OrgLayoutClientProps {
  children: React.ReactNode;
  orgId: string;
  orgName: string;
  token: string;
  userEmail: string;
  userId: string;
}

export function OrgLayoutClient({
  orgId,
  orgName,
  token,
  userId,
  userEmail,
  children,
}: OrgLayoutClientProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <SidebarProvider>
      <AppSidebar
        onSettingsClick={() => setSettingsOpen(true)}
        orgId={orgId}
        orgName={orgName}
        userEmail={userEmail}
      />
      <SidebarInset>{children}</SidebarInset>
      <SettingsDialog
        onOpenChange={setSettingsOpen}
        open={settingsOpen}
        orgId={orgId}
      />
    </SidebarProvider>
  );
}
