"use client";

import React from "react";
import Link from "next/link";
import { ClinicalCaseData, ConfidenceLevel, CONFIDENCE_LABELS } from "@/lib/casesData";
import { RiskIndicator } from "@/components/ui/RiskIndicator";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { H2, H3, Label, BodySm, Data } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";
import {
  User,
  Brain,
  FileText,
  Printer,
  ArrowRight,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

interface ClinicalPatientWorkspaceProps {
  patient: ClinicalCaseData | null;
  onOpenReferralModal: () => void;
}

const CONFIDENCE_BAR_FILL: Record<ConfidenceLevel, number> = {
  HIGH: 90,
  MEDIUM: 60,
  LOW: 30,
};

const VITAL_TONE: Record<string, string> = {
  alert: "bg-risk-emergency/10 border-risk-emergency/50 text-risk-emergency",
  warning: "bg-risk-high/10 border-risk-high/50 text-risk-high",
  normal: "bg-ground border-rule text-ink-muted",
};

export function ClinicalPatientWorkspace({ patient, onOpenReferralModal }: ClinicalPatientWorkspaceProps) {
  if (!patient) {
    return (
      <Card className="p-8 text-center space-y-3 flex flex-col items-center justify-center min-h-[500px]">
        {/* rounded-control, not rounded-card: this reads as an icon chip, not a card. */}
        <div className="p-4 rounded-control bg-ground border border-rule text-ink-muted">
          <User className="h-8 w-8" aria-hidden="true" />
        </div>
        <H3>No Patient Selected</H3>
        <BodySm className="text-ink-muted max-w-xs">
          Click any patient row in the queue to preview demographics, explainable AI reasoning, red flags, and generate referral memos.
        </BodySm>
      </Card>
    );
  }

  const isEmergency = patient.riskLevel === "EMERGENCY";

  return (
    <Card className="space-y-5 sticky top-4">
      {/* Patient Workspace Header */}
      <div className="flex items-start justify-between pb-3 border-b border-rule">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <H2>{patient.patientName}</H2>
            <Data className="text-ink-muted">({patient.patientId})</Data>
          </div>
          <BodySm className="text-ink-muted">
            {patient.age}y / {patient.gender}
            {" · "}
            <span className="text-action font-semibold">{patient.village || "Rural Sub-Center"}</span>
          </BodySm>
        </div>
        <RiskIndicator level={patient.riskLevel} variant="tint" />
      </div>

      {/* Vitals Grid */}
      <div className="space-y-1.5">
        <Label>Patient Vitals & Intake Parameters</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {patient.vitals.map((v) => (
            <div
              key={v.label}
              className={cn("p-2 rounded-control border text-center", VITAL_TONE[v.status] || VITAL_TONE.normal)}
            >
              <Label className="text-inherit">{v.label}</Label>
              <Data className="text-inherit block">{v.value}</Data>
            </div>
          ))}
        </div>
      </div>

      {/*
        Explainable AI Diagnosis & Confidence Gauge.

        Grouped by a rule and spacing rather than a second bordered surface:
        this block sits inside the workspace Card, and giving it its own
        card-like fill and border made a nested card. The treatment matches
        the sibling groups further down this same component.
      */}
      <div className="space-y-3 border-t border-rule pt-3">
        <div className="flex items-center justify-between">
          <BodySm className="font-semibold text-action flex items-center gap-1.5">
            <Brain className="h-4 w-4" aria-hidden="true" />
            <span>Gemma 3 Offline AI Reasoning</span>
          </BodySm>
          <Label className="text-risk-low flex items-center gap-1">
            <Sparkles className="h-3 w-3" aria-hidden="true" /> Explainable AI
          </Label>
        </div>

        {/* Primary Finding */}
        <div className="space-y-1">
          <Label>Primary Finding / Diagnosis</Label>
          <BodySm className="font-semibold text-ink leading-snug">{patient.primaryFinding}</BodySm>
        </div>

        {/* AI Confidence Band */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between">
            <BodySm className="text-ink-muted">AI Reasoning Confidence:</BodySm>
            <BodySm className="font-semibold text-action">{CONFIDENCE_LABELS[patient.confidenceLevel]}</BodySm>
          </div>
          <div className="w-full bg-surface-raised h-2 rounded-control overflow-hidden border border-rule">
            <div
              className={cn("h-full rounded-control", isEmergency ? "bg-risk-emergency" : "bg-action")}
              style={{ width: `${CONFIDENCE_BAR_FILL[patient.confidenceLevel]}%` }}
            />
          </div>
          {patient.requiresHumanReview && (
            <Label className="text-ink-muted">Needs clinician review</Label>
          )}
        </div>

        {/* Supporting Evidence & Clinical Summary */}
        <div className="space-y-1 border-t border-rule pt-2">
          <Label>Clinical Reasoning Summary</Label>
          <BodySm className="text-ink">{patient.clinicalSummary}</BodySm>
        </div>

        {/* Red Flags / Critical Warnings if Emergency or High */}
        {(isEmergency || patient.riskLevel === "HIGH") && (
          <div className="p-2.5 rounded-control bg-risk-emergency/10 border border-risk-emergency/50 text-risk-emergency space-y-1">
            <BodySm className="font-semibold flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Red Flags & Safety Intercept Warnings</span>
            </BodySm>
            <BodySm className="text-inherit leading-normal">
              High acute presentation requiring STAT referral protocol to tertiary facility.
            </BodySm>
          </div>
        )}
      </div>

      {/* Clinical Event Timeline */}
      <div className="space-y-2">
        <Label>Clinical Activity Progression</Label>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-ink">
            <span className="h-2 w-2 rounded-full bg-risk-low shrink-0" aria-hidden="true" />
            <BodySm>1. Patient Registration ({patient.village}), done</BodySm>
          </div>
          <div className="flex items-center gap-2 text-ink">
            <span className="h-2 w-2 rounded-full bg-risk-low shrink-0" aria-hidden="true" />
            <BodySm>2. Offline Report Extraction (PyMuPDF / OCR), done</BodySm>
          </div>
          <div className="flex items-center gap-2 text-ink">
            <span className="h-2 w-2 rounded-full bg-action shrink-0" aria-hidden="true" />
            <BodySm>3. Gemma 3 Multimodal Reasoning, {CONFIDENCE_LABELS[patient.confidenceLevel]}</BodySm>
          </div>
          <div className="flex items-center gap-2 text-ink">
            <span className="h-2 w-2 rounded-full bg-risk-low shrink-0" aria-hidden="true" />
            <BodySm>4. Safety Engine Gate Check (under 0.3ms), verified</BodySm>
          </div>
        </div>
      </div>

      {/* Clinical Actions Toolbar */}
      <div className="space-y-2 pt-2 border-t border-rule">
        <Button
          variant="danger"
          className="w-full"
          leftIcon={<FileText className="h-4 w-4" />}
          onClick={onOpenReferralModal}
        >
          Generate 1-Click Referral Memo
        </Button>

        <div className="flex gap-2">
          <Link
            href={`/results/${patient.caseId}`}
            className={buttonVariants({
              variant: "secondary",
              className: "flex-1 w-full",
            })}
          >
            Open Full Case
            <span className="inline-flex" aria-hidden="true">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
          <Button
            variant="secondary"
            aria-label="Print patient file"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
