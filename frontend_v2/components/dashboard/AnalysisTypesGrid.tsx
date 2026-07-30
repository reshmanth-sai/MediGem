import React from "react";
import { FileText, Heart, Activity, Pill, Stethoscope } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function AnalysisTypesGrid() {
  const modalities = [
    {
      title: "12-Lead ECG Rhythm Strips",
      formats: "PNG, JPG, PDF",
      purpose: "Rhythm assessment & acute cardiac observation flagging",
      output: "Rhythm summary & urgency classification",
      icon: <Heart className="h-5 w-5 text-red-500" />,
    },
    {
      title: "Laboratory Diagnostic Reports",
      formats: "PDF, PNG, Scanned Images",
      purpose: "Automated PyMuPDF text layer extraction & value flagging",
      output: "Abnormal lab parameter list & physician review summary",
      icon: <Activity className="h-5 w-5 text-teal-600 dark:text-teal-400" />,
    },
    {
      title: "Prescription Scan Memos",
      formats: "PNG, JPG, PDF",
      purpose: "Handwritten memo text extraction & dosage formatting",
      output: "Structured medication list & patient guidance",
      icon: <Pill className="h-5 w-5 text-amber-500" />,
    },
    {
      title: "Wound & Clinical Images",
      formats: "PNG, JPG",
      purpose: "OpenCV quality variance evaluation & physical assessment",
      output: "Wound observation summary & care recommendation",
      icon: <Stethoscope className="h-5 w-5 text-purple-500" />,
    },
    {
      title: "Clinical Symptom Notes",
      formats: "Plain Text, Voice Transcripts",
      purpose: "Symptom extraction & emergency rule evaluation",
      output: "Emergency alert or structured clinical summary",
      icon: <FileText className="h-5 w-5 text-blue-500" />,
    },
  ];

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
        Supported Clinical Analysis Modalities
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modalities.map((m) => (
          <Card key={m.title} className="space-y-2 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded bg-slate-100 dark:bg-slate-900">{m.icon}</div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">{m.title}</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {m.purpose}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span>Formats: {m.formats}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
