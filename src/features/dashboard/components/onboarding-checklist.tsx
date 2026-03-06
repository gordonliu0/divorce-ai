"use client";

import { Check, Circle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/shared/lib/supabase/client";
import { cn } from "@/shared/lib/utils";

interface ChecklistStep {
  action: () => void;
  completed: boolean;
  key: string;
  label: string;
}

interface OnboardingChecklistProps {
  orgId: string;
}

export function OnboardingChecklist({ orgId }: OnboardingChecklistProps) {
  const router = useRouter();
  const supabase = createClient();
  const [hasSources, setHasSources] = useState<boolean | null>(null);
  const [hasAssets, setHasAssets] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    setLoading(true);

    // Check for connected sources (drive folders or devices)
    const [
      { count: driveCount },
      { count: deviceCount },
      { count: assetCount },
    ] = await Promise.all([
      supabase
        .from("drive_folders")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", orgId),
      supabase
        .from("device_activations")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", orgId),
      supabase
        .from("assets")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", orgId),
    ]);

    setHasSources((driveCount ?? 0) + (deviceCount ?? 0) > 0);
    setHasAssets((assetCount ?? 0) > 0);
    setLoading(false);
  }, [supabase, orgId]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Don't render while loading or if all steps are complete
  if (loading || hasSources === null || hasAssets === null) {
    return null;
  }

  const allComplete = hasSources && hasAssets;
  if (allComplete) {
    return null;
  }

  const steps: ChecklistStep[] = [
    {
      key: "create_org",
      label: "Create organization",
      completed: true, // They're viewing the org, so it's created
      action: () => {
        /* no-op: org creation step is always complete */
      },
    },
    {
      key: "connect_source",
      label: "Connect a source",
      completed: hasSources,
      action: () => router.push(`/o/${orgId}/assets`),
    },
    {
      key: "import_video",
      label: "Import your first video",
      completed: hasAssets,
      action: () => router.push(`/o/${orgId}/assets`),
    },
    {
      key: "try_search",
      label: "Try a search",
      completed: false, // We could track this but keep it simple for now
      action: () => router.push(`/o/${orgId}`),
    },
  ];

  return (
    <div className="px-3 py-2">
      <p className="mb-2 font-medium text-muted-foreground text-xs">
        Get started
      </p>
      <div className="space-y-1">
        {steps.map((step) => (
          <button
            className={cn(
              "flex w-full items-start gap-2 rounded-sm py-1 text-left text-sm transition-colors",
              step.completed
                ? "text-muted-foreground"
                : "cursor-pointer text-foreground hover:text-foreground/80"
            )}
            disabled={step.completed}
            key={step.key}
            onClick={step.action}
            type="button"
          >
            {step.completed ? (
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
            ) : (
              <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            )}
            <span className={cn(step.completed && "line-through")}>
              {step.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
