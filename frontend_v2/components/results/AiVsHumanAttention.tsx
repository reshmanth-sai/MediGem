import React from "react";
import { Cpu, UserCheck, Eye } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function AiVsHumanAttention() {
  const machineFocus = [
    { target: "PyMuPDF Text Layer Extraction", weight: "98.5% Weight", details: "Extracted lab parameters: WBC 14.5 k/uL, Glucose 185 mg/dL" },
    { target: "Vital Sign Threshold Evaluation", weight: "95.0% Weight", details: "HR 110 bpm (Tachycardia threshold > 100 bpm)" },
    { target: "ECG Rhythm Waveform Extraction", weight: "92.0% Weight", details: "12-Lead ST-segment elevation evaluation" },
  ];

  const clinicianFocus = [
    { target: "Patient Chief Complaint", weight: "Primary Focus", details: "Substernal chest tightness radiating to left shoulder" },
    { target: "Symptom Onset & Duration", weight: "Clinical Context", details: "Acute onset 30 minutes ago while resting" },
    { target: "Physical Examination & Response", weight: "Observational", details: "Diaphoresis, cold clammy extremities" },
  ];

  return (
    <Card className="space-y-4 border-l-4 border-l-purple-600 bg-slate-50/50 dark:bg-slate-900/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Eye className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            👁️ AI vs. Human Clinician Attention Map
          </h3>
        </div>
        <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400 font-semibold bg-purple-100 dark:bg-purple-950 px-2 py-0.5 rounded">
          ATTENTION MAPPING ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Machine Focus Column */}
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-teal-700 dark:text-teal-400 border-b border-slate-100 dark:border-slate-700 pb-2">
            <Cpu className="h-4 w-4 text-teal-600" />
            <span>AI Model Focus Areas (Gemma 3 4B)</span>
          </div>
          <div className="space-y-2 text-xs">
            {machineFocus.map((m) => (
              <div key={m.target} className="p-2 rounded bg-teal-50/50 dark:bg-teal-950/40 space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                  <span>{m.target}</span>
                  <span className="text-[10px] font-mono text-teal-600 bg-teal-100 dark:bg-teal-900 px-1.5 py-0.5 rounded">
                    {m.weight}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">{m.details}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Human Clinician Focus Column */}
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-purple-700 dark:text-purple-400 border-b border-slate-100 dark:border-slate-700 pb-2">
            <UserCheck className="h-4 w-4 text-purple-600" />
            <span>Human Clinician Focus Areas (Health Worker)</span>
          </div>
          <div className="space-y-2 text-xs">
            {clinicianFocus.map((h) => (
              <div key={h.target} className="p-2 rounded bg-purple-50/50 dark:bg-purple-950/40 space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                  <span>{h.target}</span>
                  <span className="text-[10px] font-mono text-purple-600 bg-purple-100 dark:bg-purple-900 px-1.5 py-0.5 rounded">
                    {h.weight}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">{h.details}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
