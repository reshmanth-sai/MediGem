"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PRESET_CASES } from "@/lib/casesData";
import { Users, ShieldAlert, Activity, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardHome() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const cases = Object.values(PRESET_CASES);
  const emergencyCases = cases.filter((c) => c.riskLevel === "EMERGENCY");
  const highRiskCases = cases.filter((c) => c.riskLevel === "HIGH");

  if (!mounted) return null;

  return (
    <AppShell>
      <div className="max-w-[1400px] space-y-12">
        {/* Header Section */}
        <header className="space-y-2">
          <h1 className="text-h2 font-semibold text-ink">Clinical Workspace</h1>
          <p className="text-body text-ink-muted max-w-xl">
            {cases.length} active sessions undergoing continuous telemetry monitoring.
          </p>
        </header>

        {/* Utilitarian Metrics Overview */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <MetricBlock
            label="Active Encounters"
            value={cases.length.toString()}
            icon={<Users className="w-4 h-4" />}
          />
          <MetricBlock
            label="Critical Alerts"
            value={emergencyCases.length.toString()}
            icon={<ShieldAlert className="w-4 h-4" />}
            isAlert={emergencyCases.length > 0}
          />
          <MetricBlock
            label="Elevated Risk"
            value={highRiskCases.length.toString()}
            icon={<Activity className="w-4 h-4" />}
          />
        </section>

        {/* Minimalist Patient Queue Grid */}
        <section className="space-y-6">
          <div className="flex justify-between items-center border-b border-rule pb-4">
            <h2 className="text-h3 font-semibold text-ink">Active Queue</h2>
            <Link
              href="/history"
              className="text-body-sm font-medium text-action hover:text-action-hover"
            >
              View full history
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-8">
            {cases.map((patient) => (
              <PatientListItem key={patient.caseId} patient={patient} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

// --- Strictly functional components (no floating cards) ---

function MetricBlock({ label, value, icon, isAlert = false }: any) {
  return (
    <div className="flex flex-col border-l-2 border-rule pl-4 py-1">
      <div className="flex items-center gap-2 text-ink-muted mb-2">
        {icon}
        <span className="text-label uppercase tracking-widest">{label}</span>
      </div>
      <span className={`text-display tabular-nums ${isAlert ? "text-clinical-emergency" : "text-ink"}`}>
        {value}
      </span>
    </div>
  );
}

function PatientListItem({ patient }: { patient: any }) {
  const isEmergency = patient.riskLevel === "EMERGENCY";

  return (
    <div className={`relative flex flex-col gap-4 pb-6 border-b ${isEmergency ? "border-clinical-emergency/50" : "border-rule"}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href={`/results/${patient.caseId}`}
            className="text-h3 font-semibold text-ink hover:text-action transition-colors inline-block"
          >
            {patient.patientName}
          </Link>
          <div className="text-body-sm text-ink-muted mt-0.5">
            {patient.age}y {patient.gender.charAt(0)} · {patient.patientId}
          </div>
        </div>
        <div className="text-right">
          <div className={`text-label font-bold ${isEmergency ? "text-clinical-emergency" : "text-ink-muted"}`}>
            {patient.riskLevel}
          </div>
          <div className="text-xs text-ink-muted font-medium mt-0.5 tabular-nums">
            {patient.arrivalTime}
          </div>
        </div>
      </div>

      <p className="text-body text-ink line-clamp-2">
        {patient.chiefComplaint}
      </p>

      <div className="flex items-center justify-between mt-2 pt-4 border-t border-rule/50">
        <span className="text-body-sm font-medium text-ink-muted truncate pr-4">
          Finding: {patient.primaryFinding}
        </span>
        <Link
          href={`/results/${patient.caseId}`}
          className="text-xs font-semibold text-action hover:text-action-hover inline-flex items-center gap-1 shrink-0"
        >
          Analyze record <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
