"use client";

import React from "react";
import Link from "next/link";
import { AlertOctagon, ArrowRight, ShieldAlert, Zap } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { H3, BodySm } from "@/components/ui/Typography";

export function EmergencyAlertBanner() {
  return (
    <div className="relative overflow-hidden rounded-card bg-risk-emergency/10 border border-risk-emergency/50 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 rounded-card bg-risk-emergency text-on-action shrink-0">
          <AlertOctagon className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded-chip text-label font-bold bg-risk-emergency text-on-action">
              Critical safety intercept
            </span>
            <span className="text-body-sm text-risk-emergency font-semibold flex items-center gap-1">
              <Zap className="h-3.5 w-3.5" aria-hidden="true" /> Triggered in 0.28ms
            </span>
          </div>
          <H3>Anitha S. (62F, Sundarpur): acute coronary syndrome risk detected</H3>
          <BodySm className="text-ink-muted">
            Severe crushing substernal chest pain, diaphoresis, BP 155/95, HR 110 bpm. Immediate referral
            protocol generated.
          </BodySm>
        </div>
      </div>

      <div className="shrink-0 w-full sm:w-auto flex justify-end">
        <Link
          href="/results/DEMO-ACUTE-CARDIAC"
          className={buttonVariants({ variant: "danger", size: "lg" })}
        >
          <span className="inline-flex" aria-hidden="true">
            <ShieldAlert className="h-4 w-4" />
          </span>
          Open STAT referral protocol
          <span className="inline-flex" aria-hidden="true">
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>
      </div>
    </div>
  );
}
