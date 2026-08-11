import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  ChevronDown,
  CloudSun,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { t } from "@/nui/i18n";
import { fetchNui } from "@/nui/bridge";
import { useDashboardStore } from "@/stores/dashboard";
import { usePartyStore } from "@/stores/party";
import { useNotificationsStore } from "@/stores/notifications";
import { Meter, StatusDot, TacButton, Tag, money } from "./primitives";

export type TabKey =
  | "dashboard"
  | "orders"
  | "vehicles"
  | "drivers"
  | "skills"
  | "company"
  | "history"
  | "leaderboard";

const TABS: { key: TabKey; label: string }[] = [
  { key: "dashboard", label: t("nav.dashboard") },
  { key: "orders", label: t("nav.orders") },
  { key: "vehicles", label: t("nav.vehicles") },
  { key: "drivers", label: t("nav.drivers") },
  { key: "skills", label: t("nav.skills") },
  { key: "company", label: t("nav.company") },
  { key: "history", label: t("nav.history") },
  { key: "leaderboard", label: t("nav.leaderboard") },
];

function Clock() {
  const [now, setNow] = useState<string>("--:--:--");
  useEffect(() => {
    const tick = () =>
      setNow(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="font-mono text-[13px] text-foreground tabular-nums">{now}</span>;
}

export function CommandHeader({
  tab,
  onTab,
}: {
  tab: TabKey;
  onTab: (t: TabKey) => void;
}) {
  const player = useDashboardStore((s) => s.player);
  const { party, invitations } = usePartyStore();
  const notifications = useNotificationsStore((s) => s.notifications);
  const markAllRead = useNotificationsStore((s) => s.markAllRead);
  const [openMenu, setOpenMenu] = useState<"convoy" | "bell" | null>(null);

  const unread = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);
  const xpPct = (player.xp / player.xpMax) * 100;

  return (
    <header className="relative z-30 border-b border-white/10 bg-[#0B0F18]/85 backdrop-blur-xl">
      <div className="flex items-stretch justify-between gap-6 px-6 py-3">
        {/* Left — identity */}
        <div className="flex min-w-[260px] items-center gap-3">
          <div className="clip-corner-sm relative flex h-12 w-12 items-center justify-center border border-amber-500/40 bg-gradient-to-br from-amber-500/25 to-transparent">
            <span className="font-display text-lg font-bold text-amber-400">PX</span>
            <span className="absolute -right-1 -bottom-1 h-2 w-2 bg-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-[13px] font-semibold tracking-[0.14em] text-foreground">
                {player.name}
              </span>
              <Tag tone="amber">LVL {player.level}</Tag>
            </div>
            <p className="label-caps mt-0.5">{player.rank}</p>
            <div className="mt-1.5 flex items-center gap-2">
              <Meter value={xpPct} className="w-32" />
              <span className="font-mono text-[10px] text-muted-foreground">
                {player.xp}/{player.xpMax}
              </span>
            </div>
          </div>
        </div>

        {/* Center — tactical tabs */}
        <nav className="flex flex-1 items-end justify-center">
          <div className="flex items-end gap-1">
            {TABS.map((item) => {
              const active = item.key === tab;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onTab(item.key)}
                  className={cn(
                    "font-display relative px-3.5 pt-2 pb-3 text-[11px] tracking-[0.16em] uppercase transition-colors duration-150",
                    active
                      ? "text-amber-400"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute inset-x-1 -bottom-[13px] h-[2px] transition-all duration-300",
                      active
                        ? "bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.9)] opacity-100"
                        : "bg-amber-400/0 opacity-0",
                    )}
                  />
                </button>
              );
            })}
          </div>
        </nav>

        {/* Right — telemetry & actions */}
        <div className="flex items-center gap-4">
          <div className="hidden text-right lg:block">
            <div className="flex items-center justify-end gap-2">
              <CloudSun className="h-3.5 w-3.5 text-cyan-400" />
              <span className="label-caps">CLEAR · 21°C</span>
            </div>
            <Clock />
          </div>

          <div className="clip-corner-sm border border-white/10 bg-white/[0.03] px-3 py-1.5 text-right">
            <p className="label-caps">{t("header.cash")}</p>
            <p className="font-mono text-[13px] font-semibold text-emerald-400">
              {money(player.cash)}
            </p>
            <p className="font-mono text-[10px] text-muted-foreground">
              BANK {money(player.bank)}
            </p>
          </div>

          {/* Convoy */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === "convoy" ? null : "convoy")}
              className="clip-corner-sm flex items-center gap-2 border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-cyan-300 transition-all duration-150 active:scale-[0.98] hover:bg-cyan-500/20"
            >
              <Users className="h-3.5 w-3.5" />
              <span className="font-display text-[11px] tracking-[0.14em]">
                [{party.size}/{party.max}]
              </span>
              <ChevronDown className="h-3 w-3" />
            </button>
            {openMenu === "convoy" && (
              <div className="panel-glass clip-corner absolute right-0 z-50 mt-2 w-72 p-3">
                <p className="label-caps mb-2">{t("header.convoy")}</p>
                <div className="space-y-2">
                  {party.members.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between border border-white/8 bg-white/[0.02] px-2.5 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <StatusDot tone={m.ready ? "emerald" : "amber"} />
                        <span className="text-[11px] text-foreground">{m.name}</span>
                        {m.leader && <Tag tone="amber">LEAD</Tag>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {m.distanceFromLeader.toFixed(1)} km
                        </span>
                        {!m.leader && (
                          <button
                            type="button"
                            onClick={() => fetchNui("kickPartyMember", { memberId: m.id })}
                            className="text-rose-400/70 transition-colors hover:text-rose-400"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {invitations.length > 0 && (
                  <div className="mt-3 border-t border-white/10 pt-3">
                    <p className="label-caps mb-2">Pending invites</p>
                    {invitations.map((inv) => (
                      <div key={inv.id} className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">
                          {inv.from} · {inv.convoy}
                        </span>
                        <TacButton
                          size="sm"
                          variant="ghost"
                          onClick={() => fetchNui("sendPartyInvite", { target: inv.from })}
                        >
                          Accept
                        </TacButton>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-3 flex gap-2">
                  <TacButton
                    size="sm"
                    variant="cyan"
                    className="flex-1"
                    onClick={() => fetchNui("sendPartyInvite", {})}
                  >
                    Invite
                  </TacButton>
                  <TacButton
                    size="sm"
                    variant="danger"
                    className="flex-1"
                    onClick={() => fetchNui("leaveParty", {})}
                  >
                    Leave
                  </TacButton>
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setOpenMenu(openMenu === "bell" ? null : "bell");
                markAllRead();
              }}
              className="clip-corner-sm relative border border-white/10 bg-white/[0.03] p-2 text-muted-foreground transition-all duration-150 active:scale-[0.98] hover:border-amber-500/40 hover:text-amber-300"
            >
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <span className="font-mono absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center bg-amber-400 px-1 text-[9px] font-bold text-[#0b0d13]">
                  {unread}
                </span>
              )}
            </button>
            {openMenu === "bell" && (
              <div className="panel-glass clip-corner absolute right-0 z-50 mt-2 w-80 p-3">
                <p className="label-caps mb-2">{t("header.notifications")}</p>
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="border-l-2 border-white/10 bg-white/[0.02] py-2 pl-3"
                      style={{
                        borderLeftColor:
                          n.level === "success"
                            ? "rgb(52 211 153)"
                            : n.level === "warning"
                              ? "rgb(251 113 133)"
                              : "rgb(34 211 238)",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-foreground">{n.title}</span>
                        <span className="font-mono text-[10px] text-muted-foreground">{n.time}</span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{n.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => fetchNui("closeNui", {})}
            className="clip-corner-sm border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-rose-300 transition-all duration-150 active:scale-[0.98] hover:bg-rose-500/20"
            title={t("header.close")}
          >
            <span className="font-display text-[11px] tracking-[0.16em]">ESC</span>
          </button>
        </div>
      </div>
    </header>
  );
}
