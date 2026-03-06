// components/onboarding/steps/AccountSetupStep.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useOnboarding } from "../../contexts/OnboardingContext";
import { useOnboardingFlow } from "../../hooks/useOnboardingFlow";
import { useOnboardingMutations } from "../../hooks/useOnboardingMutations";

const ROLE_OPTIONS = [
  { value: "solo_creator", label: "Solo creator" },
  { value: "freelance_editor", label: "Freelance editor" },
  { value: "agency_member", label: "Agency member" },
  { value: "course_creator", label: "Course creator" },
  { value: "other", label: "Other" },
];

const EDITING_TOOL_OPTIONS = [
  { value: "premiere", label: "Premiere Pro" },
  { value: "davinci", label: "DaVinci Resolve" },
  { value: "final_cut", label: "Final Cut Pro" },
  { value: "capcut", label: "CapCut" },
  { value: "other", label: "Other" },
];

const PUBLISHING_CADENCE_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "project_based", label: "Project-based" },
];

const FOOTAGE_OWNERSHIP_OPTIONS = [
  { value: "own", label: "My own" },
  { value: "client_team", label: "Client/team footage" },
  { value: "mix", label: "Mix of both" },
];

export function AccountSetupStep() {
  const { state } = useOnboarding();
  const { nextStep, canGoBack, goToStep } = useOnboardingFlow();
  const { updateAccountInfo, isUpdatingAccount } = useOnboardingMutations();

  const [fullName, setFullName] = useState(state.accountData.fullName);
  const [role, setRole] = useState<string>("");
  const [otherRole, setOtherRole] = useState("");
  const [editingTool, setEditingTool] = useState<string>("");
  const [otherEditingTool, setOtherEditingTool] = useState("");
  const [publishingCadence, setPublishingCadence] = useState<string>("");
  const [footageOwnership, setFootageOwnership] = useState<string>("");

  // Initialize state from accountData
  useEffect(() => {
    setFullName(state.accountData.fullName);

    // Role: check if it's a predefined option or custom
    if (!state.accountData.role) {
      setRole("");
      setOtherRole("");
    } else if (
      ROLE_OPTIONS.some((option) => option.value === state.accountData.role)
    ) {
      setRole(state.accountData.role);
      setOtherRole("");
    } else {
      setRole("other");
      setOtherRole(state.accountData.role);
    }

    // Editing tool: same pattern
    if (!state.accountData.editingTool) {
      setEditingTool("");
      setOtherEditingTool("");
    } else if (
      EDITING_TOOL_OPTIONS.some(
        (option) => option.value === state.accountData.editingTool
      )
    ) {
      setEditingTool(state.accountData.editingTool);
      setOtherEditingTool("");
    } else {
      setEditingTool("other");
      setOtherEditingTool(state.accountData.editingTool);
    }

    setPublishingCadence(state.accountData.publishingCadence || "");
    setFootageOwnership(state.accountData.footageOwnership || "");
  }, [state.accountData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      return;
    }

    const finalRole =
      role === "other" && otherRole.trim() ? otherRole.trim() : role;
    const finalEditingTool =
      editingTool === "other" && otherEditingTool.trim()
        ? otherEditingTool.trim()
        : editingTool;

    const result = await updateAccountInfo({
      fullName: fullName.trim(),
      role: finalRole || undefined,
      editingTool: finalEditingTool || undefined,
      publishingCadence: publishingCadence || undefined,
      footageOwnership: footageOwnership || undefined,
    });

    if (result.success) {
      nextStep();
    }
  };

  const isValid = fullName.trim().length > 0;

  return (
    <Card className="bg-muted/10 p-8 md:p-12">
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="mb-2 scroll-m-20 font-bold text-3xl tracking-tight">
            Account Setup
          </h2>
          <p className="text-muted-foreground">
            First, let's set up your account.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="fullName"
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Smith"
              required
              type="text"
              value={fullName}
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">
              What best describes you?{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Select onValueChange={setRole} value={role}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {role === "other" && (
              <div className="mt-2">
                <Input
                  onChange={(e) => setOtherRole(e.target.value)}
                  placeholder="Please specify your role"
                  type="text"
                  value={otherRole}
                />
              </div>
            )}
          </div>

          {/* Editing Tool */}
          <div className="space-y-2">
            <Label htmlFor="editingTool">
              What's your main editing software?{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Select onValueChange={setEditingTool} value={editingTool}>
              <SelectTrigger>
                <SelectValue placeholder="Select editing software" />
              </SelectTrigger>
              <SelectContent>
                {EDITING_TOOL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {editingTool === "other" && (
              <div className="mt-2">
                <Input
                  onChange={(e) => setOtherEditingTool(e.target.value)}
                  placeholder="Please specify your editing software"
                  type="text"
                  value={otherEditingTool}
                />
              </div>
            )}
          </div>

          {/* Publishing Cadence */}
          <div className="space-y-2">
            <Label htmlFor="publishingCadence">
              How often do you publish or deliver video?{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Select
              onValueChange={setPublishingCadence}
              value={publishingCadence}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {PUBLISHING_CADENCE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Footage Ownership */}
          <div className="space-y-2">
            <Label htmlFor="footageOwnership">
              Do you primarily work with your own footage or others'?{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Select
              onValueChange={setFootageOwnership}
              value={footageOwnership}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select footage type" />
              </SelectTrigger>
              <SelectContent>
                {FOOTAGE_OWNERSHIP_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            {canGoBack ? (
              <Button
                onClick={() => {
                  goToStep("welcome");
                }}
                variant="ghost"
              >
                ← Back
              </Button>
            ) : (
              <div />
            )}

            <Button disabled={!isValid || isUpdatingAccount} type="submit">
              {isUpdatingAccount ? "Saving..." : "Continue →"}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
