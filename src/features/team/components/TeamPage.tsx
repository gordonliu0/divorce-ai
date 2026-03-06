"use client";

import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { useTeamData } from "../contexts/TeamDataContext";
import { useTeamMutations } from "../hooks/useTeamMutations";
import { useTeamPermissions } from "../hooks/useTeamPermissions";
import type { PendingInvitation, TeamMember } from "../types/types";
import { InvitationRow } from "./InvitationRow";
import { InviteModal } from "./InviteModal";
import { TeamMemberRow } from "./TeamMemberRow";

interface TeamInvitationsProps {
  organizationId: string;
}

export default function TeamPage({ organizationId }: TeamInvitationsProps) {
  const { state, selectors } = useTeamData();
  const {
    resendInvitation,
    cancelInvitation,
    updateMemberRole,
    removeMember,
    transferOwnership,
  } = useTeamMutations(organizationId);
  const {
    canInvite,
    canChangeRole,
    canRemoveMember,
    canTransferOwnership,
    currentUserId,
    loading: permissionsLoading,
  } = useTeamPermissions(organizationId);

  const [organizationName] = useState("Organization");
  const [activeTab, setActiveTab] = useState<"members" | "pending" | "expired">(
    "members"
  );
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [sortField, setSortField] = useState<string>("sent_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const filteredInvitations = useMemo(() => {
    let filtered: PendingInvitation[];

    if (activeTab === "pending") {
      filtered = selectors.getPendingInvitations();
    } else if (activeTab === "expired") {
      filtered = [
        ...selectors.getExpiredInvitations(),
        ...selectors.getCancelledInvitations(),
      ];
    } else {
      filtered = state.invitations;
    }

    return filtered.sort((a, b) => {
      const aVal = a[sortField as keyof PendingInvitation];
      const bVal = b[sortField as keyof PendingInvitation];
      const modifier = sortOrder === "asc" ? 1 : -1;
      if (!(aVal && bVal)) {
        return 0;
      }
      return aVal > bVal ? modifier : -modifier;
    });
  }, [state.invitations, activeTab, sortField, sortOrder, selectors]);

  const handleResend = async (id: string) => {
    const result = await resendInvitation(id);
    if (!result.success) {
      console.error("Failed to resend invitation:", result.error);
    }
  };

  const handleCancel = async (id: string) => {
    const result = await cancelInvitation(id);
    if (!result.success) {
      console.error("Failed to cancel invitation:", result.error);
    }
  };

  const handleCopyLink = (token: string) => {
    const link = `${window.location.origin}/invite/${token}`;
    navigator.clipboard.writeText(link);
  };

  const handleChangeRole = async (
    userId: string,
    newRole: "admin" | "member"
  ) => {
    const result = await updateMemberRole(userId, newRole);
    if (result.success) {
      toast.success(`Role updated to ${newRole}`);
    } else {
      toast.error(result.error || "Failed to update role");
    }
  };

  const handleRemoveMember = async (userId: string) => {
    const result = await removeMember(userId);
    if (result.success) {
      toast.success("Member removed successfully");
    } else {
      toast.error(result.error || "Failed to remove member");
    }
  };

  const handleTransferOwnership = async (newOwnerId: string) => {
    const result = await transferOwnership(newOwnerId);
    if (result.success) {
      toast.success("Ownership transferred successfully");
    } else {
      toast.error(result.error || "Failed to transfer ownership");
    }
  };

  const isLastOwner = (member: TeamMember) => {
    const ownerCount = state.members.filter((m) => m.role === "owner").length;
    return member.role === "owner" && ownerCount === 1;
  };

  const renderSortButton = (field: string, children: React.ReactNode) => (
    <button
      className="flex items-center gap-1 text-[11px] text-muted-foreground uppercase tracking-wider hover:text-foreground"
      onClick={() => handleSort(field)}
      type="button"
    >
      {children}
      {sortField === field &&
        (sortOrder === "asc" ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        ))}
    </button>
  );

  const pendingCount = selectors.getPendingInvitations().length;
  const expiredCount =
    selectors.getExpiredInvitations().length +
    selectors.getCancelledInvitations().length;

  const tabs = [
    { key: "members" as const, label: "Members", count: state.members.length },
    { key: "pending" as const, label: "Pending", count: pendingCount },
    { key: "expired" as const, label: "Expired", count: expiredCount },
  ];

  return (
    <div className="flex h-full w-full flex-col">
      {/* Tabs + Invite button */}
      <div className="flex items-center justify-between border-b">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              className={`-mb-px border-b-2 px-3 py-2 font-medium text-xs transition-colors ${
                activeTab === tab.key
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              type="button"
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-1.5 text-muted-foreground">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
        <Button
          className="h-7 text-xs"
          disabled={!canInvite || permissionsLoading}
          onClick={() => setInviteModalOpen(true)}
          size="sm"
          variant="outline"
        >
          <Plus className="mr-1 h-3 w-3" />
          Add members
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "members" ? (
          <table className="w-full">
            <thead className="sticky top-0 bg-background">
              <tr className="border-b">
                <th className="px-3 py-2 text-left font-medium text-[11px] text-muted-foreground uppercase tracking-wider">
                  User
                </th>
                <th className="px-3 py-2 text-left font-medium text-[11px] text-muted-foreground uppercase tracking-wider">
                  Role
                </th>
                <th className="px-3 py-2 text-left font-medium text-[11px] text-muted-foreground uppercase tracking-wider">
                  Joined
                </th>
                <th className="w-12 px-3 py-2 text-right font-medium text-[11px] text-muted-foreground uppercase tracking-wider" />
              </tr>
            </thead>
            <tbody>
              {state.members.map((member) => (
                <TeamMemberRow
                  allMembers={state.members}
                  canChangeRole={canChangeRole(member)}
                  canRemove={canRemoveMember(member, isLastOwner(member))}
                  canTransferOwnership={canTransferOwnership()}
                  currentUserId={currentUserId || ""}
                  isLoading={permissionsLoading}
                  key={member.id}
                  member={member}
                  onChangeRole={handleChangeRole}
                  onRemove={handleRemoveMember}
                  onTransferOwnership={handleTransferOwnership}
                  organizationName={organizationName}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full">
            <thead className="sticky top-0 bg-background">
              <tr className="border-b">
                <th className="px-3 py-2 text-left">
                  {renderSortButton("email", "Email")}
                </th>
                <th className="px-3 py-2 text-left">
                  {renderSortButton("role", "Role")}
                </th>
                <th className="px-3 py-2 text-left">
                  {renderSortButton("invited_by_name", "Invited by")}
                </th>
                <th className="px-3 py-2 text-left">
                  {renderSortButton("sent_at", "Sent")}
                </th>
                <th className="px-3 py-2 text-left">
                  {renderSortButton("expires_at", "Expires")}
                </th>
                <th className="px-3 py-2 text-left font-medium text-[11px] text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="w-12 px-3 py-2 text-right" />
              </tr>
            </thead>
            <tbody>
              {filteredInvitations.length === 0 ? (
                <tr>
                  <td
                    className="px-3 py-8 text-center text-muted-foreground text-xs"
                    colSpan={7}
                  >
                    {activeTab === "pending"
                      ? "No pending invitations"
                      : "No expired or cancelled invitations"}
                  </td>
                </tr>
              ) : (
                filteredInvitations.map((invitation) => (
                  <InvitationRow
                    invitation={invitation}
                    key={invitation.id}
                    onCancel={handleCancel}
                    onCopyLink={handleCopyLink}
                    onResend={handleResend}
                    orgId={organizationId}
                  />
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <InviteModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        organizationId={organizationId}
      />
    </div>
  );
}
