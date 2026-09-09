"use client";

import React from "react";
import Link from "next/link";
import { PRESET_CASES, ClinicalCaseData, CONFIDENCE_LABELS } from "@/lib/casesData";
import { RiskIndicator } from "@/components/ui/RiskIndicator";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { Section } from "@/components/ui/Card";
import { Label, BodySm } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";
import { FileText, ChevronRight, ClipboardList, Search } from "lucide-react";

interface CaseHistoryTableProps {
  searchQuery: string;
  selectedRisk: string;
  selectedStatus: string;
  selectedPatientId: string | null;
  onSelectPatient: (patient: ClinicalCaseData) => void;
  onOpenReferralModal: (patient: ClinicalCaseData) => void;
  onClearFilters: () => void;
}

export function CaseHistoryTable({
  searchQuery,
  selectedRisk,
  selectedStatus,
  selectedPatientId,
  onSelectPatient,
  onOpenReferralModal,
  onClearFilters,
}: CaseHistoryTableProps) {
  const riskWeight: Record<string, number> = {
    EMERGENCY: 4,
    HIGH: 3,
    MODERATE: 2,
    LOW: 1,
  };

  const casesList: ClinicalCaseData[] = Object.values(PRESET_CASES).sort(
    (a, b) => (riskWeight[b.riskLevel] || 0) - (riskWeight[a.riskLevel] || 0)
  );

  const filteredCases = casesList.filter((c) => {
    const matchesSearch =
      c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.village && c.village.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.primaryFinding.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRisk = selectedRisk === "ALL" || c.riskLevel === selectedRisk;
    const matchesStatus =
      selectedStatus === "ALL" ||
      (selectedStatus === "TODAY" && c.arrivalTime?.includes("min")) ||
      (selectedStatus === "PENDING" && (c.status === "waiting" || c.status === "analyzing")) ||
      (selectedStatus === "REFERRED" && c.status === "referred") ||
      (selectedStatus === "COMPLETED" && c.status === "completed");

    return matchesSearch && matchesRisk && matchesStatus;
  });

  const clinicHasNoCases = casesList.length === 0;

  /**
   * Row selection is the only route into the workspace panel, so the row has
   * to be operable from the keyboard (WCAG 2.1.1). Enter and Space match the
   * activation keys of the click target this row stands in for.
   *
   * The target check stops the row handler firing a second time when the key
   * was pressed on the referral button or the results link inside the row:
   * those bubble their own Enter up to the `<tr>`, and both already have
   * their own activation behaviour.
   */
  const handleRowKeyDown = (
    event: React.KeyboardEvent<HTMLTableRowElement>,
    patient: ClinicalCaseData
  ) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    if (event.target !== event.currentTarget) return;
    event.preventDefault();
    onSelectPatient(patient);
  };

  return (
    <Section
      heading="Active patient queue"
      headingAdornment={
        <Label className="normal-case">{filteredCases.length} of {casesList.length} patients</Label>
      }
    >
      <BodySm className="text-ink-muted">Select a row to view the clinical assessment in the workspace panel.</BodySm>

      {clinicHasNoCases ? (
        <EmptyState
          icon={ClipboardList}
          title="No cases in history"
          description="Cases will appear here once patient intakes have been recorded."
          action={{ label: "Start new patient intake", href: "/new-case" }}
        />
      ) : filteredCases.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No matching patients"
          description="Try adjusting your search query or risk filters."
          action={{ label: "Clear filters", onClick: onClearFilters }}
        />
      ) : (
        <Table
          caption="Active patient queue, sorted by risk severity"
          captionHidden
          containerClassName="max-h-[640px] overflow-y-auto"
        >
          <THead>
            <tr>
              <TH>Patient and village</TH>
              <TH>Age / sex</TH>
              <TH>Chief complaint</TH>
              <TH>Risk level</TH>
              <TH>Confidence</TH>
              <TH className="text-right">Actions</TH>
            </tr>
          </THead>
          <TBody>
            {filteredCases.map((patient) => {
              const isSelected = selectedPatientId === patient.caseId;
              const isEmergency = patient.riskLevel === "EMERGENCY";

              /*
               * The row is a real tab stop with an Enter/Space handler, not a
               * click-only target. `role="button"` is deliberately not used:
               * on a `<tr>` it would drop the row and cell semantics that let
               * a screen reader read each value against its column header,
               * which costs more than the role gains. The table therefore
               * stays a plain `<table>` rather than a `role="grid"`, since a
               * grid announces a full arrow-key navigation model this table
               * does not implement. Selection is carried by a visible
               * "Selected" label as well as the fill, so it never rests on
               * colour or on `aria-selected` alone.
               */
              return (
                <TR
                  key={patient.caseId}
                  tabIndex={0}
                  onClick={() => onSelectPatient(patient)}
                  onKeyDown={(event) => handleRowKeyDown(event, patient)}
                  selected={isSelected}
                  aria-current={isSelected ? true : undefined}
                  className={cn(
                    "cursor-pointer",
                    "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus",
                    isEmergency && !isSelected && "border-l-4 border-l-risk-emergency"
                  )}
                >
                  <TD>
                    <div className="font-semibold text-ink flex items-center gap-1.5">
                      {patient.patientName}
                      <span className="text-label text-ink-muted normal-case">({patient.patientId})</span>
                      {isSelected && (
                        <span className="rounded-control border border-rule px-1.5 text-label font-semibold text-ink-muted normal-case">
                          Selected
                        </span>
                      )}
                    </div>
                    <div className="text-body-sm text-ink-muted">{patient.village || "Rural clinic"}</div>
                  </TD>

                  <TD>
                    {patient.age}y / {patient.gender.charAt(0)}
                  </TD>

                  <TD className="max-w-xs truncate" title={patient.chiefComplaint}>
                    {patient.chiefComplaint}
                  </TD>

                  <TD>
                    <RiskIndicator level={patient.riskLevel} variant="tint" showScore={patient.urgencyScore} />
                  </TD>

                  <TD>{CONFIDENCE_LABELS[patient.confidenceLevel]}</TD>

                  <TD className="text-right">
                    <div
                      className="flex items-center justify-end gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        size="sm"
                        variant="secondary"
                        aria-label="Generate referral memo"
                        onClick={() => onOpenReferralModal(patient)}
                      >
                        <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                      </Button>
                      {/*
                        Styled as a Button but rendered as the link itself. A
                        `<button>` nested inside `<a>` is invalid HTML, creates
                        a second tab stop for a single action, and leaves the
                        anchor with no accessible name, since the inner
                        aria-label names the button rather than the link.
                      */}
                      <Link
                        href={`/results/${patient.caseId}`}
                        aria-label={`Open case results for ${patient.patientName}`}
                        className={buttonVariants({ size: "sm", variant: "secondary" })}
                      >
                        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </TD>
                </TR>
              );
            })}
          </TBody>
        </Table>
      )}
    </Section>
  );
}
