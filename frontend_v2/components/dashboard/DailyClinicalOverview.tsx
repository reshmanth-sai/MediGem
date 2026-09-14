"use client";

import React from "react";
import { ShieldCheck, WifiOff, Wifi, Cpu } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { symptomDistribution } from "@/lib/caseStats";
import { useCaseList } from "@/providers/CasesProvider";
import { capture } from "@/components/landing/data";
import { useSystemStatus } from "@/hooks/useSystemStatus";

/*
 * Two columns. The left is derived from the case list on this page; the right
 * shows only figures that were measured or read from the browser. Nothing on
 * this surface is typed in.
 */
export function DailyClinicalOverview() {
  const cases = useCaseList().cases;
  const rows = symptomDistribution(cases);
  const status = useSystemStatus();
  const gate = capture.gate;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-rule" aria-label="Presenting complaints and system status">
      <div className="space-y-3">
        <SectionHeader
          title="Presenting complaints"
          badge={
            <span className="text-label font-mono px-1.5 py-0.2 rounded-chip bg-surface-raised border border-rule text-ink-muted">
              {cases.length} in queue
            </span>
          }
        />
        <div className="space-y-3">
          {rows.map((s) => (
            <div key={s.label} className="space-y-1">
              <div className="flex items-center justify-between text-body-sm">
                <span className="text-ink font-medium">{s.label}</span>
                <span className="text-ink-muted font-mono tabular text-label">
                  {s.count} ({s.pct}%)
                </span>
              </div>
              <div className="w-full bg-surface-raised h-1.5 rounded-chip overflow-hidden border border-rule">
                <div className="h-full rounded-chip bg-action" style={{ width: `${s.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <SectionHeader
          title="System"
          badge={
            <span className="text-label font-mono px-1.5 py-0.2 rounded-chip bg-surface-raised border border-rule text-ink-muted">
              measured {capture.meta.captured_at.slice(0, 10)}
            </span>
          }
        />
        <dl className="divide-y divide-rule border-t border-rule text-body-sm">
          <div className="flex items-center justify-between gap-4 py-2">
            <dt className="flex items-center gap-2 text-ink-muted"><ShieldCheck className="h-3.5 w-3.5 text-risk-low" aria-hidden="true" />Emergency rules</dt>
            <dd className="font-mono text-ink">{gate.rule_count} rules · {gate.latency_ms.match_median.toFixed(2)} ms median</dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-2">
            <dt className="flex items-center gap-2 text-ink-muted"><Cpu className="h-3.5 w-3.5 text-action" aria-hidden="true" />Model</dt>
            <dd className="font-mono text-ink">{capture.meta.model} · local</dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-2">
            <dt className="flex items-center gap-2 text-ink-muted">
              {status.online ? <Wifi className="h-3.5 w-3.5" aria-hidden="true" /> : <WifiOff className="h-3.5 w-3.5" aria-hidden="true" />}
              This browser
            </dt>
            <dd className="font-mono text-ink">{status.online === null ? "checking" : status.online ? "online" : "offline"}{status.storageFreeGb !== null ? ` · ${status.storageFreeGb.toFixed(1)} GB storage quota free` : ""}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
