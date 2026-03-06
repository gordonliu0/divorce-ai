import router from "next/router";

// Shared acceptance function
export async function handleAcceptInvitation(
  invitationId: string,
  token: string
) {
  const response = await fetch("/api/invitations/accept", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ invitationId, token }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  // Redirect to organization dashboard
  const { organizationId } = await response.json();
  router.push(`/org/${organizationId}/`);
}
