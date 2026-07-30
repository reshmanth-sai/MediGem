import React from "react";
import { Edit2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PatientDetailsFormData } from "./StepPatientDetails";
import { MedicalHistoryData } from "./StepMedicalHistory";
import { UploadedFileItem } from "./StepUploads";

export function StepReview({
  patientData,
  symptoms,
  symptomDuration,
  symptomSeverity,
  historyData,
  uploadedFiles,
  onEditStep,
}: {
  patientData: PatientDetailsFormData;
  symptoms: string[];
  symptomDuration: string;
  symptomSeverity: string;
  historyData: MedicalHistoryData;
  uploadedFiles: UploadedFileItem[];
  onEditStep: (stepId: number) => void;
}) {
  return (
    <Card className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Step 5: Case Review & Validation Summary
        </h3>
        <p className="text-xs text-slate-500">
          Review all entered patient demographics, vitals, symptoms, and attached files before starting AI reasoning
        </p>
      </div>

      {/* Section 1: Demographics */}
      <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 space-y-2 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase text-slate-500">1. Patient Demographics & Vitals</h4>
          <Button size="sm" variant="ghost" leftIcon={<Edit2 className="h-3.5 w-3.5" />} onClick={() => onEditStep(1)}>
            Edit
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <p><span className="text-slate-500">Name:</span> <strong>{patientData.patientName || "Not specified"}</strong></p>
          <p><span className="text-slate-500">ID:</span> <strong>{patientData.patientId || "P-101"}</strong></p>
          <p><span className="text-slate-500">Age/Gender:</span> <strong>{patientData.age}y/o {patientData.gender}</strong></p>
          <p><span className="text-slate-500">Location:</span> <strong>{patientData.location || "Clinic A"}</strong></p>
          <p><span className="text-slate-500">HR / BP:</span> <strong>{patientData.hrBpm || "--"} bpm | {patientData.systolicBp || "--"}/{patientData.diastolicBp || "--"} mmHg</strong></p>
          <p><span className="text-slate-500">Temp / SpO2:</span> <strong>{patientData.tempCelsius || "--"}°C | {patientData.spO2Percent || "--"}%</strong></p>
        </div>
      </div>

      {/* Section 2: Symptoms */}
      <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 space-y-2 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase text-slate-500">2. Symptoms & Onset</h4>
          <Button size="sm" variant="ghost" leftIcon={<Edit2 className="h-3.5 w-3.5" />} onClick={() => onEditStep(2)}>
            Edit
          </Button>
        </div>
        <div className="space-y-1 text-xs">
          <p><span className="text-slate-500">Presenting Symptoms:</span> <strong>{symptoms.length > 0 ? symptoms.join(", ") : "None specified"}</strong></p>
          <p><span className="text-slate-500">Duration & Severity:</span> <strong>{symptomDuration || "Not specified"} ({symptomSeverity})</strong></p>
        </div>
      </div>

      {/* Section 3: History */}
      <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 space-y-2 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase text-slate-500">3. Past Medical History</h4>
          <Button size="sm" variant="ghost" leftIcon={<Edit2 className="h-3.5 w-3.5" />} onClick={() => onEditStep(3)}>
            Edit
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <p><span className="text-slate-500">Allergies:</span> <strong>{historyData.allergies || "None reported"}</strong></p>
          <p><span className="text-slate-500">Medications:</span> <strong>{historyData.medications || "None reported"}</strong></p>
          <p><span className="text-slate-500">Chronic Conditions:</span> <strong>{historyData.chronicConditions || "None reported"}</strong></p>
          <p><span className="text-slate-500">Prior Surgeries:</span> <strong>{historyData.surgeries || "None reported"}</strong></p>
        </div>
      </div>

      {/* Section 4: Uploads */}
      <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 space-y-2 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase text-slate-500">4. Attached Medical Files</h4>
          <Button size="sm" variant="ghost" leftIcon={<Edit2 className="h-3.5 w-3.5" />} onClick={() => onEditStep(4)}>
            Edit
          </Button>
        </div>
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          {uploadedFiles.length > 0
            ? `${uploadedFiles.length} file(s) attached: ${uploadedFiles.map((f) => f.file.name).join(", ")}`
            : "No files attached (Proceeding with text & vitals analysis only)"}
        </p>
      </div>

      {symptoms.length === 0 && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center space-x-2 text-xs text-amber-800 dark:text-amber-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Notice: No specific symptoms selected. Analysis will proceed on chief complaint text.</span>
        </div>
      )}
    </Card>
  );
}
