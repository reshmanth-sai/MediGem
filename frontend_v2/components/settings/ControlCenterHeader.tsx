"use client";

import React from "react";
import { Settings } from "lucide-react";
import { H1, BodySm, Label } from "@/components/ui/Typography";
import { SystemReadoutGrid } from "./SystemReadouts";

export function ControlCenterHeader() {
  return (
    <div className="clinical-panel bg-surface border border-rule p-5 space-y-4">
      <div className="space-y-1">
        <Label className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] font-mono bg-action-subtle text-action">
          <Settings className="h-3 w-3" aria-hidden="true" /> System controls
        </Label>
        <H1>System Controls</H1>
        <BodySm className="text-ink-muted">Reasoning parameters, this tab&apos;s data, accessibility, appearance and system readouts.</BodySm>
      </div>
      <SystemReadoutGrid className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-4 pt-4 border-t border-rule divide-y divide-rule sm:divide-y-0" />
    </div>
  );
}
