"use client";

import { Crown, MoreVertical, UserCog, UserX } from "lucide-react";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import type { TeamMember } from "../types/types";
import { ChangeRoleDialog } from "./ChangeRoleDialog";
import { RemoveMemberDialog } from "./RemoveMemberDialog";
import { TransferOwnershipDialog } from "./TransferOwnershipDialog";

interface MemberActionsMenuProps {
  allMembers: TeamMember[];
  canChangeRole: boolean;
  canRemove: boolean;
  canTransferOwnership: boolean;
  currentUserId: string;
  isLoading?: boolean;
  member: TeamMember;
  onChangeRole: (userId: string, newRole: "admin" | "member") => Promise<void>;
  onRemove: (userId: string) => Promise<void>;
  onTransferOwnership: (newOwnerId: string) => Promise<void>;
  organizationName: string;
}

export function MemberActionsMenu({
  member,
  allMembers,
  currentUserId,
  organizationName,
  canChangeRole,
  canRemove,
  canTransferOwnership,
  onChangeRole,
  onRemove,
  onTransferOwnership,
  isLoading = false,
}: MemberActionsMenuProps) {
  const [changeRoleDialogOpen, setChangeRoleDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [transferOwnershipDialogOpen, setTransferOwnershipDialogOpen] =
    useState(false);

  // Don't show menu if no actions are available
  if (!(canChangeRole || canRemove || canTransferOwnership)) {
    return null;
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            className="h-7 w-7 p-0"
            disabled={isLoading}
            size="sm"
            variant="ghost"
          >
            <MoreVertical className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {canChangeRole && (
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                setChangeRoleDialogOpen(true);
              }}
            >
              <UserCog className="mr-2 h-4 w-4" />
              Change Role
            </DropdownMenuItem>
          )}

          {canTransferOwnership && member.role !== "owner" && (
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                setTransferOwnershipDialogOpen(true);
              }}
            >
              <Crown className="mr-2 h-4 w-4" />
              Transfer Ownership
            </DropdownMenuItem>
          )}

          {(canChangeRole || canTransferOwnership) && canRemove && (
            <DropdownMenuSeparator />
          )}

          {canRemove && (
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={(e) => {
                e.preventDefault();
                setRemoveDialogOpen(true);
              }}
            >
              <UserX className="mr-2 h-4 w-4" />
              Remove from Organization
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ChangeRoleDialog
        isLoading={isLoading}
        isOpen={changeRoleDialogOpen}
        member={member}
        onClose={() => setChangeRoleDialogOpen(false)}
        onConfirm={(newRole) => onChangeRole(member.user_id, newRole)}
      />

      <RemoveMemberDialog
        isLoading={isLoading}
        isOpen={removeDialogOpen}
        member={member}
        onClose={() => setRemoveDialogOpen(false)}
        onConfirm={() => onRemove(member.user_id)}
        organizationName={organizationName}
      />

      <TransferOwnershipDialog
        currentUserId={currentUserId}
        isLoading={isLoading}
        isOpen={transferOwnershipDialogOpen}
        members={allMembers}
        onClose={() => setTransferOwnershipDialogOpen(false)}
        onConfirm={onTransferOwnership}
        organizationName={organizationName}
      />
    </>
  );
}
