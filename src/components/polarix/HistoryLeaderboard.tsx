import { t } from "@/nui/i18n";
import { useDashboardStore } from "@/stores/dashboard";
import { Panel, PanelHeader, Tag, money } from "./primitives";

export function HistoryTab() {
  const history = useDashboardStore((s) => s.history);
  return (
    <Panel>
      <PanelHeader title={t("nav.history")} sub="CONTRACT LEDGER" />
      <div className="p-4">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10">
              {["Contract", "Cargo", "Route", "Payout", "XP", "Time", "Rating"].map((h) => (
                <th key={h} className="label-caps px-3 py-2">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr key={h.id} className="border-b border-white/5 last:border-0">
                <td className="font-mono px-3 py-3 text-[11px] text-muted-foreground">{h.id}</td>
                <td className="px-3 py-3 text-[12px] text-foreground">{h.cargo}</td>
                <td className="px-3 py-3 text-[12px] text-muted-foreground">{h.route}</td>
                <td className="font-mono px-3 py-3 text-[12px] text-emerald-400">{money(h.payout)}</td>
                <td className="font-mono px-3 py-3 text-[12px] text-cyan-400">+{h.xp}</td>
                <td className="font-mono px-3 py-3 text-[11px] text-muted-foreground">{h.date}</td>
                <td className="px-3 py-3">
                  <Tag tone={h.rating === "PRISTINE" ? "emerald" : h.rating === "DAMAGED" ? "amber" : "rose"}>
                    {h.rating}
                  </Tag>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

export function LeaderboardTab() {
  const leaderboard = useDashboardStore((s) => s.leaderboard);
  return (
    <Panel>
      <PanelHeader title={t("nav.leaderboard")} sub="TOP HAULERS · SERVER WIDE" accent="cyan" />
      <div className="space-y-2 p-4">
        {leaderboard.map((e) => (
          <div
            key={e.rank}
            className="clip-corner-sm flex items-center gap-4 border border-white/8 bg-white/[0.02] px-4 py-3"
          >
            <span className="font-display w-8 text-[18px] font-bold text-amber-400">#{e.rank}</span>
            <span className="flex-1 text-[13px] text-foreground">{e.name}</span>
            <Tag tone="cyan">LVL {e.level}</Tag>
            <span className="font-mono w-24 text-right text-[12px] text-muted-foreground">
              {e.deliveries} runs
            </span>
            <span className="font-mono w-32 text-right text-[13px] text-emerald-400">
              {money(e.earnings)}
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
