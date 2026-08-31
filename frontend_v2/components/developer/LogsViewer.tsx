"use client";

import React, { useState } from "react";
import { Terminal, Search } from "lucide-react";
import { Section } from "@/components/ui/Card";
import { BodySm } from "@/components/ui/Typography";

export function LogsViewer() {
  const [filter, setFilter] = useState("");

  const logs = [
    "[12:00:01] INFO  EmergencyEngine initialized with 11 rules and 12 synonym groups.",
    "[12:00:01] WARN  [EMG-028B62BB] EMERGENCY DETECTED! Rule=R-CARDIAC-01, Category=CARDIAC, Duration=0.09ms",
    "[12:00:02] INFO  PyMuPDF extracted 100% text layer from Lab_Report_CBC.pdf",
    "[12:00:02] INFO  OpenCV Laplacian blur score variance: 245.2 (PASS)",
    "[12:00:03] INFO  Executing Ollama local inference with model gemma3:4b",
    "[12:00:08] INFO  Pydantic v2 schema validation passed cleanly in 2.1ms",
  ];

  const filtered = logs.filter((l) => l.toLowerCase().includes(filter.toLowerCase()));

  return (
    <Section
      heading={
        <span className="inline-flex items-center gap-2">
          <Terminal className="h-4 w-4 text-ink-muted shrink-0" aria-hidden="true" />
          System Logs & Telemetry
        </span>
      }
      headingAs="h3"
      headingAdornment={
        <div className="relative">
          <Search
            className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter logs"
            aria-label="Filter system logs"
            className="h-9 pl-8 pr-3 text-body-sm bg-surface border border-rule-strong rounded-control text-ink placeholder:text-ink-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus transition-colors"
          />
        </div>
      }
    >
      {filtered.length > 0 ? (
        <pre
          aria-label="System log output"
          className="font-mono text-body-sm p-3 bg-surface-raised text-ink border border-rule rounded-control overflow-x-auto whitespace-pre"
        >
          <code>{filtered.join("\n")}</code>
        </pre>
      ) : (
        <BodySm className="text-ink-muted">No log lines match that filter.</BodySm>
      )}
    </Section>
  );
}
