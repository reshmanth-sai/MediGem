"use client";

import React from "react";
import { ModalDialog } from "@/components/ui/Dialog";
import { RiskBadge } from "@/components/ui/Badge";
import { SelectedCaseDetails } from "./CaseDetailsPreview";

export function CaseComparisonModal({
  isOpen,
  onClose,
  case1,
  case2,
}: {
  isOpen: boolean;
  onClose: () => void;
  case1: SelectedCaseDetails;
  case2: SelectedCaseDetails;
}) {
  if (!isOpen) return null;

  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} title="⚖️ Side-by-Side Dual Case Comparison" className="max-w-3xl">
      <div className="grid grid-cols-2 gap-4 text-xs">
        {/* Case 1 Column */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-3 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">{case1.patientId}</p>
              <p className="text-[10px] text-slate-400 font-mono">{case1.id}</p>
            </div>
            <RiskBadge level={case1.riskLevel} />
          </div>
          <p><span className="text-slate-500">Demographics:</span> <strong>{case1.age}y/o {case1.gender}</strong></p>
          <p><span className="text-slate-500">Symptoms:</span> <strong>{case1.symptoms}</strong></p>
          <p><span className="text-slate-500">Finding:</span> <strong>{case1.finding}</strong></p>
        </div>

        {/* Case 2 Column */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-3 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">{case2.patientId}</p>
              <p className="text-[10px] text-slate-400 font-mono">{case2.id}</p>
            </div>
            <RiskBadge level={case2.riskLevel} />
          </div>
          <p><span className="text-slate-500">Demographics:</span> <strong>{case2.age}y/o {case2.gender}</strong></p>
          <p><span className="text-slate-500">Symptoms:</span> <strong>{case2.symptoms}</strong></p>
          <p><span className="text-slate-500">Finding:</span> <strong>{case2.finding}</strong></p>
        </div>
      </div>
    </ModalDialog>
  );
}
