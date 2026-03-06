"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import type { TeamMember } from "../types/types";

interface RemoveMemberDialogProps {
  isLoading?: boolean;
  isOpen: boolean;
  member: TeamMember | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  organizationName: string;
}

export function RemoveMemberDialog({
  isOpen,
  onClose,
  member,
  organizationName,
  onConfirm,
  isLoading = false,
}: RemoveMemberDialogProps) {
  if (!member) {
    return null;
  }

  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <AlertDialog onOpenChange={onClose} open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Remove {member.name} from {organizationName}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            They will immediately lose access to this organization. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isLoading}
            onClick={handleConfirm}
          >
            {isLoading ? "Removing..." : "Remove Member"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
