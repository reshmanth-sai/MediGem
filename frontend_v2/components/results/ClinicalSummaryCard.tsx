import React from "react";
import { AlertTriangle, CheckCircle2, Edit3, ArrowRight, ShieldAlert } from "lucide-react";
import { RiskBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { RiskLevel } from "@/types/analysis";

export function ClinicalSummaryCard({
  riskLevel = "MODERATE" as RiskLevel,
  urgencyScore = 6.5,
  primaryFinding = "Sinus Tachycardia with mild elevated Blood Pressure",
  clinicalSummary = "Patient presents with chest tightness, heart rate of 98 bpm, and BP of 132/88 mmHg. Multimodal reasoning indicates moderate clinical risk requiring non-urgent cardiology evaluation.",
  recommendedAction = "Schedule routine 12-lead ECG review with cardiology specialist within 48 hours & monitor vitals Q4H.",
  onApprove = () => alert("Referral memorandum approved & copied to clipboard."),
  onEdit = () => alert("Opening assessment editor modal..."),
}: {
  riskLevel?: RiskLevel;
  urgencyScore?: number;
  primaryFinding?: string;
  clinicalSummary?: string;
  recommendedAction?: string;
  onApprove?: () => void;
  onEdit?: () => void;
}) {
  return (
    <Card className="relative overflow-hidden border-2 border-amber-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-slate-100 shadow-xl space-y-5 p-6">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="h-4 w-4 text-amber-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
              Primary Clinical Assessment & Triage
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight leading-tight">
            {primaryFinding}
          </h2>
        </div>

        <div className="flex items-center space-x-4 bg-slate-950/80 p-3 rounded-xl border border-slate-800 shrink-0">
          <div className="text-right">
            <div className="flex items-baseline space-x-1 justify-end">
              <span className="text-3xl font-black text-amber-400 font-mono">
                {urgencyScore.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400 font-mono">/ 10</span>
            </div>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-medium">
              Urgency Score
            </span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <RiskBadge level={riskLevel} />
        </div>
      </div>

      {/* Clinical Assessment Summary Box */}
      <div className="space-y-2 text-xs leading-relaxed">
        <h3 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
          <span>Clinical Assessment Findings</span>
        </h3>
        <p className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-slate-200 font-medium text-sm leading-relaxed shadow-inner">
          {clinicalSummary}
        </p>
      </div>

      {/* Recommended Action & CTA Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-1">
        <div className="md:col-span-8 p-3.5 bg-amber-950/30 rounded-xl border border-amber-800/50 space-y-1 text-xs">
          <span className="font-bold uppercase tracking-wider text-[10px] text-amber-400 flex items-center space-x-1">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span>Recommended Next Clinical Step</span>
          </span>
          <p className="font-semibold text-amber-200 text-xs md:text-sm">{recommendedAction}</p>
        </div>

        <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-2">
          <Button
            size="md"
            variant="primary"
            className="w-full justify-center font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/20"
            leftIcon={<CheckCircle2 className="h-4 w-4" />}
            onClick={onApprove}
          >
            Approve & Generate Referral
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-full justify-center border-slate-700 hover:bg-slate-800 text-slate-300 text-xs"
            leftIcon={<Edit3 className="h-3.5 w-3.5" />}
            onClick={onEdit}
          >
            Modify Clinical Finding
          </Button>
        </div>
      </div>
    </Card>
  );
}

