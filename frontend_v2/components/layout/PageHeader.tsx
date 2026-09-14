import React from "react";
import { cn } from "@/lib/utils";

/*
 * The one page header. Title left, actions right, an optional meta line of
 * small facts beneath. No icon tiles, no badges in the title; the page name
 * is enough. Density matches the rail: this is a tool, not a brochure.
 */
export function PageHeader({
  title,
  subtitle,
  meta,
  actions,
  back,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Small facts, rendered as a dot-separated line. */
  meta?: React.ReactNode[];
  actions?: React.ReactNode;
  back?: { href: string; label: string };
  className?: string;
}) {
  return (
    <header className={cn("flex flex-col gap-3 pb-4 border-b border-rule", className)}>
      {back && (
        <a href={back.href} className="text-body-sm text-ink-muted hover:text-ink w-fit focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
          &larr; {back.label}
        </a>
      )}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <h1 className="text-h2 text-ink">{title}</h1>
          {subtitle && <p className="text-body-sm text-ink-muted max-w-2xl">{subtitle}</p>}
          {meta && meta.length > 0 && (
            <p className="text-body-sm text-ink-muted font-mono tabular flex flex-wrap gap-x-2">
              {meta.map((m, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span aria-hidden="true">·</span>}
                  <span>{m}</span>
                </React.Fragment>
              ))}
            </p>
          )}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </header>
  );
}
