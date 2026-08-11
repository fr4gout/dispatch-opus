import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Monitor, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchNui, onNuiMessage } from "@/nui/bridge";
import { useDashboardStore } from "@/stores/dashboard";
import { useGameHudStore } from "@/stores/gameHud";
import { usePartyStore } from "@/stores/party";
import { useNotificationsStore } from "@/stores/notifications";
import { useAdminMissionsStore } from "@/stores/adminMissions";
import { CommandHeader, type TabKey } from "@/components/polarix/CommandHeader";
import { DashboardTab } from "@/components/polarix/DashboardTab";
import { OrdersTab } from "@/components/polarix/OrdersTab";
import { VehiclesTab } from "@/components/polarix/VehiclesTab";
import { DriversTab } from "@/components/polarix/DriversTab";
import { SkillsTab } from "@/components/polarix/SkillsTab";
import { CompanyTab } from "@/components/polarix/CompanyTab";
import { HistoryTab, LeaderboardTab } from "@/components/polarix/HistoryLeaderboard";
import { GameHud } from "@/components/polarix/GameHud";
import { AdminMissionEditor } from "@/components/polarix/AdminMissionEditor";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Polarix Dispatch OS — FiveM Trucker Terminal" },
      {
        name: "description",
        content:
          "Futuristic freight dispatch terminal for the polarix_truckerjob FiveM resource: contracts, fleet garage, AI drivers, skill matrix and convoy HUD.",
      },
      { property: "og:title", content: "Polarix Dispatch OS — FiveM Trucker Terminal" },
      {
        property: "og:description",
        content:
          "Industrial-glass NUI for freight contracts, fleet telemetry, AI driver income and convoy operations.",
      },
    ],
  }),
  component: Terminal,
});

function Terminal() {
  const [tab, setTab] = useState<TabKey>("dashboard");
  const [view, setView] = useState<"terminal" | "admin">("terminal");
  const [hudOn, setHudOn] = useState(true);

  const hydrateDashboard = useDashboardStore((s) => s.hydrate);
  const hydrateParty = usePartyStore((s) => s.hydrate);
  const hydrateNotifications = useNotificationsStore((s) => s.hydrate);
  const setHudData = useGameHudStore((s) => s.setHudData);
  const hydrateMissions = useAdminMissionsStore((s) => s.hydrate);

  // Lua -> NUI
  useEffect(() => {
    return onNuiMessage(({ action, data }) => {
      const payload = (data ?? {}) as Record<string, unknown>;
      switch (action) {
        case "setData":
        case "updateDashboard":
          hydrateDashboard(payload);
          break;
        case "updateParty":
          hydrateParty(payload);
          break;
        case "updateNotifications":
          hydrateNotifications(payload);
          break;
        case "updateHud":
          setHudData(payload);
          break;
        case "updateMissions":
          hydrateMissions(payload);
          break;
        default:
          break;
      }
    });
  }, [hydrateDashboard, hydrateParty, hydrateNotifications, setHudData, hydrateMissions]);

  // ESC closes the terminal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") fetchNui("closeNui", {});
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="tac-grid relative min-h-screen bg-[#07090E] text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(245,158,11,0.10),transparent)]" />

      <CommandHeader tab={tab} onTab={setTab} />

      <main className="relative px-6 py-5">
        {view === "terminal" ? (
          <>
            {tab === "dashboard" && <DashboardTab onOpenOrders={() => setTab("orders")} />}
            {tab === "orders" && <OrdersTab />}
            {tab === "vehicles" && <VehiclesTab />}
            {tab === "drivers" && <DriversTab />}
            {tab === "skills" && <SkillsTab />}
            {tab === "company" && <CompanyTab />}
            {tab === "history" && <HistoryTab />}
            {tab === "leaderboard" && <LeaderboardTab />}
          </>
        ) : (
          <AdminMissionEditor />
        )}
      </main>

      {/* Preview-only surface switchers */}
      <div className="fixed bottom-5 left-5 z-40 flex gap-2">
        {[
          { key: "terminal", label: "Terminal", icon: Monitor },
          { key: "admin", label: "Admin Editor", icon: Shield },
        ].map((v) => (
          <button
            key={v.key}
            type="button"
            onClick={() => setView(v.key as "terminal" | "admin")}
            className={cn(
              "font-display clip-corner-sm inline-flex items-center gap-2 border px-3 py-2 text-[10px] tracking-[0.16em] uppercase transition-all duration-150 active:scale-[0.98]",
              view === v.key
                ? "border-amber-500/40 bg-amber-500/15 text-amber-300"
                : "border-white/10 bg-white/[0.03] text-muted-foreground hover:text-foreground",
            )}
          >
            <v.icon className="h-3.5 w-3.5" />
            {v.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setHudOn((s) => !s)}
          className={cn(
            "font-display clip-corner-sm border px-3 py-2 text-[10px] tracking-[0.16em] uppercase transition-all duration-150 active:scale-[0.98]",
            hudOn
              ? "border-cyan-500/40 bg-cyan-500/15 text-cyan-300"
              : "border-white/10 bg-white/[0.03] text-muted-foreground",
          )}
        >
          Delivery HUD
        </button>
      </div>

      {hudOn && (
        <div className="fixed right-5 bottom-5 z-40">
          <GameHud />
        </div>
      )}
    </div>
  );
}
