"use client";

import React from "react";
import { PatientDetailsFormData } from "./StepPatientDetails";
import { MedicalHistoryData } from "./StepMedicalHistory";
import { UploadedFileItem } from "./StepUploads";
import { User, HeartPulse, Layers, FileText, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";

interface StickyPatientContextSidebarProps {
  patientData: PatientDetailsFormData;
  symptoms: string[];
  historyData: MedicalHistoryData;
  uploadedFiles: UploadedFileItem[];
  currentStep: number;
}

export function StickyPatientContextSidebar({
  patientData,
  symptoms,
  historyData,
  uploadedFiles,
  currentStep,
}: StickyPatientContextSidebarProps) {
  // Generate real-time clinical advisory recommendations based on vitals
  const advisories: string[] = [];
  if ((patientData.hrBpm ?? 0) > 120) {
    advisories.push("HR >120 bpm: Recommend 12-lead ECG strip upload if available.");
  }
  if ((patientData.systolicBp ?? 0) > 150) {
    advisories.push("BP >150/90: Record second blood pressure measurement in 15 mins.");
  }
  if (symptoms.some((s) => s.toLowerCase().includes("chest"))) {
    advisories.push("Chest Symptoms Detected: Ensure pain onset & radiation details are logged.");
  }

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-4 shadow-xl sticky top-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
          <User className="h-4 w-4 text-teal-400" />
          <span>Patient Intake Context</span>
        </h3>
        <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
          <ShieldCheck className="h-3 w-3" /> OFFLINE EDGE
        </span>
      </div>

      {/* Patient Overview */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <h4 className="text-sm font-black text-white">{patientData.patientName || "New Patient"}</h4>
          <span className="text-xs font-mono text-slate-400">({patientData.patientId || "P-NEW"})</span>
        </div>
        <p className="text-xs text-slate-400">
          {patientData.age}y / {patientData.gender} • <span className="text-teal-300">{patientData.location}</span>
        </p>
      </div>

      {/* Vitals Grid Preview */}
      <div className="space-y-1.5">
        <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">Recorded Vital Signs</p>
        <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
            <span className="text-slate-400">HR:</span>
            <span className={`font-bold ${(patientData.hrBpm ?? 0) > 100 ? "text-amber-400" : "text-white"}`}>
              {patientData.hrBpm} bpm
            </span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
            <span className="text-slate-400">BP:</span>
            <span className={`font-bold ${(patientData.systolicBp ?? 0) > 140 ? "text-amber-400" : "text-white"}`}>
              {patientData.systolicBp}/{patientData.diastolicBp}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
            <span className="text-slate-400">Temp:</span>
            <span className="font-bold text-white">{patientData.tempCelsius}°C</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
            <span className="text-slate-400">SpO2:</span>
            <span className={`font-bold ${(patientData.spO2Percent ?? 100) < 94 ? "text-rose-400" : "text-white"}`}>
              {patientData.spO2Percent}%
            </span>
          </div>
        </div>
      </div>

      {/* Real-time Clinical Advisory System */}
      {advisories.length > 0 && (
        <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs space-y-1">
          <p className="font-bold flex items-center gap-1 text-[10.5px] uppercase font-mono text-amber-300">
            <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
            <span>Clinical Decision Advisories</span>
          </p>
          {advisories.map((adv, idx) => (
            <p key={idx} className="text-[11px] leading-snug font-medium">• {adv}</p>
          ))}
        </div>
      )}

      {/* Selected Symptoms List */}
      <div className="space-y-1.5">
        <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">Presenting Symptoms ({symptoms.length})</p>
        <div className="flex flex-wrap gap-1">
          {symptoms.length > 0 ? (
            symptoms.map((s) => (
              <span key={s} className="px-2 py-0.5 rounded-md bg-teal-950 text-teal-300 border border-teal-500/30 text-[11px] font-semibold">
                {s}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-500 italic">No symptoms selected yet.</span>
          )}
        </div>
      </div>

      {/* Uploaded Files Summary */}
      <div className="space-y-1 text-xs">
        <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">Attached Files ({uploadedFiles.length})</p>
        {uploadedFiles.length > 0 ? (
          <div className="space-y-1 font-mono text-[11px]">
            {uploadedFiles.map((f) => (
              <div key={f.id} className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-slate-300">
                <span className="truncate max-w-[180px]">{f.file.name}</span>
                <span className="text-[9.5px] text-teal-400 uppercase font-bold">{f.type}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">No documents uploaded.</p>
        )}
      </div>

      {/* Trust Notice */}
      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[10.5px] font-mono text-slate-400 flex items-center space-x-2">
        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
        <span>Autosaved locally to SQLite edge volume.</span>
      </div>
    </div>
  );
}
