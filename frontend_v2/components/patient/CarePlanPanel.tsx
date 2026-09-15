"use client";

import React, { useState } from "react";
import { ClipboardList } from "lucide-react";
import { TextField, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { ClinicalCaseData } from "@/lib/casesData";
import type { PlanInput } from "@/services/cases.service";

const URGENCIES = ["Immediate referral", "Urgent referral within 24 hours", "Routine referral", "Monitor and follow up", "Routine follow-up"];

/*
 * The clinician's plan for the case, distinct from the model's recommendation
 * above it. Editable when the case is stored on the API; otherwise shown with
 * the controls disabled and a line saying why.
 */
export function CarePlanPanel({ caseData, onSave }: { caseData: ClinicalCaseData; onSave?: (plan: PlanInput) => Promise<void> }) {
  const plan = caseData.plan;
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<PlanInput>({
    next_step: plan?.nextStep ?? caseData.disposition.nextStep ?? "",
    follow_up: plan?.followUp ?? "",
    urgency: plan?.urgency ?? caseData.disposition.urgency ?? URGENCIES[3],
    note: plan?.note ?? "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canEdit = Boolean(onSave);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSave) return;
    if (!form.next_step.trim()) return setError("Say what happens next.");
    setBusy(true);
    setError(null);
    try {
      await onSave({ ...form, next_step: form.next_step.trim(), follow_up: form.follow_up?.trim() || undefined, note: form.note?.trim() || undefined });
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The plan could not be saved.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section id="care-plan" aria-label="Care plan" className="space-y-4 scroll-mt-24">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-h3 text-ink inline-flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-ink-muted" aria-hidden="true" /> Care plan
        </h2>
        {!editing && (
          <Button type="button" size="sm" variant="secondary" disabled={!canEdit} title={canEdit ? undefined : "Available for cases stored on the pipeline API"} onClick={() => setEditing(true)}>
            {plan ? "Update care plan" : "Set care plan"}
          </Button>
        )}
      </div>

      {!editing && (
        plan ? (
          <dl className="grid grid-cols-1 sm:grid-cols-[9rem_1fr] gap-x-4 gap-y-2 text-body-sm border-t border-rule pt-3">
            <dt className="text-ink-muted">Next step</dt>
            <dd className="text-ink">{plan.nextStep}</dd>
            {plan.urgency && (<><dt className="text-ink-muted">Urgency</dt><dd className="text-ink">{plan.urgency}</dd></>)}
            {plan.followUp && (<><dt className="text-ink-muted">Follow-up</dt><dd className="text-ink">{plan.followUp}</dd></>)}
            {plan.note && (<><dt className="text-ink-muted">Note</dt><dd className="text-ink whitespace-pre-line">{plan.note}</dd></>)}
            {plan.updatedBy && (
              <>
                <dt className="text-ink-muted">Set by</dt>
                <dd className="text-ink-muted font-mono">{plan.updatedBy}{plan.updatedAt ? ` · ${plan.updatedAt.replace("T", " ").slice(0, 16)} UTC` : ""}</dd>
              </>
            )}
          </dl>
        ) : (
          <p className="text-body-sm text-ink-muted border-t border-rule pt-3">
            No care plan yet. The model&apos;s recommendation is above; the plan is what the clinician decides to do.
            {!canEdit && " Plans are recorded on cases stored by the pipeline API."}
          </p>
        )
      )}

      {editing && (
        <form onSubmit={submit} className="space-y-3 border-t border-rule pt-3">
          <Textarea label="Next step" value={form.next_step} onChange={(e) => setForm((f) => ({ ...f, next_step: e.target.value }))} rows={2} required autoFocus />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-body-sm">
              <span className="font-medium text-ink">Urgency</span>
              <select value={form.urgency ?? ""} onChange={(e) => setForm((f) => ({ ...f, urgency: e.target.value }))} className="h-10 px-3 rounded-control border border-rule bg-surface text-ink">
                {[form.urgency, ...URGENCIES].filter((u, i, a) => u && a.indexOf(u) === i).map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </label>
            <TextField label="Follow-up" placeholder="e.g. Recheck BP in 3 days" value={form.follow_up ?? ""} onChange={(e) => setForm((f) => ({ ...f, follow_up: e.target.value }))} />
          </div>
          <Textarea label="Note (optional)" value={form.note ?? ""} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} rows={2} />
          {error && <p role="alert" className="text-body-sm text-risk-emergency">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setEditing(false)} disabled={busy}>Cancel</Button>
            <Button type="submit" disabled={busy}>{busy ? "Saving" : "Save plan"}</Button>
          </div>
        </form>
      )}
    </section>
  );
}
