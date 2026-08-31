import React from "react";
import { FileText, Heart, Activity, Pill, Stethoscope } from "lucide-react";
import { Section, Card } from "@/components/ui/Card";
import { BodySm, Label } from "@/components/ui/Typography";

export function AnalysisTypesGrid() {
  const modalities = [
    {
      title: "12-Lead ECG Rhythm Strips",
      formats: "PNG, JPG, PDF",
      purpose: "Rhythm assessment and acute cardiac observation flagging",
      output: "Rhythm summary and urgency classification",
      icon: <Heart className="h-5 w-5 text-action" aria-hidden="true" />,
    },
    {
      title: "Laboratory Diagnostic Reports",
      formats: "PDF, PNG, Scanned Images",
      purpose: "Automated PyMuPDF text layer extraction and value flagging",
      output: "Abnormal lab parameter list and physician review summary",
      icon: <Activity className="h-5 w-5 text-action" aria-hidden="true" />,
    },
    {
      title: "Prescription Scan Memos",
      formats: "PNG, JPG, PDF",
      purpose: "Handwritten memo text extraction and dosage formatting",
      output: "Structured medication list and patient guidance",
      icon: <Pill className="h-5 w-5 text-action" aria-hidden="true" />,
    },
    {
      title: "Wound & Clinical Images",
      formats: "PNG, JPG",
      purpose: "OpenCV quality variance evaluation and physical assessment",
      output: "Wound observation summary and care recommendation",
      icon: <Stethoscope className="h-5 w-5 text-action" aria-hidden="true" />,
    },
    {
      title: "Clinical Symptom Notes",
      formats: "Plain Text, Voice Transcripts",
      purpose: "Symptom extraction and emergency rule evaluation",
      output: "Emergency alert or structured clinical summary",
      icon: <FileText className="h-5 w-5 text-action" aria-hidden="true" />,
    },
  ];

  return (
    <Section heading="Supported Clinical Analysis Modalities">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modalities.map((m) => (
          <Card key={m.title} className="space-y-2 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-control bg-surface-raised">{m.icon}</div>
                <h3 className="text-body-sm font-bold text-ink">{m.title}</h3>
              </div>
              <BodySm className="text-ink-muted leading-relaxed">{m.purpose}</BodySm>
            </div>
            <div className="pt-2 border-t border-rule flex items-center justify-between">
              <Label>Formats: {m.formats}</Label>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
