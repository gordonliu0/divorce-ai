// app/onboarding/page.tsx

import { redirect } from "next/navigation";
import { OnboardingLayout } from "@/features/onboarding/components/OnboardingLayout";
import { OnboardingContainer } from "@/features/onboarding/components/onboarding-container";
import { OnboardingSteps } from "@/features/onboarding/components/steps/OnboardingSteps";
import type {
  OnboardingState,
  OnboardingStep,
} from "@/features/onboarding/contexts/OnboardingContext";
import { createClient } from "@/shared/lib/supabase/server";

async function getInitialOnboardingState(): Promise<Partial<OnboardingState>> {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // Get user data
  const { data: userData } = await supabase
    .from("users")
    .select("name")
    .eq("id", user.id)
    .single();

  // Get onboarding progress
  const { data: progressData } = await supabase
    .from("users")
    .select("onboarding_step, onboarding_completed_at")
    .eq("id", user.id)
    .single();

  // If onboarding already completed, redirect to dashboard
  if (progressData?.onboarding_completed_at) {
    redirect("/dashboard");
  }

  // Check if user has already created an organization
  const { data: orgMembership } = await supabase
    .from("members")
    .select("organization_id, organizations(id, name, team_size)")
    .eq("user_id", user.id)
    .eq("role", "owner")
    .single();

  const hasCreatedOrg = !!orgMembership;

  return {
    currentStep: (progressData?.onboarding_step as OnboardingStep) || "welcome",
    hasCreatedOrg,
    accountData: {
      fullName: userData?.name || "",
    },
    organizationData:
      hasCreatedOrg && orgMembership?.organizations
        ? {
            id: orgMembership.organizations.id,
            name: orgMembership.organizations.name,
            teamSize: orgMembership.organizations.team_size || undefined,
          }
        : { name: "" },
    invitationData: {
      emails: [],
      customMessage: "",
    },
  };
}

export default async function OnboardingPage() {
  const initialState = await getInitialOnboardingState();

  return (
    <OnboardingContainer initialState={initialState}>
      <OnboardingLayout>
        <OnboardingSteps />
      </OnboardingLayout>
    </OnboardingContainer>
  );
}
