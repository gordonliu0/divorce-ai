// hooks/useOnboardingFlow.ts
"use client";

import type { OnboardingStep } from "../contexts/OnboardingContext";
import { useOnboarding } from "../contexts/OnboardingContext";

export function useOnboardingFlow() {
  const { state, setStep, resetError } = useOnboarding();

  const stepOrder: OnboardingStep[] = [
    "welcome",
    "account-setup",
    "organization-setup",
    "invite-team",
    "ready",
  ];

  const currentStepIndex = stepOrder.indexOf(state.currentStep);

  const canGoBack = () => {
    // Can't go back from welcome
    if (state.currentStep === "welcome") {
      return false;
    }

    // Can't go back past org setup if org is created
    if (state.hasCreatedOrg && state.currentStep === "organization-setup") {
      return false;
    }

    return true;
  };

  const canGoForward = () => {
    // Can always skip forward (validation happens on each step's "Continue" button)
    return currentStepIndex < stepOrder.length - 1;
  };

  const goToStep = (step: OnboardingStep) => {
    resetError();
    setStep(step);
    return true;
  };

  const nextStep = () => {
    if (!canGoForward()) {
      return false;
    }
    const nextStep = stepOrder[currentStepIndex + 1];
    return goToStep(nextStep);
  };

  const previousStep = () => {
    const prevStep = stepOrder[currentStepIndex - 1];
    return goToStep(prevStep);
  };

  return {
    currentStep: state.currentStep,
    currentStepIndex,
    totalSteps: stepOrder.length,
    canGoBack: canGoBack(),
    canGoForward: canGoForward(),
    goToStep,
    nextStep,
    previousStep,
  };
}
