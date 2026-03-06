"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import type { TeamMember } from "../types/types";

interface ChangeRoleDialogProps {
  isLoading?: boolean;
  isOpen: boolean;
  member: TeamMember | null;
  onClose: () => void;
  onConfirm: (newRole: "admin" | "member") => Promise<void>;
}

export function ChangeRoleDialog({
  isOpen,
  onClose,
  member,
  onConfirm,
  isLoading = false,
}: ChangeRoleDialogProps) {
  const [selectedRole, setSelectedRole] = useState<"admin" | "member">(
    "member"
  );

  if (!member) {
    return null;
  }

  const handleConfirm = async () => {
    await onConfirm(selectedRole);
    onClose();
  };

  // Set initial role when dialog opens
  const handleOpenChange = (open: boolean) => {
    if (open && member) {
      setSelectedRole(
        member.role === "owner" ? "admin" : (member.role as "admin" | "member")
      );
    }
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change {member.name}&apos;s Role</DialogTitle>
          <DialogDescription>
            Select the new role for this team member.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-muted">
              <input
                checked={selectedRole === "admin"}
                className="h-4 w-4"
                disabled={isLoading}
                name="role"
                onChange={(e) => setSelectedRole(e.target.value as "admin")}
                type="radio"
                value="admin"
              />
              <div>
                <div className="font-medium">Admin</div>
                <div className="text-muted-foreground text-sm">
                  Can manage team members and invitations
                </div>
              </div>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-muted">
              <input
                checked={selectedRole === "member"}
                className="h-4 w-4"
                disabled={isLoading}
                name="role"
                onChange={(e) => setSelectedRole(e.target.value as "member")}
                type="radio"
                value="member"
              />
              <div>
                <div className="font-medium">Member</div>
                <div className="text-muted-foreground text-sm">
                  Can view and access organization resources
                </div>
              </div>
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button disabled={isLoading} onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={handleConfirm}>
            {isLoading ? "Updating..." : "Update Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
