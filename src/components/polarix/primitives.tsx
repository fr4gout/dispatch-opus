import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Panel({
  children,
  className,
  glow,
}: {
  children: ReactNode;
  className?: string;
  glow?: "amber" | "cyan" | "none";
}) {
  return (
    <div
      className={cn(
        "panel-glass clip-corner relative",
        glow === "amber" && "shadow-[0_0_40px_-16px_rgba(245,158,11,0.55)]",
        glow === "cyan" && "shadow-[0_0_40px_-16px_rgba(34,211,238,0.5)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PanelHeader({
  title,
  sub,
  right,
  accent = "amber",
}: {
  title: string;
  sub?: string;
  right?: ReactNode;
  accent?: "amber" | "cyan";
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "h-3 w-[3px]",
            accent === "amber" ? "bg-amber-400" : "bg-cyan-400",
          )}
        />
        <div>
          <h2 className="font-display text-[13px] font-semibold tracking-[0.16em] text-foreground uppercase">
            {title}
          </h2>
          {sub ? <p className="label-caps mt-0.5">{sub}</p> : null}
        </div>
      </div>
      {right}
    </div>
  );
}

export function Stat({
  label,
  value,
  unit,
  hint,
  accent = "amber",
}: {
  label: string;
  value: string;
  unit?: string;
  hint?: ReactNode;
  accent?: "amber" | "cyan" | "emerald" | "rose";
}) {
  const tone = {
    amber: "text-amber-400",
    cyan: "text-cyan-400",
    emerald: "text-emerald-400",
    rose: "text-rose-400",
  }[accent];
  return (
    <div>
      <p className="label-caps">{label}</p>
      <p className={cn("text-telemetry mt-1 text-2xl font-bold", tone)}>
        {value}
        {unit ? <span className="ml-1 text-xs text-muted-foreground">{unit}</span> : null}
      </p>
      {hint ? <div className="mt-1 text-[11px] text-muted-foreground">{hint}</div> : null}
    </div>
  );
}

export function TacButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled,
  className,
  icon,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "cyan" | "danger" | "muted";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
}) {
  const variants: Record<string, string> = {
    primary:
      "bg-gradient-to-r from-amber-500 to-yellow-400 text-[#0b0d13] font-semibold hover:shadow-[0_0_24px_rgba(245,158,11,0.45)]",
    cyan: "bg-gradient-to-r from-cyan-500 to-blue-500 text-[#05080f] font-semibold hover:shadow-[0_0_24px_rgba(34,211,238,0.4)]",
    ghost:
      "border border-white/12 bg-white/[0.03] text-foreground hover:border-amber-500/40 hover:text-amber-300",
    danger:
      "border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20",
    muted: "border border-white/10 bg-white/[0.02] text-muted-foreground",
  };
  const sizes: Record<string, string> = {
    sm: "px-3 py-1.5 text-[10px]",
    md: "px-4 py-2 text-[11px]",
    lg: "px-6 py-3.5 text-[13px]",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "clip-corner-sm inline-flex items-center justify-center gap-2 tracking-[0.16em] uppercase transition-all duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100",
        "font-display",
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {icon}
      {children}
    </button>
  );
}

export function Meter({
  value,
  accent = "amber",
  className,
}: {
  value: number;
  accent?: "amber" | "cyan" | "emerald" | "rose";
  className?: string;
}) {
  const tone = {
    amber: "from-amber-500 to-yellow-400",
    cyan: "from-cyan-500 to-blue-500",
    emerald: "from-emerald-500 to-teal-400",
    rose: "from-rose-500 to-orange-400",
  }[accent];
  return (
    <div className={cn("h-1.5 w-full overflow-hidden bg-white/8", className)}>
      <div
        className={cn("h-full bg-gradient-to-r transition-all duration-500", tone)}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function StatusDot({ tone = "emerald" }: { tone?: "emerald" | "amber" | "rose" | "muted" }) {
  const color = {
    emerald: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]",
    amber: "bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.9)]",
    rose: "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.9)]",
    muted: "bg-white/25",
  }[tone];
  return <span className={cn("inline-block h-1.5 w-1.5 rounded-full", color, tone !== "muted" && "animate-pulse")} />;
}

export function Tag({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: "amber" | "cyan" | "emerald" | "rose" | "muted";
}) {
  const tones = {
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    rose: "text-rose-400 bg-rose-500/10 border-rose-500/30",
    muted: "text-muted-foreground bg-white/[0.03] border-white/10",
  }[tone];
  return (
    <span
      className={cn(
        "font-display inline-flex items-center gap-1 border px-2 py-0.5 text-[9px] tracking-[0.18em] uppercase",
        tones,
      )}
    >
      {children}
    </span>
  );
}

export const money = (n: number) => `$${n.toLocaleString("en-US")}`;
export const km = (n: number) => `${n.toFixed(1)} km`;
