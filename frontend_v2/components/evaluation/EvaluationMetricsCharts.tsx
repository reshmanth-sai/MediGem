"use client";

import React from "react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  Label as AxisLabel,
} from "recharts";
import { Card, Section } from "@/components/ui/Card";
import { MetricStat } from "@/components/ui/MetricStat";
import { Label, BodySm } from "@/components/ui/Typography";
import { ConfidenceBadge, type ConfidenceLevel } from "@/components/ui/ConfidenceBadge";
import { Activity, Brain, Clock, ShieldCheck } from "lucide-react";

/**
 * Thresholds mapping the raw reasoning-confidence samples (used only to
 * derive a band) onto the same qualitative levels ConfidenceBadge renders
 * everywhere else. Never surface the raw numbers themselves: a decimal
 * implies calibration the model does not have.
 */
function confidenceLevelFor(value: number): ConfidenceLevel {
  if (value >= 97) return "HIGH";
  if (value >= 93) return "MEDIUM";
  return "LOW";
}

const CONFIDENCE_LEVEL_WORD: Record<ConfidenceLevel, string> = {
  HIGH: "High",
  MEDIUM: "Moderate",
  LOW: "Low",
};

/** Axis and grid chrome shared by both charts, so they read as one system. */
const AXIS_TICK = { fontSize: 13, fill: "var(--ink-muted)" };
const AXIS_LABEL_STYLE = { fill: "var(--ink-muted)", fontSize: 13 };
const TOOLTIP_STYLE = {
  backgroundColor: "var(--surface-raised)",
  color: "var(--ink)",
  borderRadius: 8,
  border: "1px solid var(--rule)",
};

export function EvaluationMetricsCharts() {
  const trendData = [
    { sample: "Run 1", confidence: 94.2, latencySec: 5.1 },
    { sample: "Run 2", confidence: 96.8, latencySec: 4.8 },
    { sample: "Run 3", confidence: 95.0, latencySec: 5.4 },
    { sample: "Run 4", confidence: 98.1, latencySec: 4.2 },
    { sample: "Run 5", confidence: 96.4, latencySec: 4.9 },
  ];

  const metrics = [
    // Model confidence is reported as a qualitative band, never a decimal
    // percentage, matching ConfidenceBadge: no false precision about certainty.
    { icon: Brain, label: "Mean Clinical Confidence", value: "High", subtitle: "Across 128 benchmark cases" },
    { icon: ShieldCheck, label: "Pipeline Success Rate", value: "100%", subtitle: "Zero unhandled exceptions" },
    { icon: Clock, label: "Emergency Intercept Speed", value: "< 0.3ms", subtitle: "Deterministic rule engine" },
    { icon: Activity, label: "PyMuPDF OCR Accuracy", value: "98%", subtitle: "Text layer extraction" },
  ];

  const latencyValues = trendData.map((d) => d.latencySec);
  const confidenceLevels = trendData.map((d) => confidenceLevelFor(d.confidence));

  /**
   * Text equivalents for anyone who cannot parse the visual. Confidence is
   * described only as a qualitative band per run, never a percentage.
   */
  const confidenceSummary =
    `Reasoning confidence per benchmark run, shown as a qualitative band. ` +
    trendData
      .map((d, i) => `${d.sample}: ${CONFIDENCE_LEVEL_WORD[confidenceLevels[i]]} confidence`)
      .join(", ") + ".";

  const latencySummary =
    `Bar chart of end to end local latency across ${trendData.length} benchmark runs, ` +
    `ranging from ${Math.min(...latencyValues)} to ${Math.max(...latencyValues)} seconds. ` +
    trendData.map((d) => `${d.sample}: ${d.latencySec} seconds`).join(", ") + ".";

  return (
    <div className="space-y-6">
      <Section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 divide-y divide-rule sm:divide-y-0">
          {metrics.map((metric) => (
            <MetricStat key={metric.label} {...metric} />
          ))}
        </div>
      </Section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="space-y-3">
          <Label as="h4">Reasoning Confidence Trend</Label>
          <BodySm className="text-ink-muted">
            Model confidence per benchmark run, reported as a qualitative band.
          </BodySm>
          <div className="h-64 flex items-center">
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-5">
              {trendData.map((d, i) => (
                <div key={d.sample} className="flex flex-col items-center gap-2 text-center">
                  <BodySm className="text-ink-muted">{d.sample}</BodySm>
                  <ConfidenceBadge level={confidenceLevels[i]} />
                </div>
              ))}
            </div>
          </div>
          <p className="sr-only">{confidenceSummary}</p>
        </Card>

        <Card className="space-y-3">
          <Label as="h4">Local Latency Breakdown</Label>
          <BodySm className="text-ink-muted">
            End to end on-device latency per benchmark run, in seconds.
          </BodySm>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={trendData}
                margin={{ top: 8, right: 12, left: 8, bottom: 24 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--rule)" opacity={0.5} />
                <XAxis dataKey="sample" tick={AXIS_TICK} stroke="var(--rule)">
                  <AxisLabel value="Benchmark run" position="insideBottom" offset={-16} style={AXIS_LABEL_STYLE} />
                </XAxis>
                <YAxis tick={AXIS_TICK} stroke="var(--rule)" unit="s">
                  <AxisLabel
                    value="Latency (seconds)"
                    angle={-90}
                    position="insideLeft"
                    style={{ ...AXIS_LABEL_STYLE, textAnchor: "middle" }}
                  />
                </YAxis>
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`${v}s`, "Latency"]} />
                <Legend verticalAlign="top" height={28} wrapperStyle={AXIS_LABEL_STYLE} />
                <Bar
                  dataKey="latencySec"
                  name="Latency (seconds)"
                  fill="var(--action)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="sr-only">{latencySummary}</p>
        </Card>
      </div>
    </div>
  );
}
