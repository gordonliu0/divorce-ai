// components/onboarding/steps/InviteTeamStep.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { useOnboarding } from "../../contexts/OnboardingContext";
import { useOnboardingFlow } from "../../hooks/useOnboardingFlow";
import { useOnboardingMutations } from "../../hooks/useOnboardingMutations";

const EMAIL_SPLIT_REGEX = /[,;\n]+/;
const EMAIL_VALIDATION_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function InviteTeamStep() {
  const { state } = useOnboarding();
  const { nextStep, previousStep } = useOnboardingFlow();
  const { sendOnboardingInvitations, isSendingInvites } =
    useOnboardingMutations();

  const [emailsText, setEmailsText] = useState("");
  const [customMessage, setCustomMessage] = useState(
    state.invitationData.customMessage || ""
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync with context if user navigates back
  useEffect(() => {
    if (state.invitationData.emails.length > 0) {
      setEmailsText(state.invitationData.emails.join("\n"));
    }
    if (state.invitationData.customMessage) {
      setCustomMessage(state.invitationData.customMessage);
    }
  }, [state.invitationData]);

  const parseEmails = (text: string): string[] => {
    if (!text.trim()) {
      return [];
    }

    // Split by comma, newline, or semicolon
    const emails = text
      .split(EMAIL_SPLIT_REGEX)
      .map((email) => email.trim().toLowerCase())
      .filter((email) => email.length > 0);

    return [...new Set(emails)]; // Remove duplicates
  };

  const validateEmail = (email: string): boolean => {
    return EMAIL_VALIDATION_REGEX.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const emails = parseEmails(emailsText);

    // Validate all emails
    if (emails.length > 0) {
      const invalidEmails = emails.filter((email) => !validateEmail(email));
      if (invalidEmails.length > 0) {
        setValidationError(`Invalid email format: ${invalidEmails.join(", ")}`);
        return;
      }

      // Check limit
      if (emails.length > 50) {
        setValidationError("Maximum 50 invitations at once");
        return;
      }
    }

    const result = await sendOnboardingInvitations({
      emails,
      customMessage: customMessage.trim() || undefined,
    });

    if (result.success) {
      nextStep();
    }
  };

  const handleSkip = async () => {
    // Skip sends empty invitation list (which just updates progress)
    const result = await sendOnboardingInvitations({
      emails: [],
      customMessage: undefined,
    });

    if (result.success) {
      nextStep();
    }
  };

  const emailCount = parseEmails(emailsText).length;

  return (
    <Card className="bg-muted/10 p-8 md:p-12">
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="mb-2 scroll-m-20 font-bold text-3xl tracking-tight">
            Invite your team
          </h2>
          <p className="text-muted-foreground">
            Collaborate on your asset library together. You can always invite
            more people later.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email Addresses */}
          <div className="space-y-2">
            <Label htmlFor="emails">
              Email addresses{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="emails"
              onChange={(e) => {
                setEmailsText(e.target.value);
                setValidationError(null);
              }}
              placeholder="colleague@company.com, teammate@company.com"
              rows={4}
              value={emailsText}
            />
            <p className="text-muted-foreground text-sm">
              Enter email addresses separated by commas or new lines
            </p>
            {emailCount > 0 && (
              <p className="text-primary text-sm">
                {emailCount} {emailCount === 1 ? "invitation" : "invitations"}{" "}
                ready to send
              </p>
            )}
          </div>

          {/* Custom Message */}
          <div className="space-y-2">
            <Label htmlFor="customMessage">
              Custom message{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="customMessage"
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Hey team, I've set up SpeedyGhost for our video assets..."
              rows={3}
              value={customMessage}
            />
            <p className="text-muted-foreground text-sm">
              Optional welcome message included in invitation emails
            </p>
          </div>

          {/* Validation Error */}
          {validationError && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
              <p className="text-destructive text-sm">{validationError}</p>
            </div>
          )}

          {/* Footer Note */}
          <p className="text-center text-muted-foreground text-sm">
            Team members will receive an email invitation to join your
            organization
          </p>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <Button
              disabled={isSendingInvites}
              onClick={previousStep}
              variant="ghost"
            >
              ← Back
            </Button>

            <div className="flex items-center gap-3">
              <Button
                disabled={isSendingInvites}
                onClick={handleSkip}
                variant="ghost"
              >
                Skip, I'll invite later
              </Button>

              <Button
                disabled={isSendingInvites || emailCount === 0}
                type="submit"
              >
                {isSendingInvites ? "Sending..." : "Send Invites →"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Card>
  );
}
