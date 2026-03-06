"use client";

import {
  OnboardingProvider,
  type OnboardingState,
} from "../contexts/OnboardingContext";

export function OnboardingContainer({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState: Partial<OnboardingState>;
}) {
  return (
    <OnboardingProvider initialState={initialState}>
      {children}
    </OnboardingProvider>
  );
}
