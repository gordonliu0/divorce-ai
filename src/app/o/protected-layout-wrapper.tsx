"use client";

import { InvitationsProvider } from "@/features/invitations/context/invitations-context";

export function ProtectedLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <InvitationsProvider>{children}</InvitationsProvider>;
}
