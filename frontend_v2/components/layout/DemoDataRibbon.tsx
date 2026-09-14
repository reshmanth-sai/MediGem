"use client";

import React from "react";
import { isApiConfigured } from "@/lib/api-client";
import { CAPTURED_AT } from "@/lib/replay";

/*
 * One honest line on every workstation route. The queue and its cases are a
 * bundled example set until there is a case store; whether a new intake runs
 * on the real pipeline depends on the API being configured for this build.
 */
export function DemoDataRibbon() {
  const live = isApiConfigured();
  return (
    <div role="note" className="px-4 sm:px-6 lg:px-8 py-1.5 border-b border-rule bg-surface-sunken text-body-sm text-ink-muted">
      <span className="font-semibold text-ink">Example queue.</span>{" "}
      {live
        ? "The patients listed are synthetic. A new intake runs on the pipeline API on this machine."
        : `Every patient on these screens is synthetic. No pipeline API is configured, so a new intake replays a run recorded on ${CAPTURED_AT}.`}
    </div>
  );
}
