"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";

export function HistoryQueueHeader() {
  return (
    <div className="space-y-4 pb-4 border-b border-rule">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-h1 font-bold text-ink tracking-tight">
            Patient Queue &amp; Clinical Archive
          </h1>
          <p className="text-body-sm text-ink-muted">
            Prioritized by clinical severity · Offline repository
          </p>
        </div>

        <Link
          href="/new-case"
          className={buttonVariants({ variant: "primary", size: "md" })}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New Patient Intake
        </Link>
      </div>

      {/* Typographic Counters Bar (No card containers) */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-body py-2 border-y border-rule">
        <div className="flex items-baseline gap-2">
          <span className="text-h2 font-bold font-mono tabular text-ink">128</span>
          <span className="text-body-sm text-ink-muted">total cases</span>
        </div>
        <span className="text-rule-strong hidden sm:inline" aria-hidden="true">|</span>
        <div className="flex items-baseline gap-2">
          <span className="text-h2 font-bold font-mono tabular text-risk-emergency">14</span>
          <span className="text-body-sm text-ink-muted">emergencies</span>
        </div>
        <span className="text-rule-strong hidden sm:inline" aria-hidden="true">|</span>
        <div className="flex items-baseline gap-2">
          <span className="text-h2 font-bold font-mono tabular text-risk-high">3</span>
          <span className="text-body-sm text-ink-muted">pending review</span>
        </div>
        <span className="text-rule-strong hidden sm:inline" aria-hidden="true">|</span>
        <div className="flex items-baseline gap-2">
          <span className="text-h2 font-bold font-mono tabular text-ink">4</span>
          <span className="text-body-sm text-ink-muted">referrals today</span>
        </div>
      </div>
    </div>
  );
}
