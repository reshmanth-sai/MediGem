"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { CompactOperationalHeader } from "@/components/dashboard/CompactOperationalHeader";
import { EmergencyAlertBanner } from "@/components/dashboard/EmergencyAlertBanner";
import { PatientQueueTable } from "@/components/dashboard/PatientQueueTable";
import { DailyClinicalOverview } from "@/components/dashboard/DailyClinicalOverview";
import { AIStatusRibbon } from "@/components/dashboard/AIStatusRibbon";
import { FloatingAIAssistant } from "@/components/ai/FloatingAIAssistant";

export default function HomePage() {
  return (
    <AppShell>
      <div className="space-y-6 max-w-7xl mx-auto pb-16">
        {/* Section 1: Persistent Emergency Alert Banner (Critical Intercept) */}
        <EmergencyAlertBanner />

        {/* Section 2: Compact Operational Header (120-160px) */}
        <CompactOperationalHeader />

        {/* Section 3: Patient Intake & Clinical Queue Centerpiece */}
        <PatientQueueTable />

        {/* Section 4: Daily Clinical Trends & Safety Overview */}
        <DailyClinicalOverview />

        {/* Section 5: Live AI Telemetry & Edge Operational Status Ribbon */}
        <AIStatusRibbon />
      </div>

      {/* Floating Offline AI Clinical Assistant */}
      <FloatingAIAssistant />
    </AppShell>
  );
}
