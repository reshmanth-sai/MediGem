"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PRESET_CASES, ClinicalCaseData, CONFIDENCE_LABELS } from "@/lib/casesData";
import { RiskIndicator } from "@/components/ui/RiskIndicator";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button, buttonVariants } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Input";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { Section } from "@/components/ui/Card";
import { Label } from "@/components/ui/Typography";
import { Search, ArrowRight, ClipboardList } from "lucide-react";

const RISK_FILTERS = ["ALL", "EMERGENCY", "HIGH", "MODERATE", "LOW"] as const;

function filterLabel(level: (typeof RISK_FILTERS)[number]) {
  return level.charAt(0) + level.slice(1).toLowerCase();
}

export function PatientQueueTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRisk, setFilterRisk] = useState<string>("ALL");

  // Sort by risk priority: EMERGENCY -> HIGH -> MODERATE -> LOW
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

  return (
    <Section
      heading="Today's patient intake and queue"
      headingAdornment={<Label className="normal-case">Prioritized by emergency severity</Label>}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted pointer-events-none"
            aria-hidden="true"
          />
          <TextField
            type="text"
            placeholder="Search patient, ID, village"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            aria-label="Search patient queue"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by risk level">
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
          title="No matching cases"
          description="Try a different search term or clear the risk filter to see the full queue."
          action={{
            label: "Clear filters",
            onClick: () => {
              setSearchQuery("");
              setFilterRisk("ALL");
            },
          }}
        />
      ) : (
        <Table caption="Today's patient intake queue, sorted by emergency severity" captionHidden>
          <THead>
            <tr>
              <TH>Patient and village</TH>
              <TH>Age / sex</TH>
              <TH>Chief complaint</TH>
              <TH>Risk level</TH>
              <TH>AI confidence</TH>
              <TH>Arrival</TH>
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
                      {patient.patientName}
                      <span className="text-label text-ink-muted normal-case">({patient.patientId})</span>
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
                  <TD className="text-ink-muted">{patient.arrivalTime || "15 mins ago"}</TD>
                  <TD className="text-right">
                    <Link
                      href={`/results/${patient.caseId}`}
                      className={buttonVariants({
                        size: "sm",
                        variant: isEmergency ? "danger" : "secondary",
                      })}
                    >
                      Open case
                      <span className="inline-flex" aria-hidden="true">
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </Link>
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
