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
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <h2 className="text-label uppercase tracking-wider font-semibold text-ink-muted">
            {title}
          </h2>
          {badge && <div className="shrink-0">{badge}</div>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {subtitle && <p className="text-body-sm text-ink-muted">{subtitle}</p>}
    </div>
  );
}
