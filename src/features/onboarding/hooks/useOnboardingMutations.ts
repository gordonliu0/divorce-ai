// hooks/useOnboardingMutations.ts
"use client";

import { useState } from "react";
import { createClient } from "@/shared/lib/supabase/client";
import type {
  AccountData,
  InvitationData,
  OrganizationData,
} from "../contexts/OnboardingContext";
import { useOnboarding } from "../contexts/OnboardingContext";

const ONBOARDING_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useOnboardingMutations() {
  const {
    state,
    setAccountData,
    setOrganizationData,
    setInvitationData,
    setError,
    resetError,
  } = useOnboarding();

  interface ValidationError {
    email: string;
    error: string;
  }

  const validateEmailsClientSide = (emails: string[]): ValidationError[] => {
    const errors: ValidationError[] = [];

    // Check batch size limit
    if (emails.length > 50) {
      return [{ email: "", error: "Maximum 50 invitations per batch" }];
    }

    for (const email of emails) {
      const cleanEmail = email.trim().toLowerCase();

      // Email format validation
      if (!ONBOARDING_EMAIL_REGEX.test(cleanEmail)) {
        errors.push({ email, error: "Invalid email format" });
      }

      // For onboarding, we don't need to check for existing members/invitations
      // since this is a new organization being created
    }

    return errors;
  };

  const [isUpdatingAccount, setIsUpdatingAccount] = useState(false);
  const [isCreatingOrg, setIsCreatingOrg] = useState(false);
  const [isSendingInvites, setIsSendingInvites] = useState(false);
  const [isCompletingOnboarding, setIsCompletingOnboarding] = useState(false);

  const supabase = createClient();

  // Update account info (direct Supabase update)
  const updateAccountInfo = async (data: AccountData) => {
    setIsUpdatingAccount(true);
    resetError();

    const previousData = state.accountData;
    setAccountData(data);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Not authenticated");
      }

      // Handle "other" free text for role and editing tool
      const finalRole =
        data.role === "other" && data.otherRole ? data.otherRole : data.role;
      const finalEditingTool =
        data.editingTool === "other" && data.otherEditingTool
          ? data.otherEditingTool
          : data.editingTool;

      const { error } = await supabase
        .from("users")
        .update({
          name: data.fullName,
          role: finalRole || null,
          editing_tool: finalEditingTool || null,
          publishing_cadence: data.publishingCadence || null,
          footage_ownership: data.footageOwnership || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      // Update current step to account-setup
      await fetch("/api/onboarding/update-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: "account-setup" }),
      });

      return { success: true };
    } catch (error) {
      setAccountData(previousData);
      const message =
        error instanceof Error ? error.message : "Failed to update account";
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsUpdatingAccount(false);
    }
  };

  // Create organization (API route)
  const createOrganizationWithOnboarding = async (data: OrganizationData) => {
    if (state.hasCreatedOrg) {
      setError("Organization already created");
      return { success: false, error: "Organization already created" };
    }

    setIsCreatingOrg(true);
    resetError();

    try {
      const response = await fetch("/api/onboarding/create-organization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          teamSize: data.teamSize,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create organization");
      }

      setOrganizationData({
        id: result.data.id,
        name: result.data.name,
        teamSize: result.data.team_size,
      });

      // Update current step to organization-setup
      await fetch("/api/onboarding/update-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: "organization-setup" }),
      });

      return { success: true, data: result.data };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create organization";
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsCreatingOrg(false);
    }
  };

  // Send invitations (reuses existing invitation API)
  const sendOnboardingInvitations = async (data: InvitationData) => {
    if (!state.organizationData.id) {
      setError("Organization must be created first");
      return { success: false, error: "Organization must be created first" };
    }

    if (data.emails.length === 0) {
      // Skip is allowed - just update progress
      await fetch("/api/onboarding/update-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: "invite-team",
        }),
      });
      return { success: true };
    }

    setIsSendingInvites(true);
    resetError();

    try {
      // Client-side validation first
      const clientErrors = validateEmailsClientSide(data.emails);
      if (clientErrors.length > 0) {
        return { success: false, sent: 0, errors: clientErrors };
      }

      const response = await fetch(
        `/api/o/${state.organizationData.id}/invitations/send`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            emails: data.emails,
            role: "member",
            customMessage: data.customMessage,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send invitations");
      }

      // Store invitation data in state
      setInvitationData({
        emails: data.emails,
        customMessage: data.customMessage,
      });

      // Update progress
      await fetch("/api/onboarding/update-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: "invite-team",
          markCompleted: true,
        }),
      });

      return {
        success: true,
        sent: result.sent,
        errors: result.errors || [],
        invitations: result.invitations,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to send invitations";
      setError(message);
      return {
        success: false,
        sent: 0,
        errors: [{ email: "", error: message }],
      };
    } finally {
      setIsSendingInvites(false);
    }
  };

  // Complete onboarding
  const completeOnboarding = async () => {
    setIsCompletingOnboarding(true);
    resetError();

    try {
      const response = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to complete onboarding");
      }

      return { success: true };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to complete onboarding";
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsCompletingOnboarding(false);
    }
  };

  return {
    updateAccountInfo,
    createOrganizationWithOnboarding,
    sendOnboardingInvitations,
    completeOnboarding,
    isUpdatingAccount,
    isCreatingOrg,
    isSendingInvites,
    isCompletingOnboarding,
  };
}
