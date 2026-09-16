import React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  subtitle?: string;
}

/**
 * SectionHeader: Quiet, clean clinical section separator.
 * Replaces heavy card containers with an explicit typographic header,
 * optional inline status/count, and an understated bottom divider.
 */
export function SectionHeader({
  title,
  badge,
  action,
  subtitle,
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div className={cn("space-y-1.5 pb-2.5 border-b border-rule", className)} {...props}>
      {/*
        The badge used to be `shrink-0`, which is right for a short count chip
        and wrong for anything longer: the reasoning card passes a request id,
        status and duration, and at 377px that one chip pushed the whole
        results page 108px wider than a phone. The row wraps and the badge is
        allowed to shrink, so long content breaks over lines instead of
        forcing a horizontal scrollbar. A short badge still sits inline
        beside the title, unchanged.
      */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
        <div className="flex flex-wrap items-center gap-2.5 min-w-0">
          <h2 className="text-label uppercase tracking-wider font-semibold text-ink-muted">
            {title}
          </h2>
          {badge && <div className="min-w-0">{badge}</div>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {subtitle && <p className="text-body-sm text-ink-muted">{subtitle}</p>}
    </div>
  );
}
