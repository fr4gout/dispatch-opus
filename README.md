# Polaris Dispatch OS

# TASK: Complete Redesign of FiveM Trucker Job NUI Frontend ("Polarix Dispatch OS v2.0")

You are a world-class Lead UI/UX Engineer and Game HUD Designer. You are tasked with completely redesigning the frontend NUI interface for a FiveM GTA V Trucker & Freight Logistics script named "polarix_truckerjob".

### CORE OBJECTIVE & DESIGN PHILOSOPHY

Destroy the "generic AI boilerplate look" (no standard dark rounded boxes with blue glow buttons). Instead, build a bespoke, hyper-polished, futuristic-industrial Freight Dispatch Terminal & Fleet Command OS. The UI should look like a $100M AAA game interface (Euro Truck Simulator 2 meets Cyberpunk 2077 Telemetry & Vercel-grade Dark Glassmorphism).

---

## 1. TECH STACK & ARCHITECTURE RULES

- **Framework**: Vue 3 (Composition API `<script setup lang="ts">`) + Tailwind CSS + Pinia Stores + Lucide / Tabler Icons.

- **Environment**: FiveM NUI (National User Interface).

- **NUI Communication Structure**:

  - **Lua to NUI**: Handled via `window.addEventListener('message', ...)` or NUI listener updating Pinia stores.

  - **NUI to Lua**: Handled via asynchronous callbacks `fetch(`https://${GetParentResourceName()}/${eventName}`, { method: 'POST', body: JSON.stringify(data) })`.

- **i18n Support**: Retain translation wrapper `$t(...)` compatibility for all labels.

---

## 2. DESIGN SYSTEM & VISUAL STYLE GUIDE

### Color Palette (Tailwind Tokens & CSS Variables)

- **Background**: `bg-[#07090E]` (Onyx Void with 3% tactical grid overlay).

- **Card Panels**: `bg-[#0F1522]/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/60`.

- **Primary Accent (Industrial Amber)**: `from-amber-500 to-yellow-400 text-amber-400 border-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]`.

- **Secondary Accent (Cyan Telemetry)**: `from-cyan-500 to-blue-500 text-cyan-400 border-cyan-500/30`.

- **Status Emerald**: `text-emerald-400 bg-emerald-500/10 border-emerald-500/30`.

- **Warning Crimson**: `text-rose-400 bg-rose-500/10 border-rose-500/30`.

### Typography Pairings

- **Headings & Telemetry Numbers**: `'Chakra Petch', 'Rajdhani', sans-serif` (Tactical, bold, angular).

- **Body & Data Labels**: `'Inter', 'Plus Jakarta Sans', sans-serif` (Ultra-crisp UI sans).

- **Coordinates / Currency / VIN Codes**: `'JetBrains Mono', monospace`.

### Textures & Micro-Interactions

- Subtle scanline overlay option (`pointer-events-none opacity-20`).

- Tactile hover sound-effect triggers or visual press scale (`active:scale-[0.98] transition-all duration-150`).

- Glowing neon status indicators (`animate-pulse`).

---

## 3. LAYOUT & SCREEN BREAKDOWN

### A. Top Command Dispatch Header

- **Left**: Company / Driver Logo Badge with Level Badge (e.g. `LVL 24 - MASTER HAULER`), XP Progress bar ring/bar.

- **Center**: Tactical Navigation Tabs (Dashboard, Freight Market, Fleet Garage, AI Drivers, Skill Matrix, Logistics HQ, History, Leaderboard). Tab indicators feature active amber neon bottom bar with smooth layout animation.

- **Right**:

  - Live Server Time & Weather Telemetry.

  - Quick Money Counter (Personal Cash + Company Bank preview).

  - Convoy / Party Quick Dropdown Button (shows party size `[3/4]`, convoy status, invite button).

  - Notifications Bell icon with badge counter.

  - Close Terminal (`ESC` / `[X]`) button.

### B. Dashboard Overview Tab (`DashboardTab.vue`)

- **Hero Stats Carousel/Grid**:

  - Total Earnings (with growth indicator).

  - Completed Deliveries (with breakdown of cargo types).

  - Total Distance Driven in km.

  - Driver Reputation Rank Tier (Rookie $\rightarrow$ Highway Legend).

- **Active Job Spotlight**: If an order is currently active, show a high-tech job card with live ETA, remaining distance countdown, cargo health bar (%), and "Abort Contract" or "View Waypoint" actions.

- **Quick Freight Market Preview**: TOP 3 recommended high-payout orders with instant "Dispatch Route" buttons.

- **Convoy Status Bar**: Live party member widgets showing friend avatars, current distance from leader, and convoy readiness.

### C. Freight Market / Orders Dispatch Tab (`OrdersTab.vue`)

- **Split Layout (List & Interactive Map Terminal)**:

  - **Left (Contracts List)**: Filter by Cargo Category (Heavy, Fragile, High-Value, Hazardous), Distance, Reward, Level Req. Search bar.

  - **Contract Cards**: Show cargo icon, cargo name, weight (e.g. `24.5 t`), distance (`42.8 km`), reward (`$18,400`), XP payout (`+450 XP`), time limit (`35m`), pickup/dropoff city labels.

  - **Right (Route Planner & Vector Map)**:

    - Interactive 2D vector map displaying Los Santos & Blaine County route preview.

    - Animated line connecting Pickup Coordinate to Dropoff Coordinate with distance markers.

    - Route Breakdown Panel: Pickup location, Dropoff location, Estimated Fuel Cost, Cargo Hazard Level, Minimum Level Requirement.

    - Large Action Button: **"ACCEPT CONTRACT & DISPATCH ROUTE"** (or **"RENT TRUCK & START"** if player owns no truck).

