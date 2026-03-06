"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import TeamPage from "@/features/team/components/TeamPage";
import { TeamDataProvider } from "@/features/team/contexts/TeamDataContext";
import {
  transformInvitations,
  transformMembers,
} from "@/features/team/lib/team";
import { createClient } from "@/shared/lib/supabase/client";

interface PeopleSectionProps {
  orgId: string;
}

export function PeopleSection({ orgId }: PeopleSectionProps) {
  const [teamMembers, setTeamMembers] = useState<
    ReturnType<typeof transformMembers>
  >([]);
  const [teamInvitations, setTeamInvitations] = useState<
    ReturnType<typeof transformInvitations>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      const supabase = createClient();

      const [membersResult, invitationsResult] = await Promise.all([
        supabase
          .from("members")
          .select(
            `id, user_id, organization_id, role, joined_at,
             user:users!user_id (*)`
          )
          .eq("organization_id", orgId),
        supabase
          .from("invitations")
          .select("*, invited_by:users!invited_by_user_id (name)")
          .eq("organization_id", orgId),
      ]);

      // biome-ignore lint/suspicious/noExplicitAny: Supabase join types don't match our transform input shape
      const membersData = (membersResult.data || []) as any;
      setTeamMembers(transformMembers(membersData));
      // biome-ignore lint/suspicious/noExplicitAny: Supabase join types don't match our transform input shape
      const invitationsData = (invitationsResult.data || []) as any;
      setTeamInvitations(transformInvitations(invitationsData));
      setIsLoading(false);
    };

    fetchTeam();
  }, [orgId]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-1.5">
        <h3 className="font-semibold text-sm">People</h3>
        <p className="mt-0.5 text-muted-foreground text-xs">
          Manage members and invitations for your organization.
        </p>
      </div>
      <div className="mb-4 border-border border-b" />
      <TeamDataProvider
        initialInvitations={teamInvitations}
        initialMembers={teamMembers}
      >
        <TeamPage organizationId={orgId} />
      </TeamDataProvider>
    </div>
  );
}
