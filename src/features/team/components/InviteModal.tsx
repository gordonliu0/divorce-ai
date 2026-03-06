import { AlertCircle, CheckCircle2, RefreshCw, Send } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { useTeamMutations } from "../hooks/useTeamMutations";
import type { ValidationError } from "../types/types";

const EMAIL_SPLIT_REGEX = /[\n,]+/;

export function InviteModal({
  isOpen,
  onClose,
  organizationId,
}: {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
}) {
  const [emails, setEmails] = useState("");
  const [role, setRole] = useState<"admin" | "member">("member");
  const [customMessage, setCustomMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [successCount, setSuccessCount] = useState(0);

  const { sendInvitations, sendingInvitations, sendError } =
    useTeamMutations(organizationId);

  const handleSubmit = async () => {
    setValidationErrors([]);
    setSuccessCount(0);

    // Parse emails
    const emailList = emails
      .split(EMAIL_SPLIT_REGEX)
      .map((e) => e.trim())
      .filter((e) => e);

    if (emailList.length === 0) {
      setValidationErrors([
        { email: "", error: "Please enter at least one email address" },
      ]);
      return;
    }

    const result = await sendInvitations(
      emailList,
      role,
      customMessage || undefined
    );

    if (result.errors.length > 0) {
      setValidationErrors(result.errors);
    }

    if (result.sent > 0) {
      setSuccessCount(result.sent);

      // If all invitations were successful, close modal after delay
      if (result.errors.length === 0) {
        setTimeout(() => {
          onClose();
          setEmails("");
          setCustomMessage("");
          setSuccessCount(0);
          setValidationErrors([]);
        }, 2000);
      }
    }
  };

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="max-h-[90vh] max-w-2xl">
        <DialogHeader>
          <DialogTitle>Invite Team Members</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {successCount > 0 && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Successfully sent {successCount} invitation
                {successCount > 1 ? "s" : ""}!
              </AlertDescription>
            </Alert>
          )}

          {(validationErrors.length > 0 || sendError) && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {sendError ? (
                  <div>{sendError}</div>
                ) : (
                  <>
                    <div className="mb-1 font-medium">
                      Some invitations could not be sent:
                    </div>
                    <ul className="space-y-1 text-sm">
                      {validationErrors.map((err) => (
                        <li key={err.email || err.error}>
                          {err.email ? `${err.email}: ${err.error}` : err.error}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="emails">Email Addresses</Label>
            <Textarea
              className="h-32"
              id="emails"
              onChange={(e) => setEmails(e.target.value)}
              placeholder="Enter email addresses (comma or newline separated)&#10;john@example.com, jane@example.com"
              value={emails}
            />
            <p className="text-muted-foreground text-xs">
              Maximum 50 invitations per batch
            </p>
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              onValueChange={(value) => setRole(value as "admin" | "member")}
              value={role}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Custom Message (Optional)</Label>
            <Textarea
              className="h-24"
              id="message"
              maxLength={500}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Add a personal note to the invitation email..."
              value={customMessage}
            />
            <p className="text-muted-foreground text-xs">
              {customMessage.length}/500 characters
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            disabled={sendingInvitations}
            onClick={onClose}
            variant="outline"
          >
            Cancel
          </Button>
          <Button disabled={sendingInvitations} onClick={handleSubmit}>
            {sendingInvitations ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Invitations
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
