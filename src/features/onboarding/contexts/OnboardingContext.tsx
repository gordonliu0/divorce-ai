// contexts/OnboardingContext.tsx
"use client";

import { createContext, type ReactNode, useContext, useReducer } from "react";

// Types
export type OnboardingStep =
  | "welcome"
  | "account-setup"
  | "organization-setup"
  | "invite-team"
  | "ready";

export interface AccountData {
  editingTool?: string;
  footageOwnership?: string;
  fullName: string;
  otherEditingTool?: string;
  otherRole?: string;
  publishingCadence?: string;
  role?: string;
}

export interface OrganizationData {
  id?: string;
  name: string;
  teamSize?: string;
}

export interface InvitationData {
  customMessage?: string;
  emails: string[];
}

export interface OnboardingState {
  accountData: AccountData;
  currentStep: OnboardingStep;
  error: string | null;
  hasCreatedOrg: boolean;
  invitationData: InvitationData;
  loading: boolean;
  organizationData: OrganizationData;
}

// Actions
type OnboardingAction =
  | { type: "SET_STEP"; payload: OnboardingStep }
  | { type: "SET_ACCOUNT_DATA"; payload: AccountData }
  | { type: "SET_ORGANIZATION_DATA"; payload: OrganizationData }
  | { type: "SET_INVITATION_DATA"; payload: InvitationData }
  | { type: "SET_ORG_CREATED"; payload: boolean }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "RESET_ERROR" };

// Reducer
function onboardingReducer(
  state: OnboardingState,
  action: OnboardingAction
): OnboardingState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.payload };
    case "SET_ACCOUNT_DATA":
      return { ...state, accountData: action.payload };
    case "SET_ORGANIZATION_DATA":
      return {
        ...state,
        organizationData: action.payload,
        hasCreatedOrg: true,
      };
    case "SET_INVITATION_DATA":
      return { ...state, invitationData: action.payload };
    case "SET_ORG_CREATED":
      return { ...state, hasCreatedOrg: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "RESET_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
}

// Context
interface OnboardingContextValue {
  resetError: () => void;
  setAccountData: (data: AccountData) => void;
  setError: (error: string | null) => void;
  setInvitationData: (data: InvitationData) => void;
  setLoading: (loading: boolean) => void;
  setOrganizationData: (data: OrganizationData) => void;
  setOrgCreated: (created: boolean) => void;
  setStep: (step: OnboardingStep) => void;
  state: OnboardingState;
}

const OnboardingContext = createContext<OnboardingContextValue | undefined>(
  undefined
);

// Provider
interface OnboardingProviderProps {
  children: ReactNode;
  initialState: Partial<OnboardingState>;
}

export function OnboardingProvider({
  children,
  initialState,
}: OnboardingProviderProps) {
  const [state, dispatch] = useReducer(onboardingReducer, {
    currentStep: initialState.currentStep || "welcome",
    hasCreatedOrg: initialState.hasCreatedOrg,
    accountData: initialState.accountData || { fullName: "" },
    organizationData: initialState.organizationData || { name: "" },
    invitationData: initialState.invitationData || {
      emails: [],
      customMessage: "",
    },
    loading: false,
    error: null,
  });

  const value: OnboardingContextValue = {
    state,
    setStep: (step) => dispatch({ type: "SET_STEP", payload: step }),
    setAccountData: (data) =>
      dispatch({ type: "SET_ACCOUNT_DATA", payload: data }),
    setOrganizationData: (data) =>
      dispatch({ type: "SET_ORGANIZATION_DATA", payload: data }),
    setInvitationData: (data) =>
      dispatch({ type: "SET_INVITATION_DATA", payload: data }),
    setOrgCreated: (created) =>
      dispatch({ type: "SET_ORG_CREATED", payload: created }),
    setLoading: (loading) =>
      dispatch({ type: "SET_LOADING", payload: loading }),
    setError: (error) => dispatch({ type: "SET_ERROR", payload: error }),
    resetError: () => dispatch({ type: "RESET_ERROR" }),
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

// Hook to use context
export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
}
