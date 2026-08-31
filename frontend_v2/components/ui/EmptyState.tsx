import React from "react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { H3, Body } from "@/components/ui/Typography";
import { Button, buttonVariants } from "@/components/ui/Button";

/**
 * The action is either a handler or a destination, never both. A destination
 * renders a real anchor, so it keeps middle-click, open-in-new-tab, copy-link
 * and no-JS navigation; pushing a plain navigation through onClick silently
 * drops all four. Both members render with the same buttonVariants treatment,
 * so the two are visually indistinguishable.
 */
export type EmptyStateAction =
  | { label: string; onClick: () => void; href?: never }
  | { label: string; href: string; onClick?: never };

export interface EmptyStateProps {
  /** Lucide icon component to display. Rendered at 32px with strokeWidth 1.75. */
  icon: LucideIcon;
  /** Title text displayed as H3. */
  title: string;
  /** Description text displayed as Body. */
  description: string;
  /** Action configuration: a label plus either an onClick handler or an href. */
  action: EmptyStateAction;
  /** Optional className to merge with the root element. */
  className?: string;
}

/**
 * EmptyState: centered stack for when a list or table has no content.
 * Displays icon, title, description, and a primary action button.
 * Per spec 4.4, the icon may use text-action (indigo) to mark empty states
 * as an approved brand-identity surface.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-12",
        className
      )}
    >
      <Icon
        className="h-8 w-8 text-action"
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <H3>{title}</H3>
      <Body>{description}</Body>
      {action.href !== undefined ? (
        <Link href={action.href} className={cn(buttonVariants({ variant: "primary" }))}>
          {action.label}
        </Link>
      ) : (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
