"use client";

import React from "react";
import Link from "next/link";
import { PlayCircle, FileText, Heart, Activity, Pill, Stethoscope, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { RiskBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function DemoGalleryGrid() {
  const presets = [
    {
      id: "DEMO-ECG",
      title: "12-Lead ECG Tachycardia Strip",
      category: "ECG",
      risk: "MODERATE",
      diagnosis: "Sinus Tachycardia with elevated Heart Rate (95 bpm)",
      desc: "Simulated 12-lead rhythm strip from rural primary health center",
      latency: "5.42s",
      icon: <Heart className="h-5 w-5 text-red-500" />,
    },
    {
      id: "DEMO-ACUTE-CARDIAC",
      title: "Acute Chest Pain Emergency",
      category: "EMERGENCY",
      risk: "EMERGENCY",
      diagnosis: "Severe crushing chest pain (Acute Cardiac Intercept)",
      desc: "Emergency Safety Engine triggers acute cardiac gate in < 0.3ms",
      latency: "0.18ms",
      icon: <AlertTriangle className="h-5 w-5 text-red-600 animate-pulse" />,
    },
    {
      id: "DEMO-LAB-CBC",
      title: "CBC Diagnostic Lab Report PDF",
      category: "LAB_REPORT",
      risk: "HIGH",
      diagnosis: "Elevated WBC count (14.5 k/uL) indicating infection",
      desc: "PyMuPDF text layer extraction bypassing OCR with 100% confidence",
      latency: "4.15s",
      icon: <Activity className="h-5 w-5 text-teal-600 dark:text-teal-400" />,
    },
    {
      id: "DEMO-PRESCRIPTION",
      title: "Handwritten Prescription Scan",
      category: "PRESCRIPTION",
      risk: "LOW",
      diagnosis: "Standard anti-hypertensive dosage memo",
      desc: "Handwritten memo text extraction & dosage formatting",
      latency: "4.90s",
      icon: <Pill className="h-5 w-5 text-amber-500" />,
    },
    {
      id: "DEMO-WOUND",
      title: "Post-Operative Wound Scan",
      category: "WOUND",
      risk: "MODERATE",
      diagnosis: "Surgical site monitoring with mild erythema",
      desc: "OpenCV quality variance evaluation (Laplacian score 245.2)",
      latency: "5.10s",
      icon: <Stethoscope className="h-5 w-5 text-purple-500" />,
    },
    {
      id: "DEMO-NORMAL",
      title: "Normal Routine Checkup",
      category: "CLINICAL_NOTE",
      risk: "LOW",
      diagnosis: "Normal physiological parameters & baseline vitals",
      desc: "Baseline health worker consultation memo",
      latency: "3.80s",
      icon: <FileText className="h-5 w-5 text-blue-500" />,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Curated Synthetic Demo Presets ({presets.length})
        </h2>
        <span className="text-xs text-slate-500 font-medium">1-Click Instant Loading</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {presets.map((p) => (
          <Card key={p.id} className="space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded bg-slate-100 dark:bg-slate-900">{p.icon}</div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">{p.title}</h3>
                </div>
                <RiskBadge level={p.risk as any} />
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {p.desc}
              </p>

              <div className="p-2 rounded bg-slate-50 dark:bg-slate-900 text-[11px] space-y-0.5">
                <span className="text-slate-400 font-semibold block">Expected Diagnosis:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{p.diagnosis}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-mono text-slate-400">Latency: {p.latency}</span>
              <Link href={`/results/${p.id}`}>
                <Button size="sm" variant="primary" leftIcon={<PlayCircle className="h-3.5 w-3.5" />}>
                  Load Preset
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
