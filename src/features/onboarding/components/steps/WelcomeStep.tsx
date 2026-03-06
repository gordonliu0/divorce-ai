// components/onboarding/steps/WelcomeStep.tsx
"use client";

import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { useOnboardingFlow } from "../../hooks/useOnboardingFlow";

export function WelcomeStep() {
  const { nextStep } = useOnboardingFlow();

  return (
    <Card className="bg-muted/10 p-8 md:p-12">
      <div className="mx-auto max-w-xl text-center">
        {/* Header */}
        <h1 className="mb-4 scroll-m-20 font-bold text-4xl tracking-tight">
          Welcome to SpeedyGhost AI
        </h1>
        <p className="mb-8 text-muted-foreground text-xl">
          Your team's intelligent workspace for video content
        </p>

        {/* Body */}
        <p className="mb-12 text-muted-foreground leading-7">
          SpeedyGhost helps creative teams find and reuse video assets
          instantly. Stop recreating content you've already made. Start building
          faster.
        </p>

        {/* Value Props */}
        <div className="mb-12 grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <svg
                aria-label="Connect your Drive"
                className="h-6 w-6 text-primary"
                fill="none"
                role="img"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <h3 className="mb-2 font-semibold">Connect your Drive</h3>
            <p className="text-muted-foreground text-sm">
              Automatic sync with your existing folders
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <svg
                aria-label="Search semantically"
                className="h-6 w-6 text-primary"
                fill="none"
                role="img"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <h3 className="mb-2 font-semibold">Search semantically</h3>
            <p className="text-muted-foreground text-sm">
              Find clips by describing what you need
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <svg
                aria-label="Collaborate with your team"
                className="h-6 w-6 text-primary"
                fill="none"
                role="img"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <h3 className="mb-2 font-semibold">Reuse with confidence</h3>
            <p className="text-muted-foreground text-sm">
              Never lose track of your best content again
            </p>
          </div>
        </div>

        {/* CTA */}
        <Button className="w-full md:w-auto" onClick={nextStep}>
          Get Started →
        </Button>
      </div>
    </Card>
  );
}
