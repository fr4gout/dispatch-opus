import { MapPin, Plus, Save, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { t } from "@/nui/i18n";
import { fetchNui } from "@/nui/bridge";
import { useAdminMissionsStore } from "@/stores/adminMissions";
import { Panel, PanelHeader, TacButton, Tag } from "./primitives";

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="label-caps">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="font-mono clip-corner-sm mt-1 w-full border border-white/10 bg-black/40 px-3 py-2 text-[12px] text-foreground outline-none focus:border-amber-500/40"
      />
    </label>
  );
}

export function AdminMissionEditor() {
  const { missions, selectedMission, selectMission, updateSelected, saveSelected, newMission, deleteMission } =
    useAdminMissionsStore();

  return (
    <div className="grid grid-cols-12 gap-4">
      <Panel className="col-span-12 lg:col-span-4">
        <PanelHeader
          title={t("admin.title")}
          sub={`${missions.length} CUSTOM MISSIONS`}
          right={
            <TacButton size="sm" icon={<Plus className="h-3 w-3" />} onClick={newMission}>
              {t("admin.new")}
            </TacButton>
          }
        />
        <div className="space-y-2 p-3">
          {missions.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => selectMission(m.id)}
              className={cn(
                "clip-corner-sm block w-full border p-3 text-left transition-all duration-150 active:scale-[0.99]",
                selectedMission?.id === m.id
                  ? "border-amber-500/40 bg-amber-500/[0.07]"
                  : "border-white/8 bg-white/[0.02] hover:border-white/20",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-[13px] text-foreground">{m.title}</span>
                <Tag tone={m.enabled ? "emerald" : "muted"}>{m.enabled ? "LIVE" : "DRAFT"}</Tag>
              </div>
              <p className="font-mono mt-0.5 text-[10px] text-muted-foreground">
                {m.id} · {m.cargoType} · LVL {m.minLevel}-{m.maxLevel}
              </p>
            </button>
          ))}
        </div>
      </Panel>

      <Panel className="col-span-12 lg:col-span-8">
        <PanelHeader title="Mission Configuration" accent="cyan" sub={selectedMission?.id ?? "NONE"} />
        {selectedMission ? (
          <div className="space-y-4 p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Title" value={selectedMission.title} onChange={(v) => updateSelected({ title: v })} />
              <Field
                label="Cargo Type"
                value={selectedMission.cargoType}
                onChange={(v) => updateSelected({ cargoType: v })}
              />
            </div>
            <Field
              label="Reward Formula"
              value={selectedMission.rewardFormula}
              onChange={(v) => updateSelected({ rewardFormula: v })}
            />
            <div className="grid gap-4 md:grid-cols-2">
              {(["pickup", "dropoff"] as const).map((key) => (
                <div key={key} className="clip-corner-sm border border-white/8 bg-white/[0.02] p-3">
                  <p className="label-caps inline-flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-cyan-400" /> {key} vector
                  </p>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {(["x", "y", "z"] as const).map((axis) => (
                      <Field
                        key={axis}
                        label={axis}
                        value={selectedMission[key][axis]}
                        onChange={(v) =>
                          updateSelected({
                            [key]: { ...selectedMission[key], [axis]: Number(v) || 0 },
                          })
                        }
                      />
                    ))}
                  </div>
                  <TacButton
                    size="sm"
                    variant="ghost"
                    className="mt-3 w-full"
                    onClick={() => fetchNui("plotMissionWaypoint", { type: key, coords: selectedMission[key] })}
                  >
                    Plot on map
                  </TacButton>
                </div>
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Field
                label="Min Level"
                value={selectedMission.minLevel}
                onChange={(v) => updateSelected({ minLevel: Number(v) || 1 })}
              />
              <Field
                label="Max Level"
                value={selectedMission.maxLevel}
                onChange={(v) => updateSelected({ maxLevel: Number(v) || 99 })}
              />
              <div>
                <span className="label-caps">Status</span>
                <TacButton
                  className="mt-1 w-full"
                  variant={selectedMission.enabled ? "primary" : "ghost"}
                  onClick={() => updateSelected({ enabled: !selectedMission.enabled })}
                >
                  {selectedMission.enabled ? "Live" : "Draft"}
                </TacButton>
              </div>
            </div>
            <div className="flex gap-2">
              <TacButton
                size="lg"
                icon={<Save className="h-3.5 w-3.5" />}
                onClick={() => {
                  saveSelected();
                  fetchNui("saveCustomMission", { mission: selectedMission });
                }}
              >
                {t("admin.save")}
              </TacButton>
              <TacButton
                size="lg"
                variant="danger"
                icon={<Trash2 className="h-3.5 w-3.5" />}
                onClick={() => {
                  deleteMission(selectedMission.id);
                  fetchNui("deleteCustomMission", { id: selectedMission.id });
                }}
              >
                {t("admin.delete")}
              </TacButton>
            </div>
          </div>
        ) : (
          <p className="p-10 text-center text-[12px] text-muted-foreground">Select a mission to edit.</p>
        )}
      </Panel>
    </div>
  );
}
