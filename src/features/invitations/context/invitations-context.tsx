"use client";

import { createContext, type ReactNode, useContext, useReducer } from "react";
import type { UserInvitation } from "../hooks/use-user-invitations";

interface InvitationsState {
  error: string | null;
  invitations: UserInvitation[];
  loading: boolean;
  pendingCount: number;
}

type InvitationsAction =
  | { type: "SET_INVITATIONS"; payload: UserInvitation[] }
  | {
      type: "UPDATE_INVITATION";
      payload: { id: string; updates: Partial<UserInvitation> };
    }
  | { type: "REMOVE_INVITATION"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

const initialState: InvitationsState = {
  invitations: [],
  pendingCount: 0,
  loading: true,
  error: null,
};

function invitationsReducer(
  state: InvitationsState,
  action: InvitationsAction
): InvitationsState {
  switch (action.type) {
    case "SET_INVITATIONS": {
      const invitations = action.payload;
      const pendingCount = invitations.filter(
        (inv) => inv.status === "pending"
      ).length;
      return { ...state, invitations, pendingCount, loading: false };
    }
    case "UPDATE_INVITATION": {
      const invitations = state.invitations.map((inv) =>
        inv.id === action.payload.id
          ? { ...inv, ...action.payload.updates }
          : inv
      );
      const pendingCount = invitations.filter(
        (inv) => inv.status === "pending"
      ).length;
      return { ...state, invitations, pendingCount };
    }
    case "REMOVE_INVITATION": {
      const invitations = state.invitations.filter(
        (inv) => inv.id !== action.payload
      );
      const pendingCount = invitations.filter(
        (inv) => inv.status === "pending"
      ).length;
      return { ...state, invitations, pendingCount };
    }
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

interface InvitationsContextValue extends InvitationsState {
  removeInvitation: (id: string) => void;
  setError: (error: string | null) => void;
  setInvitations: (invitations: UserInvitation[]) => void;
  setLoading: (loading: boolean) => void;
  updateInvitation: (id: string, updates: Partial<UserInvitation>) => void;
}

const InvitationsContext = createContext<InvitationsContextValue | undefined>(
  undefined
);

export function InvitationsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(invitationsReducer, initialState);

  const value: InvitationsContextValue = {
    ...state,
    setInvitations: (invitations) =>
      dispatch({ type: "SET_INVITATIONS", payload: invitations }),
    updateInvitation: (id, updates) =>
      dispatch({ type: "UPDATE_INVITATION", payload: { id, updates } }),
    removeInvitation: (id) =>
      dispatch({ type: "REMOVE_INVITATION", payload: id }),
    setLoading: (loading) =>
      dispatch({ type: "SET_LOADING", payload: loading }),
    setError: (error) => dispatch({ type: "SET_ERROR", payload: error }),
  };

  return (
    <InvitationsContext.Provider value={value}>
      {children}
    </InvitationsContext.Provider>
  );
}

export function useInvitations() {
  const context = useContext(InvitationsContext);
  if (context === undefined) {
    throw new Error("useInvitations must be used within InvitationsProvider");
  }
  return context;
}
