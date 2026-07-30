import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardTemplate } from "@/components/templates/Templates";
import { HackathonDemoPlayer } from "@/components/demo/HackathonDemoPlayer";
import { DemoGalleryGrid } from "@/components/demo/DemoGalleryGrid";

export default function DemoPage() {
  return (
    <AppShell>
      <DashboardTemplate title="Synthetic Demo Presets & Hackathon Mode" subtitle="1-Click clinical preset loaders & 5-minute guided presentation player">
        <div className="space-y-6 max-w-7xl mx-auto pb-8">
          {/* MANDATORY BONUS 2: 5-Minute Hackathon Demo Player */}
          <HackathonDemoPlayer />

          {/* Synthetic Demo Gallery Grid */}
          <DemoGalleryGrid />
        </div>
      </DashboardTemplate>
    </AppShell>
  );
}
