"use client";

import { createContext, type ReactNode, useContext, useReducer } from "react";
import type { PendingInvitation, TeamMember } from "../types/types";

interface TeamState {
  invitations: PendingInvitation[];
  members: TeamMember[];
}

type TeamAction =
  | { type: "SET_MEMBERS"; payload: TeamMember[] }
  | { type: "SET_INVITATIONS"; payload: PendingInvitation[] }
  | { type: "ADD_INVITATION"; payload: PendingInvitation }
  | {
      type: "UPDATE_INVITATION";
      payload: { id: string; updates: Partial<PendingInvitation> };
    }
  | { type: "REMOVE_INVITATION"; payload: string }
  | { type: "ADD_MEMBER"; payload: TeamMember }
  | {
      type: "UPDATE_MEMBER_ROLE";
      payload: { userId: string; newRole: "owner" | "admin" | "member" };
    }
  | { type: "REMOVE_MEMBER"; payload: string }
  | {
      type: "UPDATE_MEMBER";
      payload: { userId: string; updates: Partial<TeamMember> };
    };

interface TeamActions {
  addInvitation: (invitation: PendingInvitation) => void;
  addMember: (member: TeamMember) => void;
  removeInvitation: (id: string) => void;
  removeMember: (userId: string) => void;
  setInvitations: (invitations: PendingInvitation[]) => void;
  setMembers: (members: TeamMember[]) => void;
  updateInvitation: (id: string, updates: Partial<PendingInvitation>) => void;
  updateMember: (userId: string, updates: Partial<TeamMember>) => void;
  updateMemberRole: (
    userId: string,
    newRole: "owner" | "admin" | "member"
  ) => void;
}

interface TeamSelectors {
  getCancelledInvitations: () => PendingInvitation[];
  getExpiredInvitations: () => PendingInvitation[];
  getMemberByEmail: (email: string) => TeamMember | undefined;
  getPendingInvitationByEmail: (email: string) => PendingInvitation | undefined;
  getPendingInvitations: () => PendingInvitation[];
}

interface TeamDataContextValue {
  actions: TeamActions;
  selectors: TeamSelectors;
  state: TeamState;
}

const TeamDataContext = createContext<TeamDataContextValue | null>(null);

const teamReducer = (state: TeamState, action: TeamAction): TeamState => {
  switch (action.type) {
    case "SET_MEMBERS":
      return { ...state, members: action.payload };

    case "SET_INVITATIONS":
      return { ...state, invitations: action.payload };

    case "ADD_INVITATION":
      return {
        ...state,
        invitations: [...state.invitations, action.payload],
      };

    case "UPDATE_INVITATION":
      return {
        ...state,
        invitations: state.invitations.map((invitation) =>
          invitation.id === action.payload.id
            ? { ...invitation, ...action.payload.updates }
            : invitation
        ),
      };

    case "REMOVE_INVITATION":
      return {
        ...state,
        invitations: state.invitations.filter(
          (invitation) => invitation.id !== action.payload
        ),
      };

    case "ADD_MEMBER":
      return {
        ...state,
        members: [...state.members, action.payload],
      };

    case "UPDATE_MEMBER_ROLE":
      return {
        ...state,
        members: state.members.map((member) =>
          member.user_id === action.payload.userId
            ? { ...member, role: action.payload.newRole }
            : member
        ),
      };

    case "REMOVE_MEMBER":
      return {
        ...state,
        members: state.members.filter(
          (member) => member.user_id !== action.payload
        ),
      };

    case "UPDATE_MEMBER":
      return {
        ...state,
        members: state.members.map((member) =>
          member.user_id === action.payload.userId
            ? { ...member, ...action.payload.updates }
            : member
        ),
      };

    default:
      return state;
  }
};

interface TeamDataProviderProps {
  children: ReactNode;
  initialInvitations?: PendingInvitation[];
  initialMembers?: TeamMember[];
}

export function TeamDataProvider({
  children,
  initialMembers = [],
  initialInvitations = [],
}: TeamDataProviderProps) {
  const [state, dispatch] = useReducer(teamReducer, {
    members: initialMembers,
    invitations: initialInvitations,
  });

  const actions: TeamActions = {
    setMembers: (members) =>
      dispatch({ type: "SET_MEMBERS", payload: members }),
    setInvitations: (invitations) =>
      dispatch({ type: "SET_INVITATIONS", payload: invitations }),
    addInvitation: (invitation) =>
      dispatch({ type: "ADD_INVITATION", payload: invitation }),
    updateInvitation: (id, updates) =>
      dispatch({ type: "UPDATE_INVITATION", payload: { id, updates } }),
    removeInvitation: (id) =>
      dispatch({ type: "REMOVE_INVITATION", payload: id }),
    addMember: (member) => dispatch({ type: "ADD_MEMBER", payload: member }),
    updateMemberRole: (userId, newRole) =>
      dispatch({ type: "UPDATE_MEMBER_ROLE", payload: { userId, newRole } }),
    removeMember: (userId) =>
      dispatch({ type: "REMOVE_MEMBER", payload: userId }),
    updateMember: (userId, updates) =>
      dispatch({ type: "UPDATE_MEMBER", payload: { userId, updates } }),
  };

  const selectors: TeamSelectors = {
    getPendingInvitations: () =>
      state.invitations.filter((inv) => inv.status === "pending"),

    getExpiredInvitations: () =>
      state.invitations.filter((inv) => inv.status === "expired"),

    getCancelledInvitations: () =>
      state.invitations.filter((inv) => inv.status === "cancelled"),

    getMemberByEmail: (email: string) =>
      state.members.find(
        (member) => member.email.toLowerCase() === email.toLowerCase()
      ),

    getPendingInvitationByEmail: (email: string) =>
      state.invitations.find(
        (inv) =>
          inv.email.toLowerCase() === email.toLowerCase() &&
          inv.status === "pending"
      ),
  };

  return (
    <TeamDataContext.Provider value={{ state, actions, selectors }}>
      {children}
    </TeamDataContext.Provider>
  );
}

export function useTeamData() {
  const context = useContext(TeamDataContext);
  if (!context) {
    throw new Error("useTeamData must be used within a TeamDataProvider");
  }
  return context;
}
