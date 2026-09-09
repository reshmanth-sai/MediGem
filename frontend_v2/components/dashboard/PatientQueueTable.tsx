"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PRESET_CASES, ClinicalCaseData } from "@/lib/casesData";
import { RiskIndicator } from "@/components/ui/RiskIndicator";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button, buttonVariants } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Input";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Search, ChevronRight, ClipboardList } from "lucide-react";

const RISK_FILTERS = ["ALL", "EMERGENCY", "HIGH", "MODERATE", "LOW"] as const;

function filterLabel(level: (typeof RISK_FILTERS)[number]) {
  return level.charAt(0) + level.slice(1).toLowerCase();
}

export function PatientQueueTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRisk, setFilterRisk] = useState<string>("ALL");

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
      (c.village && c.village.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRisk = filterRisk === "ALL" || c.riskLevel === filterRisk;

    return matchesSearch && matchesRisk;
  });

  const clinicHasNoCases = casesList.length === 0;

  const getPatientStatus = (patient: ClinicalCaseData) => {
    if (patient.riskLevel === "EMERGENCY") return "Immediate STAT";
    if (patient.disposition?.needsReferral) return "Awaiting review";
    return "Stable";
  };

  return (
    <section className="clinical-panel p-5 space-y-4 bg-surface border border-rule" aria-label="Patient Queue">
      <SectionHeader
        title="Patient Queue & Clinical Census"
        badge={
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-[2px] bg-surface-raised border border-rule text-ink-muted">
            {filteredCases.length} Active Patients
          </span>
        }
        subtitle="Prioritized by deterministic clinical emergency and triage severity"
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-muted pointer-events-none"
            aria-hidden="true"
          />
          <TextField
            type="text"
            placeholder="Search patient, ID, village..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9 text-body-sm"
            aria-label="Search patient queue"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by priority">
          {RISK_FILTERS.map((lvl) => (
            <Button
              key={lvl}
              type="button"
              size="sm"
              variant={filterRisk === lvl ? "primary" : "secondary"}
              onClick={() => setFilterRisk(lvl)}
              aria-pressed={filterRisk === lvl}
            >
              {filterLabel(lvl)}
            </Button>
          ))}
        </div>
      </div>

      {clinicHasNoCases ? (
        <EmptyState
          icon={ClipboardList}
          title="No active cases today"
          description="New patient intakes will appear here as soon as they are logged."
          action={{ label: "Start new patient intake", href: "/new-case" }}
        />
      ) : filteredCases.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No matching patients"
          description="Adjust your search query or clear priority filters."
          action={{
            label: "Clear filters",
            onClick: () => {
              setSearchQuery("");
              setFilterRisk("ALL");
            },
          }}
        />
      ) : (
        <Table caption="Today's patient triage queue, sorted by clinical priority" captionHidden>
          <THead>
            <tr>
              <TH>Patient</TH>
              <TH>Age / Sex</TH>
              <TH>Presenting complaint</TH>
              <TH>Priority</TH>
              <TH>Arrival</TH>
              <TH>Status</TH>
              <TH className="text-right">Action</TH>
            </tr>
          </THead>
          <TBody>
            {filteredCases.map((patient) => {
              const isEmergency = patient.riskLevel === "EMERGENCY";
              return (
                <TR key={patient.caseId}>
                  <TD>
                    <div className="font-semibold text-ink flex items-center gap-1.5">
                      <Link
                        href={`/results/${patient.caseId}`}
                        className="hover:underline text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                      >
                        {patient.patientName}
                      </Link>
                      <span className="text-label text-ink-muted normal-case font-mono">
                        ({patient.patientId})
                      </span>
                    </div>
                    <div className="text-body-sm text-ink-muted">{patient.village || "Rural clinic"}</div>
                  </TD>
                  <TD className="font-mono tabular">
                    {patient.age} {patient.gender.charAt(0)}
                  </TD>
                  <TD className="max-w-xs truncate text-ink" title={patient.chiefComplaint}>
                    {patient.chiefComplaint}
                  </TD>
                  <TD>
                    <RiskIndicator level={patient.riskLevel} variant="tint" />
                  </TD>
                  <TD className="text-ink-muted text-body-sm font-mono tabular">
                    {patient.arrivalTime || "15m ago"}
                  </TD>
                  <TD>
                    <span
                      className={`text-body-sm font-semibold ${
                        isEmergency
                          ? "text-risk-emergency"
                          : patient.riskLevel === "HIGH"
                          ? "text-risk-high"
                          : "text-ink-muted"
                      }`}
                    >
                      {getPatientStatus(patient)}
                    </span>
                  </TD>
                  <TD className="text-right">
                    <Link
                      href={`/results/${patient.caseId}`}
                      className={buttonVariants({
                        size: "sm",
                        variant: isEmergency ? "danger" : "secondary",
                      })}
                    >
                      Open
                      <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </TD>
                </TR>
              );
            })}
          </TBody>
        </Table>
      )}
    </section>
  );
}
