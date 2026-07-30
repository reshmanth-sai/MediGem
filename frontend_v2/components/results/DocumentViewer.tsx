"use client";

import React, { useState } from "react";
import { ClinicalCaseData } from "@/lib/casesData";
import { FileText, Eye, CheckCircle2, Image as ImageIcon, Sparkles } from "lucide-react";

interface DocumentViewerProps {
  caseData: ClinicalCaseData;
}

export function DocumentViewer({ caseData }: DocumentViewerProps) {
  const [selectedDoc, setSelectedDoc] = useState<"LAB" | "ECG">("LAB");

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <FileText className="h-4 w-4 text-teal-400" />
          <span>Split-View Document Workspace</span>
        </h3>
        <span className="text-[10px] text-slate-400 font-mono">PyMuPDF Layer Active</span>
      </div>

      {/* File Switcher Tabs */}
      <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setSelectedDoc("LAB")}
          className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
            selectedDoc === "LAB" ? "bg-slate-800 text-teal-300 font-bold border border-slate-700" : "text-slate-400 hover:text-white"
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          <span>Lab_Report_CBC.pdf</span>
        </button>

        <button
          onClick={() => setSelectedDoc("ECG")}
          className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
            selectedDoc === "ECG" ? "bg-slate-800 text-teal-300 font-bold border border-slate-700" : "text-slate-400 hover:text-white"
          }`}
        >
          <ImageIcon className="h-3.5 w-3.5" />
          <span>ECG_Rhythm_Strip.png</span>
        </button>
      </div>

      {/* Split-View Document Content */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between text-[10.5px]">
          <span className="text-teal-300 font-bold flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            {selectedDoc === "LAB" ? "PyMuPDF Text Layer Extracted (100% OCR Confidence)" : "OpenCV Laplacian Variance 245.2 (High Contrast)"}
          </span>
          <span className="text-slate-400">Quality: HIGH</span>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px] leading-relaxed max-h-40 overflow-y-auto">
          {selectedDoc === "LAB" ? (
            <div className="space-y-1">
              <p className="text-teal-300 font-bold">[EXTRACTED LAB VALUES FROM PDF TEXT LAYER]</p>
              <p>WBC Count : 14.5 k/uL (Ref: 4.5 - 11.0 k/uL) [HIGH]</p>
              <p>RBC Count : 4.8 M/uL  (Ref: 4.2 - 5.4 M/uL) [NORMAL]</p>
              <p>Hemoglobin: 13.8 g/dL  (Ref: 12.0 - 15.5 g/dL) [NORMAL]</p>
              <p>Platelets : 260 k/uL  (Ref: 150 - 450 k/uL) [NORMAL]</p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-teal-300 font-bold">[ECG RHYTHM STRIP ANALYSIS]</p>
              <p>Lead II Rhythm: Sinus Tachycardia @ 98 bpm</p>
              <p>P Wave Morphology: Normal Upright in Lead II</p>
              <p>QRS Complex: Narrow (84 ms), No Bundle Branch Block</p>
              <p>ST-T Segment: Isoelectric, no acute ischemia</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
