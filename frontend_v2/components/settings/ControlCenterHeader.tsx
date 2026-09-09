"use client";

import React from "react";
import { Settings, Cpu, ShieldCheck, Database, HardDrive, BatteryCharging, WifiOff, CheckCircle2 } from "lucide-react";
import { H1, BodySm, Label } from "@/components/ui/Typography";
import { MetricStat } from "@/components/ui/MetricStat";

export function ControlCenterHeader() {
  return (
    <div className="clinical-panel bg-surface border border-rule p-5 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Label className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] font-mono bg-action-subtle text-action">
              <Settings className="h-3 w-3" aria-hidden="true" /> Clinical Control Center
            </Label>
            <Label className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] font-mono bg-risk-low/10 text-risk-low">
              <CheckCircle2 className="h-3 w-3" aria-hidden="true" /> 100% Operational
            </Label>
          </div>
          <H1>System Control Center & Clinical Preferences</H1>
          <BodySm className="text-ink-muted">
            Operational health telemetry, clinical reasoning parameters, offline storage, accessibility & security controls
          </BodySm>
        </div>
      </div>

      {/* Operational Health Telemetry Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-4 pt-4 border-t border-rule divide-y divide-rule sm:divide-y-0">
        <MetricStat icon={WifiOff} iconClassName="text-risk-low" label="Offline Status" value="100% Edge Air-Gap" />
        <MetricStat icon={Cpu} iconClassName="text-action" label="Inference Engine" value="gemma3:4b (Local)" />
        <MetricStat icon={ShieldCheck} iconClassName="text-action" label="Safety Gate" value="11 Rules (<0.28ms)" />
        <MetricStat icon={Database} iconClassName="text-risk-low" label="Edge DB" value="SQLite Connected" />
        <MetricStat icon={HardDrive} iconClassName="text-risk-high" label="Storage" value="14.2 GB Free" />
        <MetricStat icon={BatteryCharging} iconClassName="text-action" label="Power State" value="94% Charged" />
      </div>
    </div>
  );
}
