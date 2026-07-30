import React from "react";
import { ShieldCheck, Cpu, Play } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function StepConfirmAnalyze({
  patientName,
  fileCount,
  onStartAnalysis,
}: {
  patientName: string;
  fileCount: number;
  onStartAnalysis: () => void;
}) {
  return (
    <Card className="space-y-6 text-center max-w-xl mx-auto py-8">
      <div className="mx-auto w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-600 dark:text-teal-400">
        <Cpu className="h-6 w-6" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Ready for Offline AI Clinical Analysis
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
          Case data for <strong>{patientName || "Patient"}</strong> ({fileCount} file(s) attached) is formatted and validated.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 text-left space-y-2 text-xs text-teal-900 dark:text-teal-200">
        <div className="flex items-center space-x-2 font-bold">
          <ShieldCheck className="h-4 w-4 text-teal-600" />
          <span>100% Offline Local Inference Notice</span>
        </div>
        <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
          <li>Reasoning executes locally using Gemma 3 4B via Ollama.</li>
          <li>Deterministic Emergency Safety Engine evaluates symptoms in &lt; 0.3ms.</li>
          <li>Zero PHI patient data leaves this local machine.</li>
        </ul>
      </div>

      <Button
        size="lg"
        variant="primary"
        onClick={onStartAnalysis}
        leftIcon={<Play className="h-5 w-5" />}
        className="w-full sm:w-auto px-8"
      >
        Start AI Clinical Analysis
      </Button>
    </Card>
  );
}
