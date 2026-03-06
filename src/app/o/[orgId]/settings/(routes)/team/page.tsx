// app/[orgSlug]/settings/team/page.tsx

import { createClient } from "@/shared/lib/supabase/server";
import TeamPage from "../../../../../../features/team/components/TeamPage";
import { TeamDataProvider } from "../../../../../../features/team/contexts/TeamDataContext";
import {
  transformInvitations,
  transformMembers,
} from "../../../../../../features/team/lib/team";

const page = async ({ params }: { params: Promise<{ orgId: string }> }) => {
  const supabase = await createClient();
  const { orgId } = await params;

  const { data: membersRaw } = await supabase
    .from("organization_members")
    .select(
      `
      id,
      user_id,
      organization_id,
      role,
      joined_at,
      user:users!user_id (
        *
      )
    `
    )
    .eq("organization_id", orgId);

  const { data: invitationsRaw } = await supabase
    .from("organization_invitations")
    .select(
      `
      *,
      invited_by:users!invited_by_user_id (
        name
      )
    `
    )
    .eq("organization_id", orgId);

  const members = transformMembers(membersRaw || []);
  const invitations = transformInvitations(invitationsRaw || []);

  return (
    <TeamDataProvider initialInvitations={invitations} initialMembers={members}>
      <TeamPage organizationId={orgId} />
    </TeamDataProvider>
  );
};

export default page;
