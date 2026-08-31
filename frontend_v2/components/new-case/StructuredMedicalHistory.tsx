"use client";

import React from "react";
import { Activity, ShieldAlert, Pill, FileText } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { TextField, Textarea } from "@/components/ui/Input";
import { H3, BodySm } from "@/components/ui/Typography";
import { MedicalHistoryData } from "./StepMedicalHistory";

export type MedicalHistoryField = keyof MedicalHistoryData;

export interface StructuredMedicalHistoryProps {
  historyData: MedicalHistoryData;
  onChange: (field: MedicalHistoryField, val: string) => void;
  errors?: Partial<Record<MedicalHistoryField, string>>;
  onBlurField?: (field: MedicalHistoryField) => void;
}

export function StructuredMedicalHistory({
  historyData,
  onChange,
  errors,
  onBlurField,
}: StructuredMedicalHistoryProps) {
  const bind = (field: MedicalHistoryField) => ({
    id: field,
    value: historyData[field],
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => onChange(field, e.target.value),
    onBlur: () => onBlurField?.(field),
    error: errors?.[field],
  });

  return (
    <Card className="space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-rule">
        <span className="p-2.5 rounded-control bg-action-subtle text-action border border-rule">
          <Activity className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="space-y-1">
          <H3>Step 3: Past medical history and medications</H3>
          <BodySm className="text-ink-muted">
            Record chronic illnesses, active prescriptions, and known allergies.
            Every field on this step is optional.
          </BodySm>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField
          label="Drug and food allergies"
          helperText="Write None known when the patient reports no allergies."
          {...bind("allergies")}
        />
        <TextField
          label="Current active medications"
          helperText="Include the dose and frequency where known."
          {...bind("medications")}
        />
        <TextField
          label="Chronic conditions"
          helperText="Include how long each condition has been diagnosed."
          {...bind("chronicConditions")}
        />
        <TextField
          label="Prior surgeries or hospitalisations"
          helperText="Include the year where known."
          {...bind("surgeries")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField
          label="Past illnesses"
          helperText="Significant illnesses that are no longer active."
          {...bind("pastIllnesses")}
        />
        <Textarea
          label="Lifestyle and environmental factors"
          rows={2}
          helperText="Tobacco or alcohol use, occupation, exposures."
          {...bind("lifestyleNotes")}
        />
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-none p-0 m-0">
        <li className="flex items-center gap-2 text-body-sm text-ink-muted">
          <ShieldAlert className="h-4 w-4 text-risk-emergency" aria-hidden="true" />
          <span>Allergies drive the safety gate before any recommendation.</span>
        </li>
        <li className="flex items-center gap-2 text-body-sm text-ink-muted">
          <Pill className="h-4 w-4 text-action" aria-hidden="true" />
          <span>Active medications are checked for interactions.</span>
        </li>
        <li className="flex items-center gap-2 text-body-sm text-ink-muted">
          <FileText className="h-4 w-4 text-ink-muted" aria-hidden="true" />
          <span>History is stored locally with the rest of the case.</span>
        </li>
      </ul>
    </Card>
  );
}
