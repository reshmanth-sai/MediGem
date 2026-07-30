"use client";

import React, { useState } from "react";
import { ClinicalCaseData } from "@/lib/casesData";
import { CheckCircle2, Edit3, XCircle, MessageSquare, Printer, ShieldCheck } from "lucide-react";

interface StickyDecisionFooterProps {
  caseData: ClinicalCaseData;
  onOpenReferral: () => void;
}

export function StickyDecisionFooter({ caseData, onOpenReferral }: StickyDecisionFooterProps) {
  const [decisionState, setDecisionState] = useState<"pending" | "approved" | "modified" | "rejected">("pending");
  const [soapNote, setSoapNote] = useState("");
  const [showSoapInput, setShowSoapInput] = useState(false);

  const handleApprove = () => {
    setDecisionState("approved");
    onOpenReferral();
  };

  const handleReject = () => {
    setDecisionState("rejected");
    setShowSoapInput(true);
  };

  return (
    <div className="fixed bottom-0 left-0 md:left-[68px] right-0 z-40 bg-slate-950/85 border-t border-slate-800/80 p-3 shadow-2xl backdrop-blur-xl transition-all duration-300">
      <div className="max-w-[1500px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:pr-44">
        {/* Clinician Oversight Statement */}
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-teal-950/80 border border-teal-500/30 text-teal-300 shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="text-xs space-y-0.5">
            <p className="font-bold text-white flex items-center gap-2 font-mono">
              <span>Human Clinical Oversight Bar</span>
              {decisionState === "approved" && (
                <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 text-[10px] font-extrabold">APPROVED</span>
              )}
              {decisionState === "rejected" && (
                <span className="px-2 py-0.5 rounded bg-rose-500 text-slate-950 text-[10px] font-extrabold">REJECTED</span>
              )}
            </p>
            <p className="text-slate-300 text-[11px]">
              Dr. Vikram Patel (CHO) maintains 100% final clinical authority over AI assistance.
            </p>
          </div>
        </div>

        {/* Fitts's Law Decision Actions Bar */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Approve Referral CTA */}
          <button
            onClick={handleApprove}
            className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-black shadow-xl transition-all flex items-center justify-center space-x-2 border border-emerald-300 min-h-[44px]"
            title="Approve Referral Memorandum (Cmd + A)"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Approve Referral</span>
            <span className="text-[9.5px] font-mono opacity-80 bg-slate-950/20 px-1.5 py-0.5 rounded font-bold">⌘A</span>
          </button>

          {/* Modify Assessment CTA */}
          <button
            onClick={() => setDecisionState("modified")}
            className="px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md text-amber-300 text-xs font-bold transition-colors flex items-center space-x-1.5 border border-slate-700 min-h-[44px]"
            title="Modify Clinical Findings (Cmd + M)"
          >
            <Edit3 className="h-4 w-4 text-amber-400" />
            <span>Modify</span>
            <span className="text-[9.5px] font-mono opacity-80 bg-slate-950/50 px-1.5 py-0.5 rounded font-bold">⌘M</span>
          </button>

          {/* Reject AI Assessment CTA */}
          <button
            onClick={handleReject}
            className="px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md text-rose-300 text-xs font-bold transition-colors flex items-center space-x-1.5 border border-slate-700 min-h-[44px]"
            title="Reject AI Assessment (Cmd + R)"
          >
            <XCircle className="h-4 w-4 text-rose-400" />
            <span>Reject AI</span>
          </button>

          {/* SOAP Note Input Toggle */}
          <button
            onClick={() => setShowSoapInput(!showSoapInput)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center space-x-1.5 min-h-[44px]"
          >
            <MessageSquare className="h-4 w-4 text-teal-400" />
            <span>SOAP Note</span>
          </button>

          {/* Print Referral */}
          <button
            onClick={onOpenReferral}
            className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md text-slate-300 hover:text-white text-xs border border-slate-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Print Referral Memorandum"
          >
            <Printer className="h-4 w-4 text-teal-400" />
          </button>
        </div>
      </div>

      {/* SOAP Note Drawer */}
      {showSoapInput && (
        <div className="max-w-[1500px] mx-auto mt-3 p-3.5 rounded-xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 space-y-2 animate-fadeIn">
          <label className="text-xs font-bold text-slate-300 uppercase font-mono">
            Clinician Override & SOAP Note Justification
          </label>
          <textarea
            value={soapNote}
            onChange={(e) => setSoapNote(e.target.value)}
            placeholder="Add clinician observations, diagnostic disagreement notes, or override rationale..."
            rows={2}
            className="w-full p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 font-medium"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowSoapInput(false)}
              className="px-3 py-1 rounded-lg bg-teal-500 text-slate-950 text-xs font-extrabold"
            >
              Save Override Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
