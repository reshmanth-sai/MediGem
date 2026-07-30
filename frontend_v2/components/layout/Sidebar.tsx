import React from "react";
import { Activity, FileText, History, Settings, Award, Terminal } from "lucide-react";

export function Sidebar() {
  const items = [
    { label: "Analysis Workspace", icon: <Activity className="h-4 w-4" />, active: true },
    { label: "Demo Presets", icon: <FileText className="h-4 w-4" /> },
    { label: "Session History", icon: <History className="h-4 w-4" /> },
    { label: "Judge Evaluation", icon: <Award className="h-4 w-4" /> },
    { label: "Developer Inspector", icon: <Terminal className="h-4 w-4" /> },
    { label: "Settings", icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-1 hidden md:block">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
        Clinical SaaS Navigation
      </p>
      {items.map((item) => (
        <button
          key={item.label}
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
            item.active
              ? "bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </aside>
  );
}
