"use client";

import React from "react";
import { Info, ShieldCheck } from "lucide-react";
import { H2, BodySm } from "@/components/ui/Typography";

export function AboutSystem() {
  return (
    <div className="rounded-card bg-surface border border-rule p-6 space-y-6">
      <div className="flex items-center space-x-3 pb-3 border-b border-rule">
        <div className="p-2.5 rounded-control bg-action-subtle text-action border border-rule">
          <Info className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <H2>About MediGem Clinical Workstation</H2>
          <BodySm className="text-ink-muted">
            System build metadata, local inference engine licenses, and offline certification.
          </BodySm>
        </div>
      </div>

      <div className="space-y-3 font-mono text-body-sm">
        <div className="p-3.5 rounded-control bg-ground border border-rule space-y-2">
          <div className="flex justify-between">
            <span className="text-ink-muted">Application Release:</span>
            <span className="text-action font-semibold">MediGem v2.0.0 (Production Edge)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">Inference Model Provider:</span>
            <span className="text-ink font-semibold">Gemma 3 4B (Google DeepMind)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">Emergency Engine Rules:</span>
            <span className="text-ink font-semibold">v1.2 (11 Verified Safety Rules)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">Local Database:</span>
            <span className="text-ink font-semibold">None (in-memory draft, tab-scoped result)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">License:</span>
            <span className="text-ink">Apache 2.0 / MIT License</span>
          </div>
        </div>

        <div className="p-3 rounded-control bg-action-subtle border border-rule text-action flex items-center space-x-2">
          <ShieldCheck className="h-5 w-5 shrink-0" aria-hidden="true" />
          <p>
            Built for offline use in rural sub-centres. Not a certified medical device.
          </p>
        </div>
      </div>
    </div>
  );
}
