import React from "react";
import { cn } from "@/lib/utils";

export interface ClinicalRowProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  value: React.ReactNode;
  subValue?: React.ReactNode;
  indicator?: React.ReactNode;
  divided?: boolean;
}

/**
 * ClinicalRow: A clean observation / record row with tabular alignment.
 * Used for dense medical scans instead of surrounding each observation in a card.
 */
export function ClinicalRow({
  label,
  value,
  subValue,
  indicator,
  divided = true,
  className,
  ...props
}: ClinicalRowProps) {
  return (
    <div
      className={cn(
        "py-2.5 flex items-start justify-between gap-3 text-body-sm",
        divided && "border-b border-rule last:border-b-0",
        className
      )}
      {...props}
    >
      <div className="space-y-0.5 min-w-0 flex-1">
        <div className="font-semibold text-ink leading-snug">{label}</div>
        {subValue && <div className="text-body-sm text-ink-muted">{subValue}</div>}
      </div>
      <div className="flex items-center gap-2 shrink-0 text-right">
        <div className="font-mono tabular text-body-sm font-semibold text-ink">{value}</div>
        {indicator && <div className="shrink-0">{indicator}</div>}
      </div>
    </div>
  );
}
