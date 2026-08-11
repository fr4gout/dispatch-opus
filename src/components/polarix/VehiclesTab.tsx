import { useState } from "react";
import { BatteryCharging, Container, Fuel, Truck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { t } from "@/nui/i18n";
import { fetchNui } from "@/nui/bridge";
import { useDashboardStore } from "@/stores/dashboard";
import type { Vehicle } from "@/nui/types";
import { Meter, Panel, PanelHeader, TacButton, Tag, money } from "./primitives";

function GaugeRow({
  icon,
  label,
  value,
  display,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  display: string;
  accent: "amber" | "cyan" | "emerald";
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="label-caps inline-flex items-center gap-1.5">
          {icon}
          {label}
        </span>
        <span className="font-mono text-[11px] text-foreground">{display}</span>
      </div>
      <Meter value={value} accent={accent} />
    </div>
  );
}

function VehicleCard({ v, mode }: { v: Vehicle; mode: "fleet" | "shop" }) {
  const isTruck = v.kind === "truck";
  return (
    <div
      className={cn(
        "clip-corner relative border bg-white/[0.02] p-4 transition-all duration-150",
        v.equipped
          ? "border-amber-500/40 shadow-[0_0_36px_-18px_rgba(245,158,11,0.9)]"
          : "border-white/8 hover:border-white/20",
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] text-muted-foreground">{v.vin}</p>
          <h4 className="font-display text-[16px] font-bold text-foreground">{v.name}</h4>
          <p className="label-caps mt-0.5">{v.classTag}</p>
        </div>
        {v.equipped ? (
          <Tag tone="amber">IN BAY {v.slot} / EQUIPPED</Tag>
        ) : (
          <Tag tone="muted">SLOT {v.slot}</Tag>
        )}
      </div>

      <div className="clip-corner-sm mt-3 flex h-24 items-center justify-center border border-white/8 bg-gradient-to-br from-white/[0.05] to-transparent">
        {isTruck ? (
          <Truck className="h-10 w-10 text-white/20" />
        ) : (
          <Container className="h-10 w-10 text-white/20" />
        )}
      </div>

      <div className="mt-4 space-y-2.5">
        {isTruck && (
          <GaugeRow
            icon={<Zap className="h-3 w-3 text-amber-400" />}
            label={t("veh.topSpeed")}
            value={(v.topSpeed / 200) * 100}
            display={`${v.topSpeed} km/h`}
            accent="amber"
          />
        )}
        <GaugeRow
          icon={<Container className="h-3 w-3 text-cyan-400" />}
          label={t("veh.payload")}
          value={(v.payload / 50) * 100}
          display={`${v.payload} t`}
          accent="cyan"
        />
        {isTruck && (
          <GaugeRow
            icon={<Fuel className="h-3 w-3 text-cyan-400" />}
            label={t("veh.fuel")}
            value={(v.fuel / 500) * 100}
            display={`${v.fuel} L`}
            accent="cyan"
          />
        )}
        <GaugeRow
          icon={<BatteryCharging className="h-3 w-3 text-emerald-400" />}
          label={t("veh.condition")}
          value={v.condition}
          display={`${v.condition}%`}
          accent="emerald"
        />
      </div>

      <div className="mt-4 flex gap-2">
        {mode === "fleet" ? (
          <TacButton
            className="flex-1"
            variant={v.equipped ? "muted" : "primary"}
            disabled={v.equipped}
            onClick={() =>
              fetchNui(isTruck ? "equipVehicle" : "equipTrailer", { slot: v.slot })
            }
          >
            {v.equipped ? t("veh.equipped") : `${t("veh.equip")} ${isTruck ? "Truck" : "Trailer"}`}
          </TacButton>
        ) : (
          <>
            <TacButton
              className="flex-1"
              onClick={() => fetchNui(isTruck ? "buyVehicle" : "buyTrailer", { slot: v.slot })}
            >
              {t("veh.buy")} {money(v.price)}
            </TacButton>
            {isTruck && (
              <TacButton
                variant="ghost"
                onClick={() => fetchNui("rentVehicle", { slot: v.slot })}
              >
                {t("veh.rent")} {money(v.rentPrice)}
              </TacButton>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function VehiclesTab() {
  const { vehiclesOwned, vehiclesShop, trailersOwned, trailerShop } = useDashboardStore();
  const [kind, setKind] = useState<"truck" | "trailer">("truck");
  const [mode, setMode] = useState<"fleet" | "shop">("fleet");

  const list =
    kind === "truck"
      ? mode === "fleet"
        ? vehiclesOwned
        : vehiclesShop
      : mode === "fleet"
        ? trailersOwned
        : trailerShop;

  const Toggle = ({
    options,
    value,
    onChange,
  }: {
    options: { key: string; label: string }[];
    value: string;
    onChange: (k: string) => void;
  }) => (
    <div className="clip-corner-sm flex border border-white/10 bg-white/[0.02] p-0.5">
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          onClick={() => onChange(o.key)}
          className={cn(
            "font-display px-4 py-1.5 text-[10px] tracking-[0.16em] uppercase transition-all duration-150 active:scale-[0.98]",
            value === o.key
              ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-[#0b0d13] font-semibold"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );

  return (
    <Panel>
      <PanelHeader
        title={t("nav.vehicles")}
        sub={`${list.length} UNITS · ${mode === "fleet" ? "OWNED" : "COMMERCIAL DEALERSHIP"}`}
        right={
          <div className="flex gap-2">
            <Toggle
              options={[
                { key: "truck", label: t("veh.trucks") },
                { key: "trailer", label: t("veh.trailers") },
              ]}
              value={kind}
              onChange={(k) => setKind(k as "truck" | "trailer")}
            />
            <Toggle
              options={[
                { key: "fleet", label: t("veh.fleet") },
                { key: "shop", label: t("veh.shop") },
              ]}
              value={mode}
              onChange={(k) => setMode(k as "fleet" | "shop")}
            />
          </div>
        }
      />
      <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map((v) => (
          <VehicleCard key={`${v.kind}-${v.slot}`} v={v} mode={mode} />
        ))}
      </div>
    </Panel>
  );
}
