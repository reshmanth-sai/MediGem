"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const TRIAGE_DATA = [
  { day: "Sun", consultations: 45, referrals: 8 },
  { day: "Mon", consultations: 78, referrals: 14 },
  { day: "Tue", consultations: 68, referrals: 11 },
  { day: "Wed", consultations: 82, referrals: 16 },
  { day: "Thu", consultations: 74, referrals: 12 },
  { day: "Fri", consultations: 92, referrals: 18 },
  { day: "Sat", consultations: 60, referrals: 9 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border border-rule p-3 rounded-control text-body-sm shadow-none">
        <p className="font-bold text-ink">{label}</p>
        <p className="text-action font-semibold mt-1">
          Consultations: {payload[0]?.value}
        </p>
        <p className="text-risk-low font-semibold">
          Referrals: {payload[1]?.value}
        </p>
      </div>
    );
  }
  return null;
}

export function PatientTriageTrendsChart() {
  return (
    <section className="border-t border-rule pt-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rule mb-4">
        <div>
          <h2 className="text-h3 text-ink">Patient triage trends</h2>
          <p className="text-body-sm text-ink-muted mt-1">
            Weekly volume of primary sub-center triage and tertiary referrals
          </p>
        </div>

        {/* Legend Metrics */}
        <div className="flex items-center gap-6 shrink-0">
          <div>
            <div className="text-data font-semibold text-ink leading-tight tabular">499</div>
            <div className="flex items-center gap-1.5 text-label normal-case text-ink-muted mt-0.5">
              <span className="h-2 w-2 rounded-none bg-action shrink-0" aria-hidden="true" />
              <span>Consultations</span>
            </div>
          </div>

          <div>
            <div className="text-data font-semibold text-ink leading-tight">88</div>
            <div className="flex items-center gap-1.5 text-label normal-case font-medium text-ink-muted mt-0.5">
              <span className="h-2.5 w-2.5 rounded-full bg-risk-low shrink-0" aria-hidden="true" />
              <span>Referrals</span>
            </div>
          </div>
        </div>
      </div>

      {/* Smooth Area Chart */}
      <div className="h-64 sm:h-72 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={TRIAGE_DATA}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--rule)"
              vertical={false}
              opacity={0.6}
            />

            <XAxis
              dataKey="day"
              stroke="var(--ink-muted)"
              fontSize={13}
              tickLine={false}
              axisLine={false}
              dy={10}
            />

            <YAxis
              stroke="var(--ink-muted)"
              fontSize={13}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickLine={false}
              axisLine={false}
              dx={-5}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="consultations"
              stroke="var(--action)"
              strokeWidth={2.5}
              fillOpacity={0}
              fill="transparent"
              activeDot={{ r: 6, fill: "var(--surface)", stroke: "var(--action)", strokeWidth: 3 }}
            />

            <Area
              type="monotone"
              dataKey="referrals"
              stroke="var(--risk-low)"
              strokeWidth={2.5}
              fillOpacity={0}
              fill="transparent"
              activeDot={{ r: 6, fill: "var(--surface)", stroke: "var(--risk-low)", strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
