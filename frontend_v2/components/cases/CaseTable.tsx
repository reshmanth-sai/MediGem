"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, ClipboardList, Search } from "lucide-react";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/EmptyState";
import { RiskIndicator } from "@/components/ui/RiskIndicator";
import { buttonVariants } from "@/components/ui/Button";
import { CONFIDENCE_LABELS, type ClinicalCaseData } from "@/lib/casesData";
import { cn } from "@/lib/utils";

/*
 * One table for every case list. Columns are picked from `columns` below or
 * supplied by the consumer; rows can be selectable (the history split view)
 * or plain. Under md the same rows render as a card list so nothing scrolls
 * sideways on a phone.
 */

export interface CaseColumn {
  id: string;
  header: string;
  cell: (c: ClinicalCaseData) => React.ReactNode;
  numeric?: boolean;
  /** Skip in the card list (the patient column is the card header). */
  cardHidden?: boolean;
  className?: string;
}

export function caseStatus(c: ClinicalCaseData): string {
  if (c.riskLevel === "EMERGENCY") return "Immediate";
  if (c.disposition?.needsReferral) return "Awaiting review";
  return "Stable";
}

export const columns = {
  patient: {
    id: "patient",
    header: "Patient",
    cardHidden: true,
    cell: (c) => (
      <>
        <Link href={`/results/${c.caseId}`} className="font-semibold text-ink hover:underline whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
          {c.patientName}
        </Link>
        <div className="text-body-sm text-ink-muted font-mono whitespace-nowrap">{c.patientId}</div>
        <div className="text-body-sm text-ink-muted">{c.village || "Rural clinic"}</div>
      </>
    ),
  },
  ageSex: { id: "ageSex", header: "Age / Sex", cell: (c) => <span className="font-mono tabular">{c.age} {c.gender.charAt(0)}</span> },
  complaint: {
    id: "complaint",
    header: "Presenting complaint",
    className: "max-w-xs",
    cell: (c) => (
      <span className="line-clamp-2 text-ink" title={c.chiefComplaint}>
        {c.chiefComplaint}
      </span>
    ),
  },
  finding: { id: "finding", header: "Primary finding", className: "max-w-xs", cell: (c) => <span className="line-clamp-2 text-ink">{c.primaryFinding}</span> },
  priority: { id: "priority", header: "Priority", cell: (c) => <RiskIndicator level={c.riskLevel} variant="tint" /> },
  priorityScore: { id: "priorityScore", header: "Risk", cell: (c) => <RiskIndicator level={c.riskLevel} variant="tint" showScore={c.urgencyScore} /> },
  arrival: { id: "arrival", header: "Arrival", cell: (c) => <span className="text-ink-muted text-body-sm font-mono tabular">{c.arrivalTime || "Not recorded"}</span> },
  confidence: { id: "confidence", header: "Confidence", cell: (c) => <span className="text-body-sm text-ink whitespace-nowrap">{CONFIDENCE_LABELS[c.confidenceLevel]}</span> },
  status: {
    id: "status",
    header: "Status",
    cell: (c) => (
      <span className={cn("text-body-sm font-semibold", c.riskLevel === "EMERGENCY" ? "text-risk-emergency" : c.riskLevel === "HIGH" ? "text-risk-high" : "text-ink-muted")}>
        {caseStatus(c)}
      </span>
    ),
  },
  review: {
    id: "review",
    header: "Review",
    cell: (c) => <span className={cn("text-body-sm font-semibold", c.requiresHumanReview ? "text-risk-high" : "text-risk-low")}>{c.requiresHumanReview ? "Required" : "Cleared"}</span>,
  },
} satisfies Record<string, CaseColumn>;

export function OpenCaseAction({ c, label = "Open" }: { c: ClinicalCaseData; label?: string }) {
  return (
    <Link
      href={`/results/${c.caseId}`}
      aria-label={`${label} case for ${c.patientName}`}
      className={buttonVariants({ size: "sm", variant: c.riskLevel === "EMERGENCY" ? "danger" : "secondary" })}
      onClick={(e) => e.stopPropagation()}
    >
      {label}
      <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
    </Link>
  );
}

