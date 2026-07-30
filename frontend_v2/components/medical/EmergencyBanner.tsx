import React from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmergencyBanner({
  category = "CARDIAC",
  symptom = "Severe crushing chest pain",
  durationMs = 0.18,
  className,
}: {
  category?: string;
  symptom?: string;
  durationMs?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "p-5 rounded-xl border-l-8 border-l-red-600 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 space-y-2 animate-pulse",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-red-700 dark:text-red-300 font-extrabold text-lg">
          <AlertTriangle className="h-6 w-6 text-red-600 animate-bounce" />
          <span>🚨 ACUTE EMERGENCY INTERCEPTED</span>
        </div>
        <span className="text-xs font-mono font-bold text-red-600 bg-red-100 dark:bg-red-900/60 px-2.5 py-1 rounded">
          URGENCY 10/10
        </span>
      </div>
      <p className="text-xs text-red-900 dark:text-red-200 font-semibold">
        Deterministic Emergency Safety Engine intercepted critical symptom: &quot;{symptom}&quot; ({category}) in {durationMs.toFixed(2)}ms.
      </p>
      <p className="text-xs text-red-700 dark:text-red-300 italic">
        ⚠️ LLM inference blocked for patient safety. Immediate emergency facility referral generated.
      </p>
    </div>
  );
}
