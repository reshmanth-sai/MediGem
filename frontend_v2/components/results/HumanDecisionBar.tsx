"use client";

import React, { useState } from "react";
import { ClinicalCaseData } from "@/lib/casesData";
import { CheckCircle2, Edit3, XCircle, FilePlus, MessageSquare, Printer, Download, ArrowRight } from "lucide-react";

interface HumanDecisionBarProps {
  caseData: ClinicalCaseData;
  onOpenReferral: () => void;
}

export function HumanDecisionBar({ caseData, onOpenReferral }: HumanDecisionBarProps) {
  const [decisionState, setDecisionState] = useState<"pending" | "approved" | "modified" | "rejected">("pending");
  const [soapNote, setSoapNote] = useState("");
  const [showSoapInput, setShowSoapInput] = useState(false);

  const handleApprove = () => {
    setDecisionState("approved");
    onOpenReferral();
  };

  return (
    <div className="sticky top-20 z-10 rounded-2xl bg-slate-900/95 border border-teal-500/50 p-4 shadow-2xl space-y-3 backdrop-blur-md">
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
        {/* Clinician Oversight Header */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <span>Sticky Clinician Decision Toolbar</span>
              {decisionState === "approved" && (
                <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 text-[10px] font-bold">APPROVED</span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              Healthcare worker maintains 100% final clinical authority over AI co-pilot recommendations.
            </p>
          </div>
        </div>

        {/* Primary Action Buttons Bar */}
        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
          {/* Approve CTA */}
          <button
            onClick={handleApprove}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-black shadow-xl transition-all flex items-center justify-center space-x-2 border border-emerald-300"
            title="Approve assessment and generate referral memo (Cmd + A)"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Approve & Referral</span>
            <span className="text-[9.5px] font-mono opacity-80 bg-slate-950/20 px-1.5 py-0.5 rounded">⌘A</span>
          </button>

          {/* Modify CTA */}
          <button
            onClick={() => setDecisionState("modified")}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold transition-colors flex items-center space-x-1.5 border border-slate-700"
            title="Modify clinical assessment findings (Cmd + M)"
          >
            <Edit3 className="h-4 w-4 text-amber-400" />
            <span>Modify</span>
            <span className="text-[9.5px] font-mono opacity-80 bg-slate-950/40 px-1 py-0.5 rounded">⌘M</span>
          </button>

          {/* Reject CTA */}
          <button
            onClick={() => setDecisionState("rejected")}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-bold transition-colors flex items-center space-x-1.5 border border-slate-700"
          >
            <XCircle className="h-4 w-4 text-rose-400" />
            <span>Reject</span>
          </button>

          {/* SOAP Note Button */}
          <button
            onClick={() => setShowSoapInput(!showSoapInput)}
            className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs border border-slate-700 transition-colors flex items-center space-x-1.5"
          >
            <MessageSquare className="h-4 w-4 text-teal-400" />
            <span>SOAP Note</span>
          </button>

          {/* Print & Export PDF */}
          <button
            onClick={onOpenReferral}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs border border-slate-700 transition-colors"
            title="Print Referral Memorandum"
          >
            <Printer className="h-4 w-4 text-teal-400" />
          </button>
        </div>
      </div>

      {/* SOAP Note Input Drawer */}
      {showSoapInput && (
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 animate-fadeIn">
          <label className="text-[10.5px] font-bold text-slate-400 uppercase font-mono">
            Clinician SOAP Note (Subjective, Objective, Assessment, Plan)
          </label>
          <textarea
            value={soapNote}
            onChange={(e) => setSoapNote(e.target.value)}
            placeholder="Add subjective observations, clinical notes, or human override justification..."
            rows={2}
            className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 font-medium"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowSoapInput(false)}
              className="px-3 py-1 rounded-lg bg-teal-500 text-slate-950 text-xs font-bold"
            >
              Save SOAP Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