export interface CaseTableProps {
  cases: ClinicalCaseData[];
  /** Length of the unfiltered list, so the empty state can tell "no cases" from "no matches". */
  total: number;
  columns: CaseColumn[];
  caption: string;
  selectedCaseId?: string | null;
  onSelect?: (c: ClinicalCaseData) => void;
  renderAction?: (c: ClinicalCaseData) => React.ReactNode;
  onClearFilters?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function CaseTable({ cases, total, columns: cols, caption, selectedCaseId, onSelect, renderAction, onClearFilters, emptyTitle = "No cases", emptyDescription = "New patient intakes will appear here as soon as they are logged." }: CaseTableProps) {
  if (total === 0) {
    return <EmptyState icon={ClipboardList} title={emptyTitle} description={emptyDescription} action={{ label: "Start new patient intake", href: "/new-case" }} />;
  }
  if (cases.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title="No matching cases"
        description="Adjust the search or clear the filters."
        action={onClearFilters ? { label: "Clear filters", onClick: onClearFilters } : { label: "Start new patient intake", href: "/new-case" }}
      />
    );
  }

  const selectable = Boolean(onSelect);
  const rowKey = (e: React.KeyboardEvent, c: ClinicalCaseData) => {
    if (!onSelect || (e.key !== "Enter" && e.key !== " ") || e.target !== e.currentTarget) return;
    e.preventDefault();
    onSelect(c);
  };

  return (
    <>
      <div className="hidden md:block">
        <Table caption={caption} captionHidden>
          <THead>
            <tr>
              {cols.map((col) => (
                <TH key={col.id} numeric={col.numeric}>
                  {col.header}
                </TH>
              ))}
              {renderAction && <TH className="text-right">Action</TH>}
            </tr>
          </THead>
          <TBody>
            {cases.map((c) => {
              const selected = selectable ? selectedCaseId === c.caseId : undefined;
              return (
                <TR
                  key={c.caseId}
                  selected={selected}
                  tabIndex={selectable ? 0 : undefined}
                  onClick={onSelect ? () => onSelect(c) : undefined}
                  onKeyDown={(e) => rowKey(e, c)}
                  aria-current={selected ? "true" : undefined}
                  className={cn(selectable && "cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus")}
                >
                  {cols.map((col) => (
                    <TD key={col.id} numeric={col.numeric} className={col.className}>
                      {col.cell(c)}
                    </TD>
                  ))}
                  {renderAction && <TD className="text-right whitespace-nowrap">{renderAction(c)}</TD>}
                </TR>
              );
            })}
          </TBody>
        </Table>
      </div>

      <ul className="md:hidden divide-y divide-rule border-t border-b border-rule" aria-label={caption}>
        {cases.map((c) => {
          const selected = selectable && selectedCaseId === c.caseId;
          return (
            <li
              key={c.caseId}
              tabIndex={selectable ? 0 : undefined}
              onClick={onSelect ? () => onSelect(c) : undefined}
              onKeyDown={(e) => rowKey(e as unknown as React.KeyboardEvent, c)}
              aria-current={selected ? "true" : undefined}
              className={cn("py-3 space-y-2", selectable && "cursor-pointer", selected && "bg-action-subtle -mx-2 px-2")}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">{columns.patient.cell(c)}</div>
                <RiskIndicator level={c.riskLevel} variant="tint" />
              </div>
              <dl className="grid grid-cols-[7rem_1fr] gap-x-3 gap-y-1 text-body-sm">
                {cols
                  .filter((col) => !col.cardHidden && col.id !== "priority" && col.id !== "priorityScore")
                  .map((col) => (
                    <React.Fragment key={col.id}>
                      <dt className="text-ink-muted">{col.header}</dt>
                      <dd className="min-w-0">{col.cell(c)}</dd>
                    </React.Fragment>
                  ))}
              </dl>
              {renderAction && <div className="flex justify-end">{renderAction(c)}</div>}
            </li>
          );
        })}
      </ul>
    </>
  );
}
