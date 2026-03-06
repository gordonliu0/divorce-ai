import type { User } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/shared/lib/supabase/client";

export interface UserInvitation {
  accepted_at: string | null;
  custom_message?: string;
  email: string;
  expires_at: string;
  id: string;
  invited_by_name: string | null;
  organization_id: string;
  organization_name: string;
  role: "admin" | "member";
  sent_at: string;
  status: "pending" | "accepted" | "declined" | "expired" | "cancelled";
  token: string;
}

interface UseUserInvitationsReturn {
  error: string | null;
  invitations: UserInvitation[];
  loading: boolean;
  pendingCount: number;
  refetch: () => Promise<void>;
}

export function useUserInvitations(): UseUserInvitationsReturn {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [invitations, setInvitations] = useState<UserInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvitations = useCallback(async () => {
    const { data: user } = await supabase.auth.getUser();
    setUser(user.user);
    const email = user?.user?.email;

    if (!email) {
      setInvitations([]);
      setLoading(false);
      return;
    }

    try {
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("organization_invitations")
        .select("*")
        .eq("email", email)
        .order("sent_at", { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setInvitations((data as UserInvitation[]) || []);
    } catch (err) {
      console.error("Error fetching invitations:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch invitations"
      );
    } finally {
      setLoading(false);
    }
  }, [supabase]); // Dependency: supabase client

  // Initial fetch
  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  // Real-time subscription
  useEffect(() => {
    if (!user?.email) {
      return;
    }

    const channel = supabase
      .channel("user-invitations")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "organization_invitations",
          filter: `email=eq.${user.email.toLowerCase()}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            // New invitation received
            fetchInvitations();
          } else if (payload.eventType === "UPDATE") {
            // Invitation status changed
            setInvitations((prev) =>
              prev.map((inv) =>
                inv.id === payload.new.id ? { ...inv, ...payload.new } : inv
              )
            );
          } else if (payload.eventType === "DELETE") {
            // Invitation deleted
            setInvitations((prev) =>
              prev.filter((inv) => inv.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.email, fetchInvitations, supabase]);

  // Calculate pending count
  const pendingCount = invitations.filter(
    (inv) => inv.status === "pending"
  ).length;

  return {
    invitations,
    pendingCount,
    loading,
    error,
    refetch: fetchInvitations,
  };
}
