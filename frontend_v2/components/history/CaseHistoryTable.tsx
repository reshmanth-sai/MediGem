"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Filter, ExternalLink, LayoutGrid, List, AlignJustify, Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { RiskBadge } from "@/components/ui/Badge";
import { SelectedCaseDetails, CaseDetailsPreview } from "./CaseDetailsPreview";

export function CaseHistoryTable() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"LIST" | "GRID" | "COMPACT">("LIST");
  const [favorites, setFavorites] = useState<string[]>(["CASE-8902"]);
  const [selectedCase, setSelectedCase] = useState<SelectedCaseDetails | null>(null);

  const cases: SelectedCaseDetails[] = [
    { id: "CASE-8901", patientId: "P-101", age: 45, gender: "Male", symptoms: "Chest tightness, Palpitations", date: "2026-07-30 12:00", riskLevel: "MODERATE", finding: "Sinus Tachycardia with mild BP elevation" },
    { id: "CASE-8902", patientId: "P-102", age: 62, gender: "Female", symptoms: "Severe crushing chest pain, Diaphoresis", date: "2026-07-30 11:30", riskLevel: "EMERGENCY", finding: "Acute Cardiac Emergency Intercepted (< 0.3ms)" },
    { id: "CASE-8903", patientId: "P-103", age: 28, gender: "Male", symptoms: "Mild fever, Cough", date: "2026-07-30 10:15", riskLevel: "LOW", finding: "Normal physiological parameters" },
    { id: "CASE-8904", patientId: "P-104", age: 54, gender: "Female", symptoms: "Elevated BP, Headache", date: "2026-07-29 16:45", riskLevel: "HIGH", finding: "Hypertensive episode requiring monitoring" },
  ];

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const filtered = cases.filter((item) => {
    const matchesSearch =
      item.patientId.toLowerCase().includes(search.toLowerCase()) ||
      item.symptoms.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase());

    const matchesRisk = riskFilter === "ALL" || item.riskLevel === riskFilter;

    return matchesSearch && matchesRisk;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <Card className="lg:col-span-2 space-y-4">
        {/* Search & Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Patient ID, symptoms, or Case ID..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 dark:text-white"
            />
          </div>

          <div className="flex items-center space-x-2">
            {/* Risk Filters */}
            <Filter className="h-4 w-4 text-slate-400" />
            {["ALL", "EMERGENCY", "HIGH", "MODERATE", "LOW"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setRiskFilter(lvl)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded transition-colors ${
                  riskFilter === lvl
                    ? "bg-teal-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                {lvl}
              </button>
            ))}

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 pl-2 border-l border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setViewMode("LIST")}
                className={`p-1.5 rounded ${viewMode === "LIST" ? "bg-teal-600 text-white" : "text-slate-400"}`}
              >
                <List className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode("GRID")}
                className={`p-1.5 rounded ${viewMode === "GRID" ? "bg-teal-600 text-white" : "text-slate-400"}`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode("COMPACT")}
                className={`p-1.5 rounded ${viewMode === "COMPACT" ? "bg-teal-600 text-white" : "text-slate-400"}`}
              >
                <AlignJustify className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* View Mode Layout Render */}
        {viewMode === "GRID" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedCase(item)}
                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all space-y-2 ${
                  selectedCase?.id === item.id
                    ? "bg-teal-50 dark:bg-teal-950 border-teal-600"
                    : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <button onClick={(e) => toggleFavorite(item.id, e)}>
                      <Star className={`h-3.5 w-3.5 ${favorites.includes(item.id) ? "fill-amber-400 text-amber-400" : "text-slate-400"}`} />
                    </button>
                    <span className="font-bold text-slate-900 dark:text-white">{item.patientId}</span>
                  </div>
                  <RiskBadge level={item.riskLevel} />
                </div>
                <p className="text-slate-600 dark:text-slate-300 truncate">{item.symptoms}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                  <span>{item.date}</span>
                  <Link href={`/results/${item.id}`} onClick={(e) => e.stopPropagation()}>
                    <ExternalLink className="h-3.5 w-3.5 hover:text-teal-600" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800 overflow-x-auto">
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedCase(item)}
                  className={`py-3 px-3 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                    selectedCase?.id === item.id
                      ? "bg-teal-50/80 dark:bg-teal-950/60"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <button onClick={(e) => toggleFavorite(item.id, e)}>
                        <Star className={`h-3.5 w-3.5 ${favorites.includes(item.id) ? "fill-amber-400 text-amber-400" : "text-slate-400"}`} />
                      </button>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.patientId}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">({item.id})</span>
                      <span className="text-[11px] text-slate-500">• {item.date}</span>
                    </div>
                    {viewMode === "LIST" && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 truncate max-w-md">
                        {item.symptoms}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <RiskBadge level={item.riskLevel} />
                    <Link href={`/results/${item.id}`} onClick={(e) => e.stopPropagation()}>
                      <ExternalLink className="h-4 w-4 text-slate-400 hover:text-teal-600" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No matching cases found.</p>
            )}
          </div>
        )}
      </Card>

      {/* Side Preview Panel */}
      <div className="lg:col-span-1">
        {selectedCase ? (
          <CaseDetailsPreview caseItem={selectedCase} onClose={() => setSelectedCase(null)} />
        ) : (
          <Card className="p-6 text-center space-y-2 border-dashed">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Select any case row to preview details
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
