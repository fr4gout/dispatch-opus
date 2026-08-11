import { useState } from "react";
import { Lock, Plus, UserRound, Wallet } from "lucide-react";
import { t } from "@/nui/i18n";
import { fetchNui } from "@/nui/bridge";
import { useDashboardStore } from "@/stores/dashboard";
import { Meter, Panel, PanelHeader, StatusDot, TacButton, Tag, money } from "./primitives";

export function DriversTab() {
  const { driverSlots, player } = useDashboardStore();
  const [splash, setSplash] = useState(false);

  const totalYield = driverSlots
    .filter((s) => s.state === "hired")
    .reduce((sum, s) => sum + (s.ratePerHour ?? 0), 0);
  const pending = driverSlots.reduce((sum, s) => sum + (s.pending ?? 0), 0);

  const collect = () => {
    setSplash(true);
    fetchNui("collectDriverPayouts", {});
    window.setTimeout(() => setSplash(false), 700);
  };

  return (
    <Panel>
      <PanelHeader
        title={t("nav.drivers")}
        sub="FLEET COMMAND · PASSIVE OPERATIONS"
        right={
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="label-caps">{t("drivers.yield")}</p>
              <p className="font-mono text-[14px] font-semibold text-amber-400">
                {money(totalYield)}/hr
              </p>
            </div>
            <div className="relative">
              <TacButton icon={<Wallet className="h-3.5 w-3.5" />} onClick={collect}>
                {t("drivers.collect")} · {money(pending)}
              </TacButton>
              {splash && (
                <span className="splash pointer-events-none absolute inset-0 bg-amber-400/40 blur-md" />
              )}
            </div>
          </div>
        }
      />
      <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
        {driverSlots.map((slot) => {
          if (slot.state === "hired") {
            return (
              <div
                key={slot.slot}
                className="clip-corner border border-white/8 bg-white/[0.02] p-4 transition-all duration-150 hover:border-amber-500/25"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="clip-corner-sm flex h-11 w-11 items-center justify-center border border-amber-500/30 bg-amber-500/10">
                      <UserRound className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-display text-[14px] font-semibold text-foreground">
                        {slot.driverName}
                      </h4>
                      <p className="label-caps mt-0.5">{slot.vehicle}</p>
                    </div>
                  </div>
                  <Tag tone="emerald">
                    <StatusDot /> ACTIVE
                  </Tag>
                </div>

                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[10px] tracking-[0.14em] text-cyan-300 uppercase">
                      {slot.status}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {slot.progress}%
                    </span>
                  </div>
                  <Meter value={slot.progress ?? 0} accent="cyan" />
                </div>

                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="label-caps">Rate</p>
                    <p className="font-mono text-[15px] font-semibold text-emerald-400">
                      +{money(slot.ratePerHour ?? 0)}/hr
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="label-caps">Pending</p>
                    <p className="font-mono text-[13px] text-amber-400">{money(slot.pending ?? 0)}</p>
                  </div>
                </div>
              </div>
            );
          }
          if (slot.state === "purchasable") {
            return (
              <div
                key={slot.slot}
                className="clip-corner flex flex-col items-center justify-center border border-dashed border-cyan-500/25 bg-cyan-500/[0.03] p-6 text-center"
              >
                <div className="clip-corner-sm flex h-11 w-11 items-center justify-center border border-cyan-500/30 bg-cyan-500/10">
                  <Plus className="h-5 w-5 text-cyan-400" />
                </div>
                <p className="font-display mt-3 text-[13px] tracking-[0.14em] text-foreground uppercase">
                  Slot {slot.slot} available
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Projected income{" "}
                  <span className="font-mono text-emerald-400">
                    +{money(slot.incomePreview ?? 0)}/hr
                  </span>
                </p>
                <TacButton
                  variant="cyan"
                  className="mt-4"
                  onClick={() => fetchNui("hireDriverSlot", { slot: slot.slot })}
                >
                  {t("drivers.hire")} · {money(slot.price ?? 0)}
                </TacButton>
              </div>
            );
          }
          return (
            <div
              key={slot.slot}
              className="clip-corner flex flex-col items-center justify-center border border-white/8 bg-black/30 p-6 text-center opacity-60"
            >
              <Lock className="h-6 w-6 text-white/25" />
              <p className="font-display mt-3 text-[13px] tracking-[0.14em] text-muted-foreground uppercase">
                Slot {slot.slot} locked
              </p>
              <p className="mt-1 text-[11px] text-rose-400">
                {t("drivers.locked")} {slot.levelReq} · you are LVL {player.level}
              </p>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
