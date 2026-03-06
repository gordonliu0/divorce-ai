"use client";

import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { createClient } from "@/shared/lib/supabase/client";

type OrgRole = "owner" | "admin" | "member";

const TEAM_SIZE_OPTIONS = [
  { value: "solo", label: "Just me" },
  { value: "2_to_5", label: "2–5" },
  { value: "6_plus", label: "6+" },
];

interface GeneralSectionProps {
  orgId: string;
  userRole: OrgRole | null;
}

export function GeneralSection({ orgId, userRole }: GeneralSectionProps) {
  const [orgName, setOrgName] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [originalTeamSize, setOriginalTeamSize] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const canEdit = userRole === "owner" || userRole === "admin";
  const hasChanges = orgName !== originalName || teamSize !== originalTeamSize;

  useEffect(() => {
    const fetchOrg = async () => {
      const supabase = createClient();
      const { data: org } = await supabase
        .from("organizations")
        .select("id, name, team_size")
        .eq("id", orgId)
        .single();

      if (org) {
        setOrgName(org.name);
        setOriginalName(org.name);
        setTeamSize(org.team_size || "");
        setOriginalTeamSize(org.team_size || "");
      }
      setIsLoading(false);
    };

    fetchOrg();
  }, [orgId]);

  const saveOrgName = useCallback(
    async (name: string) => {
      const response = await fetch(`/api/o/${orgId}/renameOrg`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update organization");
      }
    },
    [orgId]
  );

  const saveTeamSize = useCallback(
    async (size: string) => {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("organizations")
        .update({ team_size: size || null })
        .eq("id", orgId);
      if (updateError) {
        throw updateError;
      }
    },
    [orgId]
  );

  const handleSave = useCallback(async () => {
    setError(null);

    if (!orgName.trim()) {
      setError("Organization name is required");
      return;
    }

    if (orgName.length > 100) {
      setError("Organization name must be 100 characters or less");
      return;
    }

    setIsSaving(true);

    try {
      if (orgName !== originalName) {
        await saveOrgName(orgName.trim());
      }
      if (teamSize !== originalTeamSize) {
        await saveTeamSize(teamSize);
      }

      setOriginalName(orgName.trim());
      setOriginalTeamSize(teamSize);
      toast.success("Organization updated");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
      toast.error("Failed to update organization");
    } finally {
      setIsSaving(false);
    }
  }, [
    orgName,
    originalName,
    teamSize,
    originalTeamSize,
    saveOrgName,
    saveTeamSize,
  ]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-1 font-semibold text-sm">Organization Settings</h3>
      <div className="mb-4 border-border border-b" />
      <div className="max-w-md space-y-4">
        <div className="space-y-2">
          <Label
            className="text-muted-foreground text-xs"
            htmlFor="settings-org-name"
          >
            Name
          </Label>
          <Input
            disabled={!canEdit || isSaving}
            id="settings-org-name"
            onChange={(e) => setOrgName(e.target.value)}
            placeholder="Enter organization name"
            value={orgName}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs">Team size</Label>
          <Select
            disabled={!canEdit || isSaving}
            onValueChange={setTeamSize}
            value={teamSize}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select team size" />
            </SelectTrigger>
            <SelectContent>
              {TEAM_SIZE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {error && <p className="text-destructive text-xs">{error}</p>}
        {!canEdit && (
          <p className="text-muted-foreground text-xs">
            Contact an admin to update organization settings
          </p>
        )}

        {canEdit && (
          <Button
            disabled={!hasChanges || isSaving}
            onClick={handleSave}
            size="sm"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </div>
    </div>
  );
}
