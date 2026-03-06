import { Check, Copy, Mail, RefreshCw, X } from "lucide-react";
import { useState } from "react";
import { useTeamPermissions } from "../hooks/useTeamPermissions";
import { formatDate, formatExpiry, formatRole } from "../lib/utils";
import type { PendingInvitation } from "../types/types";

export function InvitationRow({
  invitation,
  orgId,
  onResend,
  onCancel,
  onCopyLink,
}: {
  invitation: PendingInvitation;
  orgId: string;
  onResend: (id: string) => void;
  onCancel: (id: string) => void;
  onCopyLink: (token: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const { canManageInvitations } = useTeamPermissions(orgId);

  const handleCopyLink = () => {
    onCopyLink(invitation.token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isExpired = invitation.status === "expired";
  const isCancelled = invitation.status === "cancelled";
  const isPending = invitation.status === "pending";
  const canResend = canManageInvitations && (isPending || isExpired);
  const canCancel = canManageInvitations && isPending;
  const canCopy = !(isCancelled || isExpired);

  const statusText = () => {
    switch (invitation.status) {
      case "pending":
        return (
          <span className="text-yellow-600 dark:text-yellow-400">Pending</span>
        );
      case "expired":
        return <span className="text-red-600 dark:text-red-400">Expired</span>;
      case "cancelled":
        return <span className="text-muted-foreground">Cancelled</span>;
      default:
        return null;
    }
  };

  const getExpiryDisplay = () => {
    if (isCancelled) {
      return <span className="text-muted-foreground">—</span>;
    }

    return (
      <div className="flex items-center gap-1.5">
        <span className={isExpired ? "text-red-600 dark:text-red-400" : ""}>
          {formatExpiry(invitation.expires_at)}
        </span>
        {invitation.resend_count > 0 && (
          <span className="text-muted-foreground">
            ({invitation.resend_count}x)
          </span>
        )}
      </div>
    );
  };

  return (
    <tr
      className={`group border-b hover:bg-muted/50 ${
        isCancelled ? "opacity-50" : ""
      }`}
    >
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Mail
            className={`h-3.5 w-3.5 shrink-0 ${isCancelled ? "text-muted-foreground" : "text-muted-foreground"}`}
          />
          <span
            className={`text-sm ${
              isCancelled ? "text-muted-foreground line-through" : ""
            }`}
          >
            {invitation.email}
          </span>
        </div>
      </td>
      <td className="px-3 py-2.5 text-muted-foreground text-xs">
        {formatRole(invitation.role)}
      </td>
      <td className="px-3 py-2.5 text-muted-foreground text-xs">
        {invitation.invited_by_name}
      </td>
      <td className="px-3 py-2.5 text-muted-foreground text-xs">
        {formatDate(invitation.sent_at)}
      </td>
      <td className="px-3 py-2.5 text-muted-foreground text-xs">
        {getExpiryDisplay()}
      </td>
      <td className="px-3 py-2.5 text-xs">{statusText()}</td>
      <td className="px-3 py-2.5 text-right">
        <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {canCopy && (
            <button
              className="rounded p-1 transition-colors hover:bg-muted"
              onClick={handleCopyLink}
              title="Copy invitation link"
              type="button"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-600" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </button>
          )}

          {canResend && (
            <button
              className="rounded p-1 transition-colors hover:bg-muted"
              disabled={invitation.resend_count >= 10}
              onClick={() => onResend(invitation.id)}
              title={
                isExpired ? "Resend expired invitation" : "Resend invitation"
              }
              type="button"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${
                  invitation.resend_count >= 10
                    ? "text-muted-foreground"
                    : "text-blue-600 dark:text-blue-400"
                }`}
              />
            </button>
          )}

          {canCancel && (
            <button
              className="rounded p-1 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
              onClick={() => onCancel(invitation.id)}
              title="Cancel invitation"
              type="button"
            >
              <X className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
            </button>
          )}

          {!canManageInvitations && (
            <span className="text-[10px] text-muted-foreground italic">
              View only
            </span>
          )}
        </div>
      </td>
    </tr>
  );
}