### D. Fleet Garage & Trailers Shop Tab (`VehiclesTab.vue`)

- **Dual Category Selector**: Trucks vs. Trailers.

- **Garage Toggle**: "My Fleet (Owned)" vs. "Commercial Dealership (Shop)".

- **Vehicle Telemetry Card**:

  - High-res vehicle card with class tag (`Class 8 Heavy Duty`), slot identifier, and equipped indicator badge ("IN BAY 1 / EQUIPPED").

  - Circular or visual bar telemetry gauges: Top Speed (`160 km/h`), Max Payload (`35 t`), Fuel Tank (`400 L`), Engine Condition.

  - Actions: **"EQUIP TRUCK"**, **"BUY VEHICLE ($120,000)"**, or **"RENT VEHICLE ($1,500/job)"**.

### E. AI Driver Operations Tab (`DriversTab.vue`)

- **Fleet Command Passive Income Manager**:

  - Grid of Driver Slots (Slot 1 to Slot N).

  - Slot states:

    - **Hired Slot**: AI driver avatar, assigned vehicle model, passive earnings rate (`+$450/hr`), status ("ON ROUTE - DELIVERING LUMBER").

    - **Purchasable Slot**: Unlocked slot available for hire (`$25,000`), income preview.

    - **Locked Slot**: Locked by driver level requirement (`Requires Lvl 15`).

  - Global Header: Total Passive Hourly Yield, **"COLLECT ALL PAYOUTS"** button with neon splash feedback.

### F. Interactive Skill Matrix Tab (`SkillsTab.vue`)

- **Visual Tech-Tree Layout**:

  - Skill Branches: Long Distance, Heavy Weight, Fragile Cargo, High Value, Eco Driving, Just-in-Time Delivery.

  - Nodes arranged in a interconnected branching grid with SVG glow connector lines.

  - Node States:

    - **Acquired**: Glowing Amber background with checkmark badge.

    - **Available**: Glowing Cyan border with pulsing "Unlock ($1 Skill Point)" button.

    - **Locked**: Semi-transparent dark opacity with padlock icon and requirement tooltip.

  - Hovering node displays a detailed tactical tooltip with perk percentages (e.g. `+18% Payout on Fragile Goods`).

### G. Logistics Corporation HQ Tab (`CompanyTab.vue`)

- **Tab Sub-Navigation**: Overview, Member Roster, Vault Bank, Company Perks, Invitations, Settings.

- **Executive Dashboard**:

  - Company Banner, Rank Tier, Total Treasury Vault Balance.

  - Financial Ledger & P&L chart preview (Weekly Payouts, Cargo Volume).

  - **Member Roster Table**: Member name, Role badge (Owner, Dispatcher, Senior Driver, Recruit), Total Contribution ($), Online Status, Actions (Promote, Demote, Kick).

  - **Company Vault Manager**: Interactive Deposit & Withdraw modal with quick preset buttons ($5k, $25k, $100k, Custom).

### H. In-Game Delivery HUD (`GameHud.vue`)

- **Position**: Bottom-right or top-center floating HUD (clean, compact, zero obstructiveness).

- **Components**:

  - Waypoint Step Indicator: `[1. PICKUP] ➔ [2. TRANSPORT] ➔ [3. UNLOAD]`.

  - Destination Label & Live Distance Gauge (`1.4 km`).

  - Cargo Condition Meter (`98% - PRISTINE`).

  - Timer Countdown (`14:32 remaining`).

  - Party Member Distance list for convoy driving.

### I. Admin Mission Editor (`AdminMissionEditor.vue`)

- Sleek dark admin studio layout.

- List of current custom missions on the left.

- Form controls on the right for mission title, cargo type, reward formula, pickup/dropoff coordinate vector inputs, level restrictions, and map waypoint plotting.

---

## 4. PINIA STORES & DATA BINDINGS TO PRESERVE

Ensure all new UI components map directly to the existing Pinia stores without breaking state logic:

- `useDashboardStore()`: `orders`, `vehiclesOwned`, `vehiclesShop`, `trailersOwned`, `trailerShop`, `skillBranches`, `driverSlots`, `companyData`, `leaderboard`, `history`.

- `usePartyStore()`: `party`, `invitations`.

- `useNotificationsStore()`: `notifications`.

- `useGameHudStore()`: `hudData`.

- `useAdminMissionsStore()`: `missions`, `selectedMission`.

---

## 5. NUI CALLBACK EVENTS TO BIND

Ensure button click handlers fire the correct FiveM NUI Callbacks:

- `takeOrder` $\rightarrow$ `{ orderId }`

- `equipVehicle` / `buyVehicle` $\rightarrow$ `{ slot }`

- `equipTrailer` / `buyTrailer` $\rightarrow$ `{ slot }`

- `acquireSkill` $\rightarrow$ `{ skillId }`

- `hireDriverSlot` $\rightarrow$ `{ slot }`

- `createCompany` / `depositCompanyMoney` / `withdrawCompanyMoney`

- `sendPartyInvite` / `kickPartyMember` / `leaveParty`

- `rentVehicle` / `closeRentalModal`

- `closeNui` (on ESC key press or Close button).

---

## OUTPUT EXPECTATIONS

Generate clean, modular Vue 3 single-file components (`.vue`) using Tailwind CSS and TypeScript. Prioritize extreme visual excellence, glassmorphism, responsive grid layouts, and high-tech industrial aesthetics.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f32206b0-d781-46d8-92b6-b9dc4d3f6edd).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
