// app/onboarding/components/OnboardingSteps.tsx
"use client";

import { useOnboarding } from "../../contexts/OnboardingContext";
import { AccountSetupStep } from "./AccountSetupStep";
import { InviteTeamStep } from "./InviteTeamStep";
import { OrganizationSetupStep } from "./OrganizationSetupStep";
import { ReadyStep } from "./ReadyStep";
import { WelcomeStep } from "./WelcomeStep";

export function OnboardingSteps() {
  const { state } = useOnboarding();

  switch (state.currentStep) {
    case "welcome":
      return <WelcomeStep />;
    case "account-setup":
      return <AccountSetupStep />;
    case "organization-setup":
      return <OrganizationSetupStep />;
    case "invite-team":
      return <InviteTeamStep />;
    case "ready":
      return <ReadyStep />;
    default:
      return <WelcomeStep />;
  }
}
