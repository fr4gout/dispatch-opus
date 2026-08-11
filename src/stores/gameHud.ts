import { create } from "zustand";
import type { HudData } from "@/nui/types";
import { mockHudData } from "@/nui/mock";

interface GameHudState {
  hudData: HudData;
  setHudData: (data: Partial<HudData>) => void;
  hydrate: (payload: Partial<GameHudState>) => void;
}

export const useGameHudStore = create<GameHudState>((set) => ({
  hudData: mockHudData,
  setHudData: (data) => set((s) => ({ hudData: { ...s.hudData, ...data } })),
  hydrate: (payload) => set(payload),
}));
