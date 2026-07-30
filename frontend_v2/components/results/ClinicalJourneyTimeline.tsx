"use client";

import React, { useState } from "react";
import { ClinicalCaseData } from "@/lib/casesData";
import { Clock, CheckCircle2, ShieldCheck, Brain, FileText, UserCheck, Filter } from "lucide-react";

interface ClinicalJourneyTimelineProps {
  caseData: ClinicalCaseData;
}

export function ClinicalJourneyTimeline({ caseData }: ClinicalJourneyTimelineProps) {
  const [filter, setFilter] = useState<"ALL" | "CLINICAL" | "AI" | "SAFETY">("ALL");

  const events = [
    { type: "CLINICAL", time: "2 hours ago", title: "Symptom Onset", desc: caseData.chiefComplaint, icon: Clock, color: "text-amber-400" },
    { type: "CLINICAL", time: "15 mins ago", title: "Clinic Intake & Vitals Recorded", desc: `HR ${caseData.vitals.find(v=>v.label==="HR")?.value}, BP ${caseData.vitals.find(v=>v.label==="BP")?.value} by Ramesh Kumar (CHO)`, icon: UserCheck, color: "text-teal-400" },
    { type: "UPLOADS", time: "12 mins ago", title: "Document OCR & Extraction", desc: "Lab report PDF text layer extracted successfully.", icon: FileText, color: "text-teal-400" },
    { type: "AI", time: "10 mins ago", title: "Gemma 3 Multimodal Reasoning", desc: `Primary diagnosis generated with ${caseData.aiConfidence || 96.4}% confidence.`, icon: Brain, color: "text-teal-400" },
    { type: "SAFETY", time: "10 mins ago", title: "Emergency Safety Gate", desc: "Deterministic safety rules evaluated (<0.28ms). Safety pass confirmed.", icon: ShieldCheck, color: "text-emerald-400" },
    { type: "CLINICAL", time: "Just now", title: "Clinician Workstation Active", desc: "Awaiting final human decision and referral memo generation.", icon: CheckCircle2, color: "text-emerald-400 font-bold" },
  ];

  const filteredEvents = events.filter((ev) => filter === "ALL" || ev.type === filter);

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <Clock className="h-4 w-4 text-teal-400" />
          <span>Expandable Audit Journey Timeline</span>
        </h3>
        <span className="text-[10px] text-slate-400 font-mono">{filteredEvents.length} Events</span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-mono">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-2.5 py-1 rounded-lg transition-all ${filter === "ALL" ? "bg-slate-800 text-teal-300 font-bold" : "text-slate-500 hover:text-white"}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("CLINICAL")}
          className={`px-2.5 py-1 rounded-lg transition-all ${filter === "CLINICAL" ? "bg-slate-800 text-teal-300 font-bold" : "text-slate-500 hover:text-white"}`}
        >
          Clinical
        </button>
        <button
          onClick={() => setFilter("AI")}
          className={`px-2.5 py-1 rounded-lg transition-all ${filter === "AI" ? "bg-slate-800 text-teal-300 font-bold" : "text-slate-500 hover:text-white"}`}
        >
          AI
        </button>
        <button
          onClick={() => setFilter("SAFETY")}
          className={`px-2.5 py-1 rounded-lg transition-all ${filter === "SAFETY" ? "bg-slate-800 text-teal-300 font-bold" : "text-slate-500 hover:text-white"}`}
        >
          Safety
        </button>
      </div>

      {/* Event Nodes */}
      <div className="space-y-3 pt-1">
        {filteredEvents.map((ev, idx) => {
          const Icon = ev.icon;
          return (
            <div key={idx} className="flex items-start space-x-3 text-xs">
              <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-teal-400 shrink-0 mt-0.5">
                <Icon className={`h-3.5 w-3.5 ${ev.color}`} />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white text-[11.5px]">{ev.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono">• {ev.time}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{ev.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
