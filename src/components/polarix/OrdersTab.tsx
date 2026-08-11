import { useMemo, useState } from "react";
import { Clock, Fuel, Search, ShieldAlert, Truck, Weight } from "lucide-react";
import { cn } from "@/lib/utils";
import { t } from "@/nui/i18n";
import { fetchNui } from "@/nui/bridge";
import { useDashboardStore } from "@/stores/dashboard";
import type { CargoCategory, Order } from "@/nui/types";
import { Panel, PanelHeader, TacButton, Tag, money } from "./primitives";

const CATEGORIES: { key: CargoCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "heavy", label: "Heavy" },
  { key: "fragile", label: "Fragile" },
  { key: "highvalue", label: "High-Value" },
  { key: "hazardous", label: "Hazardous" },
  { key: "standard", label: "Standard" },
];

const SORTS = [
  { key: "reward", label: "Reward" },
  { key: "distance", label: "Distance" },
  { key: "level", label: "Level Req" },
] as const;

const hazardTone = (h: Order["hazard"]) =>
  h === "EXTREME" ? "rose" : h === "MEDIUM" ? "amber" : h === "LOW" ? "cyan" : "emerald";

function RouteMap({ order }: { order: Order }) {
  const { pickupCoords: a, dropoffCoords: b } = order;
  const mid = { x: (a.x + b.x) / 2 + 40, y: (a.y + b.y) / 2 - 40 };
  return (
    <svg viewBox="0 0 800 800" className="h-full w-full">
      <defs>
        <linearGradient id="routeGrad" x1="0" x2="1">
          <stop offset="0%" stopColor="rgb(34 211 238)" />
          <stop offset="100%" stopColor="rgb(245 158 11)" />
        </linearGradient>
        <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="800" height="800" fill="url(#mapGrid)" />
      {/* landmass silhouette */}
      <path
        d="M120 150 L300 60 L520 90 L700 200 L740 400 L660 560 L520 700 L340 740 L180 660 L110 470 Z"
        fill="rgba(255,255,255,0.025)"
        stroke="rgba(255,255,255,0.10)"
        strokeWidth="1.5"
      />
      <path
        d="M180 620 L300 560 L420 600 L520 540 L620 560"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />
      <text x="300" y="640" fill="rgba(255,255,255,0.28)" fontSize="15" letterSpacing="4">
        LOS SANTOS
      </text>
      <text x="480" y="210" fill="rgba(255,255,255,0.28)" fontSize="15" letterSpacing="4">
        BLAINE COUNTY
      </text>

      {/* route */}
      <path
        d={`M${a.x} ${a.y} Q ${mid.x} ${mid.y} ${b.x} ${b.y}`}
        fill="none"
        stroke="url(#routeGrad)"
        strokeWidth="3"
        className="route-flow"
      />
      <circle cx={a.x} cy={a.y} r="9" fill="rgb(34 211 238)" opacity="0.25" />
      <circle cx={a.x} cy={a.y} r="4" fill="rgb(34 211 238)" />
      <circle cx={b.x} cy={b.y} r="9" fill="rgb(245 158 11)" opacity="0.25" />
      <circle cx={b.x} cy={b.y} r="4" fill="rgb(245 158 11)" />
      <text x={a.x + 12} y={a.y + 4} fill="rgb(34 211 238)" fontSize="13">
        PICKUP
      </text>
      <text x={b.x + 12} y={b.y + 4} fill="rgb(245 158 11)" fontSize="13">
        DROPOFF
      </text>
      <text
        x={mid.x}
        y={mid.y}
        fill="rgba(255,255,255,0.6)"
        fontSize="14"
        textAnchor="middle"
      >
        {order.distance} km
      </text>
    </svg>
  );
}

