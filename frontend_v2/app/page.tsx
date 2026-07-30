import { AppShell } from "@/components/layout/AppShell";
import { DashboardTemplate } from "@/components/templates/Templates";
import { StatCard } from "@/components/ui/Card";
import { Activity, ShieldCheck, Zap, History } from "lucide-react";

export default function HomePage() {
  return (
    <AppShell>
      <DashboardTemplate
        title="MediGem Clinical Co-Pilot Dashboard"
        subtitle="Offline multimodal AI co-pilot for rural healthcare workers"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Total Cases Processed" value="128" icon={<Activity />} subtitle="+12 this week" />
          <StatCard title="Safety Interceptions" value="100%" icon={<ShieldCheck />} subtitle="0 Emergency Bypasses" />
          <StatCard title="Avg Reasoning Speed" value="5.4s" icon={<Zap />} subtitle="Gemma 3 4B Local" />
          <StatCard title="Active Session" value="Offline Edge" icon={<History />} subtitle="100% Local Inference" />
        </div>
      </DashboardTemplate>
    </AppShell>
  );
}
