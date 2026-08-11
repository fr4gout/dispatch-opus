import { create } from "zustand";
import type { AdminMission } from "@/nui/types";
import { mockMissions } from "@/nui/mock";

interface AdminMissionsState {
  missions: AdminMission[];
  selectedMission: AdminMission | null;
  selectMission: (id: string) => void;
  updateSelected: (patch: Partial<AdminMission>) => void;
  saveSelected: () => void;
  newMission: () => void;
  deleteMission: (id: string) => void;
  hydrate: (payload: Partial<AdminMissionsState>) => void;
}

const blank = (): AdminMission => ({
  id: `cm-${Date.now().toString().slice(-4)}`,
  title: "Untitled Mission",
  cargoType: "Standard",
  rewardFormula: "distance * 400",
  pickup: { x: 0, y: 0, z: 0 },
  dropoff: { x: 0, y: 0, z: 0 },
  minLevel: 1,
  maxLevel: 99,
  enabled: false,
});

export const useAdminMissionsStore = create<AdminMissionsState>((set) => ({
  missions: mockMissions,
  selectedMission: mockMissions[0] ?? null,
  selectMission: (id) =>
    set((s) => ({ selectedMission: s.missions.find((m) => m.id === id) ?? null })),
  updateSelected: (patch) =>
    set((s) => ({
      selectedMission: s.selectedMission ? { ...s.selectedMission, ...patch } : null,
    })),
  saveSelected: () =>
    set((s) => {
      if (!s.selectedMission) return s;
      const exists = s.missions.some((m) => m.id === s.selectedMission!.id);
      return {
        missions: exists
          ? s.missions.map((m) => (m.id === s.selectedMission!.id ? s.selectedMission! : m))
          : [...s.missions, s.selectedMission!],
      };
    }),
  newMission: () => set(() => ({ selectedMission: blank() })),
  deleteMission: (id) =>
    set((s) => ({
      missions: s.missions.filter((m) => m.id !== id),
      selectedMission: s.selectedMission?.id === id ? null : s.selectedMission,
    })),
  hydrate: (payload) => set(payload),
}));
