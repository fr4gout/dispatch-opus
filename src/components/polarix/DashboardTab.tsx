import { ArrowRight, Ban, Boxes, Gauge, MapPin, Navigation, TrendingUp } from "lucide-react";
import { t } from "@/nui/i18n";
import { fetchNui } from "@/nui/bridge";
import { useDashboardStore } from "@/stores/dashboard";
import { usePartyStore } from "@/stores/party";
import { Meter, Panel, PanelHeader, Stat, StatusDot, TacButton, Tag, money } from "./primitives";

export function DashboardTab({ onOpenOrders }: { onOpenOrders: () => void }) {
  const { player, activeJob, orders } = useDashboardStore();
  const party = usePartyStore((s) => s.party);
  const recommended = [...orders].sort((a, b) => b.reward - a.reward).slice(0, 3);

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Hero stats */}
      <div className="col-span-12 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Panel className="p-5">
          <Stat
            label={t("dash.earnings")}
            value={money(player.totalEarnings)}
            hint={
              <span className="inline-flex items-center gap-1 text-emerald-400">
                <TrendingUp className="h-3 w-3" /> +{player.earningsGrowth}% this week
              </span>
            }
          />
        </Panel>
        <Panel className="p-5">
          <Stat label={t("dash.deliveries")} value={player.deliveries.toString()} accent="cyan" />
          <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1">
            {player.deliveryBreakdown.map((b) => (
              <div key={b.label} className="flex justify-between text-[10px]">
                <span className="text-muted-foreground uppercase">{b.label}</span>
                <span className="font-mono text-foreground">{b.value}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel className="p-5">
          <Stat
            label={t("dash.distance")}
            value={player.distanceKm.toLocaleString("en-US")}
            unit="km"
            accent="emerald"
            hint={<span>Odometer since first haul</span>}
          />
        </Panel>
        <Panel className="p-5">
          <Stat label={t("dash.reputation")} value={player.reputation} />
          <Meter value={player.reputationProgress} className="mt-3" />
          <p className="label-caps mt-1.5">Rookie → Highway Legend</p>
        </Panel>
      </div>

      {/* Active job */}
      <Panel className="col-span-12 xl:col-span-8" glow="amber">
        <PanelHeader
          title={t("dash.activeJob")}
          sub={activeJob ? `CONTRACT ${activeJob.orderId}` : undefined}
          right={activeJob ? <Tag tone="emerald"><StatusDot /> IN TRANSIT</Tag> : <Tag>IDLE</Tag>}
        />
        {activeJob ? (
          <div className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <h3 className="font-display text-2xl font-bold text-foreground">{activeJob.cargo}</h3>
                <div className="mt-2 flex items-center gap-3 text-[12px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                    {activeJob.pickup}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-amber-400" />
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-amber-400" />
                    {activeJob.dropoff}
                  </span>
                </div>
              </div>
              <div className="flex gap-8">
                <Stat label={t("dash.eta")} value={`${activeJob.etaMinutes}m`} accent="cyan" />
                <Stat label={t("dash.remaining")} value={activeJob.remainingKm.toFixed(1)} unit="km" />
                <Stat label="Payout" value={money(activeJob.reward)} accent="emerald" />
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <div className="mb-1.5 flex justify-between">
                  <span className="label-caps">Route progress</span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {(activeJob.totalKm - activeJob.remainingKm).toFixed(1)} / {activeJob.totalKm} km
                  </span>
                </div>
                <Meter
                  value={((activeJob.totalKm - activeJob.remainingKm) / activeJob.totalKm) * 100}
                  accent="cyan"
                />
              </div>
              <div>
                <div className="mb-1.5 flex justify-between">
                  <span className="label-caps">{t("dash.cargoHealth")}</span>
                  <span className="font-mono text-[11px] text-emerald-400">
                    {activeJob.cargoHealth}%
                  </span>
                </div>
                <Meter value={activeJob.cargoHealth} accent="emerald" />
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <TacButton
                variant="primary"
                icon={<Navigation className="h-3.5 w-3.5" />}
                onClick={() => fetchNui("setWaypoint", { orderId: activeJob.orderId })}
              >
                {t("dash.waypoint")}
              </TacButton>
              <TacButton
                variant="danger"
                icon={<Ban className="h-3.5 w-3.5" />}
                onClick={() => fetchNui("abortOrder", { orderId: activeJob.orderId })}
              >
                {t("dash.abort")}
              </TacButton>
            </div>
          </div>
        ) : (
          <div className="p-10 text-center">
            <Boxes className="mx-auto h-8 w-8 text-white/15" />
            <p className="font-display mt-3 text-sm tracking-[0.14em] text-muted-foreground uppercase">
              {t("dash.noJob")}
            </p>
            <p className="mt-1 text-[12px] text-muted-foreground">{t("dash.noJobHint")}</p>
          </div>
        )}
      </Panel>

      {/* Convoy status */}
      <Panel className="col-span-12 xl:col-span-4">
        <PanelHeader title={t("dash.convoy")} accent="cyan" sub={`${party.size}/${party.max} UNITS`} />
        <div className="space-y-2 p-4">
          {party.members.map((m) => (
            <div
              key={m.id}
              className="clip-corner-sm flex items-center gap-3 border border-white/8 bg-white/[0.02] p-3"
            >
              <div className="clip-corner-sm flex h-9 w-9 items-center justify-center border border-cyan-500/30 bg-cyan-500/10">
                <span className="font-display text-[11px] text-cyan-300">
                  {m.name.split(" ").map((p) => p[0]).join("")}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-[12px] text-foreground">{m.name}</span>
                  {m.leader && <Tag tone="amber">LEAD</Tag>}
                </div>
                <p className="truncate text-[10px] text-muted-foreground">{m.cargo}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[11px] text-foreground">
                  {m.distanceFromLeader.toFixed(1)} km
                </p>
                <p className={`text-[9px] uppercase ${m.ready ? "text-emerald-400" : "text-amber-400"}`}>
                  {m.ready ? "READY" : "LAGGING"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Recommended contracts */}
      <Panel className="col-span-12">
        <PanelHeader
          title={t("dash.recommended")}
          sub="TOP PAYOUT · LIVE FEED"
          right={
            <TacButton size="sm" variant="ghost" onClick={onOpenOrders}>
              Open freight market
            </TacButton>
          }
        />
        <div className="grid gap-4 p-4 lg:grid-cols-3">
          {recommended.map((o) => (
            <div
              key={o.id}
              className="clip-corner-sm group relative border border-white/8 bg-white/[0.02] p-4 transition-all duration-150 hover:border-amber-500/30"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-[10px] text-muted-foreground">{o.id}</p>
                  <h4 className="font-display mt-0.5 text-[15px] font-semibold text-foreground">
                    {o.cargo}
                  </h4>
                </div>
                <Tag tone="amber">{o.category}</Tag>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div>
                  <p className="label-caps">Reward</p>
                  <p className="font-mono text-[13px] text-emerald-400">{money(o.reward)}</p>
                </div>
                <div>
                  <p className="label-caps">Distance</p>
                  <p className="font-mono text-[13px] text-foreground">{o.distance} km</p>
                </div>
                <div>
                  <p className="label-caps">XP</p>
                  <p className="font-mono text-[13px] text-cyan-400">+{o.xp}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
                <Gauge className="h-3 w-3 text-amber-400" /> {o.weight} t · {o.timeLimit}m limit
              </div>
              <TacButton
                className="mt-4 w-full"
                onClick={() => fetchNui("takeOrder", { orderId: o.id })}
              >
                {t("dash.dispatch")}
              </TacButton>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
