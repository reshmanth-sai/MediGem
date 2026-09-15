"use client";

import React from "react";

export interface ClinicalNotesRecordProps {
  initialNotes?: string;
  chiefComplaint?: string;
}

/*
 * Notes as recorded at intake. Read-only: there is no note store yet, so an
 * editor here would save to nowhere and vanish on reload. Editing arrives with
 * the event log.
 */
export function ClinicalNotesRecord({ initialNotes, chiefComplaint }: ClinicalNotesRecordProps) {
  return (
    <section className="space-y-4" aria-label="Clinical notes">
      <div className="flex items-center justify-between">
        <h2 className="text-h3 text-ink">Clinical notes</h2>
        <span className="text-body-sm text-ink-muted">Recorded at intake</span>
      </div>
      <div className="space-y-3">
        <div className="space-y-1">
          <h3 className="text-body-sm font-semibold text-ink">Chief complaint</h3>
          <p className="text-body-sm text-ink">{chiefComplaint || "Not recorded."}</p>
        </div>
        <div className="space-y-1">
          <h3 className="text-body-sm font-semibold text-ink">History and notes</h3>
          <p className="text-body-sm text-ink whitespace-pre-line">{initialNotes?.trim() || "No intake notes were recorded."}</p>
        </div>
      </div>
    </section>
  );
}
