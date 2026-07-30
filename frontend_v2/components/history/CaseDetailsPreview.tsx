import React from "react";
import Link from "next/link";
import { ExternalLink, X, Printer } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { RiskBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export interface SelectedCaseDetails {
  id: string;
  patientId: string;
  age: number;
  gender: string;
  symptoms: string;
  date: string;
  riskLevel: any;
  finding: string;
}

export function CaseDetailsPreview({
  caseItem,
  onClose,
}: {
  caseItem: SelectedCaseDetails | null;
  onClose: () => void;
}) {
  if (!caseItem) return null;

  return (
    <Card className="space-y-4 border-l-4 border-l-teal-600 bg-slate-50/50 dark:bg-slate-900/50">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-bold uppercase text-slate-400">Quick Case Preview</span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {caseItem.patientId} ({caseItem.id})
          </h3>
        </div>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Risk Assessment:</span>
          <RiskBadge level={caseItem.riskLevel} />
        </div>
        <p><span className="text-slate-500">Demographics:</span> <strong>{caseItem.age}y/o {caseItem.gender}</strong></p>
        <p><span className="text-slate-500">Analysis Date:</span> <strong>{caseItem.date}</strong></p>
        <p><span className="text-slate-500">Presenting Symptoms:</span> <strong>{caseItem.symptoms}</strong></p>
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
          <p className="font-semibold text-slate-500">Primary Finding:</p>
          <p className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            {caseItem.finding}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <Link href={`/results/${caseItem.id}`} className="flex-1">
          <Button size="sm" variant="primary" className="w-full" leftIcon={<ExternalLink className="h-3.5 w-3.5" />}>
            Open Full Results
          </Button>
        </Link>
        <Button size="sm" variant="outline" leftIcon={<Printer className="h-3.5 w-3.5" />} onClick={() => window.print()}>
          Print Memo
        </Button>
      </div>
    </Card>
  );
}
