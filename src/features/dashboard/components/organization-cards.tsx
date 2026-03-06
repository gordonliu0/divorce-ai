import { Box, WalletCards } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

interface OrganizationCardData {
  assetCount?: number;
  description?: string;
  id: string;
  name: string;
  plan?: string;
}

interface OrganizationCardsProps {
  organizations: OrganizationCardData[];
  showAssets?: boolean;
  showDescription?: boolean;
  showPlan?: boolean;
}

export function OrganizationCards({
  organizations,
  showDescription = true,
  showAssets = true,
  showPlan = true,
}: OrganizationCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {organizations.map((org) => (
        <Link href={`/o/${org.id}`} key={org.id}>
          <Card className="cursor-pointer bg-muted/30 p-4 transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
              <CardTitle className="font-medium text-base">
                {org.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-1">
              <div className="space-y-2">
                {showDescription && (
                  <p className="text-muted-foreground text-xs">
                    {org.description || "No description provided"}
                  </p>
                )}

                <div className="space-y-1 text-xs">
                  {showAssets && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Box className="h-3.5 w-3.5" />
                        {org.assetCount || 0} Assets
                      </span>
                      <span className="font-medium" />
                    </div>
                  )}

                  {showPlan && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <WalletCards className="h-3.5 w-3.5" />
                        {org.plan || "Free"} Plan
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium capitalize" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