export function OrdersTab() {
  const { orders, player, vehiclesOwned } = useDashboardStore();
  const [category, setCategory] = useState<CargoCategory | "all">("all");
  const [sort, setSort] = useState<(typeof SORTS)[number]["key"]>("reward");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string>(orders[0]?.id ?? "");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders
      .filter((o) => (category === "all" ? true : o.category === category))
      .filter((o) =>
        q
          ? [o.cargo, o.pickup, o.dropoff, o.id].some((f) => f.toLowerCase().includes(q))
          : true,
      )
      .sort((a, b) =>
        sort === "reward"
          ? b.reward - a.reward
          : sort === "distance"
            ? a.distance - b.distance
            : a.levelReq - b.levelReq,
      );
  }, [orders, category, query, sort]);

  const selected = filtered.find((o) => o.id === selectedId) ?? filtered[0] ?? null;
  const ownsTruck = vehiclesOwned.length > 0;

  return (
    <div className="grid grid-cols-12 gap-4">
      <Panel className="col-span-12 flex flex-col xl:col-span-5">
        <PanelHeader title={t("nav.orders")} sub={`${filtered.length} ACTIVE CONTRACTS`} />
        <div className="space-y-3 border-b border-white/10 p-4">
          <div className="clip-corner-sm flex items-center gap-2 border border-white/10 bg-white/[0.02] px-3 py-2">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("orders.search")}
              className="w-full bg-transparent text-[12px] text-foreground outline-none placeholder:text-muted-foreground/60"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setCategory(c.key)}
                className={cn(
                  "font-display clip-corner-sm border px-2.5 py-1 text-[10px] tracking-[0.14em] uppercase transition-all duration-150 active:scale-[0.98]",
                  category === c.key
                    ? "border-amber-500/40 bg-amber-500/15 text-amber-300"
                    : "border-white/10 bg-white/[0.02] text-muted-foreground hover:text-foreground",
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="label-caps">Sort</span>
            {SORTS.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setSort(s.key)}
                className={cn(
                  "text-[10px] tracking-[0.14em] uppercase transition-colors",
                  sort === s.key ? "text-cyan-400" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-[calc(100vh-360px)] space-y-2 overflow-y-auto p-3">
          {filtered.length === 0 && (
            <p className="py-10 text-center text-[12px] text-muted-foreground">{t("orders.empty")}</p>
          )}
          {filtered.map((o) => {
            const active = selected?.id === o.id;
            const locked = player.level < o.levelReq;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => setSelectedId(o.id)}
                className={cn(
                  "clip-corner-sm block w-full border p-3 text-left transition-all duration-150 active:scale-[0.99]",
                  active
                    ? "border-amber-500/40 bg-amber-500/[0.07] shadow-[0_0_24px_-14px_rgba(245,158,11,0.9)]"
                    : "border-white/8 bg-white/[0.02] hover:border-white/20",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] text-muted-foreground">{o.id}</p>
                    <h4 className="font-display truncate text-[14px] font-semibold text-foreground">
                      {o.cargo}
                    </h4>
                    <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                      {o.pickup} → {o.dropoff}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[14px] font-semibold text-emerald-400">
                      {money(o.reward)}
                    </p>
                    <p className="font-mono text-[10px] text-cyan-400">+{o.xp} XP</p>
                  </div>
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  <Tag tone={hazardTone(o.hazard)}>{o.category}</Tag>
                  <span className="font-mono inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Weight className="h-3 w-3" />
                    {o.weight} t
                  </span>
                  <span className="font-mono inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Truck className="h-3 w-3" />
                    {o.distance} km
                  </span>
                  <span className="font-mono inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {o.timeLimit}m
                  </span>
                  {locked && <Tag tone="rose">LVL {o.levelReq}</Tag>}
                </div>
              </button>
            );
          })}
        </div>
      </Panel>

      <Panel className="col-span-12 xl:col-span-7" glow="cyan">
        <PanelHeader
          title={t("orders.route")}
          accent="cyan"
          sub={selected ? `CONTRACT ${selected.id}` : "NO CONTRACT SELECTED"}
          right={selected ? <Tag tone={hazardTone(selected.hazard)}>{selected.hazard} HAZARD</Tag> : null}
        />
        {selected ? (
          <div className="p-4">
            <div className="clip-corner-sm scanlines relative h-[380px] overflow-hidden border border-white/8 bg-[#080B12]">
              <RouteMap order={selected} />
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-5">
              <div className="clip-corner-sm border border-white/8 bg-white/[0.02] p-3">
                <p className="label-caps">{t("orders.pickup")}</p>
                <p className="mt-1 text-[12px] text-cyan-300">{selected.pickup}</p>
              </div>
              <div className="clip-corner-sm border border-white/8 bg-white/[0.02] p-3">
                <p className="label-caps">{t("orders.dropoff")}</p>
                <p className="mt-1 text-[12px] text-amber-300">{selected.dropoff}</p>
              </div>
              <div className="clip-corner-sm border border-white/8 bg-white/[0.02] p-3">
                <p className="label-caps inline-flex items-center gap-1">
                  <Fuel className="h-3 w-3" /> {t("orders.fuel")}
                </p>
                <p className="font-mono mt-1 text-[12px] text-foreground">{money(selected.fuelCost)}</p>
              </div>
              <div className="clip-corner-sm border border-white/8 bg-white/[0.02] p-3">
                <p className="label-caps inline-flex items-center gap-1">
                  <ShieldAlert className="h-3 w-3" /> {t("orders.hazard")}
                </p>
                <p className="font-mono mt-1 text-[12px] text-foreground">{selected.hazard}</p>
              </div>
              <div className="clip-corner-sm border border-white/8 bg-white/[0.02] p-3">
                <p className="label-caps">{t("orders.levelReq")}</p>
                <p className="font-mono mt-1 text-[12px] text-foreground">LVL {selected.levelReq}</p>
              </div>
            </div>

            <TacButton
              size="lg"
              className="mt-4 w-full"
              variant={ownsTruck ? "primary" : "cyan"}
              disabled={player.level < selected.levelReq}
              onClick={() =>
                ownsTruck
                  ? fetchNui("takeOrder", { orderId: selected.id })
                  : fetchNui("rentVehicle", { orderId: selected.id })
              }
            >
              {ownsTruck ? t("orders.accept") : t("orders.rent")}
            </TacButton>
          </div>
        ) : (
          <p className="p-10 text-center text-[12px] text-muted-foreground">{t("orders.empty")}</p>
        )}
      </Panel>
    </div>
  );
}
