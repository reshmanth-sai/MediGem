import React from "react";
import { cn } from "@/lib/utils";

/**
 * Table: the Section 7 table primitive (56px rows, zebra striping, sticky
 * header, tabular numerals). Used by the patient queue and case history
 * tables, and anywhere else the app needs a real data table.
 *
 * WCAG 2.2 "Focus Not Obscured (Minimum)": the header is `sticky`, so a
 * keyboard user tabbing to a row below the fold has that row scrolled into
 * view by the browser's default focus-scroll behaviour, which by default
 * lands the row directly under the sticky header, hidden behind it. The
 * wrapper's `scroll-pt-14` sets `scroll-padding-top` to the header's own
 * height (56px, matching the row height token), so the browser's
 * scroll-into-view keeps that much clearance above the focused row and it
 * lands visibly below the header instead.
 */
export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
  /**
   * Accessible name for the table. Always required: every real data table
   * needs one, even if it never renders visibly (see `captionHidden`).
   */
  caption: React.ReactNode;
  /**
   * Set true when the surrounding context (for example a `Section` with its
   * own `heading`) already names this table visually, so the caption should
   * stay in the accessibility tree without being shown twice on screen.
   * Defaults to false (caption renders visibly) since not every table sits
   * inside a heading that already names it.
   */
  captionHidden?: boolean;
  /** className for the scrolling wrapper div, distinct from the table's own className. */
  containerClassName?: string;
}

export function Table({
  caption,
  captionHidden = false,
  children,
  className,
  containerClassName,
  ...props
}: TableProps) {
  return (
    <div className={cn("overflow-x-auto scroll-pt-14", containerClassName)}>
      <table className={cn("w-full border-collapse", className)} {...props}>
        <caption
          className={cn(
            "text-left text-label text-ink-muted py-2",
            captionHidden && "sr-only"
          )}
        >
          {caption}
        </caption>
        {children}
      </table>
    </div>
  );
}

export function THead({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        "sticky top-0 z-10 bg-surface-raised text-ink-muted text-label border-b border-rule",
        className
      )}
      {...props}
    >
      {children}
    </thead>
  );
}

export interface THProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /** Marks this header as a sort control. Renders an operable button inside the `<th>`. */
  sortable?: boolean;
  /** Current sort state. Only meaningful when `sortable` is true. */
  sortDirection?: "asc" | "desc" | "none";
  /** Called when the sort button is activated. Required when `sortable` is true. */
  onSort?: () => void;
  /** Right-aligns the header to match a numeric column's cells. */
  numeric?: boolean;
}

const ARIA_SORT_MAP: Record<"asc" | "desc" | "none", "ascending" | "descending" | "none"> = {
  asc: "ascending",
  desc: "descending",
  none: "none",
};

export function TH({
  children,
  className,
  sortable = false,
  sortDirection = "none",
  onSort,
  numeric = false,
  scope = "col",
  ...props
}: THProps) {
  return (
    <th
      scope={scope}
      aria-sort={sortable ? ARIA_SORT_MAP[sortDirection] : undefined}
      className={cn(
        "h-14 px-4 font-semibold whitespace-nowrap",
        numeric ? "text-right" : "text-left",
        className
      )}
      {...props}
    >
      {sortable ? (
        <button
          type="button"
          onClick={onSort}
          className="inline-flex items-center gap-1 rounded-control focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus hover:text-ink"
        >
          {children}
        </button>
      ) : (
        children
      )}
    </th>
  );
}

export function TBody({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn(className)} {...props}>
      {children}
    </tbody>
  );
}

export interface TRProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /**
   * Whether this row is selected. Left undefined (the default) for tables
   * with no selection semantics at all: React omits an attribute whose
   * value is `undefined`, so `aria-selected` is only rendered once a caller
   * actually opts a row into selection tracking. Passing `false` explicitly
   * still marks the row selectable-but-not-selected.
   */
  selected?: boolean;
}

export function TR({ children, className, selected, ...props }: TRProps) {
  return (
    <tr
      aria-selected={selected}
      className={cn(
        "h-14 even:bg-ground hover:bg-surface-raised",
        // `!bg-action-subtle` (Tailwind's important modifier) is required
        // here, not just a plain `bg-action-subtle`: `even:bg-ground`
        // compiles to `.even\:bg-ground:nth-child(2n)`, a class plus a
        // pseudo-class (specificity 0-2-0), which otherwise beats a plain
        // `.bg-action-subtle` class (specificity 0-1-0) in the cascade on
        // every even-positioned row regardless of source order. The `!`
        // forces `!important`, so the selected fill wins on every row,
        // even and odd alike.
        selected && "!bg-action-subtle",
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export interface TDProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  /** Right-aligns and applies tabular figures for numeric data. */
  numeric?: boolean;
}

export function TD({ children, className, numeric = false, ...props }: TDProps) {
  return (
    <td
      className={cn(
        "px-4 align-middle",
        numeric ? "text-right tabular font-mono" : "text-left",
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
}
