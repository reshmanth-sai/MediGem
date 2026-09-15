"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { ClinicalCaseData } from "@/lib/casesData";

export interface ClinicalNotesRecordProps {
  initialNotes?: string;
  chiefComplaint?: string;
  notes?: ClinicalCaseData["notes"];
  /** Present when the case is stored on the API; adds a note to it. */
  onAddNote?: (text: string) => Promise<void>;
}

/*
 * What was recorded at intake, then the clinicians' notes in order. Notes are
 * append-only: nothing here edits or removes an earlier entry.
 */
export function ClinicalNotesRecord({ initialNotes, chiefComplaint, notes = [], onAddNote }: ClinicalNotesRecordProps) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddNote || !text.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await onAddNote(text.trim());
      setText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "The note could not be saved.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="space-y-4" aria-label="Clinical notes">
      <h2 className="text-h3 text-ink">Clinical notes</h2>
      <div className="space-y-3">
        <div className="space-y-1">
          <h3 className="text-body-sm font-semibold text-ink">Chief complaint <span className="font-normal text-ink-muted">· at intake</span></h3>
          <p className="text-body-sm text-ink">{chiefComplaint || "Not recorded."}</p>
        </div>
        <div className="space-y-1">
          <h3 className="text-body-sm font-semibold text-ink">History <span className="font-normal text-ink-muted">· at intake</span></h3>
          <p className="text-body-sm text-ink whitespace-pre-line">{initialNotes?.trim() || "No intake notes were recorded."}</p>
        </div>
      </div>

      <div className="space-y-2 border-t border-rule pt-3">
        <h3 className="text-body-sm font-semibold text-ink">Clinician notes</h3>
        {notes.length === 0 ? (
          <p className="text-body-sm text-ink-muted">No clinician notes yet.</p>
        ) : (
          <ol className="divide-y divide-rule">
            {notes.map((n) => (
              <li key={n.id} className="py-2 space-y-0.5">
                <p className="text-body-sm text-ink whitespace-pre-line">{n.text}</p>
                <p className="text-body-sm text-ink-muted font-mono">{n.author} · {n.at.replace("T", " ").slice(0, 16)} UTC</p>
              </li>
            ))}
          </ol>
        )}
        <form onSubmit={submit} className="space-y-2">
          <Textarea
            label="Add a note"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            disabled={!onAddNote}
            placeholder={onAddNote ? "Observation, counselling given, follow-up arranged" : "Notes are recorded on cases stored by the pipeline API"}
          />
          {error && <p role="alert" className="text-body-sm text-risk-emergency">{error}</p>}
          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={!onAddNote || busy || !text.trim()}>{busy ? "Saving" : "Add note"}</Button>
          </div>
        </form>
      </div>
    </section>
  );
}
