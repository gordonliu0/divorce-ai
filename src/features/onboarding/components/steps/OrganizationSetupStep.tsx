// components/onboarding/steps/OrganizationSetupStep.tsx
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

const TEAM_SIZE_OPTIONS = [
  { value: "solo", label: "Just me" },
  { value: "2_to_5", label: "2–5" },
  { value: "6_plus", label: "6+" },
];

export function OrganizationSetupStep() {
  const { state } = useOnboarding();
  const { nextStep, previousStep } = useOnboardingFlow();
  const { createOrganizationWithOnboarding, isCreatingOrg } =
    useOnboardingMutations();

  const [name, setName] = useState(state.organizationData.name);
  const [teamSize, setTeamSize] = useState(
    state.organizationData.teamSize || ""
  );

  const isLocked = state.hasCreatedOrg;

  // Sync with context if user navigates back (though this shouldn't happen after creation)
  useEffect(() => {
    if (state.organizationData.name) {
      setName(state.organizationData.name);
    }
    if (state.organizationData.teamSize) {
      setTeamSize(state.organizationData.teamSize);
    }
  }, [state.organizationData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || isLocked) {
      return;
    }

    const result = await createOrganizationWithOnboarding({
      name: name.trim(),
      teamSize: teamSize || undefined,
    });

    if (result.success) {
      nextStep();
    }
  };

  const isValid = name.trim().length > 0;

  return (
    <Card className="bg-muted/10 p-8 md:p-12">
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="mb-2 scroll-m-20 font-bold text-3xl tracking-tight">
            {isLocked ? (
              <>Organization created successfully!</>
            ) : (
              <>Create your organization</>
            )}
          </h2>
          <p className="text-muted-foreground">
            {isLocked ? (
              <>Your organization is ready to use.</>
            ) : (
              <>
                Organizations let you collaborate with a team and share assets.
              </>
            )}
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Organization Name */}
          <div className="space-y-2">
            <Label htmlFor="orgName">
              Organization Name <span className="text-destructive">*</span>
            </Label>
            <Input
              disabled={isLocked}
              id="orgName"
              onChange={(e) => setName(e.target.value)}
              placeholder={`${state.accountData.fullName.split(" ")[0]}'s Org`}
              required
              type="text"
              value={name}
            />
          </div>

          {/* Team Size */}
          <div className="space-y-2">
            <Label htmlFor="teamSize">
              How many people work with your video library?{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Select
              disabled={isLocked}
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

          {/* Footer Note */}
          {!isLocked && (
            <p className="text-center text-muted-foreground text-sm">
              You can invite team members after setup
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <Button onClick={previousStep} variant="ghost">
              ← Back
            </Button>

            {isLocked ? (
              <Button className="ml-4" onClick={nextStep}>
                Continue →
              </Button>
            ) : (
              <Button
                disabled={!isValid || isCreatingOrg || isLocked}
                type="submit"
              >
                {(() => {
                  if (isCreatingOrg) {
                    return "Creating...";
                  }
                  if (isLocked) {
                    return "Organization Created";
                  }
                  return "Create Organization →";
                })()}
              </Button>
            )}
          </div>
        </form>
      </div>
    </Card>
  );
}
