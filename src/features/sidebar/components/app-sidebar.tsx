"use client";

import { CircleHelp, Home, Send } from "lucide-react";
import type * as React from "react";
import { NavMain } from "@/features/sidebar/components/nav-main";
import { NavSecondary } from "@/features/sidebar/components/nav-secondary";
import { TeamSwitcher } from "@/features/sidebar/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/shared/components/ui/sidebar";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onSettingsClick?: () => void;
  orgId: string;
  orgName: string;
  userEmail: string;
}

export function AppSidebar({
  orgId,
  orgName,
  userEmail,
  onSettingsClick,
  ...props
}: AppSidebarProps) {
  const orgBase = `/o/${orgId}`;

  const navMain = [
    {
      title: "Dashboard",
      url: orgBase,
      icon: Home,
      exact: true,
    },
  ];

  const navSecondary = [
    {
      title: "Help",
      url: "https://docs.ghost.com",
      icon: CircleHelp,
    },
    {
      title: "Feedback",
      url: "mailto:feedback@ghost.com",
      icon: Send,
    },
  ];

  return (
    <Sidebar className="border-r-0" collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher
          onSettingsClick={onSettingsClick}
          orgId={orgId}
          orgName={orgName}
          userEmail={userEmail}
        />
        <NavMain items={navMain} />
      </SidebarHeader>
      <SidebarContent />
      <SidebarFooter>
        <NavSecondary className="p-0" items={navSecondary} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
