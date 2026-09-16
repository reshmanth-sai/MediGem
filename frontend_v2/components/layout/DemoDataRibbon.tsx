"use client";

import React from "react";
import { useCaseList } from "@/providers/CasesProvider";
import { CAPTURED_AT } from "@/lib/replay";
import { isApiConfigured } from "@/lib/api-client";

/*
 * One honest line on every workstation route, saying where the case list
 * comes from right now. It disappears only when the list is live.
 *
 * Two phrasings of the same fact. The full sentence wrapped to three lines on
 * a phone and cost about 150px above every route, more viewport than any
 * other piece of chrome. Below `md` the ribbon states the part a clinician
 * has to know -- that these patients are not real, or that the pipeline is
 * not answering -- and drops the detail about where the replay came from.
 * The claim is never softened between the two, only shortened; whichever one
 * is hidden is hidden from assistive technology too, so a screen reader hears
 * exactly one of them rather than both.
 */
function ribbonText(
  list: ReturnType<typeof useCaseList>
): { lead: string; short: string; full: string } {
  if (list.source === "live") {
    const n = list.cases.length;
    const cases = `${n} case${n === 1 ? "" : "s"}`;
    return {
      lead: "Live queue.",
      short: `${cases} stored on this machine.`,
      full: `${cases} stored on this machine. New intakes run on the pipeline and are added here.`,
    };
  }

  if (isApiConfigured()) {
    if (list.loading) {
      return {
        lead: "Example queue.",
        short: "Loading the live queue.",
        full: "Loading the live queue from the pipeline API.",
      };
    }
    const reason = list.reason ?? "unknown";
    return {
      lead: "Example queue.",
      short: `The pipeline API did not answer (${reason}). These are bundled examples.`,
      full: `The pipeline API did not answer (${reason}), so these are the bundled examples. A new intake will run on the API when it is back.`,
    };
  }

  return {
    lead: "Example queue.",
    short: "Every patient on these screens is synthetic.",
    full: `Every patient on these screens is synthetic. No pipeline API is configured, so a new intake replays a run recorded on ${CAPTURED_AT}.`,
  };
}

export function DemoDataRibbon() {
  const list = useCaseList();
  const { lead, short, full } = ribbonText(list);

  return (
    <div
      role="note"
      className="px-4 sm:px-6 lg:px-8 py-1.5 border-b border-rule bg-surface-sunken text-body-sm text-ink-muted"
    >
      <span className="font-semibold text-ink">{lead}</span>{" "}
      <span className="md:hidden">{short}</span>
      <span className="hidden md:inline">{full}</span>
    </div>
  );
}
