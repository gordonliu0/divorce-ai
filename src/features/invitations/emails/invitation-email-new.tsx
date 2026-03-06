import { getBaseUrl } from "@/shared/lib/url";

interface InvitationEmailNewProps {
  customMessage?: string;
  invitationUrl: string;
  inviterName: string;
  organizationName: string;
}

export function InvitationEmailNew({
  invitationUrl,
  inviterName,
  organizationName,
  customMessage,
}: InvitationEmailNewProps) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        lineHeight: "1.6",
        color: "#333",
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        <h2>{inviterName} invited you to join SpeedyGhost</h2>

        <p>Hi there,</p>

        <p>
          <strong>{inviterName}</strong> has invited you to join{" "}
          <strong>{organizationName}</strong> on SpeedyGhost - your team's
          intelligent workspace for video content.
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

        <div
          style={{
            backgroundColor: "#f9fafb",
            padding: "16px",
            borderRadius: "6px",
            margin: "20px 0",
          }}
        >
          <p>
            <strong>SpeedyGhost helps creative teams:</strong>
          </p>
          <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
            <li>Connect their Drive folders automatically</li>
            <li>Search video assets semantically</li>
            <li>Reuse content with confidence</li>
          </ul>
        </div>

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
          Join {organizationName}
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
          Questions? Reply to this email or visit our{" "}
          <a href={`${getBaseUrl()}/help`}>help center</a>.
        </p>
      </div>
    </div>
  );
}
