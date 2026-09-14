"use client";

import { allCases } from "@/lib/caseStats";

import React from "react";
import { Search, Layers } from "lucide-react";
import { TextField } from "@/components/ui/Input";
import { Label, Data } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";

interface SegmentedQueueFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedRisk: string;
  setSelectedRisk: (risk: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
}

const RISK_LEVELS = [
  { id: "EMERGENCY", label: "Emergency", iconClass: "text-risk-emergency" },
  { id: "HIGH", label: "High Risk", iconClass: "text-risk-high" },
  { id: "MODERATE", label: "Moderate", iconClass: "text-risk-moderate" },
  { id: "LOW", label: "Low Risk", iconClass: "text-risk-low" },
] as const;

// Counts come from the case list itself, never typed in.
function riskCounts() {
  const cases = allCases();
  return RISK_LEVELS.map((r) => ({ ...r, count: cases.filter((c) => c.riskLevel === r.id).length }));
}

const ACTIVE_RISK_CLASS: Record<string, string> = {
  ALL: "bg-surface-raised border-rule-strong text-ink",
  EMERGENCY: "bg-risk-emergency/10 border-risk-emergency text-risk-emergency",
  HIGH: "bg-risk-high/10 border-risk-high text-risk-high",
  MODERATE: "bg-risk-moderate/10 border-risk-moderate text-risk-moderate",
  LOW: "bg-risk-low/10 border-risk-low text-risk-low",
};

const STATUS_FILTERS = [
  { id: "ALL", label: "All Status" },
  { id: "TODAY", label: "Today" },
  { id: "PENDING", label: "Pending Review" },
  { id: "REFERRED", label: "Referred" },
  { id: "COMPLETED", label: "Completed" },
];

export function SegmentedQueueFilters({
  searchQuery,
  setSearchQuery,
  selectedRisk,
  setSelectedRisk,
  selectedStatus,
  setSelectedStatus,
}: SegmentedQueueFiltersProps) {
  const toggleRisk = (riskId: string) => {
    if (selectedRisk === riskId) {
      setSelectedRisk("ALL");
    } else {
      setSelectedRisk(riskId);
    }
  };

  return (
    <div className="space-y-3 pt-1">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        {/* Search Input Box */}
        <div className="relative flex-1 w-full lg:max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search patients, symptoms, or protocols..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-body-sm bg-surface border border-rule rounded-card text-ink placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-action focus:border-action transition-colors"
            aria-label="Search patient queue"
          />
        </div>

        {/* Workflow Status Chips */}
        <div
          className="flex flex-wrap items-center gap-1 text-body-sm"
          role="group"
          aria-label="Filter by status"
        >
          {STATUS_FILTERS.map((s) => {
            const isActive = selectedStatus === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedStatus(s.id)}
                aria-pressed={isActive}
                className={cn(
                  "px-3 py-1 rounded-control transition-colors font-medium text-body-sm",
                  isActive
                    ? "bg-action/10 text-action border border-action/20 font-semibold"
                    : "text-ink-muted hover:text-ink hover:bg-surface-raised"
                )}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pill-shaped Risk Filter Buttons */}
      <div
        className="flex flex-wrap items-center gap-2.5"
        role="group"
        aria-label="Filter by risk level"
      >
        {riskCounts().map((rc) => {
          const isActive = selectedRisk === rc.id;
          return (
            <button
              key={rc.id}
              type="button"
              onClick={() => toggleRisk(rc.id)}
              aria-pressed={isActive}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-card border text-body-sm font-medium transition-all",
                isActive
                  ? rc.id === "EMERGENCY"
                    ? "bg-risk-emergency/10 border-risk-emergency text-risk-emergency ring-1 ring-risk-emergency"
                    : rc.id === "HIGH"
                    ? "bg-risk-high/10 border-risk-high text-risk-high ring-1 ring-risk-high"
                    : rc.id === "MODERATE"
                    ? "bg-risk-moderate/10 border-risk-moderate text-risk-moderate ring-1 ring-risk-moderate"
                    : "bg-risk-low/10 border-risk-low text-risk-low ring-1 ring-risk-low"
                  : "bg-surface border-rule text-ink hover:border-rule-strong hover:bg-surface-raised"
              )}
            >
              <span
                className={cn(
                  "h-2 w-2 rounded-full shrink-0",
                  rc.id === "EMERGENCY"
                    ? "bg-risk-emergency"
                    : rc.id === "HIGH"
                    ? "bg-risk-high"
                    : rc.id === "MODERATE"
                    ? "bg-risk-moderate"
                    : "bg-risk-low"
                )}
                aria-hidden="true"
              />
              <span className="text-ink">{rc.label}</span>
              <span className="font-bold text-ink ml-1">{rc.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
