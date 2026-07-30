"use client";

import React from "react";
import { Download, Printer, FileText, Code, Share2, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function ExportWorkspace({ caseId = "CASE-8901" }: { caseId?: string }) {
  const downloadTextSummary = () => {
    const content = `MEDIGEM CLINICAL CASE SUMMARY\nCase ID: ${caseId}\nTimestamp: ${new Date().toISOString()}\nModel: gemma3:4b\n\nAssessed Risk: MODERATE (Urgency: 6.5/10)\nPrimary Finding: Sinus Tachycardia with mild elevated Blood Pressure\nRecommended Action: Recommend routine cardiology evaluation within 48 hours.`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MediGem_Summary_${caseId}.txt`;
    a.click();
  };

  return (
    <Card className="space-y-3.5 bg-slate-900/90 border border-slate-800 text-slate-100 shadow-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Download className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-white tracking-tight">
            Export & Share Clinical Summary
          </h3>
        </div>
        <span className="text-xs text-emerald-400 font-medium font-mono flex items-center space-x-1">
          <CheckCircle className="h-3.5 w-3.5" />
          <span>Ready for Export</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
        <Button
          size="sm"
          variant="primary"
          className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold shadow-md shadow-teal-500/20"
          leftIcon={<Printer className="h-4 w-4" />}
          onClick={() => window.print()}
        >
          Print Memorandum
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-slate-700 hover:bg-slate-800 text-slate-300 text-xs"
          leftIcon={<FileText className="h-4 w-4" />}
          onClick={downloadTextSummary}
        >
          Text Summary (.txt)
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-slate-700 hover:bg-slate-800 text-slate-300 text-xs"
          leftIcon={<Code className="h-4 w-4" />}
          onClick={downloadTextSummary}
        >
          JSON Payload
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-slate-700 hover:bg-slate-800 text-slate-300 text-xs"
          leftIcon={<Share2 className="h-4 w-4" />}
          onClick={() => alert("Local sharing package prepared.")}
        >
          Share Package
        </Button>
      </div>
    </Card>
  );
}

