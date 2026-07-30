import React from "react";
import { RiskLevel } from "@/types/analysis";
import { RiskBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function RiskIndicator({
  level,
  urgencyScore,
  rationale,
}: {
  level: RiskLevel;
  urgencyScore: number;
  rationale?: string;
}) {
  return (
    <Card className="flex flex-col space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase text-slate-500">Assessed Risk Level</span>
        <RiskBadge level={level} />
      </div>
      <div className="flex items-baseline space-x-2">
        <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
          {urgencyScore.toFixed(1)}
        </span>
        <span className="text-xs text-slate-500 font-medium">/ 10 Urgency Index</span>
      </div>
      {rationale && <p className="text-xs text-slate-600 dark:text-slate-300">{rationale}</p>}
    </Card>
  );
}
