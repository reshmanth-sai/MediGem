import React from "react";
import { Card } from "@/components/ui/Card";
import { TextField, Textarea } from "@/components/ui/Input";

export interface MedicalHistoryData {
  pastIllnesses: string;
  medications: string;
  allergies: string;
  surgeries: string;
  chronicConditions: string;
  lifestyleNotes: string;
}

export function StepMedicalHistory({
  data,
  onChange,
}: {
  data: MedicalHistoryData;
  onChange: (field: keyof MedicalHistoryData, val: string) => void;
}) {
  return (
    <Card className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Step 3: Past Medical History & Current Medications
        </h3>
        <p className="text-xs text-slate-500">
          Document chronic diseases, ongoing medications, known allergies, and prior surgeries
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField
          label="Known Allergies (Drugs, Food, Environmental)"
          value={data.allergies}
          onChange={(e) => onChange("allergies", e.target.value)}
          placeholder="e.g. Penicillin, Sulfa drugs, None known"
        />
        <TextField
          label="Current Medications & Dosages"
          value={data.medications}
          onChange={(e) => onChange("medications", e.target.value)}
          placeholder="e.g. Amlodipine 5mg OD, Metformin 500mg BD"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField
          label="Chronic Conditions (Hypertension, Diabetes, Asthma)"
          value={data.chronicConditions}
          onChange={(e) => onChange("chronicConditions", e.target.value)}
          placeholder="e.g. Type 2 Diabetes (5 years), Hypertension"
        />
        <TextField
          label="Previous Surgeries or Major Illnesses"
          value={data.surgeries}
          onChange={(e) => onChange("surgeries", e.target.value)}
          placeholder="e.g. Appendectomy (2018), None"
        />
      </div>

      <Textarea
        label="Lifestyle & Environmental Factors (Optional)"
        value={data.lifestyleNotes}
        onChange={(e) => onChange("lifestyleNotes", e.target.value)}
        placeholder="e.g. Tobacco use, alcohol history, occupation hazards..."
        rows={2}
      />
    </Card>
  );
}
