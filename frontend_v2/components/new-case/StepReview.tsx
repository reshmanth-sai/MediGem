import React from "react";
import { Edit2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { H3, BodySm, Label } from "@/components/ui/Typography";
import { PatientDetailsFormValues } from "./StepPatientDetails";
import { MedicalHistoryData } from "./StepMedicalHistory";
import { UploadedFileItem } from "./StepUploads";

export interface StepReviewProps {
  patientData: PatientDetailsFormValues;
  symptoms: string[];
  symptomDuration: string;
  symptomSeverity: string;
  historyData: MedicalHistoryData;
  uploadedFiles: UploadedFileItem[];
  onEditStep: (stepId: number) => void;
}

/** Blank, zero-like and NaN values all mean the same thing: nothing recorded. */
function recorded(value: string | number | null | undefined, unit = ""): string {
  if (value === null || value === undefined) return "Not recorded";
  if (typeof value === "number" && !Number.isFinite(value)) return "Not recorded";
  const text = String(value).trim();
  if (text === "") return "Not recorded";
  return unit ? `${text} ${unit}` : text;
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <Label as="p">{label}</Label>
      <p className="text-body-sm text-ink">{value}</p>
    </div>
  );
}

function ReviewSection({
  index,
  title,
  step,
  onEditStep,
  children,
}: {
  index: number;
  title: string;
  step: number;
  onEditStep: (stepId: number) => void;
  children: React.ReactNode;
}) {
  return (
    <section className="p-4 rounded-card bg-surface-raised border border-rule space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-h3 text-ink">
          {index}. {title}
        </h4>
        <Button
          size="sm"
          variant="ghost"
          leftIcon={<Edit2 className="h-4 w-4" aria-hidden="true" />}
          aria-label={`Edit ${title}`}
          onClick={() => onEditStep(step)}
        >
          Edit
        </Button>
      </div>
      {children}
    </section>
  );
}

export function StepReview({
  patientData,
  symptoms,
  symptomDuration,
  symptomSeverity,
  historyData,
  uploadedFiles,
  onEditStep,
}: StepReviewProps) {
  return (
    <Card className="space-y-6">
      <div className="space-y-1">
        <H3>Step 5: Case review and validation summary</H3>
        <BodySm className="text-ink-muted">
          Check every recorded value before starting the clinical reasoning run.
          Anything shown as not recorded will be analysed as missing, not as
          zero.
        </BodySm>
      </div>

      <ReviewSection
        index={1}
        title="Patient demographics and vitals"
        step={1}
        onEditStep={onEditStep}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <ReviewRow label="Name" value={recorded(patientData.patientName)} />
          <ReviewRow label="Patient ID" value={recorded(patientData.patientId)} />
          <ReviewRow label="Age" value={recorded(patientData.age, "years")} />
          <ReviewRow label="Gender" value={recorded(patientData.gender)} />
          <ReviewRow label="Location" value={recorded(patientData.location)} />
          <ReviewRow label="Heart rate" value={recorded(patientData.hrBpm, "bpm")} />
          <ReviewRow
            label="Blood pressure"
            value={
              patientData.systolicBp === undefined ||
              patientData.diastolicBp === undefined
                ? "Not recorded"
                : `${patientData.systolicBp}/${patientData.diastolicBp} mmHg`
            }
          />
          <ReviewRow
            label="Temperature"
            value={recorded(patientData.tempCelsius, "Celsius")}
          />
          <ReviewRow
            label="Oxygen saturation"
            value={recorded(patientData.spO2Percent, "percent")}
          />
          <ReviewRow label="Weight" value={recorded(patientData.weightKg, "kg")} />
          <ReviewRow label="Height" value={recorded(patientData.heightCm, "cm")} />
        </div>
        <div className="space-y-0.5">
          <Label as="p">Chief complaint</Label>
          <p className="text-body-sm text-ink">
            {recorded(patientData.chiefComplaint)}
          </p>
        </div>
      </ReviewSection>

      <ReviewSection
        index={2}
        title="Symptoms and onset"
        step={2}
        onEditStep={onEditStep}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <ReviewRow
            label="Presenting symptoms"
            value={symptoms.length > 0 ? symptoms.join(", ") : "Not recorded"}
          />
          <ReviewRow label="Duration" value={recorded(symptomDuration)} />
          <ReviewRow label="Severity" value={recorded(symptomSeverity)} />
        </div>
      </ReviewSection>

      <ReviewSection
        index={3}
        title="Past medical history"
        step={3}
        onEditStep={onEditStep}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ReviewRow label="Allergies" value={recorded(historyData.allergies)} />
          <ReviewRow label="Medications" value={recorded(historyData.medications)} />
          <ReviewRow
            label="Chronic conditions"
            value={recorded(historyData.chronicConditions)}
          />
          <ReviewRow label="Prior surgeries" value={recorded(historyData.surgeries)} />
          <ReviewRow label="Past illnesses" value={recorded(historyData.pastIllnesses)} />
          <ReviewRow label="Lifestyle notes" value={recorded(historyData.lifestyleNotes)} />
        </div>
      </ReviewSection>

      <ReviewSection
        index={4}
        title="Attached medical files"
        step={4}
        onEditStep={onEditStep}
      >
        <p className="text-body-sm text-ink">
          {uploadedFiles.length > 0
            ? `${uploadedFiles.length} attached: ${uploadedFiles
                .map((f) => f.file.name)
                .join(", ")}`
            : "No files attached. Analysis proceeds on text and vitals only."}
        </p>
      </ReviewSection>

      {symptoms.length === 0 && (
        <div
          role="note"
          className="p-3 rounded-card border border-risk-high bg-surface-raised flex items-start gap-2"
        >
          <AlertCircle
            className="h-4 w-4 shrink-0 mt-0.5 text-risk-high"
            aria-hidden="true"
          />
          <p className="text-body-sm text-ink">
            <span className="font-semibold">Notice: </span>
            no specific symptoms are recorded. Reasoning will run on the chief
            complaint text alone.
          </p>
        </div>
      )}
    </Card>
  );
}
