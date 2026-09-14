"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AlertOctagon, ArrowRight, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { emergencyCases } from "@/lib/caseStats";

/*
 * One banner per EMERGENCY case that has not been acknowledged in this tab.
 * Derived from the case list, never static, so it disappears when there is
 * nothing to act on. Acknowledging hides it here; it does not change the case.
 */
export function EmergencyAlertBanner() {
  const [acknowledged, setAcknowledged] = useState<Set<string>>(() => new Set());
  const open = emergencyCases().filter((c) => !acknowledged.has(c.caseId));
  if (open.length === 0) return null;

  return (
    <div className="space-y-3" role="region" aria-label="Emergency alerts">
      {open.map((c) => {
        const vitals = c.vitals?.map((v) => `${v.label} ${v.value}`).join(" · ");
        return (
          <aside
            key={c.caseId}
            role="alert"
            className="bg-risk-emergency/10 border border-risk-emergency/40 px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3.5 min-w-0">
              <div className="pt-0.5 text-risk-emergency shrink-0">
                <AlertOctagon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-label uppercase tracking-wider font-bold text-risk-emergency">Emergency</span>
                  <span className="text-body-sm text-ink-muted">·</span>
                  <span className="font-semibold text-ink text-body-sm">
                    {c.patientName} ({c.age} years · {c.gender}{c.village ? ` · ${c.village}` : ""})
                  </span>
                </div>
                <p className="text-body-sm text-ink leading-normal">
                  {c.chiefComplaint}{vitals ? ` · ${vitals}` : ""}
                </p>
                <p className="text-body-sm font-semibold text-risk-emergency">{c.disposition.urgency}.</p>
              </div>
            </div>

            <div className="shrink-0 flex items-center justify-end gap-2">
              <Link
                href={`/results/${c.caseId}`}
                className={buttonVariants({ variant: "outline", size: "md", className: "border-risk-emergency text-risk-emergency hover:bg-risk-emergency/10" })}
              >
                Open case
                <span className="inline-flex" aria-hidden="true"><ArrowRight className="h-3.5 w-3.5" /></span>
              </Link>
              <button
                type="button"
                onClick={() => setAcknowledged((s) => new Set(s).add(c.caseId))}
                className="h-9 w-9 inline-flex items-center justify-center text-ink-muted hover:text-ink hover:bg-hover rounded-control focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                aria-label={`Acknowledge alert for ${c.patientName}`}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </aside>
        );
      })}
    </div>
  );
}
