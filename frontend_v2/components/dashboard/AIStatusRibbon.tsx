"use client";

import React from "react";
import { Cpu, ShieldCheck, Database, HardDrive, BatteryCharging, WifiOff, ChevronDown } from "lucide-react";

export function AIStatusRibbon() {
  return (
    <details className="rounded-card border border-rule bg-surface px-4 py-3 group">
      <summary className="flex items-center justify-between gap-3 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2 text-body-sm font-semibold text-risk-low">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-risk-low opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-risk-low" />
          </span>
          <WifiOff className="h-3.5 w-3.5" aria-hidden="true" />
          100% offline ready
        </span>
        <span className="flex items-center gap-1 text-label text-ink-muted">
          System detail
          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
        </span>
      </summary>

      <div className="pt-3 mt-3 border-t border-rule grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-body-sm">
        <div className="flex items-center gap-1.5">
          <Cpu className="h-3.5 w-3.5 text-action shrink-0" aria-hidden="true" />
          <span className="text-ink-muted">Model:</span>
          <span className="font-semibold text-ink">gemma3:4b (Ollama)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-risk-low shrink-0" aria-hidden="true" />
          <span className="text-ink-muted">Safety gate:</span>
          <span className="font-semibold text-ink">Under 0.28ms</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Database className="h-3.5 w-3.5 text-action shrink-0" aria-hidden="true" />
          <span className="text-ink-muted">Edge DB:</span>
          <span className="font-semibold text-risk-low">Connected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <HardDrive className="h-3.5 w-3.5 text-ink-muted shrink-0" aria-hidden="true" />
          <span className="text-ink-muted">Storage:</span>
          <span className="text-ink">14.2 GB free</span>
        </div>
        <div className="flex items-center gap-1.5">
          <BatteryCharging className="h-3.5 w-3.5 text-risk-low shrink-0" aria-hidden="true" />
          <span className="text-ink-muted">Battery:</span>
          <span className="font-semibold text-ink">94% charged</span>
        </div>
      </div>
    </details>
  );
}
