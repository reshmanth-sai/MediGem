"use client";

import React, { useState } from "react";
import { ModalDialog } from "@/components/ui/Dialog";
import { TextField } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { ClinicalCaseData } from "@/lib/casesData";
import type { PatientPatch } from "@/services/cases.service";

/*
 * Demographics only. Symptoms, vitals and the assessment are what the
 * pipeline actually ran on; they stay as recorded and a correction there is
 * a new intake, not an edit.
 */
export function EditPatientDialog({
  isOpen,
  onClose,
  caseData,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  caseData: ClinicalCaseData;
  onSave: (patch: PatientPatch) => Promise<void>;
}) {
  const [form, setForm] = useState({
    patient_name: caseData.patientName,
    patient_id: caseData.patientId,
    age: String(caseData.age || ""),
    gender: caseData.gender,
    location: caseData.village,
    chief_complaint: caseData.chiefComplaint,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const age = Number(form.age);
    if (!form.patient_name.trim()) return setError("A patient name is required.");
    if (!Number.isInteger(age) || age < 0 || age > 120) return setError("Age must be a whole number between 0 and 120.");
    setBusy(true);
    setError(null);
    try {
      await onSave({
        patient_name: form.patient_name.trim(),
        patient_id: form.patient_id.trim() || undefined,
        age,
        gender: form.gender,
        location: form.location.trim() || undefined,
        chief_complaint: form.chief_complaint.trim() || undefined,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "The change could not be saved.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} title="Edit patient details">
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField label="Full name" value={form.patient_name} onChange={set("patient_name")} required autoFocus />
          <TextField label="Patient ID" value={form.patient_id} onChange={set("patient_id")} />
          <TextField label="Age in years" type="number" min={0} max={120} value={form.age} onChange={set("age")} required />
          <label className="flex flex-col gap-1 text-body-sm">
            <span className="font-medium text-ink">Gender</span>
            <select value={form.gender} onChange={set("gender")} className="h-10 px-3 rounded-control border border-rule bg-surface text-ink">
              {["Female", "Male", "Other", "Not recorded"].map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </label>
          <TextField label="Location or facility" value={form.location} onChange={set("location")} />
        </div>
        <TextField label="Chief complaint" value={form.chief_complaint} onChange={set("chief_complaint")} />
        <p className="text-body-sm text-ink-muted">Symptoms, vitals and the assessment stay as recorded; a change to those is a new intake.</p>
        {error && <p role="alert" className="text-body-sm text-risk-emergency">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={busy}>Cancel</Button>
          <Button type="submit" disabled={busy}>{busy ? "Saving" : "Save changes"}</Button>
        </div>
      </form>
    </ModalDialog>
  );
}
