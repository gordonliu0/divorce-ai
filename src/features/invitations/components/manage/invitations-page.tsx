"use client";

import { Check, Inbox, LoaderCircle, Mail, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { useInvitationActions } from "../../hooks/use-invitation-actions";
import type { UserInvitation } from "../../hooks/use-user-invitations";
import { useUserInvitations } from "../../hooks/use-user-invitations";
import { formatDate } from "../../lib/utils";

function InvitationRecipientRow({
  invitation,
  onAccept,
  onDecline,
  processing,
}: {
  invitation: UserInvitation;
  onAccept: () => void;
  onDecline: () => void;
  processing: boolean;
}) {
  const isPending = invitation.status === "pending";

  const getRoleBadge = (role: string) => {
    return (
      <Badge variant="secondary">
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = () => {
    switch (invitation.status) {
      case "pending":
        return (
          <Badge
            className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
            variant="secondary"
          >
            Pending
          </Badge>
        );
      case "accepted":
        return (
          <Badge
            className="bg-green-100 text-green-700 hover:bg-green-100"
            variant="secondary"
          >
            <Check className="mr-1 h-3 w-3" />
            Accepted
          </Badge>
        );
      case "declined":
        return (
          <Badge
            className="bg-gray-100 text-gray-700 hover:bg-gray-100"
            variant="secondary"
          >
            <X className="mr-1 h-3 w-3" />
            Declined
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            className="bg-gray-100 text-gray-700 hover:bg-gray-100"
            variant="secondary"
          >
            <X className="mr-1 h-3 w-3" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{invitation.status}</Badge>;
    }
  };

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
            <Mail className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium">{invitation.organization_name}</p>
            <p className="text-muted-foreground text-xs">
              {invitation.invited_by_name || "Unknown"}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell>{getRoleBadge(invitation.role)}</TableCell>
      <TableCell className="text-muted-foreground">
        {formatDate(invitation.sent_at)}
      </TableCell>
      <TableCell>{getStatusBadge()}</TableCell>
      <TableCell>
        {isPending && (
          <div className="flex items-center gap-2">
            <Button disabled={processing} onClick={onAccept} size="sm">
              {processing ? (
                <>
                  <LoaderCircle className="mr-2 h-3 w-3 animate-spin" />
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
              disabled={processing}
              onClick={onDecline}
              size="sm"
              variant="outline"
            >
              <X className="mr-1 h-3 w-3" />
              Decline
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16">
      <div className="mb-4 rounded-full bg-muted p-4">
        <Inbox className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="mb-2 font-semibold text-lg">No invitations</h3>
      <p className="max-w-sm text-center text-muted-foreground text-sm">
        You don't have any organization invitations.
      </p>
    </div>
  );
}

export default function InvitationsPage() {
  const { invitations, loading } = useUserInvitations();
  const { accept, decline, accepting, declining } = useInvitationActions();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const router = useRouter();

  const pendingInvitations = invitations.filter(
    (inv) => inv.status === "pending"
  );
  const otherInvitations = invitations.filter(
    (inv) => inv.status !== "pending"
  );

  const handleAccept = async (invitation: UserInvitation) => {
    setProcessingId(invitation.id);
    const result = await accept(invitation.id, invitation.token);
    setProcessingId(null);

    if (result.success && result.organizationId) {
      toast.success("Invitation accepted!", {
        description: `You've joined ${invitation.organization_name}`,
        action: {
          label: "Go to organization",
          onClick: () => router.push(`/o/${result.organizationId}`),
        },
      });
    } else {
      toast.error("Failed to accept invitation", {
        description: result.error || "Please try again",
      });
    }
  };

  const handleDecline = async (invitation: UserInvitation) => {
    setProcessingId(invitation.id);
    const result = await decline(invitation.id);
    setProcessingId(null);

    if (result.success) {
      toast.success("Invitation declined");
    } else {
      toast.error("Failed to decline invitation", {
        description: result.error || "Please try again",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (invitations.length === 0) {
    return (
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="font-bold text-3xl">Invitations</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your organization invitations
          </p>
        </div>
        <div className="rounded-lg border bg-card">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col justify-start p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="font-medium text-lg">Your Invitations</div>
        </div>

        <div className="w-full rounded-lg border bg-card">
          <div className="relative w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Invited</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingInvitations.length > 0 && (
                  <>
                    <TableRow>
                      <TableCell
                        className="bg-muted/50 px-4 py-2 font-medium"
                        colSpan={5}
                      >
                        Pending Invitations
                      </TableCell>
                    </TableRow>
                    {pendingInvitations.map((invitation) => (
                      <InvitationRecipientRow
                        invitation={invitation}
                        key={invitation.id}
                        onAccept={() => handleAccept(invitation)}
                        onDecline={() => handleDecline(invitation)}
                        processing={
                          processingId === invitation.id &&
                          (accepting || declining)
                        }
                      />
                    ))}
                  </>
                )}
                {otherInvitations.length > 0 && (
                  <>
                    <TableRow>
                      <TableCell
                        className="bg-muted/50 px-4 py-2 font-medium"
                        colSpan={5}
                      >
                        Past Invitations
                      </TableCell>
                    </TableRow>
                    {otherInvitations.map((invitation) => (
                      <InvitationRecipientRow
                        invitation={invitation}
                        key={invitation.id}
                        onAccept={() => {
                          /* past invitations are read-only */
                        }}
                        onDecline={() => {
                          /* past invitations are read-only */
                        }}
                        processing={false}
                      />
                    ))}
                  </>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
