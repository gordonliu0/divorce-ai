// components/onboarding/OnboardingLayout.tsx
"use client";

import { useEffect } from "react";
import { useOnboarding } from "../contexts/OnboardingContext";
import { useOnboardingFlow } from "../hooks/useOnboardingFlow";

export function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const { state } = useOnboarding();
  const { currentStepIndex, totalSteps } = useOnboardingFlow();

  // Navigation guard - warn before leaving
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Block browser back button during onboarding
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <div className="flex h-full w-screen flex-col bg-background">
      {/* Progress Bar */}
      <div className="w-full bg-background">
        <div className="mx-auto px-4 pt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-medium text-sm">
              {state.currentStep === "welcome" && "Welcome"}
              {state.currentStep === "account-setup" && "Account Setup"}
              {state.currentStep === "organization-setup" &&
                "Organization Setup"}
              {state.currentStep === "invite-team" && "Invite Team"}
              {state.currentStep === "ready" && "Ready to Go"}
            </span>
            <span className="text-muted-foreground text-sm">
              Step {currentStepIndex + 1} of {totalSteps}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary transition-all duration-300"
              style={{
                width: `${((currentStepIndex + 1) / totalSteps) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="h-max w-full md:max-w-2xl">{children}</div>
      </div>

      {/* Error Display */}
      {state.error && (
        <div className="fixed right-4 bottom-4 max-w-md">
          <div className="rounded-lg border bg-destructive/10 p-4 shadow-sm">
            <div className="flex items-start">
              <div className="shrink-0">
                <svg
                  aria-label="Error"
                  className="h-5 w-5 text-destructive"
                  fill="currentColor"
                  role="img"
                  viewBox="0 0 20 20"
                >
                  <path
                    clipRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="font-medium text-destructive text-sm">
                  {state.error}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
