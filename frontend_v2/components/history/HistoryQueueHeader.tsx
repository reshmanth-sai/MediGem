"use client";

import { caseCounters } from "@/lib/caseStats";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";

export function HistoryQueueHeader() {
  const counters = caseCounters();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            Patient Queue
          </h1>
          <p className="text-sm text-ink-muted">
            Prioritized by clinical severity · Offline repository
          </p>
        </div>

        <Link
          href="/new-case"
          className="inline-flex items-center gap-1.5 bg-action hover:bg-action-hover text-on-action font-medium text-sm px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>New Patient Intake</span>
        </Link>
      </div>

      {/* Counters, derived from the same case list the table shows. */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm pt-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-bold font-mono tabular text-ink">{counters.total}</span>
          <span className="text-ink-muted text-body-sm">total cases</span>
        </div>
        <span className="text-rule-strong/40 hidden sm:inline" aria-hidden="true">|</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-bold font-mono tabular text-risk-emergency">{counters.emergency}</span>
          <span className="text-ink-muted text-body-sm">emergencies</span>
        </div>
        <span className="text-rule-strong/40 hidden sm:inline" aria-hidden="true">|</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-bold font-mono tabular text-risk-high">{counters.pendingReview}</span>
          <span className="text-ink-muted text-body-sm">pending review</span>
        </div>
        <span className="text-rule-strong/40 hidden sm:inline" aria-hidden="true">|</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-bold font-mono tabular text-ink">{counters.referrals}</span>
          <span className="text-ink-muted text-body-sm">referrals open</span>
        </div>
      </div>
    </div>
  );
}
