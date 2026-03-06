"use client";

import { Check, ChevronDown, Mail, Plus, Settings, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useInvitationActions } from "@/features/invitations/hooks/use-invitation-actions";
import { useUserInvitations } from "@/features/invitations/hooks/use-user-invitations";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import { Spinner } from "@/shared/components/ui/spinner";
import { createClient } from "@/shared/lib/supabase/client";

interface Organization {
  id: string;
  name: string;
}

export function TeamSwitcher({
  orgId,
  orgName,
  userEmail,
  onSettingsClick,
}: {
  orgId: string;
  orgName: string;
  userEmail: string;
  onSettingsClick?: () => void;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const { invitations, pendingCount, refetch } = useUserInvitations();
  const { accept, decline, accepting, declining } = useInvitationActions();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showInvitations, setShowInvitations] = useState(false);
  const [memberCount, setMemberCount] = useState<number | null>(null);

  const fetchOrgs = useCallback(async () => {
    const { data } = await supabase
      .from("organizations")
      .select("id, name, members!inner(user_id)")
      .order("name");
    if (data) {
      setOrgs(data.map((o) => ({ id: o.id, name: o.name })));
    }
  }, [supabase]);

  const fetchMemberCount = useCallback(async () => {
    const { count } = await supabase
      .from("members")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", orgId);
    setMemberCount(count ?? null);
  }, [supabase, orgId]);

  useEffect(() => {
    if (open) {
      fetchOrgs();
      fetchMemberCount();
      refetch();
    }
  }, [open, fetchOrgs, fetchMemberCount, refetch]);

  const handleSwitchOrg = (newOrgId: string) => {
    setOpen(false);
    if (newOrgId !== orgId) {
      router.push(`/o/${newOrgId}`);
    }
  };

  const handleAccept = async (invitationId: string, token: string) => {
    setProcessingId(invitationId);
    const result = await accept(invitationId, token);
    setProcessingId(null);

    if (result.success && result.organizationId) {
      toast.success("Invitation accepted!", {
        description: "You've joined the organization.",
      });
      setShowInvitations(false);
      fetchOrgs();
    } else {
      toast.error("Failed to accept invitation", {
        description: result.error || "Please try again",
      });
    }
  };

  const handleDecline = async (invitationId: string) => {
    setProcessingId(invitationId);
    const result = await decline(invitationId);
    setProcessingId(null);

    if (result.success) {
      toast.success("Invitation declined");
    } else {
      toast.error("Failed to decline invitation", {
        description: result.error || "Please try again",
      });
    }
  };

  const handleLogout = async () => {
    setOpen(false);
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const pendingInvitations = invitations.filter(
    (inv) => inv.status === "pending"
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu onOpenChange={setOpen} open={open}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
              <div className="flex aspect-square size-4 shrink-0 items-center justify-center rounded bg-sidebar-primary font-semibold text-[10px] text-sidebar-primary-foreground">
                {orgName.charAt(0).toUpperCase()}
              </div>
              <span className="truncate font-medium">{orgName}</span>
              <ChevronDown className="opacity-50" />
              {pendingCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-64 rounded-lg"
            side="bottom"
            sideOffset={4}
          >
            {/* Current org info */}
            <div className="px-3 py-2.5">
              <p className="font-semibold text-sm">{orgName}</p>
              <p className="mt-0.5 text-muted-foreground text-xs">
                Free Plan
                {memberCount != null &&
                  ` · ${memberCount} member${memberCount !== 1 ? "s" : ""}`}
              </p>
            </div>
            <DropdownMenuItem
              className="gap-2 px-3 py-1.5"
              onClick={() => {
                setOpen(false);
                onSettingsClick?.();
              }}
            >
              <Settings className="size-3.5 text-muted-foreground" />
              <span className="text-xs">Settings</span>
            </DropdownMenuItem>

            {/* Pending invitations */}
            {pendingCount > 0 && (
              <>
                <DropdownMenuSeparator />
                {showInvitations ? (
                  <div className="px-1 py-1">
                    <div className="flex items-center justify-between px-2 py-1">
                      <span className="font-medium text-muted-foreground text-xs">
                        Invitations
                      </span>
                      <button
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => setShowInvitations(false)}
                        type="button"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                    {pendingInvitations.slice(0, 5).map((invitation) => {
                      const isProcessing = processingId === invitation.id;
                      return (
                        <div
                          className="rounded-sm px-2 py-2"
                          key={invitation.id}
                        >
                          <p className="truncate font-medium text-sm">
                            {invitation.organization_name}
                          </p>
                          <p className="mt-0.5 text-muted-foreground text-xs">
                            Invited as{" "}
                            <span className="capitalize">
                              {invitation.role}
                            </span>
                          </p>
                          <div className="mt-2 flex items-center gap-1.5">
                            <Button
                              className="h-7 flex-1 text-xs"
                              disabled={isProcessing || accepting || declining}
                              onClick={() =>
                                handleAccept(invitation.id, invitation.token)
                              }
                              size="sm"
                              variant="default"
                            >
                              {isProcessing && accepting ? (
                                <Spinner className="h-3 w-3" />
                              ) : (
                                "Accept"
                              )}
                            </Button>
                            <Button
                              className="h-7 flex-1 text-xs"
                              disabled={isProcessing || accepting || declining}
                              onClick={() => handleDecline(invitation.id)}
                              size="sm"
                              variant="outline"
                            >
                              {isProcessing && declining ? (
                                <Spinner className="h-3 w-3" />
                              ) : (
                                "Decline"
                              )}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowInvitations(true);
                    }}
                  >
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="flex-1">
                      {pendingCount} pending invitation
                      {pendingCount !== 1 ? "s" : ""}
                    </span>
                  </DropdownMenuItem>
                )}
              </>
            )}

            <DropdownMenuSeparator />

            {/* Account → org list */}
            <div className="px-3 py-1.5">
              <p className="truncate text-muted-foreground text-xs">
                {userEmail}
              </p>
            </div>
            {orgs.map((org) => (
              <DropdownMenuItem
                className="gap-2 px-3 py-1.5"
                key={org.id}
                onClick={() => handleSwitchOrg(org.id)}
              >
                <div className="flex size-5 items-center justify-center rounded-xs border font-semibold text-[10px]">
                  {org.name.charAt(0).toUpperCase()}
                </div>
                <span className="flex-1 truncate text-sm">{org.name}</span>
                {org.id === orgId && (
                  <Check className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem
              className="gap-2 px-3 py-1.5"
              onClick={() => {
                setOpen(false);
                router.push("/o/new");
              }}
            >
              <Plus className="size-3.5 text-muted-foreground" />
              <span className="text-muted-foreground text-xs">
                New organization
              </span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="px-3 py-1.5 text-muted-foreground focus:text-muted-foreground"
              onClick={handleLogout}
            >
              <span className="font-medium text-xs">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
