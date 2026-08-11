import { useState } from "react";
import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { t } from "@/nui/i18n";
import { fetchNui } from "@/nui/bridge";
import { useDashboardStore } from "@/stores/dashboard";
import { Panel, PanelHeader, Tag } from "./primitives";

export function SkillsTab() {
  const { skillBranches, skillPoints } = useDashboardStore();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <Panel>
      <PanelHeader
        title={t("nav.skills")}
        sub="DRIVER PROGRESSION MATRIX"
        right={
          <Tag tone="amber">
            {skillPoints} {t("skills.points")}
          </Tag>
        }
      />
      <div className="grid gap-5 p-5 md:grid-cols-2 xl:grid-cols-3">
        {skillBranches.map((branch) => (
          <div key={branch.id} className="relative">
            <div className="mb-3 flex items-center gap-2">
              <span
                className={cn(
                  "h-3 w-[3px]",
                  branch.accent === "amber" && "bg-amber-400",
                  branch.accent === "cyan" && "bg-cyan-400",
                  branch.accent === "emerald" && "bg-emerald-400",
                  branch.accent === "rose" && "bg-rose-400",
                )}
              />
              <h3 className="font-display text-[12px] tracking-[0.18em] text-foreground uppercase">
                {branch.name}
              </h3>
            </div>

            <div className="relative pl-4">
              {/* connector spine */}
              <svg className="pointer-events-none absolute top-0 left-[7px] h-full w-3" aria-hidden>
                <line
                  x1="1"
                  y1="0"
                  x2="1"
                  y2="100%"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="2"
                  strokeDasharray="4 5"
                />
              </svg>

              <div className="space-y-3">
                {branch.nodes.map((node) => {
                  const acquired = node.state === "acquired";
                  const available = node.state === "available";
                  return (
                    <div
                      key={node.id}
                      onMouseEnter={() => setHovered(node.id)}
                      onMouseLeave={() => setHovered(null)}
                      className={cn(
                        "clip-corner-sm relative border p-3 transition-all duration-150",
                        acquired &&
                          "border-amber-500/40 bg-amber-500/[0.09] shadow-[0_0_28px_-16px_rgba(245,158,11,1)]",
                        available && "border-cyan-500/40 bg-cyan-500/[0.05]",
                        node.state === "locked" && "border-white/8 bg-black/30 opacity-55",
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-display text-[13px] font-semibold text-foreground">
                              {node.name}
                            </span>
                            {acquired && (
                              <span className="flex h-4 w-4 items-center justify-center bg-amber-400">
                                <Check className="h-2.5 w-2.5 text-[#0b0d13]" />
                              </span>
                            )}
                            {node.state === "locked" && <Lock className="h-3 w-3 text-white/30" />}
                          </div>
                          <p className="mt-0.5 text-[11px] text-muted-foreground">{node.description}</p>
                        </div>
                        <span className="label-caps">T{node.tier}</span>
                      </div>

                      {available && (
                        <button
                          type="button"
                          onClick={() => fetchNui("acquireSkill", { skillId: node.id })}
                          className="font-display clip-corner-sm mt-3 w-full animate-pulse border border-cyan-500/40 bg-cyan-500/15 px-3 py-1.5 text-[10px] tracking-[0.16em] text-cyan-300 uppercase transition-all duration-150 active:scale-[0.98] hover:bg-cyan-500/25"
                        >
                          {t("skills.unlock")} (${node.cost} Skill Point{node.cost > 1 ? "s" : ""})
                        </button>
                      )}

                      {hovered === node.id && (
                        <div className="panel-glass clip-corner-sm absolute -top-2 left-full z-40 ml-3 w-56 p-3">
                          <p className="label-caps">Perk</p>
                          <p className="mt-1 text-[12px] text-amber-300">{node.perk}</p>
                          {node.requires && (
                            <p className="font-mono mt-2 text-[10px] text-muted-foreground">
                              REQUIRES: {node.requires.toUpperCase()}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
