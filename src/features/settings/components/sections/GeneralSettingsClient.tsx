// app/o/[orgId]/settings/general/general-settings-client.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

interface GeneralSettingsClientProps {
  organization: {
    id: string;
    name: string;
  };
  role: "owner" | "admin" | "member";
}

export function GeneralSettingsClient({
  organization,
  role,
}: GeneralSettingsClientProps) {
  const [name, setName] = useState(organization.name);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const canEdit = role === "owner" || role === "admin";
  const hasChanges = name !== organization.name;

  const handleSave = async () => {
    setError(null);

    // Validate
    if (!name.trim()) {
      setError("Organization name is required");
      return;
    }

    if (name.length > 100) {
      setError("Organization name must be 100 characters or less");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/o/${organization.id}/renameOrg`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update organization");
      }

      toast.success("Organization updated", {
        description: "Your changes have been saved.",
      });

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
      toast.error("Failed to update organization");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="font-semibold text-2xl text-foreground">
          General Settings
        </h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Manage your organization profile
        </p>
      </div>

      <div className="max-w-xl space-y-4">
        <div className="space-y-2">
          <Label htmlFor="org-name">Organization Name</Label>
          <Input
            disabled={!canEdit || isSaving}
            id="org-name"
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter organization name"
            value={name}
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
          {!canEdit && (
            <p className="text-muted-foreground text-sm">
              Contact an admin to update organization settings
            </p>
          )}
        </div>

        {canEdit && (
          <Button disabled={!hasChanges || isSaving} onClick={handleSave}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </div>
    </div>
  );
}
