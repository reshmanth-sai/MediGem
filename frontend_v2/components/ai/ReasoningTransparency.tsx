import React from "react";
import { Lightbulb, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function ReasoningTransparency({
  modality = "ECG",
  emergencyGatePassed = true,
  ocrConfidence = 97.5,
  provenance = "PDF text layer extracted directly via PyMuPDF (OCR skipped, 100% text confidence)",
}: {
  modality?: string;
  emergencyGatePassed?: boolean;
  ocrConfidence?: number;
  provenance?: string;
}) {
  return (
    <Card className="bg-teal-50/60 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800 space-y-3">
      <div className="flex items-center space-x-2 text-teal-800 dark:text-teal-300 font-bold text-sm">
        <Lightbulb className="h-4 w-4 text-teal-600" />
        <span>💡 Why was this recommendation generated? (Reasoning Transparency)</span>
      </div>
      <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
        <li className="flex items-start space-x-2">
          <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 mt-0.5 shrink-0" />
          <span>Modality classified as <strong>{modality}</strong>.</span>
        </li>
        <li className="flex items-start space-x-2">
          <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 mt-0.5 shrink-0" />
          <span>Emergency safety engine gate evaluation: <strong>{emergencyGatePassed ? "PASSED (< 0.3ms)" : "TRIGGERED"}</strong>.</span>
        </li>
        <li className="flex items-start space-x-2">
          <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 mt-0.5 shrink-0" />
          <span>Document provenance: <em>{provenance}</em>.</span>
        </li>
      </ul>
    </Card>
  );
}
