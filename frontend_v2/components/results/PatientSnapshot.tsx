"use client";

import React, { useState } from "react";
import { User, ChevronDown, ChevronUp, Activity, Stethoscope } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function PatientSnapshot({
  patientId = "P-101",
  name = "Ramesh Kumar",
  age = 45,
  gender = "Male",
  vitals = [
    { label: "HR", value: "98 bpm", status: "warning" },
    { label: "BP", value: "132/88 mmHg", status: "warning" },
    { label: "Temp", value: "37.2°C", status: "normal" },
    { label: "SpO2", value: "98%", status: "normal" },
  ],
  complaint = "Patient presents in rural clinic with chest tightness and palpitations.",
}: {
  patientId?: string;
  name?: string;
  age?: number;
  gender?: string;
  vitals?: Array<{ label: string; value: string; status: "normal" | "warning" | "alert" }>;
  complaint?: string;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card className="border-l-4 border-l-teal-500 bg-slate-900/90 text-slate-100 shadow-md">
      <div
        className="flex items-center justify-between cursor-pointer select-none py-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <User className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white tracking-wide">{name}</h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                ID: {patientId}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {age}y/o • {gender}
              </span>
            </div>
          </div>
        </div>

        <button
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          aria-label="Toggle patient snapshot details"
        >
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="pt-3 mt-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
          {/* Chief Complaint */}
          <div className="md:col-span-5 space-y-1 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="flex items-center space-x-1.5 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
              <Stethoscope className="h-3.5 w-3.5 text-teal-400" />
              <span>Chief Complaint</span>
            </div>
            <p className="text-slate-200 font-medium leading-snug">{complaint}</p>
          </div>

          {/* Vitals Pills */}
          <div className="md:col-span-7 space-y-1 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="flex items-center space-x-1.5 text-slate-400 text-[11px] font-semibold uppercase tracking-wider mb-1.5">
              <Activity className="h-3.5 w-3.5 text-amber-400" />
              <span>Baseline Vitals & Triage Indicators</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {vitals.map((v) => (
                <div
                  key={v.label}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-semibold border ${
                    v.status === "warning"
                      ? "bg-amber-950/40 text-amber-300 border-amber-800/60"
                      : v.status === "alert"
                      ? "bg-rose-950/40 text-rose-300 border-rose-800/60"
                      : "bg-slate-800/90 text-teal-300 border-slate-700"
                  }`}
                >
                  <span className="text-[10px] text-slate-400 font-sans uppercase">{v.label}:</span>
                  <span>{v.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

