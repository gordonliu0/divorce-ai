// lib/email/invitations.ts
import { Resend } from "resend";
import { InvitationEmailExisting } from "@/features/invitations/emails/invitation-email-existing";
import { InvitationEmailNew } from "@/features/invitations/emails/invitation-email-new";
import { getBaseUrl } from "@/shared/lib/url";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

interface SendInvitationEmailParams {
  customMessage?: string;
  inviterName: string;
  isExistingUser: boolean;
  organizationName: string;
  to: string;
  token: string;
}

export async function sendInvitationEmail({
  to,
  token,
  inviterName,
  organizationName,
  customMessage,
  isExistingUser,
}: SendInvitationEmailParams) {
  const invitationUrl = `${getBaseUrl()}/invite/${token}`;

  const subject = isExistingUser
    ? `You've been invited to join ${organizationName} on SpeedyGhost`
    : `${inviterName} invited you to join SpeedyGhost`;

  const EmailComponent = isExistingUser
    ? InvitationEmailExisting
    : InvitationEmailNew;

  try {
    const { data, error } = await getResend().emails.send({
      from: "SpeedyGhost <hello@updates.speedyghost.ai>", // Change after domain verification
      to,
      subject,
      react: EmailComponent({
        invitationUrl,
        inviterName,
        organizationName,
        customMessage,
      }),
    });

    if (error) {
      console.error("Resend API error:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log("Email sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Failed to send invitation email:", error);
    throw error;
  }
}
