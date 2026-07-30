"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ExternalLink, User } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { RiskBadge } from "@/components/ui/Badge";
import { RiskLevel } from "@/types/analysis";

interface CaseItem {
  id: string;
  patientId: string;
  age: number;
  gender: string;
  symptoms: string;
  date: string;
  riskLevel: RiskLevel;
}

const MOCK_RECENT_CASES: CaseItem[] = [
  {
    id: "CASE-8901",
    patientId: "P-101",
    age: 45,
    gender: "Male",
    symptoms: "Chest tightness, Palpitations",
    date: "2026-07-30 12:00",
    riskLevel: "MODERATE",
  },
  {
    id: "CASE-8902",
    patientId: "P-102",
    age: 62,
    gender: "Female",
    symptoms: "Severe crushing chest pain, Diaphoresis",
    date: "2026-07-30 11:30",
    riskLevel: "EMERGENCY",
  },
  {
    id: "CASE-8903",
    patientId: "P-103",
    age: 28,
    gender: "Male",
    symptoms: "Mild fever, Cough",
    date: "2026-07-30 10:15",
    riskLevel: "LOW",
  },
  {
    id: "CASE-8904",
    patientId: "P-104",
    age: 54,
    gender: "Female",
    symptoms: "Elevated blood pressure, Headache",
    date: "2026-07-29 16:45",
    riskLevel: "HIGH",
  },
];

export function RecentCasesPanel() {
  const [search, setSearch] = useState("");

  const filtered = MOCK_RECENT_CASES.filter(
    (item) =>
      item.patientId.toLowerCase().includes(search.toLowerCase()) ||
      item.symptoms.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Recent Patient Cases
          </h2>
          <p className="text-xs text-slate-500">
            Click on any case to review generated clinical summaries & referral memorandums
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Patient ID or symptom..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 dark:text-white"
          />
        </div>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800 overflow-x-auto">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <div
              key={item.id}
              className="py-3 flex items-center justify-between hover:bg-slate-50/80 dark:hover:bg-slate-800/50 px-2 rounded-lg transition-colors gap-4"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className="p-2 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 shrink-0">
                  <User className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.patientId}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">({item.id})</span>
                    <span className="text-[11px] text-slate-500">
                      • {item.age}y/o {item.gender}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 truncate max-w-sm">
                    {item.symptoms}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                  {item.date}
                </span>
                <RiskBadge level={item.riskLevel} />
                <Link
                  href={`/results/${item.id}`}
                  className="p-1.5 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  title="View Case Results"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-400 py-6 text-center">No matching cases found.</p>
        )}
      </div>
    </Card>
  );
}
