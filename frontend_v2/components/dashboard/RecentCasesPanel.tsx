"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ExternalLink, ArrowRight, User } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { RiskBadge } from "@/components/ui/Badge";
import { RiskLevel } from "@/types/analysis";

interface CaseItem {
  id: string;
  patientId: string;
  name: string;
  age: number;
  gender: string;
  symptoms: string;
  risk: RiskLevel;
  date: string;
  timeAgo: string;
}

export function RecentCasesPanel() {
  const [query, setQuery] = useState("");

  const cases: CaseItem[] = [
    {
      id: "CASE-8901",
      patientId: "P-101",
      name: "Ramesh K.",
      age: 45,
      gender: "M",
      symptoms: "Chest tightness, Palpitations",
      risk: "MODERATE",
      date: "2026-07-30 12:00",
      timeAgo: "2 min ago",
    },
    {
      id: "CASE-8902",
      patientId: "P-102",
      name: "Anitha S.",
      age: 62,
      gender: "F",
      symptoms: "Severe crushing chest pain, Diaphoresis",
      risk: "EMERGENCY",
      date: "2026-07-30 11:30",
      timeAgo: "30 min ago",
    },
    {
      id: "CASE-8903",
      patientId: "P-103",
      name: "Vikram P.",
      age: 28,
      gender: "M",
      symptoms: "Mild fever, Dry cough",
      risk: "LOW",
      date: "2026-07-30 10:15",
      timeAgo: "2 hours ago",
    },
    {
      id: "CASE-8904",
      patientId: "P-104",
      name: "Meena R.",
      age: 54,
      gender: "F",
      symptoms: "Elevated blood pressure, Severe headache",
      risk: "HIGH",
      date: "2026-07-29 16:45",
      timeAgo: "Yesterday",
    },
  ];

  const filtered = cases.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.patientId.toLowerCase().includes(query.toLowerCase()) ||
      c.symptoms.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Card className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Recent Patient Cases
          </h2>
          <p className="text-xs text-slate-500">
            Click any patient card to review full clinical findings and referral memo
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patient, ID, or symptoms..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-white"
          />
        </div>
      </div>

      {/* Rich Scannable Patient Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((item) => (
          <Link key={item.id} href={`/results/${item.id}`} className="block group">
            <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-teal-500/60 transition-all duration-300 space-y-2.5 hover:-translate-y-0.5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="h-8 w-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xs shrink-0 border border-teal-500/20">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-teal-500 transition-colors">
                      {item.name} <span className="text-slate-400 font-medium">({item.age} {item.gender})</span>
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono">ID: {item.patientId} • {item.id}</p>
                  </div>
                </div>

                <RiskBadge level={item.risk} />
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 truncate pl-0.5">
                {item.symptoms}
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                <span>Completed {item.timeAgo}</span>
                <span className="font-semibold text-teal-600 dark:text-teal-400 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                  <span>View Case</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="pt-1 flex justify-end">
        <Link href="/history" className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1">
          <span>View All Patient Cases in History</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </Card>
  );
}
