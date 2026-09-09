"use client";

import React from "react";
import Link from "next/link";
import { AlertOctagon, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";

export function EmergencyAlertBanner() {
  return (
    <aside
      aria-label="Critical Emergency Alert"
      className="bg-risk-emergency/10 border-l-2 border-l-risk-emergency px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div className="flex items-start gap-3.5 min-w-0">
        <div className="pt-0.5 text-risk-emergency shrink-0">
          <AlertOctagon className="h-5 w-5" aria-hidden="true" />
        </div>

        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-label uppercase tracking-wider font-bold text-risk-emergency">
              Emergency
            </span>
            <span className="text-body-sm text-ink-muted">·</span>
            <span className="font-semibold text-ink text-body-sm">
              Sunita Devi (62 years · Female · Sundarpur)
            </span>
          </div>

          <p className="text-body-sm text-ink leading-normal">
            Acute chest pain · Diaphoresis · BP 165/102 · HR 115 · SpO2 92%
          </p>

          <p className="text-body-sm font-semibold text-risk-emergency">
            Immediate referral required.
          </p>
        </div>
      </div>

      <div className="shrink-0 flex justify-end">
        <Link
          href="/results/DEMO-ACUTE-CARDIAC"
          className={buttonVariants({ variant: "outline", size: "md", className: "border-risk-emergency text-risk-emergency hover:bg-risk-emergency/10" })}
        >
          <span className="inline-flex" aria-hidden="true">
            <AlertOctagon className="h-4 w-4" />
          </span>
          Open referral protocol
          <span className="inline-flex" aria-hidden="true">
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>
      </div>
    </aside>
  );
}
