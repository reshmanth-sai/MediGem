import React from "react";
import { cn } from "@/lib/utils";
import { H2, H3 } from "@/components/ui/Typography";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * Clinical Panel / Container: Flat clinical console surface with crisp 1px
 * hairline rule and zero bubble card elevation. Used for modular clinical data
 * workspaces and telemetry consoles.
 */
export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn("bg-surface border border-rule rounded-card p-5", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export const ClinicalPanel = Card;

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  /**
   * Heading text. Phrasing content only (a string or inline elements) since
   * this renders inside an h2/h3 and becomes part of its accessible name.
   * Never pass block content or unrelated metadata here.
   */
  heading?: React.ReactNode;
  /**
   * Optional trailing adornment (a badge, a timestamp, a tag) shown beside
   * the heading. Rendered as the heading's sibling, never nested inside the
   * h2/h3, so it never becomes part of the heading's accessible name.
   */
  headingAdornment?: React.ReactNode;
  headingAs?: "h2" | "h3";
}

/**
 * Section: heading plus content, no border, no background. The grouping
 * mechanism preferred over Card wherever elevation would not communicate
 * real hierarchy (see spec section 6, "prefer sections over cards").
 */
export function Section({
  children,
  className,
  heading,
  headingAdornment,
  headingAs = "h2",
  ...props
}: SectionProps) {
  const HeadingTag = headingAs === "h3" ? H3 : H2;
  const headingNode = heading != null ? <HeadingTag>{heading}</HeadingTag> : null;

  return (
    <section className={cn("space-y-4", className)} {...props}>
      {headingAdornment
        ? (headingNode || headingAdornment) && (
            <div className="flex items-center justify-between gap-4">
              {headingNode}
              {headingAdornment}
            </div>
          )
        : headingNode}
      {children}
    </section>
  );
}
