"use client";

import { Bell, Check, ExternalLink, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Spinner } from "@/shared/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { useInvitationActions } from "../../hooks/use-invitation-actions";
import { useUserInvitations } from "../../hooks/use-user-invitations";
export function NotificationsMenu() {
  const { invitations, pendingCount, refetch } = useUserInvitations();
  const { accept, decline, accepting, declining } = useInvitationActions();
  const [open, setOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const router = useRouter();

  // Refetch when dropdown opens
  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open, refetch]);

  const pendingInvitations = invitations
    .filter((inv) => inv.status === "pending")
    .slice(0, 5); // Show max 5

  const handleAccept = async (invitationId: string, token: string) => {
    setProcessingId(invitationId);
    const result = await accept(invitationId, token);
    setProcessingId(null);

    if (result.success && result.organizationId) {
      toast.success("Invitation accepted!", {
        description: "You've joined the organization.",
        action: {
          label: "Go to organization",
          onClick: () => router.push(`/o/${result.organizationId}`),
        },
      });
      setOpen(false);
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

  return (
    <DropdownMenu onOpenChange={setOpen} open={open}>
      <Tooltip>
        <TooltipTrigger className="relative rounded-full p-2 transition-colors hover:bg-muted">
          <DropdownMenuTrigger asChild>
            <div>
              <Bell className="h-4 w-4 text-muted-foreground" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive font-bold text-destructive-foreground text-xs">
                  {pendingCount > 9 ? "9+" : pendingCount}
                </span>
              )}
            </div>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>Invitations</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-96 p-0">
        <div className="border-b px-4 py-3">
          <h3 className="font-semibold text-sm">Invitations</h3>
          {pendingCount > 0 && (
            <p className="mt-0.5 text-muted-foreground text-xs">
              You have {pendingCount} pending invitation
              {pendingCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {pendingInvitations.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <Bell className="mx-auto mb-3 h-12 w-12 text-muted" />
            <p className="text-muted-foreground text-sm">
              No pending invitations
            </p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {pendingInvitations.map((invitation) => {
              const isProcessing = processingId === invitation.id;

              return (
                <div
                  className="border-b px-4 py-3 transition-colors last:border-b-0 hover:bg-muted/50"
                  key={invitation.id}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground text-sm">
                        {invitation.organization_name}
                      </p>
                      <p className="mt-0.5 text-muted-foreground text-xs">
                        Invited by {invitation.invited_by_name || "someone"} as{" "}
                        <span className="font-medium capitalize">
                          {invitation.role}
                        </span>
                      </p>
                      {invitation.custom_message && (
                        <p className="mt-2 line-clamp-2 text-muted-foreground text-xs italic">
                          "{invitation.custom_message}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      className="flex-1"
                      disabled={isProcessing || accepting || declining}
                      onClick={() =>
                        handleAccept(invitation.id, invitation.token)
                      }
                      size="sm"
                    >
                      {isProcessing && accepting ? (
                        <>
                          <Spinner className="mr-2 h-3 w-3 animate-spin" />
                          Accepting...
                        </>
                      ) : (
                        <>
                          <Check className="mr-1 h-3 w-3" />
                          Accept
                        </>
                      )}
                    </Button>
                    <Button
                      className="flex-1"
                      disabled={isProcessing || accepting || declining}
                      onClick={() => handleDecline(invitation.id)}
                      size="sm"
                      variant="outline"
                    >
                      {isProcessing && declining ? (
                        <>
                          <Spinner className="mr-2 h-3 w-3 animate-spin" />
                          Declining...
                        </>
                      ) : (
                        <>
                          <X className="mr-1 h-3 w-3" />
                          Decline
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {pendingCount > 5 && (
          <div className="border-t bg-muted px-4 py-3">
            <Link
              className="flex items-center justify-center gap-1 font-medium text-primary text-xs hover:text-primary/90"
              href="/o/invitations"
              onClick={() => setOpen(false)}
            >
              View all {pendingCount} invitations
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        )}

        {pendingInvitations.length > 0 && pendingCount <= 5 && (
          <div className="border-t bg-muted px-4 py-3">
            <Link
              className="flex items-center justify-center gap-1 font-medium text-primary text-xs hover:text-primary/90"
              href="/o/invitations"
              onClick={() => setOpen(false)}
            >
              View all invitations
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
