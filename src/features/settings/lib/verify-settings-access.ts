// lib/organizations/verify-settings-access.ts
import { redirect } from "next/navigation";
import { getUserOrgRole } from "./get-user-org-role";

export async function verifySettingsAccess(
  orgId: string,
  allowedRoles: string[]
) {
  const userRole = await getUserOrgRole(orgId);

  if (!userRole) {
    redirect(`/o/${orgId}`);
  }

  if (!allowedRoles.includes(userRole)) {
    redirect(`/o/${orgId}/settings`);
  }

  return userRole; // Return for potential use in page
}
