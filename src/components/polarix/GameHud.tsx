import { Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import { t } from "@/nui/i18n";
import { useGameHudStore } from "@/stores/gameHud";
import { usePartyStore } from "@/stores/party";
import { Meter } from "./primitives";

const STEPS = [t("hud.pickup"), t("hud.transport"), t("hud.unload")];

export function GameHud() {
  const hud = useGameHudStore((s) => s.hudData);
  const party = usePartyStore((s) => s.party);
  if (!hud.visible) return null;

  const mm = String(Math.floor(hud.secondsRemaining / 60)).padStart(2, "0");
  const ss = String(hud.secondsRemaining % 60).padStart(2, "0");

  return (
    <div className="panel-glass clip-corner w-[330px] p-4">
      <div className="flex items-center gap-1.5">
        {STEPS.map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-1.5">
            <span
              className={cn(
                "font-display flex-1 border px-2 py-1 text-center text-[9px] tracking-[0.14em] uppercase",
                i === hud.step
                  ? "border-amber-500/40 bg-amber-500/15 text-amber-300"
                  : i < hud.step
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border-white/10 bg-white/[0.02] text-muted-foreground",
              )}
            >
              {i + 1}. {s}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="label-caps">Destination</p>
          <p className="font-display text-[14px] font-semibold text-foreground">{hud.destination}</p>
        </div>
        <p className="font-mono inline-flex items-center gap-1.5 text-[18px] font-bold text-amber-400">
          <Navigation className="h-4 w-4" />
          {hud.distance.toFixed(1)} km
        </p>
      </div>

      <div className="mt-3 space-y-2">
        <div>
          <div className="flex justify-between">
            <span className="label-caps">Cargo condition</span>
            <span className="font-mono text-[11px] text-emerald-400">
              {hud.cargoCondition}% · PRISTINE
            </span>
          </div>
          <Meter value={hud.cargoCondition} accent="emerald" className="mt-1" />
        </div>
        <div className="flex justify-between">
          <span className="label-caps">Timer</span>
          <span className="font-mono text-[12px] text-foreground">
            {mm}:{ss} {t("hud.remaining")}
          </span>
        </div>
      </div>

      {party.active && (
        <div className="mt-3 border-t border-white/10 pt-2.5">
          <p className="label-caps mb-1.5">Convoy</p>
          {party.members
            .filter((m) => !m.leader)
            .map((m) => (
              <div key={m.id} className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">{m.name}</span>
                <span className="font-mono text-foreground">{m.distanceFromLeader.toFixed(1)} km</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
