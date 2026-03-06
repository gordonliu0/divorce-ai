"use client";

import { Button } from "@/shared/components/ui/button";

type OrgRole = "owner" | "admin" | "member";

interface BillingSectionProps {
  orgId: string;
  token: string;
  userRole: OrgRole | null;
}

export function BillingSection({ userRole }: BillingSectionProps) {
  const isOwner = userRole === "owner";

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-1 font-semibold text-sm">Current Plan</h3>
        <div className="mb-4 border-border border-b" />
        <div className="rounded-lg border border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Free Plan</p>
              <p className="mt-1 text-muted-foreground text-xs">
                Basic features for small teams
              </p>
            </div>
            {isOwner && (
              <Button disabled size="sm">
                Upgrade Plan
              </Button>
            )}
          </div>
        </div>
      </div>

      {!isOwner && (
        <p className="text-muted-foreground text-xs">
          Only organization owners can manage billing and upgrade plans. Please
          contact your organization owner for any billing-related changes.
        </p>
      )}
    </div>
  );
}
