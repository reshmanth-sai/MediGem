"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ControlCenterHeader } from "@/components/settings/ControlCenterHeader";
import { SettingsCategoryNav } from "@/components/settings/SettingsCategoryNav";
import { AIClinicalConfig } from "@/components/settings/AIClinicalConfig";
import { OfflineStorageAnalyzer } from "@/components/settings/OfflineStorageAnalyzer";
import { AccessibilityHumanFactors } from "@/components/settings/AccessibilityHumanFactors";
import { AppearanceThemes } from "@/components/settings/AppearanceThemes";
import { PrivacySecurityCenter } from "@/components/settings/PrivacySecurityCenter";
import { DeviceDiagnostics } from "@/components/settings/DeviceDiagnostics";
import { AboutSystem } from "@/components/settings/AboutSystem";
import { FloatingAIAssistant } from "@/components/ai/FloatingAIAssistant";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("ai");

  return (
    <AppShell>
      <div className="space-y-5 max-w-[1600px] mx-auto pb-16">
        {/* Top Control Center & Telemetry Header */}
        <ControlCenterHeader />

        {/* Master Split-Panel Layout (Left 25% Category Nav / Right 75% Config Panel) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-3">
            <SettingsCategoryNav activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          <div className="lg:col-span-9">
            {activeTab === "ai" && <AIClinicalConfig />}
            {activeTab === "storage" && <OfflineStorageAnalyzer />}
            {activeTab === "accessibility" && <AccessibilityHumanFactors />}
            {activeTab === "appearance" && <AppearanceThemes />}
            {activeTab === "security" && <PrivacySecurityCenter />}
            {activeTab === "diagnostics" && <DeviceDiagnostics />}
            {activeTab === "about" && <AboutSystem />}
          </div>
        </div>
      </div>

      {/* Floating Offline AI Clinical Assistant */}
      <FloatingAIAssistant />
    </AppShell>
  );
}
