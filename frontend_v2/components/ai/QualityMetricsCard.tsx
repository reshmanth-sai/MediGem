import React from "react";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/Card";

export function QualityMetricsCard({
  blurScore = 245.2,
  ocrConfidence = 97.5,
  completenessScore = 95.0,
}: {
  blurScore?: number;
  ocrConfidence?: number;
  completenessScore?: number;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <StatCard
        title="OpenCV Blur Score"
        value={blurScore.toFixed(1)}
        subtitle={blurScore > 100 ? "GOOD Quality" : "BLURRY Warning"}
      />
      <StatCard
        title="OCR Confidence"
        value={`${ocrConfidence.toFixed(1)}%`}
        subtitle="Text Extraction"
      />
      <StatCard
        title="Completeness"
        value={`${completenessScore.toFixed(1)}%`}
        subtitle="Clinical Coverage"
      />
    </div>
  );
}
