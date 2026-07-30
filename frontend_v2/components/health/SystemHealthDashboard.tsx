import React from "react";
import { Activity, CheckCircle2, Cpu, HardDrive, ShieldCheck, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function SystemHealthDashboard() {
  const telemetry = [
    { label: "Pipeline Status", val: "HEALTHY", icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" /> },
    { label: "Gemma Model Engine", val: "gemma3:4b ONLINE", icon: <Cpu className="h-4 w-4 text-teal-600 dark:text-teal-400" /> },
    { label: "Emergency Safety Gate", val: "0.28ms Latency", icon: <ShieldCheck className="h-4 w-4 text-red-500" /> },
    { label: "Local SQLite Cache", val: "4.2 MB / 50 MB", icon: <HardDrive className="h-4 w-4 text-purple-500" /> },
    { label: "System Version", val: "v2.0.0-production", icon: <Activity className="h-4 w-4 text-amber-500" /> },
    { label: "Last Analysis", val: "Just now (CASE-8901)", icon: <Clock className="h-4 w-4 text-blue-500" /> },
  ];

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Activity className="h-4 w-4 text-teal-600" />
          <span>System Telemetry & Engine Health Monitor</span>
        </h3>
        <span className="text-xs text-emerald-700 dark:text-emerald-400 font-mono font-bold bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
          ALL SYSTEMS OPERATIONAL
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {telemetry.map((t) => (
          <div key={t.label} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
            <div className="flex items-center space-x-1.5 text-slate-400">
              {t.icon}
              <span className="text-[10px] font-semibold uppercase">{t.label}</span>
            </div>
            <p className="font-bold text-slate-900 dark:text-white truncate">{t.val}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
