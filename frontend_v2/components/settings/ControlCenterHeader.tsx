"use client";

import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SystemReadoutGrid } from "./SystemReadouts";

export function ControlCenterHeader() {
  return (
    <div className="space-y-4">
      <PageHeader title="System controls" subtitle="Reasoning parameters, this tab&apos;s data, accessibility, appearance and system readouts." className="border-b-0 pb-0" />
      <SystemReadoutGrid className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-4 pt-4 border-t border-rule divide-y divide-rule sm:divide-y-0" />
    </div>
  );
}
