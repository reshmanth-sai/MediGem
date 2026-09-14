"use client";

import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Input";
import { RISK_FILTERS, riskFilterLabel, type RiskFilter } from "@/lib/caseFilter";

export interface CaseFilterBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  risk: RiskFilter;
  onRiskChange: (r: RiskFilter) => void;
  placeholder?: string;
  /** Extra controls (a status or review filter) rendered after the risk chips. */
  children?: React.ReactNode;
}

export function CaseFilterBar({ query, onQueryChange, risk, onRiskChange, placeholder = "Search patient, ID, complaint, village", children }: CaseFilterBarProps) {
  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
      <div className="relative w-full lg:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-muted pointer-events-none" aria-hidden="true" />
        <TextField type="search" placeholder={placeholder} value={query} onChange={(e) => onQueryChange(e.target.value)} className="pl-8 h-9 text-body-sm" aria-label="Search cases" />
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by risk">
          {RISK_FILTERS.map((lvl) => (
            <Button key={lvl} type="button" size="sm" variant={risk === lvl ? "primary" : "secondary"} onClick={() => onRiskChange(lvl)} aria-pressed={risk === lvl}>
              {riskFilterLabel(lvl)}
            </Button>
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}
