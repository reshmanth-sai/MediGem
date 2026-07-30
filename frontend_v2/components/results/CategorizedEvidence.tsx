"use client";

import React, { useState } from "react";
import { ClinicalCaseData } from "@/lib/casesData";
import { FileText, HeartPulse, Activity, CheckCircle2, ChevronDown, ChevronUp, Layers } from "lucide-react";

interface CategorizedEvidenceProps {
  caseData: ClinicalCaseData;
}

export function CategorizedEvidence({ caseData }: CategorizedEvidenceProps) {
  const [activeTab, setActiveTab] = useState<"vitals" | "ecg" | "labs" | "symptoms">("vitals");

  const evidenceCategories = [
    { id: "vitals", label: "Vital Signs", count: caseData.vitals.length, icon: HeartPulse },
    { id: "ecg", label: "12-Lead ECG", count: 1, icon: Activity },
    { id: "labs", label: "Lab Diagnostic Reports", count: 1, icon: FileText },
    { id: "symptoms", label: "Symptom History", count: 2, icon: Layers },
  ] as const;

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-4 shadow-xl">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <Layers className="h-4 w-4 text-teal-400" />
          <span>Categorized Clinical Evidence</span>
        </h3>
        <span className="text-[10px] text-slate-400 font-mono">Multimodal Evidence Provenance</span>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
        {evidenceCategories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                isActive
                  ? "bg-slate-800 text-teal-300 border border-slate-700 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{cat.label}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400">
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-3">
        {activeTab === "vitals" && (
          <div className="space-y-2">
            <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">Triage Vital Signs Evidence</p>
            <div className="grid grid-cols-2 gap-2 font-mono">
              {caseData.vitals.map((v) => (
                <div key={v.label} className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">{v.label}:</span>
                  <span className="font-bold text-white">{v.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "ecg" && (
          <div className="space-y-2 font-mono text-[11.5px]">
            <p className="text-[10px] uppercase font-bold text-slate-400">12-Lead ECG Rhythm Strip Evidence</p>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <p className="text-teal-300 font-bold">Rhythm: Sinus Tachycardia (HR 98 bpm)</p>
              <p className="text-slate-300">Axis: Normal (0° to +90°). QRS Duration: 84ms (Normal).</p>
              <p className="text-slate-400">ST Segment: No ST elevation or depression detected.</p>
            </div>
          </div>
        )}

        {activeTab === "labs" && (
          <div className="space-y-2 font-mono text-[11.5px]">
            <p className="text-[10px] uppercase font-bold text-slate-400">Lab Report PDF Extraction</p>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <p className="text-teal-300 font-bold">Document: Complete Blood Count (CBC)</p>
              <p className="text-slate-300">WBC: 14.5 k/uL (Elevated) | Neutrophils: 11.2 k/uL (Neutrophilia)</p>
              <p className="text-slate-400">Extracted via PyMuPDF Text Layer (OCR confidence 100%).</p>
            </div>
          </div>
        )}

        {activeTab === "symptoms" && (
          <div className="space-y-2 text-[11.5px]">
            <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">Presenting Symptom History</p>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <p className="text-white font-medium">• {caseData.chiefComplaint}</p>
              <p className="text-slate-400 font-mono text-[11px]">• Duration: Onset 2 hours prior to clinic arrival.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
