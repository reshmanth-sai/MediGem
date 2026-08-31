"use client";

import React from "react";
import {
  User,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Label, BodySm } from "@/components/ui/Typography";
import { PatientDetailsFormValues } from "./StepPatientDetails";
import { MedicalHistoryData } from "./StepMedicalHistory";
import { UploadedFileItem } from "./StepUploads";

export interface StickyPatientContextSidebarProps {
  patientData: PatientDetailsFormValues;
  symptoms: string[];
  historyData: MedicalHistoryData;
  uploadedFiles: UploadedFileItem[];
  currentStep: number;
}

type VitalStatus = "high" | "low" | "normal" | "unrecorded";

const STATUS_PRESENTATION: Record<
  VitalStatus,
  { label: string; tone: string; icon: React.ComponentType<{ className?: string }> }
> = {
  // Shape (icon) plus a written label plus colour. Never colour alone.
  high: { label: "High", tone: "text-risk-high", icon: TrendingUp },
  low: { label: "Low", tone: "text-risk-emergency", icon: TrendingDown },
  normal: { label: "In range", tone: "text-risk-low", icon: Minus },
  unrecorded: { label: "Not recorded", tone: "text-ink-muted", icon: Minus },
};

function VitalRow({
  name,
  value,
  status,
}: {
  name: string;
  value: string;
  status: VitalStatus;
}) {
  const presentation = STATUS_PRESENTATION[status];
  const StatusIcon = presentation.icon;
  return (
    <div className="p-2 rounded-control bg-surface-raised border border-rule space-y-0.5">
      <p className="text-body-sm text-ink-muted">{name}</p>
      <p className="text-body-sm font-semibold text-ink font-mono tabular">{value}</p>
      <p className={`flex items-center gap-1 text-body-sm ${presentation.tone}`}>
        <StatusIcon className="h-4 w-4" aria-hidden="true" />
        <span>{presentation.label}</span>
      </p>
    </div>
  );
}

function statusOf(
  value: number | undefined,
  { high, low }: { high?: number; low?: number }
): VitalStatus {
  if (value === undefined || !Number.isFinite(value)) return "unrecorded";
  if (high !== undefined && value > high) return "high";
  if (low !== undefined && value < low) return "low";
  return "normal";
}

export function StickyPatientContextSidebar({
  patientData,
  symptoms,
  historyData,
  uploadedFiles,
  currentStep,
}: StickyPatientContextSidebarProps) {
  const advisories: string[] = [];
  if ((patientData.hrBpm ?? 0) > 120) {
    advisories.push("Heart rate above 120 bpm. Attach a 12-lead ECG strip if one is available.");
  }
  if ((patientData.systolicBp ?? 0) > 150) {
    advisories.push("Systolic pressure above 150 mmHg. Repeat the measurement in 15 minutes.");
  }
  if (symptoms.some((s) => s.toLowerCase().includes("chest"))) {
    advisories.push("Chest symptoms recorded. Log pain onset and radiation details.");
  }
  if (historyData.allergies.trim() === "") {
    advisories.push("No allergy information recorded yet. Confirm on step 3.");
  }

  const ageText = Number.isFinite(patientData.age ?? Number.NaN)
    ? `${patientData.age} years`
    : "Age not recorded";
  const genderText = patientData.gender || "Gender not recorded";
  const locationText = patientData.location?.trim() || "Location not recorded";

  const bloodPressure =
    patientData.systolicBp === undefined || patientData.diastolicBp === undefined
      ? "Not recorded"
      : `${patientData.systolicBp}/${patientData.diastolicBp}`;

  return (
    <Card className="space-y-4 sticky top-4">
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-rule">
        <h3 className="flex items-center gap-1.5 text-label text-ink">
          <User className="h-4 w-4 text-action" aria-hidden="true" />
          <span>Patient intake context</span>
        </h3>
        <span className="flex items-center gap-1 text-body-sm text-risk-low">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          <span>Offline</span>
        </span>
      </div>

      <div className="space-y-1">
        <p className="text-h3 text-ink">
          {patientData.patientName.trim() || "New patient"}
        </p>
        <BodySm className="text-ink-muted">
          {patientData.patientId.trim() || "No patient ID yet"}
        </BodySm>
        <BodySm className="text-ink-muted">
          {ageText}, {genderText}, {locationText}
        </BodySm>
        <BodySm className="text-ink-muted">Currently on step {currentStep} of 5.</BodySm>
      </div>

      <div className="space-y-1.5">
        <Label as="p">Recorded vital signs</Label>
        <div className="grid grid-cols-2 gap-1.5">
          <VitalRow
            name="Heart rate"
            value={
              patientData.hrBpm === undefined ? "Not recorded" : `${patientData.hrBpm} bpm`
            }
            status={statusOf(patientData.hrBpm, { high: 100, low: 50 })}
          />
          <VitalRow
            name="Blood pressure"
            value={bloodPressure}
            status={statusOf(patientData.systolicBp, { high: 140, low: 90 })}
          />
          <VitalRow
            name="Temperature"
            value={
              patientData.tempCelsius === undefined
                ? "Not recorded"
                : `${patientData.tempCelsius} C`
            }
            status={statusOf(patientData.tempCelsius, { high: 38, low: 35 })}
          />
          <VitalRow
            name="Oxygen saturation"
            value={
              patientData.spO2Percent === undefined
                ? "Not recorded"
                : `${patientData.spO2Percent} percent`
            }
            status={statusOf(patientData.spO2Percent, { low: 94 })}
          />
        </div>
      </div>

      {advisories.length > 0 && (
        <div className="p-2.5 rounded-card bg-surface-raised border border-risk-high space-y-1">
          <p className="flex items-center gap-1 text-label text-risk-high">
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            <span>Clinical decision advisories</span>
          </p>
          <ul className="space-y-1 list-disc pl-5">
            {advisories.map((adv) => (
              <li key={adv} className="text-body-sm text-ink">
                {adv}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-1.5">
        <Label as="p">Presenting symptoms ({symptoms.length})</Label>
        {symptoms.length > 0 ? (
          <ul className="flex flex-wrap gap-1 list-none p-0 m-0">
            {symptoms.map((s) => (
              <li
                key={s}
                className="px-2 py-0.5 rounded-chip bg-action-subtle text-action border border-rule text-body-sm font-semibold"
              >
                {s}
              </li>
            ))}
          </ul>
        ) : (
          <BodySm className="text-ink-muted">No symptoms recorded yet.</BodySm>
        )}
      </div>

      <div className="space-y-1.5">
        <Label as="p">Attached files ({uploadedFiles.length})</Label>
        {uploadedFiles.length > 0 ? (
          <ul className="space-y-1 list-none p-0 m-0">
            {uploadedFiles.map((f) => (
              <li
                key={f.id}
                className="p-1.5 rounded-control bg-surface-raised border border-rule flex items-center justify-between gap-2 text-body-sm text-ink"
              >
                <span className="break-all">{f.file.name}</span>
                <span className="text-ink-muted shrink-0">{f.type}</span>
              </li>
            ))}
          </ul>
        ) : (
          <BodySm className="text-ink-muted">No documents attached.</BodySm>
        )}
      </div>

      <p className="p-2.5 rounded-control bg-surface-raised border border-rule flex items-center gap-2 text-body-sm text-ink-muted">
        <CheckCircle2 className="h-4 w-4 text-risk-low shrink-0" aria-hidden="true" />
        <span>Saved locally to the SQLite edge volume.</span>
      </p>
    </Card>
  );
}
