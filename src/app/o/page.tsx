import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { OrganizationCards } from "@/features/dashboard/components/organization-cards";
import { Button } from "@/shared/components/ui/button";
import { createClient } from "@/shared/lib/supabase/server";

export default async function OrganizationDashboard() {
  const supabase = await createClient();

  const { data: organizations, error: orgError } = await supabase
    .from("organizations")
    .select("id, name");

  if (orgError) {
    console.error("Error fetching organizations:", orgError);
  }

  const userOrganizations = organizations || [];

  const organizationsWithMetrics = userOrganizations.map((org) => ({
    id: org.id,
    name: org.name,
    assetCount: 0,
  }));

  return (
    <div className="flex h-full w-full flex-col justify-start p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="font-medium text-lg">Your Organizations</div>
          <div className="text-muted-foreground text-sm">
            {userOrganizations.length} organization
            {userOrganizations.length !== 1 ? "s" : ""}
          </div>
        </div>
        <div className="flex items-end justify-start">
          <Link href="/o/new">
            <Button variant="outline">
              <PlusIcon />
              Create Organization
            </Button>
          </Link>
        </div>

        <OrganizationCards
          organizations={organizationsWithMetrics}
          showAssets={false}
          showDescription={false}
          showPlan={false}
        />
      </div>
    </div>
  );
}
