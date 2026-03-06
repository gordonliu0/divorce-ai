"use client";

import { AlertCircle } from "lucide-react";
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
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { TeamMember } from "../types/types";

interface TransferOwnershipDialogProps {
  currentUserId: string;
  isLoading?: boolean;
  isOpen: boolean;
  members: TeamMember[];
  onClose: () => void;
  onConfirm: (newOwnerId: string) => Promise<void>;
  organizationName: string;
}

export function TransferOwnershipDialog({
  isOpen,
  onClose,
  members,
  currentUserId,
  organizationName,
  onConfirm,
  isLoading = false,
}: TransferOwnershipDialogProps) {
  const [step, setStep] = useState<"select" | "confirm">("select");
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [confirmationText, setConfirmationText] = useState("");

  // Filter out current user (owner) from the list
  const eligibleMembers = members.filter((m) => m.user_id !== currentUserId);

  const selectedMember = members.find((m) => m.user_id === selectedMemberId);
  const isConfirmationValid =
    confirmationText.toLowerCase() === organizationName.toLowerCase();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset state when closing
      setStep("select");
      setSelectedMemberId("");
      setConfirmationText("");
      onClose();
    }
  };

  const handleNext = () => {
    if (selectedMemberId) {
      setStep("confirm");
    }
  };

  const handleBack = () => {
    setStep("select");
    setConfirmationText("");
  };

  const handleConfirm = async () => {
    if (selectedMemberId && isConfirmationValid) {
      await onConfirm(selectedMemberId);
      handleOpenChange(false);
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange} open={isOpen}>
      <DialogContent className="sm:max-w-[500px]">
        {step === "select" ? (
          <>
            <DialogHeader>
              <DialogTitle>Transfer Ownership</DialogTitle>
              <DialogDescription>
                Select a team member to become the new owner of this
                organization.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label
                  className="font-medium text-sm"
                  htmlFor="new-owner-select"
                >
                  New Owner
                </label>
                <Select
                  disabled={isLoading}
                  onValueChange={setSelectedMemberId}
                  value={selectedMemberId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a member" />
                  </SelectTrigger>
                  <SelectContent>
                    {eligibleMembers.map((member) => (
                      <SelectItem key={member.user_id} value={member.user_id}>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{member.name}</span>
                          <span className="text-muted-foreground text-xs">
                            ({member.role})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <div className="text-amber-900 text-sm">
                  <p className="mb-1 font-medium">Important:</p>
                  <ul className="list-inside list-disc space-y-1">
                    <li>You will become an admin</li>
                    <li>The new owner will have full control</li>
                    <li>This action cannot be undone</li>
                  </ul>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button disabled={isLoading} onClick={onClose} variant="outline">
                Cancel
              </Button>
              <Button
                disabled={!selectedMemberId || isLoading}
                onClick={handleNext}
              >
                Next
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Transfer</DialogTitle>
              <DialogDescription>
                This is a permanent action. Please confirm by typing the
                organization name below.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2 rounded-lg bg-muted p-4">
                <div className="text-sm">
                  <span className="text-muted-foreground">New Owner:</span>{" "}
                  <span className="font-medium">{selectedMember?.name}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">
                    New Owner Email:
                  </span>{" "}
                  <span className="font-medium">{selectedMember?.email}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Your New Role:</span>{" "}
                  <span className="font-medium">Admin</span>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  className="font-medium text-sm"
                  htmlFor="confirm-transfer-input"
                >
                  Type <span className="font-bold">{organizationName}</span> to
                  confirm
                </label>
                <Input
                  autoComplete="off"
                  disabled={isLoading}
                  id="confirm-transfer-input"
                  onChange={(e) => setConfirmationText(e.target.value)}
                  placeholder={organizationName}
                  value={confirmationText}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                disabled={isLoading}
                onClick={handleBack}
                variant="outline"
              >
                Back
              </Button>
              <Button
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={!isConfirmationValid || isLoading}
                onClick={handleConfirm}
              >
                {isLoading ? "Transferring..." : "Transfer Ownership"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
