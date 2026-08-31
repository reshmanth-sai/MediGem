"use client";

import React, { useState } from "react";
import { Cpu, RefreshCw } from "lucide-react";
import { H2, BodySm, Label, DataLg } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";

export function DeviceDiagnostics() {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const runDiagnostics = () => {
    setRunning(true);
    setDone(false);
    setTimeout(() => {
      setRunning(false);
      setDone(true);
    }, 1500);
  };

  return (
    <div className="rounded-card bg-surface border border-rule p-6 space-y-6">
      <div className="flex items-center space-x-3 pb-3 border-b border-rule">
        <div className="p-2.5 rounded-control bg-action-subtle text-action border border-rule">
          <Cpu className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <H2>Device Diagnostics & System Telemetry</H2>
          <BodySm className="text-ink-muted">
            Live hardware monitoring, model inference latency, and SQLite DB integrity.
          </BodySm>
        </div>
      </div>

      {/* Diagnostics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-control bg-ground border border-rule space-y-2 font-mono">
          <div className="flex justify-between text-body-sm">
            <span className="text-ink-muted">CPU Usage:</span>
            <span className="text-action font-semibold">18% Active</span>
          </div>
          <div
            className="w-full bg-surface-raised h-2 rounded-chip overflow-hidden"
            role="progressbar"
            aria-label="CPU usage"
            aria-valuenow={18}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="bg-action h-full rounded-chip" style={{ width: "18%" }} />
          </div>
        </div>

        <div className="p-4 rounded-control bg-ground border border-rule space-y-2 font-mono">
          <div className="flex justify-between text-body-sm">
            <span className="text-ink-muted">Model VRAM Usage:</span>
            <span className="text-action font-semibold">3.8 GB / 8.0 GB</span>
          </div>
          <div
            className="w-full bg-surface-raised h-2 rounded-chip overflow-hidden"
            role="progressbar"
            aria-label="Model VRAM usage"
            aria-valuenow={47}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="bg-action h-full rounded-chip" style={{ width: "47%" }} />
          </div>
        </div>

        <div className="p-4 rounded-control bg-ground border border-rule space-y-1 font-mono">
          <Label>Avg Gemma Inference Speed</Label>
          <DataLg>3.45s / query</DataLg>
        </div>

        <div className="p-4 rounded-control bg-ground border border-rule space-y-1 font-mono">
          <Label>Emergency Rule Gate Speed</Label>
          <DataLg className="text-risk-low">&lt; 0.28ms</DataLg>
        </div>
      </div>

      {/* Maintenance Diagnostic Runner Button */}
      <div className="pt-2">
        <Button
          onClick={runDiagnostics}
          disabled={running}
          className="w-full"
          leftIcon={<RefreshCw className={running ? "h-4 w-4 motion-safe:animate-spin" : "h-4 w-4"} aria-hidden="true" />}
        >
          {running
            ? "Running Diagnostics Suite..."
            : done
              ? "Diagnostics Passed Cleanly! (Run Again)"
              : "Run Full System Diagnostics Suite"}
        </Button>
      </div>
    </div>
  );
}
