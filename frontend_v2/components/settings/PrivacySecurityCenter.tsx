"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { H2, BodySm } from "@/components/ui/Typography";
import { isApiConfigured, API_BASE_URL } from "@/lib/api-client";

/*
 * What is and is not in place. Stated plainly because a settings page that
 * announces encryption and audit logging that do not exist is worse than one
 * that says so.
 */
const ROWS: { label: string; state: "yes" | "no" | "partial"; detail: string }[] = [
  { label: "Accounts and sign-in", state: "no", detail: "There is no authentication. The clinician shown is a fixed demo persona." },
  { label: "Patient data at rest", state: "partial", detail: "Nothing is written to a database. A draft lives in memory; the last result in this tab's sessionStorage until the tab closes." },
  { label: "Encryption at rest", state: "no", detail: "No encrypted store exists because no store exists. Browser storage is not encrypted by this app." },
  { label: "Audit log", state: "no", detail: "Assessments and overrides are not logged anywhere." },
  { label: "Network use", state: "partial", detail: "Fonts and scripts ship with the site. The only requests at runtime are to the pipeline API and, from the assistant, to Ollama on the API host." },
  { label: "Telemetry", state: "yes", detail: "None. No analytics, no error reporting, no third-party scripts." },
  { label: "Uploads", state: "yes", detail: "Sent to the API, held in its temp directory for one run, then deleted." },
];

export function PrivacySecurityCenter() {
  return (
    <Card className="space-y-5">
      <div className="space-y-1">
        <H2>Privacy and security</H2>
        <BodySm className="text-ink-muted">
          Pipeline API: {isApiConfigured() ? <span className="font-mono">{API_BASE_URL}</span> : "not configured; the workstation runs on bundled examples"}.
        </BodySm>
      </div>
      <ul className="divide-y divide-rule border-t border-rule">
        {ROWS.map((r) => (
          <li key={r.label} className="py-3 grid grid-cols-1 sm:grid-cols-[12rem_6rem_1fr] gap-x-4 gap-y-1 text-body-sm">
            <span className="font-semibold text-ink">{r.label}</span>
            <span className={r.state === "yes" ? "font-mono text-risk-low" : r.state === "no" ? "font-mono text-risk-emergency" : "font-mono text-risk-high"}>
              {r.state === "yes" ? "in place" : r.state === "no" ? "not present" : "partial"}
            </span>
            <span className="text-ink-muted">{r.detail}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
