"use client";

import React from "react";
import { Cpu, ShieldCheck, WifiOff, Wifi, ChevronDown, HardDrive, Server } from "lucide-react";
import { capture } from "@/components/landing/data";
import { useSystemStatus } from "@/hooks/useSystemStatus";
import { useApiHealth } from "@/hooks/useApiHealth";

/*
 * Collapsed status line. With the API configured, model and gate figures
 * come from GET /health on this machine; otherwise they are the capture
 * script's measurements, labelled as such. Browser figures come from the
 * browser.
 */
export function AIStatusRibbon() {
  const status = useSystemStatus();
  const api = useApiHealth();
  const offline = status.online === false;

  const live = api.state === "up" ? api.health : null;
  const model = live?.model ?? capture.meta.model;
  const gateMs = live?.gate_latency_ms ?? capture.gate.latency_ms.match_median;
  const source = live ? "from /health just now" : `measured ${capture.meta.captured_at.slice(0, 10)}`;

  const headline =
    api.state === "up"
      ? live!.ollama_connected
        ? "Pipeline API and local model are up on this machine."
        : "Pipeline API is up; the local model is not answering."
      : api.state === "down"
      ? "Pipeline API is not reachable from this browser."
      : api.state === "checking"
      ? "Checking the pipeline API."
      : "No pipeline API configured for this build.";

  return (
    <details className="rounded-card border border-rule bg-surface px-4 py-3 group">
      <summary className="flex items-center justify-between gap-3 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2 text-body-sm font-semibold text-ink">
          <Server className={api.state === "up" ? "h-3.5 w-3.5 text-risk-low" : "h-3.5 w-3.5 text-ink-muted"} aria-hidden="true" />
          {headline}
        </span>
        <span className="flex items-center gap-1 text-label text-ink-muted">
          Detail
          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
        </span>
      </summary>

      <dl className="pt-3 mt-3 border-t border-rule grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-body-sm">
        <div className="flex items-center gap-1.5">
          <Cpu className="h-3.5 w-3.5 text-action shrink-0" aria-hidden="true" />
          <dt className="text-ink-muted">Model</dt>
          <dd className="font-mono text-ink">{model}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-risk-low shrink-0" aria-hidden="true" />
          <dt className="text-ink-muted">Gate</dt>
          <dd className="font-mono text-ink">{gateMs.toFixed(2)} ms · {source}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          {offline ? <WifiOff className="h-3.5 w-3.5 text-ink-muted shrink-0" aria-hidden="true" /> : <Wifi className="h-3.5 w-3.5 text-ink-muted shrink-0" aria-hidden="true" />}
          <dt className="text-ink-muted">This browser</dt>
          <dd className="font-mono text-ink">{status.online === null ? "checking" : offline ? "offline" : "online"}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <HardDrive className="h-3.5 w-3.5 text-ink-muted shrink-0" aria-hidden="true" />
          <dt className="text-ink-muted">Browser storage</dt>
          <dd className="font-mono text-ink">{status.storageFreeGb === null ? "not reported" : `${status.storageFreeGb.toFixed(1)} GB free`}</dd>
        </div>
      </dl>
    </details>
  );
}
