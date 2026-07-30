import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardTemplate } from "@/components/templates/Templates";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { AccessibilityCenter } from "@/components/settings/AccessibilityCenter";
import { OfflineSettings } from "@/components/settings/OfflineSettings";

export default function SettingsPage() {
  return (
    <AppShell>
      <DashboardTemplate title="System Settings & Accessibility Center" subtitle="Appearance themes, WCAG AA accessibility & local cache controls">
        <div className="space-y-6 max-w-4xl mx-auto pb-8">
          <AppearanceSettings />
          <AccessibilityCenter />
          <OfflineSettings />
        </div>
      </DashboardTemplate>
    </AppShell>
  );
}
