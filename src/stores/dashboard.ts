import { create } from "zustand";
import type {
  ActiveJob,
  CompanyData,
  DriverSlot,
  HistoryEntry,
  LeaderboardEntry,
  Order,
  PlayerData,
  SkillBranch,
  Vehicle,
} from "@/nui/types";
import {
  mockActiveJob,
  mockCompany,
  mockDriverSlots,
  mockHistory,
  mockLeaderboard,
  mockOrders,
  mockPlayer,
  mockSkillBranches,
  mockTrailerShop,
  mockTrailersOwned,
  mockVehiclesOwned,
  mockVehiclesShop,
} from "@/nui/mock";

interface DashboardState {
  visible: boolean;
  player: PlayerData;
  activeJob: ActiveJob | null;
  orders: Order[];
  vehiclesOwned: Vehicle[];
  vehiclesShop: Vehicle[];
  trailersOwned: Vehicle[];
  trailerShop: Vehicle[];
  skillBranches: SkillBranch[];
  skillPoints: number;
  driverSlots: DriverSlot[];
  companyData: CompanyData;
  leaderboard: LeaderboardEntry[];
  history: HistoryEntry[];
  setVisible: (v: boolean) => void;
  hydrate: (payload: Partial<DashboardState>) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  visible: true,
  player: mockPlayer,
  activeJob: mockActiveJob,
  orders: mockOrders,
  vehiclesOwned: mockVehiclesOwned,
  vehiclesShop: mockVehiclesShop,
  trailersOwned: mockTrailersOwned,
  trailerShop: mockTrailerShop,
  skillBranches: mockSkillBranches,
  skillPoints: 4,
  driverSlots: mockDriverSlots,
  companyData: mockCompany,
  leaderboard: mockLeaderboard,
  history: mockHistory,
  setVisible: (visible) => set({ visible }),
  hydrate: (payload) => set(payload),
}));
