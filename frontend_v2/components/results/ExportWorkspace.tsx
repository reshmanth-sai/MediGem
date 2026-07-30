"use client";

import React from "react";
import { Download, Printer, FileText, Code, Share2 } from "lucide-react";
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
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Download className="h-4 w-4 text-teal-600" />
          <span>Export & Share Clinical Summary</span>
        </h3>
        <span className="text-xs text-slate-500 font-medium">Ready for Download</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Button
          size="sm"
          variant="outline"
          leftIcon={<FileText className="h-4 w-4" />}
          onClick={downloadTextSummary}
        >
          Text Summary (.txt)
        </Button>
        <Button
          size="sm"
          variant="outline"
          leftIcon={<Code className="h-4 w-4" />}
          onClick={downloadTextSummary}
        >
          JSON Payload
        </Button>
        <Button
          size="sm"
          variant="outline"
          leftIcon={<Printer className="h-4 w-4" />}
          onClick={() => window.print()}
        >
          Print Memorandum
        </Button>
        <Button
          size="sm"
          variant="secondary"
          leftIcon={<Share2 className="h-4 w-4" />}
          onClick={() => alert("Local sharing package prepared.")}
        >
          Share Local
        </Button>
      </div>
    </Card>
  );
}
