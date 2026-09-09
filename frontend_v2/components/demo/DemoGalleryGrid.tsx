"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, FileText, Heart, Activity, Pill, Stethoscope, AlertTriangle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { RiskLevel } from "@/types/analysis";
import { RiskIndicator } from "@/components/ui/RiskIndicator";
import { buttonVariants } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";

interface DemoPreset {
  id: string;
  title: string;
  category: string;
  risk: RiskLevel;
  diagnosis: string;
  desc: string;
  latency: string;
  icon: LucideIcon;
}

export function DemoGalleryGrid() {
  const presets: DemoPreset[] = [
    {
      id: "DEMO-ACUTE-CARDIAC",
      title: "Acute Chest Pain Emergency",
      category: "Emergency Protocol",
      risk: "EMERGENCY",
      diagnosis: "Acute Coronary Syndrome (STAT Referral)",
      desc: "Emergency screening triggers cardiac gate in 0.28ms",
      latency: "0.28s",
      icon: AlertTriangle,
    },
    {
      id: "CASE-8901",
      title: "Hypertension with Cephalea",
      category: "Primary Care",
      risk: "MODERATE",
      diagnosis: "Stage 2 Essential Hypertension (BP 150/90)",
      desc: "62F presenting with headache, dizziness, and presbyopia",
      latency: "8.40s",
      icon: Stethoscope,
    },
    {
      id: "DEMO-ECG",
      title: "12-Lead ECG Tachycardia Strip",
      category: "Cardiology",
      risk: "MODERATE",
      diagnosis: "Sinus Tachycardia with elevated Heart Rate (98 bpm)",
      desc: "12-lead rhythm scan from rural primary health center",
      latency: "5.42s",
      icon: Heart,
    },
    {
      id: "DEMO-LAB-CBC",
      title: "CBC Diagnostic Lab Report PDF",
      category: "Laboratory",
      risk: "HIGH",
      diagnosis: "Marked leukocytosis (WBC 14.5 k/uL) with fever",
      desc: "PyMuPDF document extraction from laboratory PDF",
      latency: "4.15s",
      icon: Activity,
    },
    {
      id: "DEMO-WOUND",
      title: "Post-Operative Wound Inspection",
      category: "Surgical Monitoring",
      risk: "MODERATE",
      diagnosis: "Cesarean surgical site with mild benign erythema",
      desc: "Wound image verification and healing progression",
      latency: "5.10s",
      icon: FileText,
    },
    {
      id: "DEMO-PRESCRIPTION",
      title: "Hypertension Prescription Review",
      category: "Pharmacy",
      risk: "LOW",
      diagnosis: "Controlled hypertension on stable dual therapy",
      desc: "Handwritten prescription memo text extraction",
      latency: "4.90s",
      icon: Pill,
    },
  ];

  return (
    <section className="space-y-4" aria-label="Clinical Sample Presets">
      <SectionHeader
        title="Clinical Sample Cases"
        badge={
          <span className="text-label font-mono px-1.5 py-0.2 rounded-chip bg-surface-raised border border-rule text-ink-muted">
            {presets.length} cases
          </span>
        }
        subtitle="One-click clinical case loaders for workstation demonstrations"
      />

      {/* Quick Text Button Bar (Section 24) */}
      <div className="flex flex-wrap items-center gap-2 py-1">
        <span className="text-label uppercase tracking-wider text-ink-muted font-semibold mr-1">
          Quick load:
        </span>
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Quick preset loaders">
          {presets.map((preset) => (
            <Link
              key={preset.id}
              href={`/results/${preset.id}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-control bg-surface-raised border border-rule text-body-sm text-ink hover:text-action hover:border-rule-strong transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              <span>{preset.category}</span>
              <ChevronRight className="h-3 w-3 text-ink-muted" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>

      {/* Structured Clinical Table (No AI cards) */}
      <Table caption="Clinical demo preset library" captionHidden>
        <THead>
          <tr>
            <TH>Case Title</TH>
            <TH>Category</TH>
            <TH>Clinical Presentation / Finding</TH>
            <TH>Priority</TH>
            <TH>Latency</TH>
            <TH className="text-right">Action</TH>
          </tr>
        </THead>
        <TBody>
          {presets.map((preset) => {
            const Icon = preset.icon;
            const isEmergency = preset.risk === "EMERGENCY";
            return (
              <TR key={preset.id}>
                <TD>
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-ink-muted shrink-0" aria-hidden="true" />
                    <div>
                      <span className="font-semibold text-ink block">{preset.title}</span>
                      <span className="text-body-sm text-ink-muted">{preset.desc}</span>
                    </div>
                  </div>
                </TD>
                <TD className="text-ink-muted">{preset.category}</TD>
                <TD className="text-ink font-medium max-w-sm truncate" title={preset.diagnosis}>
                  {preset.diagnosis}
                </TD>
                <TD>
                  <RiskIndicator level={preset.risk} variant="tint" />
                </TD>
                <TD className="font-mono tabular text-ink-muted">{preset.latency}</TD>
                <TD className="text-right">
                  <Link
                    href={`/results/${preset.id}`}
                    className={buttonVariants({
                      size: "sm",
                      variant: isEmergency ? "danger" : "secondary",
                    })}
                  >
                    Open
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </TD>
              </TR>
            );
          })}
        </TBody>
      </Table>
    </section>
  );
}
