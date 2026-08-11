import { create } from "zustand";
import type { Invitation, Party } from "@/nui/types";
import { mockInvitations, mockParty } from "@/nui/mock";

interface PartyState {
  party: Party;
  invitations: Invitation[];
  hydrate: (payload: Partial<PartyState>) => void;
}

export const usePartyStore = create<PartyState>((set) => ({
  party: mockParty,
  invitations: mockInvitations,
  hydrate: (payload) => set(payload),
}));
