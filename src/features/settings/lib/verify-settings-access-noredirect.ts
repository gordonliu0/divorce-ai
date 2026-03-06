// lib/organizations/verify-settings-access.ts
import { getUserOrgRole } from "./get-user-org-role";

export async function verifySettingsAccessNoRedirect(
  orgId: string,
  allowedRoles: string[]
): Promise<boolean> {
  const userRole = await getUserOrgRole(orgId);

  if (!userRole) {
    return false;
  }

  if (!allowedRoles.includes(userRole)) {
    return false;
  }

  return true;
}
