# Polarix Dispatch OS v2.0 — FiveM Trucker NUI

A bespoke futuristic-industrial freight dispatch terminal: onyx-void background with a tactical grid, glass panels, industrial amber + cyan telemetry accents, Chakra Petch headings, Inter body, JetBrains Mono for money/coords/VIN.

Two deliverables from one build:
1. A live React preview of the full interface (this project's stack), with rich mock data so every screen looks operational.
2. A `vue-export/` folder containing the same components authored as Vue 3 `<script setup lang="ts">` SFCs + Pinia stores, ready to drop into the `polarix_truckerjob` NUI resource.

## Design system

- Background `#07090E` with a 3% tactical grid overlay + optional scanline layer.
- Panels: `#0F1522/80`, `backdrop-blur-xl`, hairline white/10 borders, deep black shadows.
- Accents: amber/yellow (primary), cyan/blue (telemetry), emerald (nominal), rose (warning).
- Micro-interactions: `active:scale-[0.98]`, amber glow on hover, pulsing status LEDs, animated tab underline.
- Zero default shadcn-looking buttons or generic rounded cards — every control is custom, angular, terminal-grade.

## Screens

- **Command header** — driver badge with LVL/XP bar, tactical tab rail with animated amber underline, server time + weather, cash / company bank counters, convoy dropdown `[3/4]`, notifications bell with badge, close terminal.
- **Dashboard** — hero stat grid (earnings, deliveries, distance, reputation tier), active job spotlight (live ETA, remaining distance, cargo health bar, abort / waypoint), top-3 recommended contracts, convoy member strip.
- **Freight Market** — split layout: filterable/searchable contract list (category, distance, reward, level) on the left; SVG vector map of Los Santos/Blaine County with animated pickup→dropoff route, route breakdown, and the big `ACCEPT CONTRACT & DISPATCH ROUTE` action (swaps to `RENT TRUCK & START` when no truck is owned).
- **Fleet Garage** — trucks/trailers selector, owned-fleet vs dealership toggle, telemetry cards with class tag, bay/equipped badge, gauges (top speed, payload, fuel, engine condition), equip/buy/rent actions.
- **AI Drivers** — slot grid with hired / purchasable / level-locked states, per-slot passive rate and route status, global hourly yield header and `COLLECT ALL PAYOUTS` with neon splash feedback.
- **Skill Matrix** — SVG-connected branching tech tree across six branches, acquired / available / locked node states, tactical hover tooltips with perk percentages.
- **Logistics HQ** — sub-nav (overview, roster, vault, perks, invitations, settings), treasury balance, ledger/P&L chart, roster table with role badges and promote/demote/kick, vault deposit/withdraw modal with presets.
- **Game HUD** — compact floating overlay: pickup→transport→unload step rail, destination + live distance, cargo condition meter, countdown, convoy distances. Toggleable in the preview.
- **Admin Mission Editor** — mission list left, form right (title, cargo type, reward formula, coordinate vectors, level restrictions, map plotting).

## Technical notes

- React preview routes: `/` (terminal, tab-switched), plus a HUD/admin toggle so all surfaces are reachable.
- State: Zustand stores mirroring the Pinia shape one-for-one (`dashboard`, `party`, `notifications`, `gameHud`, `adminMissions`) so the exported Vue stores are a direct translation.
- NUI bridge module: `fetchNui(event, data)` posting to `https://${GetParentResourceName()}/${event}` with a dev fallback, plus a `window.addEventListener('message')` listener that hydrates the stores. All specified callbacks wired: `takeOrder`, `equipVehicle`, `buyVehicle`, `equipTrailer`, `buyTrailer`, `acquireSkill`, `hireDriverSlot`, `createCompany`, `depositCompanyMoney`, `withdrawCompanyMoney`, `sendPartyInvite`, `kickPartyMember`, `leaveParty`, `rentVehicle`, `closeRentalModal`, `closeNui` (also on ESC).
- i18n: `t(...)` wrapper around a locale dictionary for every visible label, same key names in both outputs.
- Fonts loaded via `<link>` in the root route head; all colors as design tokens in `src/styles.css`.
- `vue-export/` mirrors the component list as `.vue` SFCs (`DashboardTab.vue`, `OrdersTab.vue`, `VehiclesTab.vue`, `DriversTab.vue`, `SkillsTab.vue`, `CompanyTab.vue`, `GameHud.vue`, `AdminMissionEditor.vue`) with Pinia stores and the identical Tailwind markup.

## Caveat

The Vue files are generated as source text for your FiveM resource — they are not compiled or run in this preview, so verify them in your own NUI build.
