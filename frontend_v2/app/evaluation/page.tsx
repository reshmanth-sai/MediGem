import { AppShell } from "@/components/layout/AppShell";
import { DashboardTemplate } from "@/components/templates/Templates";
import { StatCard } from "@/components/ui/Card";

export default function EvaluationPage() {
  return (
    <AppShell>
      <DashboardTemplate title="Benchmark Evaluation Dashboard" subtitle="System accuracy, safety, and performance metrics">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Safety Pass Rate" value="100%" subtitle="5 / 5 Test Runs" />
          <StatCard title="Validation Pass Rate" value="100%" subtitle="Strict Pydantic v2 Contract" />
          <StatCard title="Average OCR Confidence" value="97.5%" subtitle="PyMuPDF + OpenCV" />
          <StatCard title="Max Emergency Latency" value="0.33ms" subtitle="Deterministic Safety Gate" />
        </div>
      </DashboardTemplate>
    </AppShell>
  );
}
