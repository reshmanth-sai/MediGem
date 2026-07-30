import React from "react";
import { Clock, User, FileText, Cpu, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function MedicalTimeline() {
  const events = [
    { time: "10:00 AM", title: "Symptom Onset", desc: "Patient reported chest tightness and mild shortness of breath.", icon: <Clock className="h-4 w-4 text-amber-500" /> },
    { time: "11:45 AM", title: "Clinic Intake", desc: "Vitals recorded (HR 95, BP 138/88) by health worker.", icon: <User className="h-4 w-4 text-teal-600" /> },
    { time: "11:50 AM", title: "Files Uploaded", desc: "Lab Report PDF & ECG Rhythm Strip uploaded to workspace.", icon: <FileText className="h-4 w-4 text-blue-500" /> },
    { time: "12:00 PM", title: "AI Reasoning Completed", desc: "Gemma 3 4B generated clinical summary & referral note.", icon: <Cpu className="h-4 w-4 text-purple-500" /> },
  ];

  return (
    <Card className="space-y-3">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-teal-600" />
        <span>Chronological Medical & Reasoning Timeline</span>
      </h3>

      <div className="relative pl-6 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800 text-xs">
        {events.map((ev) => (
          <div key={ev.title} className="relative">
            <div className="absolute -left-[25px] top-0.5 p-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              {ev.icon}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <strong className="text-slate-900 dark:text-white">{ev.title}</strong>
                <span className="text-[11px] font-mono text-slate-400">• {ev.time}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mt-0.5">{ev.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
