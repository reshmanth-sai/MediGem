"use client";

import React from "react";
import Link from "next/link";
import { PlayCircle, FileText, Heart, Activity, Pill, Stethoscope, AlertTriangle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { RiskLevel } from "@/types/analysis";
import { Card } from "@/components/ui/Card";
import { RiskIndicator } from "@/components/ui/RiskIndicator";
import { buttonVariants } from "@/components/ui/Button";
import { H2, Label, BodySm } from "@/components/ui/Typography";

interface DemoPreset {
  id: string;
  title: string;
  category: string;
  risk: RiskLevel;
  diagnosis: string;
  desc: string;
  latency: string;
  icon: LucideIcon;
  /** Icon tone. Only the emergency preset carries a risk colour; the rest stay neutral. */
  iconClassName?: string;
}

export function DemoGalleryGrid() {
  const presets: DemoPreset[] = [
    {
      id: "DEMO-ECG",
      title: "12-Lead ECG Tachycardia Strip",
      category: "ECG",
      risk: "MODERATE",
      diagnosis: "Sinus Tachycardia with elevated Heart Rate (95 bpm)",
      desc: "Simulated 12-lead rhythm strip from rural primary health center",
      latency: "5.42s",
      icon: Heart,
    },
    {
      id: "DEMO-ACUTE-CARDIAC",
      title: "Acute Chest Pain Emergency",
      category: "EMERGENCY",
      risk: "EMERGENCY",
      diagnosis: "Severe crushing chest pain (Acute Cardiac Intercept)",
      desc: "Emergency Safety Engine triggers acute cardiac gate in under 0.3ms",
      latency: "0.18ms",
      icon: AlertTriangle,
      iconClassName: "text-risk-emergency",
    },
    {
      id: "DEMO-LAB-CBC",
      title: "CBC Diagnostic Lab Report PDF",
      category: "LAB_REPORT",
      risk: "HIGH",
      diagnosis: "Elevated WBC count (14.5 k/uL) indicating infection",
      desc: "PyMuPDF text layer extraction bypassing OCR with 100% confidence",
      latency: "4.15s",
      icon: Activity,
    },
    {
      id: "DEMO-PRESCRIPTION",
      title: "Handwritten Prescription Scan",
      category: "PRESCRIPTION",
      risk: "LOW",
      diagnosis: "Standard anti-hypertensive dosage memo",
      desc: "Handwritten memo text extraction & dosage formatting",
      latency: "4.90s",
      icon: Pill,
    },
    {
      id: "DEMO-WOUND",
      title: "Post-Operative Wound Scan",
      category: "WOUND",
      risk: "MODERATE",
      diagnosis: "Surgical site monitoring with mild erythema",
      desc: "OpenCV quality variance evaluation (Laplacian score 245.2)",
      latency: "5.10s",
      icon: Stethoscope,
    },
    {
      id: "DEMO-NORMAL",
      title: "Normal Routine Checkup",
      category: "CLINICAL_NOTE",
      risk: "LOW",
      diagnosis: "Normal physiological parameters & baseline vitals",
      desc: "Baseline health worker consultation memo",
      latency: "3.80s",
      icon: FileText,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <H2>Curated Synthetic Demo Presets ({presets.length})</H2>
        <Label>One-click instant loading</Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {presets.map((preset) => {
          const Icon = preset.icon;
          return (
            <Card key={preset.id} className="flex flex-col justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex items-center gap-2 min-w-0">
                    <Icon
                      className={`h-5 w-5 shrink-0 ${preset.iconClassName ?? "text-ink-muted"}`}
                      aria-hidden="true"
                    />
                    <h3 className="text-h3 text-ink">{preset.title}</h3>
                  </span>
                  <RiskIndicator level={preset.risk} variant="tint" className="shrink-0" />
                </div>

                <BodySm className="text-ink-muted leading-relaxed">{preset.desc}</BodySm>

                <div className="space-y-1 pt-3 border-t border-rule">
                  <Label>Expected diagnosis</Label>
                  <BodySm className="font-semibold text-ink">{preset.diagnosis}</BodySm>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-rule">
                <span className="font-mono tabular text-body-sm text-ink-muted">
                  Latency: {preset.latency}
                </span>
                <Link
                  href={`/results/${preset.id}` as any}
                  className={buttonVariants({ size: "sm", variant: "primary" })}
                >
                  <span className="inline-flex" aria-hidden="true">
                    <PlayCircle className="h-4 w-4" />
                  </span>
                  Load Preset
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
