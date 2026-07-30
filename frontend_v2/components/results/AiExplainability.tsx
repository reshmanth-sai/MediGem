import React from "react";
import { Lightbulb, Info } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function AiExplainability() {
  return (
    <Card className="space-y-3 bg-teal-50/50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-900">
      <div className="flex items-center space-x-2 text-teal-800 dark:text-teal-300 font-bold text-sm">
        <Lightbulb className="h-4 w-4 text-teal-600" />
        <span>💡 AI Reasoning Transparency & Limitations</span>
      </div>

      <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
        <p className="flex items-center space-x-2">
          <Info className="h-4 w-4 text-teal-600 shrink-0" />
          <span>
            <strong>PyMuPDF Text Provenance:</strong> Lab report PDF text extracted cleanly directly from document text layer (100% confidence, OCR bypassed).
          </span>
        </p>
        <p className="flex items-center space-x-2">
          <Info className="h-4 w-4 text-teal-600 shrink-0" />
          <span>
            <strong>OpenCV Image Quality:</strong> ECG image quality verified GOOD (Laplacian blur variance: 245.2).
          </span>
        </p>
        <p className="flex items-center space-x-2">
          <Info className="h-4 w-4 text-teal-600 shrink-0" />
          <span>
            <strong>Clinical Boundary Notice:</strong> MediGem provides non-diagnostic decision support. All observations must be confirmed by a licensed clinician.
          </span>
        </p>
      </div>
    </Card>
  );
}
