"use client";

import React, { useState } from "react";
import { HardDrive, Download, Trash2, RefreshCw } from "lucide-react";
import { H2, BodySm } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";

export function OfflineStorageAnalyzer() {
  const [cleared, setCleared] = useState(false);

  const handleClear = () => {
    setCleared(true);
    setTimeout(() => setCleared(false), 3000);
  };

  return (
    <div className="rounded-card bg-surface border border-rule p-6 space-y-6">
      <div className="flex items-center space-x-3 pb-3 border-b border-rule">
        <div className="p-2.5 rounded-control bg-action-subtle text-action border border-rule">
          <HardDrive className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <H2>Offline Storage & Local Database Analyzer</H2>
          <BodySm className="text-ink-muted">
            Manage edge storage quota, SQLite patient database, and offline backups.
          </BodySm>
        </div>
      </div>

      {/* Storage Breakdown Gauge Bar */}
      <div className="p-4 rounded-control bg-ground border border-rule space-y-3">
        <div className="flex items-center justify-between text-body-sm font-mono">
          <span className="text-ink font-semibold">Local Edge Volume:</span>
          <span className="text-action font-semibold">14.2 GB Free / 64 GB</span>
        </div>

        {/*
          Storage categories are not clinical severity, so this bar uses a
          neutral categorical ramp (the action hue at two strengths, then two
          greys) rather than risk-low / risk-high. Green and amber here read as
          a severity signal to a clinician glancing at the page, which is
          exactly what the palette rule exists to prevent.

          The bar is aria-hidden because it is a purely visual restatement of
          the labelled legend directly below it, which carries every category
          and its value as real text. That legend, not a hover-only `title`,
          is what makes these figures readable.
        */}
        <div
          className="w-full bg-surface-raised h-3 rounded-chip overflow-hidden flex border border-rule"
          aria-hidden="true"
        >
          <div className="bg-action h-full" style={{ width: "12%" }} />
          <div className="bg-action/55 h-full" style={{ width: "18%" }} />
          <div className="bg-ink-muted h-full" style={{ width: "8%" }} />
          <div className="bg-rule-strong h-full" style={{ width: "62%" }} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-body-sm font-mono text-ink-muted">
          <div className="flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-action" aria-hidden="true" />
            <span>Cases (4.2 MB)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-action/55" aria-hidden="true" />
            <span>Lab PDFs (48.5 MB)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-ink-muted" aria-hidden="true" />
            <span>ECGs (12.8 MB)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-rule-strong" aria-hidden="true" />
            <span>Free Volume (14.2 GB)</span>
          </div>
        </div>
      </div>

      {/* Storage Maintenance Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Button variant="secondary" onClick={handleClear} leftIcon={<Trash2 className="h-4 w-4" aria-hidden="true" />}>
          {cleared ? "Cache Cleared!" : "Clear Temp Cache"}
        </Button>

        <Button variant="secondary" leftIcon={<RefreshCw className="h-4 w-4" aria-hidden="true" />}>
          Optimize SQLite DB
        </Button>

        <Button variant="secondary" leftIcon={<Download className="h-4 w-4" aria-hidden="true" />}>
          Export Local DB
        </Button>
      </div>
    </div>
  );
}
