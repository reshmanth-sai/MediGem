import React from "react";
import { Cpu, ShieldCheck, Zap, HardDrive } from "lucide-react";
import { StatCard } from "@/components/ui/Card";

export function SystemOverview() {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
        System Overview & Health Diagnostics
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="AI Reasoning Model"
          value="Gemma 3 4B"
          subtitle="Local Ollama Inference"
          icon={<Cpu />}
        />
        <StatCard
          title="Emergency Gate Speed"
          value="< 0.3ms"
          subtitle="Deterministic Safety Engine"
          icon={<Zap />}
        />
        <StatCard
          title="Safety Rule Coverage"
          value="11 Rules"
          subtitle="100% Intercept Pass Rate"
          icon={<ShieldCheck />}
        />
        <StatCard
          title="Storage Location"
          value="Local Edge DB"
          subtitle="Zero Cloud Telemetry"
          icon={<HardDrive />}
        />
      </div>
    </div>
  );
}
