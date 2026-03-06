import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { verifySettingsAccessNoRedirect } from "@/features/settings/lib/verify-settings-access-noredirect";

export default async function Billing({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  const isOwner = await verifySettingsAccessNoRedirect(orgId, ["owner"]);

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-0.5">
        <h2 className="font-bold text-2xl tracking-tight">Billing</h2>
        <p className="text-muted-foreground">
          {isOwner
            ? "Manage your subscription and billing details"
            : "View your current subscription plan"}
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="p-6">
          <h3 className="mb-4 font-medium text-lg">Current Plan</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Free Plan</p>
              <p className="text-muted-foreground text-sm">
                Basic features for small teams
              </p>
            </div>
            {isOwner && <Button>Upgrade Plan</Button>}
          </div>
        </Card>

        {!isOwner && (
          <Card className="p-6">
            <div className="text-muted-foreground text-sm">
              Only organization owners can manage billing and upgrade plans.
              Please contact your organization owner for any billing-related
              changes.
            </div>
          </Card>
        )}

        {isOwner && (
          <>
            <Card className="p-6">
              <h3 className="mb-4 font-medium text-lg">Payment Method</h3>
              <Button variant="outline">Add Payment Method</Button>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 font-medium text-lg">Billing History</h3>
              <div className="text-muted-foreground text-sm">
                No billing history available
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
