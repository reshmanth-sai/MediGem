import React from "react";
import { Printer, FileText } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function ReferralMemo({
  patientId,
  priority,
  reason,
  summary,
}: {
  patientId: string;
  priority: string;
  reason: string;
  summary: string;
}) {
  return (
    <Card className="space-y-4 border-l-4 border-l-teal-600">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-teal-600" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white font-mono">
            CLINICAL REFERRAL MEMORANDUM
          </h4>
        </div>
        <Button
          size="sm"
          variant="outline"
          leftIcon={<Printer className="h-3.5 w-3.5" />}
          onClick={() => window.print()}
        >
          Print
        </Button>
      </div>
      <div className="space-y-2 text-xs font-mono text-slate-800 dark:text-slate-200">
        <p>PATIENT ID: {patientId}</p>
        <p>REFERRAL PRIORITY: {priority}</p>
        <p>REASON FOR REFERRAL: {reason}</p>
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="font-semibold text-slate-500 mb-1">CLINICAL SUMMARY:</p>
          <p className="whitespace-pre-wrap">{summary}</p>
        </div>
      </div>
    </Card>
  );
}
