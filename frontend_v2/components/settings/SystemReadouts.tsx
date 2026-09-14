"use client";

import React from "react";
import { Cpu, ShieldCheck, Server, Wifi, WifiOff, HardDrive, Clock } from "lucide-react";
import { MetricStat } from "@/components/ui/MetricStat";
import { useApiHealth } from "@/hooks/useApiHealth";
import { useSystemStatus } from "@/hooks/useSystemStatus";
import { capture } from "@/components/landing/data";

/*
 * The system figures every settings and developer surface shows. Each value
 * names its source: the pipeline API's /health, the capture script's
 * measurement, or this browser. Nothing here is typed in.
 */
export function useSystemReadouts() {
  const api = useApiHealth();
  const browser = useSystemStatus();
  const live = api.state === "up" ? api.health : null;
  return {
    api,
    browser,
    model: live?.model ?? capture.meta.model,
    modelSource: live ? (live.ollama_connected ? "reported by /health" : "configured; Ollama not answering") : `measured ${capture.meta.captured_at.slice(0, 10)}`,
    gateRules: live?.gate_rule_count ?? capture.gate.rule_count,
    gateMs: live?.gate_latency_ms ?? capture.gate.latency_ms.match_median,
    gateSource: live ? "from /health just now" : `measured ${capture.meta.captured_at.slice(0, 10)}`,
    apiLabel:
      api.state === "up" ? (live!.ollama_connected ? "Up, model ready" : "Up, model not answering") : api.state === "down" ? "Not reachable" : api.state === "checking" ? "Checking" : "Not configured",
    uptime: live ? `${Math.round(live.uptime_seconds / 60)} min` : null,
  };
}

export function SystemReadoutGrid({ className }: { className?: string }) {
  const r = useSystemReadouts();
  return (
    <div className={className ?? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-4 divide-y divide-rule sm:divide-y-0"}>
      <MetricStat icon={Server} iconClassName={r.api.state === "up" ? "text-risk-low" : "text-ink-muted"} label="Pipeline API" value={r.apiLabel} subtitle={r.uptime ? `up ${r.uptime}` : undefined} />
      <MetricStat icon={Cpu} iconClassName="text-action" label="Model" value={r.model} subtitle={r.modelSource} />
      <MetricStat icon={ShieldCheck} iconClassName="text-action" label="Safety gate" value={`${r.gateRules} rules`} subtitle={`${r.gateMs.toFixed(2)} ms median, ${r.gateSource}`} />
      <MetricStat
        icon={r.browser.online === false ? WifiOff : Wifi}
        iconClassName={r.browser.online === false ? "text-risk-low" : "text-ink-muted"}
        label="This browser"
        value={r.browser.online === null ? "Checking" : r.browser.online ? "Online" : "Offline"}
        subtitle="navigator.onLine"
      />
      <MetricStat
        icon={HardDrive}
        label="Browser storage"
        value={r.browser.storageFreeGb === null ? "Not reported" : `${r.browser.storageFreeGb.toFixed(1)} GB free`}
        subtitle="Storage API quota"
      />
      <MetricStat icon={Clock} label="Measured" value={capture.meta.captured_at.slice(0, 10)} subtitle={`${capture.summary.validated_runs} runs, ${capture.meta.hardware.chip}`} />
    </div>
  );
}
