import React from "react";
import { cn } from "@/lib/utils";
import { Label, DataLg, BodySm } from "@/components/ui/Typography";

export interface MetricStatProps {
  /** Optional lucide-react icon component, rendered next to the label. */
  icon?: React.ComponentType<{ className?: string }>;
  iconClassName?: string;
  label: string;
  value: string | number;
  subtitle?: string;
  className?: string;
}

/**
 * A single label / big value / subtitle stat, laid out with spacing rather
 * than boxed into a card. Used in grids of unboxed metrics per spec section
 * 9 ("no four-equal-stat-card row"). Replaces the deleted StatCard.
 */
export function MetricStat({ icon: Icon, iconClassName, label, value, subtitle, className }: MetricStatProps) {
  return (
    <div className={cn("flex flex-col gap-1 pt-4 sm:pt-0 first:pt-0", className)}>
      {Icon ? (
        <div className="flex items-center gap-2">
          <Icon className={cn("h-4 w-4 text-ink-muted", iconClassName)} aria-hidden="true" />
          <Label>{label}</Label>
        </div>
      ) : (
        <Label>{label}</Label>
      )}
      <DataLg>{value}</DataLg>
      {subtitle && <BodySm className="text-ink-muted">{subtitle}</BodySm>}
    </div>
  );
}
