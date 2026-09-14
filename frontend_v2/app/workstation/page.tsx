"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { EmergencyAlertBanner } from "@/components/dashboard/EmergencyAlertBanner";
import { CompactOperationalHeader } from "@/components/dashboard/CompactOperationalHeader";
import { PatientQueueTable } from "@/components/dashboard/PatientQueueTable";
import { DailyClinicalOverview } from "@/components/dashboard/DailyClinicalOverview";
import { AIStatusRibbon } from "@/components/dashboard/AIStatusRibbon";

export default function ClinicalWorkstationDashboard() {
  return (
    <AppShell>
      <div className="space-y-6 max-w-7xl mx-auto pb-16">
        {/* Section 1: Persistent Emergency Alert Banner (Critical Intercept) */}
        <EmergencyAlertBanner />

        {/* Section 2: Compact Operational Header with shift counters */}
        <CompactOperationalHeader />

        {/* Section 3: Patient Intake & Clinical Queue Centerpiece */}
        <PatientQueueTable />

        {/* Section 4: Daily Clinical Trends & Safety Overview */}
        <DailyClinicalOverview />

        {/* Section 5: Live AI Telemetry & Edge Operational Status Ribbon */}
        <AIStatusRibbon />
      </div>
    </AppShell>
  );
}
