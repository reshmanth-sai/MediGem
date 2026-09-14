"use client";

import React from "react";
import { Section } from "@/components/ui/Card";
import { SystemReadoutGrid } from "@/components/settings/SystemReadouts";

export function SystemHealthDashboard() {
  return (
    <Section heading="System readouts" headingAs="h3">
      <SystemReadoutGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4" />
    </Section>
  );
}
