import React from "react";
import { Card } from "@/components/ui/Card";
import { TextField, Textarea } from "@/components/ui/Input";
import { H3, BodySm } from "@/components/ui/Typography";

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
      <div className="space-y-1">
        <H3>Step 3: Past medical history and current medications</H3>
        <BodySm className="text-ink-muted">
          Record chronic diseases, ongoing medications, known allergies, and
          prior surgeries.
        </BodySm>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField
          label="Known allergies"
          helperText="Drugs, food or environmental. Write None known if there are none."
          value={data.allergies}
          onChange={(e) => onChange("allergies", e.target.value)}
        />
        <TextField
          label="Current medications and dosages"
          helperText="Include the dose and frequency where known."
          value={data.medications}
          onChange={(e) => onChange("medications", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField
          label="Chronic conditions"
          helperText="For example hypertension, diabetes or asthma, with duration."
          value={data.chronicConditions}
          onChange={(e) => onChange("chronicConditions", e.target.value)}
        />
        <TextField
          label="Previous surgeries or major illnesses"
          helperText="Include the year where known."
          value={data.surgeries}
          onChange={(e) => onChange("surgeries", e.target.value)}
        />
      </div>

      <TextField
        label="Past illnesses"
        helperText="Significant illnesses that are no longer active."
        value={data.pastIllnesses}
        onChange={(e) => onChange("pastIllnesses", e.target.value)}
      />

      <Textarea
        label="Lifestyle and environmental factors"
        rows={2}
        helperText="Tobacco or alcohol use, occupation, exposures. Optional."
        value={data.lifestyleNotes}
        onChange={(e) => onChange("lifestyleNotes", e.target.value)}
      />
    </Card>
  );
}
