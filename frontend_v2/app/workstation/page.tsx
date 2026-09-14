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
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
        <EmergencyAlertBanner />
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
