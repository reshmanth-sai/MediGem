"use client";

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

const RISK_COUNTS = [
  { id: "ALL", label: "All Cases", count: 128, colorClass: "text-ink" },
  { id: "EMERGENCY", label: "Emergency", count: 14, colorClass: "text-risk-emergency" },
  { id: "HIGH", label: "High Risk", count: 31, colorClass: "text-risk-high" },
  { id: "MODERATE", label: "Moderate", count: 52, colorClass: "text-risk-moderate" },
  { id: "LOW", label: "Low Risk", count: 31, colorClass: "text-risk-low" },
] as const;

const ACTIVE_RISK_CLASS: Record<string, string> = {
  ALL: "bg-surface-raised border-rule-strong text-ink",
  EMERGENCY: "bg-risk-emergency/12 border-risk-emergency/60 text-risk-emergency",
  HIGH: "bg-risk-high/12 border-risk-high/60 text-risk-high",
  MODERATE: "bg-risk-moderate/12 border-risk-moderate/60 text-risk-moderate",
  LOW: "bg-risk-low/12 border-risk-low/60 text-risk-low",
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
  return (
    <div className="rounded-card bg-surface border border-rule p-4 space-y-3">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        {/* Search Input Box */}
        <div className="relative flex-1 w-full lg:max-w-md">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted pointer-events-none"
            aria-hidden="true"
          />
          <TextField
            type="text"
            placeholder="Search patient name, ID, village, diagnosis, or symptom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            aria-label="Search patient queue"
          />
        </div>

        {/* Workflow Status Chips */}
        <div
          className="flex flex-wrap items-center gap-1.5 bg-ground p-1 rounded-control border border-rule"
          role="group"
          aria-label="Filter by status"
        >
          {STATUS_FILTERS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedStatus(s.id)}
              aria-pressed={selectedStatus === s.id}
              className={cn(
                "px-3 py-1.5 rounded-control transition-colors text-body-sm font-semibold",
                selectedStatus === s.id
                  ? "bg-surface-raised text-action border border-rule-strong"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Segmented Risk Level Buttons with Live Counts */}
      <div
        className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-3 border-t border-rule"
        role="group"
        aria-label="Filter by risk level"
      >
        {RISK_COUNTS.map((rc) => {
          const isActive = selectedRisk === rc.id;
          return (
            <button
              key={rc.id}
              type="button"
              onClick={() => setSelectedRisk(rc.id)}
              aria-pressed={isActive}
              className={cn(
                "p-2.5 rounded-control border text-left transition-colors flex items-center justify-between",
                isActive
                  ? ACTIVE_RISK_CLASS[rc.id]
                  : "bg-ground border-rule text-ink-muted hover:border-rule-strong hover:text-ink"
              )}
            >
              <div>
                <Label className={cn(isActive ? "text-inherit" : undefined)}>{rc.label}</Label>
                <Data className={cn("block", isActive ? "text-inherit" : rc.colorClass)}>{rc.count}</Data>
              </div>
              <Layers
                className={cn("h-4 w-4", isActive ? "opacity-100" : "opacity-40")}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
