import { getBaseUrl } from "@/shared/lib/url";

interface InvitationEmailExistingProps {
  customMessage?: string;
  invitationUrl: string;
  inviterName: string;
  organizationName: string;
}

export function InvitationEmailExisting({
  invitationUrl,
  inviterName,
  organizationName,
  customMessage,
}: InvitationEmailExistingProps) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        lineHeight: "1.6",
        color: "#333",
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        <h2>You've been invited to join {organizationName}</h2>

        <p>Hi there,</p>

        <p>
          <strong>{inviterName}</strong> has invited you to join{" "}
          <strong>{organizationName}</strong> on SpeedyGhost.
        </p>

        {customMessage && (
          <div
            style={{
              backgroundColor: "#f3f4f6",
              padding: "16px",
              borderRadius: "6px",
              margin: "16px 0",
              fontStyle: "italic",
            }}
          >
            "{customMessage}"
          </div>
        )}

        <p>You can accept this invitation from your SpeedyGhost dashboard:</p>

        <a
          href={invitationUrl}
          style={{
            display: "inline-block",
            padding: "12px 24px",
            backgroundColor: "#2563eb",
            color: "white",
            textDecoration: "none",
            borderRadius: "6px",
            margin: "20px 0",
          }}
        >
          Accept Invitation
        </a>

        <p style={{ color: "#6b7280", fontSize: "14px" }}>
          This invitation expires in 7 days.
        </p>

        <hr
          style={{
            margin: "32px 0",
            border: "none",
            borderTop: "1px solid #e5e7eb",
          }}
        />

        <p style={{ fontSize: "14px", color: "#6b7280" }}>
          Already have pending invitations?{" "}
          <a href={`${getBaseUrl()}/dashboard`}>View all invitations</a>
        </p>
      </div>
    </div>
  );
}
