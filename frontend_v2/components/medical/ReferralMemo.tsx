import React from "react";
import { Printer, FileCheck, Copy, Share2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function ReferralMemo({
  patientId = "P-101",
  priority = "ROUTINE",
  reason = "Cardiology evaluation requested for sinus tachycardia with mild BP elevation",
  summary = "Patient presented with chest tightness. HR 98 bpm, BP 132/88 mmHg. ECG shows sinus rhythm pattern without acute ST-segment changes. Non-urgent cardiology consult recommended within 48h.",
}: {
  patientId: string;
  priority: string;
  reason: string;
  summary: string;
}) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const text = `CLINICAL REFERRAL MEMORANDUM\nPatient ID: ${patientId}\nPriority: ${priority}\nReason: ${reason}\nSummary: ${summary}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="space-y-4 border-l-4 border-l-teal-500 bg-slate-900/90 text-slate-100 shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <FileCheck className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
              Clinical Document
            </h4>
            <p className="text-sm font-bold text-white tracking-tight">Referral Memorandum</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            className="border-slate-700 hover:bg-slate-800 text-slate-300 text-xs"
            leftIcon={<Copy className="h-3.5 w-3.5" />}
            onClick={handleCopy}
          >
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button
            size="sm"
            variant="primary"
            className="bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs"
            leftIcon={<Printer className="h-3.5 w-3.5" />}
            onClick={() => window.print()}
          >
            Print
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
          <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block mb-0.5">
            Patient Identity
          </span>
          <span className="font-mono font-semibold text-slate-200">{patientId}</span>
        </div>
        <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
          <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block mb-0.5">
            Referral Priority
          </span>
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-950 text-teal-300 border border-teal-800/60">
            {priority}
          </span>
        </div>
      </div>

      <div className="space-y-3 text-xs bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
        <div>
          <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block mb-1">
            Reason for Referral
          </span>
          <p className="font-medium text-slate-200 leading-snug">{reason}</p>
        </div>
        <div className="pt-2 border-t border-slate-800/60">
          <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block mb-1">
            Clinical Findings & Summary
          </span>
          <p className="text-slate-300 leading-relaxed">{summary}</p>
        </div>
      </div>
    </Card>
  );
}

