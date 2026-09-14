"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { H2, BodySm } from "@/components/ui/Typography";
import { SystemReadoutGrid, useSystemReadouts } from "./SystemReadouts";
import { API_BASE_URL } from "@/lib/api-client";

/*
 * What this browser can honestly report about the system, and where each
 * figure comes from. CPU, memory and GPU are not readable from a web page,
 * so they are not shown.
 */
export function DeviceDiagnostics() {
  const r = useSystemReadouts();
  return (
    <Card className="space-y-5">
      <div className="space-y-1">
        <H2>System diagnostics</H2>
        <BodySm className="text-ink-muted">Every figure names its source. A web page cannot read CPU, memory or GPU load, so none is shown.</BodySm>
      </div>
      <SystemReadoutGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 pt-4 border-t border-rule" />
      <dl className="border-t border-rule pt-4 grid grid-cols-1 sm:grid-cols-[12rem_1fr] gap-y-2 gap-x-4 text-body-sm">
        <dt className="text-ink-muted">API base URL</dt>
        <dd className="font-mono text-ink">{API_BASE_URL || "not configured"}</dd>
        <dt className="text-ink-muted">Ollama host</dt>
        <dd className="font-mono text-ink">{r.api.state === "up" ? r.api.health.ollama_host : "unknown until the API answers"}</dd>
        <dt className="text-ink-muted">Provider</dt>
        <dd className="font-mono text-ink">{r.api.state === "up" ? r.api.health.provider_details : r.api.state === "down" ? r.api.message : "n/a"}</dd>
      </dl>
    </Card>
  );
}
