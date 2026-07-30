import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { HistoryTemplate } from "@/components/templates/Templates";
import { ClinicalInsightsDashboard } from "@/components/history/ClinicalInsightsDashboard";
import { CaseHistoryTable } from "@/components/history/CaseHistoryTable";
import { ExportCenter } from "@/components/history/ExportCenter";

export default function HistoryPage() {
  return (
    <AppShell>
      <HistoryTemplate title="Clinical Case Management & History">
        <div className="space-y-6 max-w-7xl mx-auto pb-8">
          {/* MANDATORY BONUS 1: Clinical Insights Dashboard */}
          <ClinicalInsightsDashboard />

          {/* Searchable & Filterable Case History Table */}
          <CaseHistoryTable />

          {/* Batch Export Center */}
          <ExportCenter />
        </div>
      </HistoryTemplate>
    </AppShell>
  );
}
