"use client";

import { CreditCard, Settings, Users } from "lucide-react";
import { type ElementType, useEffect, useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/shared/components/ui/sidebar";
import { createClient } from "@/shared/lib/supabase/client";
import { BillingSection } from "./sections/BillingSection";
import { GeneralSection } from "./sections/GeneralSection";
import { PeopleSection } from "./sections/PeopleSection";

type OrgRole = "owner" | "admin" | "member";

type SettingsSection = "general" | "people" | "billing";

interface NavItem {
  allowedRoles: OrgRole[];
  group: "organization";
  icon: ElementType;
  key: SettingsSection;
  name: string;
}

const navItems: NavItem[] = [
  {
    name: "General",
    key: "general",
    icon: Settings,
    group: "organization",
    allowedRoles: ["owner", "admin", "member"],
  },
  {
    name: "People",
    key: "people",
    icon: Users,
    group: "organization",
    allowedRoles: ["owner", "admin", "member"],
  },
  {
    name: "Billing",
    key: "billing",
    icon: CreditCard,
    group: "organization",
    allowedRoles: ["owner"],
  },
];

interface SettingsDialogProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  orgId: string;
}

export function SettingsDialog({
  open,
  onOpenChange,
  orgId,
}: SettingsDialogProps) {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("general");
  const [userRole, setUserRole] = useState<OrgRole | null>(null);
  const [accessToken, setAccessToken] = useState<string>("");

  useEffect(() => {
    if (!open) {
      return;
    }

    const fetchRole = async () => {
      const supabase = createClient();
      const { data } = await supabase.rpc("user_org_role", {
        org_id: orgId,
      });
      if (data) {
        setUserRole(data as OrgRole);
      }
      const { data: sessionData } = await supabase.auth.getSession();
      setAccessToken(sessionData.session?.access_token ?? "");
    };

    fetchRole();
  }, [open, orgId]);

  const visibleItems = useMemo(() => {
    if (!userRole) {
      return [];
    }
    return navItems.filter((item) => item.allowedRoles.includes(userRole));
  }, [userRole]);

  useEffect(() => {
    if (open) {
      setActiveSection("general");
    }
  }, [open]);

  useEffect(() => {
    if (!visibleItems.find((item) => item.key === activeSection)) {
      setActiveSection(visibleItems[0]?.key ?? "general");
    }
  }, [visibleItems, activeSection]);

  const renderActiveSection = () => {
    switch (activeSection) {
      case "general":
        return <GeneralSection orgId={orgId} userRole={userRole} />;
      case "people":
        return <PeopleSection orgId={orgId} />;
      case "billing":
        return (
          <BillingSection
            orgId={orgId}
            token={accessToken}
            userRole={userRole}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="overflow-hidden p-0 md:max-h-[600px] md:max-w-[900px] lg:max-w-[1000px]">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Customize your settings here.
        </DialogDescription>
        <SidebarProvider className="items-start">
          <Sidebar className="hidden md:flex" collapsible="none">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Organization</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {visibleItems.map((item) => (
                      <SidebarMenuItem key={item.key}>
                        <SidebarMenuButton
                          isActive={item.key === activeSection}
                          onClick={() => setActiveSection(item.key)}
                        >
                          <item.icon />
                          <span>{item.name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex h-[580px] flex-1 flex-col overflow-hidden">
            <div className="flex flex-1 flex-col overflow-y-auto px-8 py-8">
              {renderActiveSection()}
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  );
}
