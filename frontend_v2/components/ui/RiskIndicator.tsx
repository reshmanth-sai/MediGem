import React from "react";
import { Circle, Octagon, Shield, Triangle, type LucideIcon } from "lucide-react";
import type { RiskLevel } from "@/types/analysis";
import { cn } from "@/lib/utils";
import { Data } from "@/components/ui/Typography";

/**
 * The single source of truth for how clinical risk is ever displayed.
 *
 * Every risk indicator in the app ships shape + text label + colour together,
 * never colour alone, so a colorblind clinician can tell risk levels apart
 * without relying on hue. Do not build a second risk display; extend this one.
 */
export type RiskIndicatorVariant = "solid" | "tint" | "inline";

export interface RiskIndicatorProps {
  level: RiskLevel;
  variant?: RiskIndicatorVariant;
  /** Optional urgency score (0 to 10), rendered with tabular figures. */
  showScore?: number;
  className?: string;
}

interface RiskConfig {
  icon: LucideIcon;
  label: string;
}

const RISK_CONFIG: Record<RiskLevel, RiskConfig> = {
  EMERGENCY: { icon: Octagon, label: "Emergency" },
  HIGH: { icon: Triangle, label: "High risk" },
  MODERATE: { icon: Circle, label: "Moderate" },
  LOW: { icon: Shield, label: "Low risk" },
};

/** Container chrome per variant. `inline` has no pill background, just icon + label. */
const VARIANT_CONTAINER: Record<RiskIndicatorVariant, string> = {
  solid: "rounded-chip px-2.5 py-1",
  tint: "rounded-chip px-2.5 py-1",
  inline: "",
};

/**
 * Tone classes per level per variant. Written out as static, literal Tailwind
 * class strings (not template-built) so the JIT compiler can see and keep them.
 */
const VARIANT_TONE: Record<RiskLevel, Record<RiskIndicatorVariant, string>> = {
  EMERGENCY: {
    solid: "bg-risk-emergency text-on-action",
    tint: "bg-risk-emergency/12 text-risk-emergency",
    inline: "text-risk-emergency",
  },
  HIGH: {
    solid: "bg-risk-high text-on-action",
    tint: "bg-risk-high/12 text-risk-high",
    inline: "text-risk-high",
  },
  MODERATE: {
    solid: "bg-risk-moderate text-on-action",
    tint: "bg-risk-moderate/12 text-risk-moderate",
    inline: "text-risk-moderate",
  },
  LOW: {
    solid: "bg-risk-low text-on-action",
    tint: "bg-risk-low/12 text-risk-low",
    inline: "text-risk-low",
  },
};

export function RiskIndicator({ level, variant = "tint", showScore, className }: RiskIndicatorProps) {
  const { icon: Icon, label } = RISK_CONFIG[level];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-body-sm font-semibold",
        VARIANT_CONTAINER[variant],
        VARIANT_TONE[level][variant],
        className
      )}
      aria-label={`Assessed risk level: ${label}`}
    >
      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
      <span>{label}</span>
      {typeof showScore === "number" && (
        <Data className={cn("text-inherit", variant === "solid" && "text-on-action")}>{showScore}</Data>
      )}
    </span>
  );
}
