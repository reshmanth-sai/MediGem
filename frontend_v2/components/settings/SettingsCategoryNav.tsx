"use client";

import React from "react";
import { Brain, HardDrive, Eye, Sun, ShieldCheck, Cpu, Info } from "lucide-react";

interface SettingsCategoryNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function SettingsCategoryNav({ activeTab, setActiveTab }: SettingsCategoryNavProps) {
  const categories = [
    { id: "ai", label: "AI & Clinical Reasoning", icon: Brain, desc: "Confidence threshold, reasoning detail, model selection" },
    { id: "storage", label: "Offline Storage & Backup", icon: HardDrive, desc: "SQLite cache, database backup, clear temp files" },
    { id: "accessibility", label: "Accessibility & Human Factors", icon: Eye, desc: "Reduced motion, high contrast, font scaling" },
    { id: "appearance", label: "Appearance & Visual Themes", icon: Sun, desc: "Dark, light, and healthcare night mode" },
    { id: "security", label: "Privacy & Security Center", icon: ShieldCheck, desc: "AES encryption, PIN lock, audit logging" },
    { id: "diagnostics", label: "Device & System Diagnostics", icon: Cpu, desc: "CPU, VRAM, inference latency, DB integrity" },
    { id: "about", label: "About & Licenses", icon: Info, desc: "Version info, safety rules, support contact" },
  ];

  return (
    <div className="rounded-2xl theme-card border p-3 space-y-2 shadow-xl">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono px-2 pt-1">
        Control Center Categories
      </p>

      <div className="space-y-1">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start space-x-3 border ${
                isActive
                  ? "theme-card border-teal-500/60 shadow-md font-bold"
                  : "theme-card border-transparent opacity-80 hover:opacity-100 hover:border-slate-400"
              }`}
            >
              <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${isActive ? "bg-teal-500/20 text-teal-400" : "bg-slate-500/10 text-slate-400"}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="space-y-0.5 truncate">
                <p className={`text-xs font-bold truncate ${isActive ? "text-teal-400 font-black" : "text-slate-700 dark:text-slate-200"}`}>
                  {cat.label}
                </p>
                <p className="text-[10.5px] text-slate-500 dark:text-slate-400 truncate leading-tight">{cat.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
