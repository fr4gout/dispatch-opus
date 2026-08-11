export type CargoCategory = "heavy" | "fragile" | "highvalue" | "hazardous" | "standard";

export interface Order {
  id: string;
  cargo: string;
  category: CargoCategory;
  weight: number; // tonnes
  distance: number; // km
  reward: number;
  xp: number;
  timeLimit: number; // minutes
  pickup: string;
  dropoff: string;
  pickupCoords: { x: number; y: number };
  dropoffCoords: { x: number; y: number };
  levelReq: number;
  hazard: "NONE" | "LOW" | "MEDIUM" | "EXTREME";
  fuelCost: number;
}

export interface Vehicle {
  slot: number;
  name: string;
  model: string;
  classTag: string;
  price: number;
  rentPrice: number;
  topSpeed: number; // km/h
  payload: number; // tonnes
  fuel: number; // litres
  condition: number; // %
  owned: boolean;
  equipped: boolean;
  vin: string;
  kind: "truck" | "trailer";
}

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  perk: string;
  cost: number;
  tier: number;
  state: "acquired" | "available" | "locked";
  requires?: string;
}

export interface SkillBranch {
  id: string;
  name: string;
  accent: "amber" | "cyan" | "emerald" | "rose";
  nodes: SkillNode[];
}

export interface DriverSlot {
  slot: number;
  state: "hired" | "purchasable" | "locked";
  driverName?: string;
  vehicle?: string;
  ratePerHour?: number;
  status?: string;
  progress?: number;
  pending?: number;
  price?: number;
  incomePreview?: number;
  levelReq?: number;
}

export interface CompanyMember {
  id: string;
  name: string;
  role: "OWNER" | "DISPATCHER" | "SENIOR" | "RECRUIT";
  contribution: number;
  online: boolean;
}

export interface CompanyData {
  name: string;
  tag: string;
  tier: string;
  vault: number;
  weekly: { label: string; payout: number; volume: number }[];
  members: CompanyMember[];
  perks: { id: string; name: string; description: string; active: boolean }[];
  invitations: { id: string; name: string; sentAt: string }[];
}

export interface ActiveJob {
  orderId: string;
  cargo: string;
  pickup: string;
  dropoff: string;
  etaMinutes: number;
  remainingKm: number;
  totalKm: number;
  cargoHealth: number;
  reward: number;
}

export interface PlayerData {
  name: string;
  level: number;
  rank: string;
  xp: number;
  xpMax: number;
  cash: number;
  bank: number;
  totalEarnings: number;
  earningsGrowth: number;
  deliveries: number;
  deliveryBreakdown: { label: string; value: number }[];
  distanceKm: number;
  reputation: string;
  reputationProgress: number;
}

export interface HistoryEntry {
  id: string;
  cargo: string;
  route: string;
  payout: number;
  xp: number;
  date: string;
  rating: "PRISTINE" | "DAMAGED" | "FAILED";
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  deliveries: number;
  earnings: number;
  level: number;
}

export interface PartyMember {
  id: string;
  name: string;
  distanceFromLeader: number;
  ready: boolean;
  leader: boolean;
  cargo?: string;
}

export interface Party {
  active: boolean;
  size: number;
  max: number;
  members: PartyMember[];
}

export interface Invitation {
  id: string;
  from: string;
  convoy: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  level: "info" | "success" | "warning";
  read: boolean;
}

export interface HudData {
  visible: boolean;
  step: 0 | 1 | 2;
  destination: string;
  distance: number;
  cargoCondition: number;
  secondsRemaining: number;
  cargo: string;
}

export interface AdminMission {
  id: string;
  title: string;
  cargoType: string;
  rewardFormula: string;
  pickup: { x: number; y: number; z: number };
  dropoff: { x: number; y: number; z: number };
  minLevel: number;
  maxLevel: number;
  enabled: boolean;
}
