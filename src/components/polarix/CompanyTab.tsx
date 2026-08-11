import { useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, Crown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { t } from "@/nui/i18n";
import { fetchNui } from "@/nui/bridge";
import { useDashboardStore } from "@/stores/dashboard";
import { Meter, Panel, PanelHeader, Stat, StatusDot, TacButton, Tag, money } from "./primitives";

const SUBTABS = [
  { key: "overview", label: t("company.overview") },
  { key: "roster", label: t("company.roster") },
  { key: "vault", label: t("company.vault") },
  { key: "perks", label: t("company.perks") },
  { key: "invitations", label: t("company.invitations") },
  { key: "settings", label: t("company.settings") },
] as const;

const roleTone = (r: string) =>
  r === "OWNER" ? "amber" : r === "DISPATCHER" ? "cyan" : r === "SENIOR" ? "emerald" : "muted";

export function CompanyTab() {
  const company = useDashboardStore((s) => s.companyData);
  const [sub, setSub] = useState<(typeof SUBTABS)[number]["key"]>("overview");
  const [vaultMode, setVaultMode] = useState<"deposit" | "withdraw" | null>(null);
  const [amount, setAmount] = useState("25000");

  const peak = Math.max(...company.weekly.map((w) => w.payout));

  return (
    <Panel>
      <PanelHeader
        title={company.name}
        sub={company.tier}
        right={
          <div className="text-right">
            <p className="label-caps">{t("company.treasury")}</p>
            <p className="font-mono text-[15px] font-semibold text-amber-400">
              {money(company.vault)}
            </p>
          </div>
        }
      />
      <div className="flex gap-1 border-b border-white/10 px-4">
        {SUBTABS.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setSub(s.key)}
            className={cn(
              "font-display relative px-3 py-2.5 text-[10px] tracking-[0.16em] uppercase transition-colors",
              sub === s.key ? "text-amber-400" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {s.label}
            {sub === s.key && (
              <span className="absolute inset-x-2 bottom-0 h-[2px] bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.9)]" />
            )}
          </button>
        ))}
      </div>

      <div className="p-5">
        {sub === "overview" && (
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="clip-corner-sm border border-white/8 bg-white/[0.02] p-4">
              <Stat label="Corporation Tag" value={company.tag} />
              <div className="mt-4 space-y-3">
                <Stat label="Members" value={company.members.length.toString()} accent="cyan" />
                <Stat
                  label="Weekly Payout"
                  value={money(company.weekly.reduce((s, w) => s + w.payout, 0))}
                  accent="emerald"
                />
              </div>
            </div>
            <div className="clip-corner-sm border border-white/8 bg-white/[0.02] p-4 lg:col-span-2">
              <p className="label-caps">Financial ledger · weekly payouts & cargo volume</p>
              <div className="mt-5 flex h-44 items-end gap-3">
                {company.weekly.map((w) => (
                  <div key={w.label} className="flex flex-1 flex-col items-center gap-2">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {Math.round(w.payout / 1000)}k
                    </span>
                    <div
                      className="w-full bg-gradient-to-t from-amber-500/30 to-amber-400"
                      style={{ height: `${(w.payout / peak) * 100}%` }}
                    />
                    <span className="label-caps">{w.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {sub === "roster" && (
          <div className="clip-corner-sm border border-white/8">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  {["Member", "Role", "Contribution", "Status", "Actions"].map((h) => (
                    <th key={h} className="label-caps px-4 py-2.5">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {company.members.map((m) => (
                  <tr key={m.id} className="border-b border-white/5 last:border-0">
                    <td className="px-4 py-3 text-[12px] text-foreground">{m.name}</td>
                    <td className="px-4 py-3">
                      <Tag tone={roleTone(m.role) as "amber"}>{m.role}</Tag>
                    </td>
                    <td className="font-mono px-4 py-3 text-[12px] text-emerald-400">
                      {money(m.contribution)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-2 text-[11px] text-muted-foreground">
                        <StatusDot tone={m.online ? "emerald" : "muted"} />
                        {m.online ? "ONLINE" : "OFFLINE"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <TacButton
                          size="sm"
                          variant="ghost"
                          onClick={() => fetchNui("promoteCompanyMember", { memberId: m.id })}
                        >
                          Promote
                        </TacButton>
                        <TacButton
                          size="sm"
                          variant="ghost"
                          onClick={() => fetchNui("demoteCompanyMember", { memberId: m.id })}
                        >
                          Demote
                        </TacButton>
                        <TacButton
                          size="sm"
                          variant="danger"
                          onClick={() => fetchNui("kickCompanyMember", { memberId: m.id })}
                        >
                          Kick
                        </TacButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {sub === "vault" && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="clip-corner-sm border border-white/8 bg-white/[0.02] p-5">
              <Stat label={t("company.treasury")} value={money(company.vault)} />
              <Meter value={72} className="mt-4" />
              <p className="label-caps mt-2">72% of tier IV cap</p>
              <div className="mt-5 flex gap-2">
                <TacButton
                  icon={<ArrowDownToLine className="h-3.5 w-3.5" />}
                  onClick={() => setVaultMode("deposit")}
                >
                  {t("company.deposit")}
                </TacButton>
                <TacButton
                  variant="ghost"
                  icon={<ArrowUpFromLine className="h-3.5 w-3.5" />}
                  onClick={() => setVaultMode("withdraw")}
                >
                  {t("company.withdraw")}
                </TacButton>
              </div>
            </div>
            {vaultMode && (
              <div className="clip-corner-sm border border-amber-500/25 bg-amber-500/[0.04] p-5">
                <div className="flex items-center justify-between">
                  <p className="font-display text-[12px] tracking-[0.16em] text-amber-300 uppercase">
                    {vaultMode === "deposit" ? t("company.deposit") : t("company.withdraw")}
                  </p>
                  <button type="button" onClick={() => setVaultMode(null)}>
                    <X className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
                  className="font-mono clip-corner-sm mt-4 w-full border border-white/10 bg-black/40 px-3 py-2.5 text-[16px] text-foreground outline-none focus:border-amber-500/40"
                />
                <div className="mt-3 flex gap-2">
                  {[5000, 25000, 100000].map((p) => (
                    <TacButton key={p} size="sm" variant="ghost" onClick={() => setAmount(String(p))}>
                      ${p / 1000}k
                    </TacButton>
                  ))}
                </div>
                <TacButton
                  size="lg"
                  className="mt-4 w-full"
                  onClick={() =>
                    fetchNui(
                      vaultMode === "deposit" ? "depositCompanyMoney" : "withdrawCompanyMoney",
                      { amount: Number(amount) },
                    )
                  }
                >
                  Confirm {vaultMode}
                </TacButton>
              </div>
            )}
          </div>
        )}

        {sub === "perks" && (
          <div className="grid gap-4 md:grid-cols-2">
            {company.perks.map((p) => (
              <div
                key={p.id}
                className={cn(
                  "clip-corner-sm border p-4",
                  p.active ? "border-emerald-500/30 bg-emerald-500/[0.05]" : "border-white/8 bg-white/[0.02]",
                )}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-display text-[13px] font-semibold text-foreground">{p.name}</h4>
                  <Tag tone={p.active ? "emerald" : "muted"}>{p.active ? "ACTIVE" : "LOCKED"}</Tag>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">{p.description}</p>
              </div>
            ))}
          </div>
        )}

        {sub === "invitations" && (
          <div className="space-y-2">
            {company.invitations.map((inv) => (
              <div
                key={inv.id}
                className="clip-corner-sm flex items-center justify-between border border-white/8 bg-white/[0.02] px-4 py-3"
              >
                <span className="text-[12px] text-foreground">{inv.name}</span>
                <span className="font-mono text-[10px] text-muted-foreground">{inv.sentAt}</span>
                <div className="flex gap-2">
                  <TacButton size="sm" onClick={() => fetchNui("acceptCompanyInvite", { id: inv.id })}>
                    Accept
                  </TacButton>
                  <TacButton
                    size="sm"
                    variant="danger"
                    onClick={() => fetchNui("declineCompanyInvite", { id: inv.id })}
                  >
                    Decline
                  </TacButton>
                </div>
              </div>
            ))}
          </div>
        )}

        {sub === "settings" && (
          <div className="clip-corner-sm max-w-lg border border-white/8 bg-white/[0.02] p-5">
            <p className="label-caps inline-flex items-center gap-2">
              <Crown className="h-3 w-3 text-amber-400" /> Owner controls
            </p>
            <TacButton className="mt-4 w-full" onClick={() => fetchNui("createCompany", {})}>
              Register new corporation
            </TacButton>
            <TacButton
              variant="danger"
              className="mt-2 w-full"
              onClick={() => fetchNui("disbandCompany", {})}
            >
              Disband corporation
            </TacButton>
          </div>
        )}
      </div>
    </Panel>
  );
}
