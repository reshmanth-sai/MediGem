"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { H2, BodySm } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { useCaseDraft } from "@/lib/store/caseDraft";
import { useSystemStatus } from "@/hooks/useSystemStatus";

/*
 * Where this workstation keeps data, and the one real action on it. There is
 * no database in the browser: the intake draft lives in memory, the last
 * result in this tab's sessionStorage, the theme and accessibility choices in
 * localStorage. Uploads sent to the API are deleted there after the run.
 */
export function OfflineStorageAnalyzer() {
  const result = useCaseDraft((s) => s.result);
  const uploads = useCaseDraft((s) => s.uploads);
  const reset = useCaseDraft((s) => s.reset);
  const browser = useSystemStatus();
  const [cleared, setCleared] = useState(false);

  return (
    <Card className="space-y-5">
      <div className="space-y-1">
        <H2>Data on this device</H2>
        <BodySm className="text-ink-muted">No patient database exists in the browser. This is everything the workstation keeps, and where.</BodySm>
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-[14rem_1fr] gap-y-3 gap-x-4 text-body-sm border-t border-rule pt-4">
        <dt className="text-ink-muted">Intake draft</dt>
        <dd className="text-ink">In memory for this tab. {uploads.length} attached file{uploads.length === 1 ? "" : "s"}. Lost on reload.</dd>
        <dt className="text-ink-muted">Last assessment</dt>
        <dd className="text-ink">{result ? `${result.caseId} in this tab's sessionStorage. Cleared when the tab closes.` : "None in this tab."}</dd>
        <dt className="text-ink-muted">Preferences</dt>
        <dd className="text-ink">Theme, contrast, motion and text size in localStorage. No patient data.</dd>
        <dt className="text-ink-muted">Uploads sent to the API</dt>
        <dd className="text-ink">Written to the API&apos;s temp directory for the run and deleted when it returns.</dd>
        <dt className="text-ink-muted">Browser storage quota</dt>
        <dd className="font-mono text-ink">{browser.storageFreeGb === null ? "not reported by this browser" : `${browser.storageFreeGb.toFixed(1)} GB free`}</dd>
      </dl>
      <div className="flex flex-wrap items-center gap-3 border-t border-rule pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            reset();
            try {
              window.sessionStorage.removeItem("medigem-case-draft");
            } catch {
              // Storage unavailable; the in-memory reset already ran.
            }
            setCleared(true);
          }}
        >
          Clear this tab&apos;s case data
        </Button>
        {cleared && <BodySm className="text-ink-muted" role="status">Cleared.</BodySm>}
      </div>
    </Card>
  );
}
