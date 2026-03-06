// components/onboarding/steps/ReadyStep.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { useOnboarding } from "../../contexts/OnboardingContext";
import { useOnboardingMutations } from "../../hooks/useOnboardingMutations";

export function ReadyStep() {
  const { state } = useOnboarding();
  const { completeOnboarding, isCompletingOnboarding } =
    useOnboardingMutations();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const inviteCount = state.invitationData.emails.length;

  const handleStartTour = async (orgId: string) => {
    setIsRedirecting(true);

    const result = await completeOnboarding();

    if (result.success) {
      // Redirect to dashboard
      router.push(`/o/${orgId}`);
    } else {
      setIsRedirecting(false);
    }
  };

  const handleSkipTour = async () => {
    setIsRedirecting(true);

    const result = await completeOnboarding();

    if (result.success) {
      // Redirect directly to dashboard without tour
      router.push("/o");
    } else {
      setIsRedirecting(false);
    }
  };

  return (
    <Card className="bg-muted/20 p-8 md:p-12">
      <div className="mx-auto max-w-xl text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              aria-label="Ready"
              className="h-8 w-8 text-green-600"
              fill="none"
              role="img"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M5 13l4 4L19 7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
          <h2 className="mb-2 scroll-m-20 font-bold text-3xl tracking-tight">
            Your organization is ready! 🎉
          </h2>
          <p className="text-muted-foreground">
            You've successfully set up your SpeedyGhost workspace.
          </p>
        </div>

        {/* Summary Card */}
        <Card className="mb-8 bg-muted/50 p-6 text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">Organization</span>
              <span className="font-semibold text-sm">
                {state.organizationData.name}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">Team members</span>
              <span className="text-sm">
                {inviteCount === 0
                  ? "1 member (just you)"
                  : `1 member + ${inviteCount} ${inviteCount === 1 ? "invite" : "invites"} sent`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">Status</span>
              <span className="font-medium text-green-600 text-sm">
                Ready to connect folders
              </span>
            </div>
          </div>
        </Card>

        {/* Body */}
        <p className="mb-8 text-muted-foreground">
          Let's take a quick tour to show you how to connect your Drive folders
          and start searching your video assets.
        </p>

        {/* Actions */}
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            disabled={isCompletingOnboarding || isRedirecting}
            onClick={() => {
              handleStartTour(state.organizationData.id ?? "");
            }}
            size="lg"
          >
            {isRedirecting ? "Loading..." : "Start Tour →"}
          </Button>
        </div>

        {/* Skip Option */}
        <Button
          className="mt-4 text-sm"
          disabled={isCompletingOnboarding || isRedirecting}
          onClick={handleSkipTour}
          variant="ghost"
        >
          Skip tour, take me to the dashboard
        </Button>
      </div>
    </Card>
  );
}
