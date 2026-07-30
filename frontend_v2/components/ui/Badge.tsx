import React from "react";
import { RiskLevel } from "@/types/analysis";
import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

export function RiskBadge({ level, className }: RiskBadgeProps) {
  const upper = level.toUpperCase() as RiskLevel;

  const styles: Record<RiskLevel, string> = {
    LOW: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300",
    MODERATE: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-300",
    HIGH: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950 dark:text-orange-300",
    EMERGENCY: "bg-red-100 text-red-800 border-red-300 animate-pulse dark:bg-red-950 dark:text-red-300",
  };

  const icons: Record<RiskLevel, string> = {
    LOW: "🟢",
    MODERATE: "🟡",
    HIGH: "🟠",
    EMERGENCY: "🚨",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border",
        styles[upper] || styles.LOW,
        className
      )}
    >
      <span>{icons[upper] || "⚠️"}</span> {upper} RISK
    </span>
  );
}

export function OfflineBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-300",
        className
      )}
    >
      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
      🟢 OFFLINE FIRST
    </span>
  );
}

export function ModelBadge({ model = "gemma3:4b", className }: { model?: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700",
        className
      )}
    >
      MODEL: {model}
    </span>
  );
}

export function LatencyBadge({ ms, className }: { ms: number; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
        className
      )}
    >
      ⏱️ {ms < 1 ? `${ms.toFixed(2)}ms` : `${(ms / 1000).toFixed(2)}s`}
    </span>
  );
}
