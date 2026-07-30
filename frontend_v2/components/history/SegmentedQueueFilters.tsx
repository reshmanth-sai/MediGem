"use client";

import React from "react";
import { Search, Filter, Layers, CheckCircle2, Clock, FileUp } from "lucide-react";

interface SegmentedQueueFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedRisk: string;
  setSelectedRisk: (risk: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
}

export function SegmentedQueueFilters({
  searchQuery,
  setSearchQuery,
  selectedRisk,
  setSelectedRisk,
  selectedStatus,
  setSelectedStatus,
}: SegmentedQueueFiltersProps) {
  const riskCounts = [
    { id: "ALL", label: "All Cases", count: 128, color: "text-slate-300" },
    { id: "EMERGENCY", label: "Emergency", count: 14, color: "text-rose-400 font-bold" },
    { id: "HIGH", label: "High Risk", count: 31, color: "text-amber-400" },
    { id: "MODERATE", label: "Moderate", count: 52, color: "text-teal-400" },
    { id: "LOW", label: "Low Risk", count: 31, color: "text-emerald-400" },
  ];

  const statusFilters = [
    { id: "ALL", label: "All Status" },
    { id: "TODAY", label: "Today" },
    { id: "PENDING", label: "Pending Review" },
    { id: "REFERRED", label: "Referred" },
    { id: "COMPLETED", label: "Completed" },
  ];

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-3 shadow-md">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        {/* Search Input Box */}
        <div className="relative flex-1 w-full lg:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient name, ID, village, diagnosis, or symptom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-medium transition-colors"
          />
        </div>

        {/* Workflow Status Chips */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          {statusFilters.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedStatus(s.id)}
              className={`px-3 py-1.5 rounded-lg transition-all text-[11px] ${
                selectedStatus === s.id
                  ? "bg-slate-800 text-teal-300 font-bold border border-slate-700 shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Segmented Risk Level Buttons with Live Counts */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 border-t border-slate-800/60">
        {riskCounts.map((rc) => {
          const isActive = selectedRisk === rc.id;
          return (
            <button
              key={rc.id}
              onClick={() => setSelectedRisk(rc.id)}
              className={`p-2.5 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${
                isActive
                  ? rc.id === "EMERGENCY"
                    ? "bg-rose-950/80 border-rose-500/80 text-rose-300 shadow-md shadow-rose-950/40"
                    : "bg-slate-800 border-teal-500/60 text-teal-300 shadow-md"
                  : "bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200"
              }`}
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider font-mono opacity-80">{rc.label}</p>
                <p className={`text-sm font-black font-mono ${rc.color}`}>{rc.count}</p>
              </div>
              <Layers className={`h-4 w-4 opacity-40 ${isActive ? "opacity-100 text-teal-400" : ""}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
