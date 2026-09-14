"use client";

import React from "react";
import { useCaseList } from "@/providers/CasesProvider";
import { CAPTURED_AT } from "@/lib/replay";
import { isApiConfigured } from "@/lib/api-client";

/*
 * One honest line on every workstation route, saying where the case list
 * comes from right now. It disappears only when the list is live.
 */
export function DemoDataRibbon() {
  const list = useCaseList();
  if (list.source === "live") {
    return (
      <div role="note" className="px-4 sm:px-6 lg:px-8 py-1.5 border-b border-rule bg-surface-sunken text-body-sm text-ink-muted">
        <span className="font-semibold text-ink">Live queue.</span> {list.cases.length} case{list.cases.length === 1 ? "" : "s"} stored on this machine. New intakes run on the pipeline and are added here.
      </div>
    );
  }
  return (
    <div role="note" className="px-4 sm:px-6 lg:px-8 py-1.5 border-b border-rule bg-surface-sunken text-body-sm text-ink-muted">
      <span className="font-semibold text-ink">Example queue.</span>{" "}
      {isApiConfigured()
        ? list.loading
          ? "Loading the live queue from the pipeline API."
          : `The pipeline API did not answer (${list.reason ?? "unknown"}), so these are the bundled examples. A new intake will run on the API when it is back.`
        : `Every patient on these screens is synthetic. No pipeline API is configured, so a new intake replays a run recorded on ${CAPTURED_AT}.`}
    </div>
  );
}
