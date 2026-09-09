"use client";

import React from "react";
import { Sliders, HardDrive, Eye, Sun, ShieldCheck, Cpu, Info } from "lucide-react";
import { Label, BodySm } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";

interface SettingsCategoryNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function SettingsCategoryNav({ activeTab, setActiveTab }: SettingsCategoryNavProps) {
  const categories = [
    { id: "ai", label: "Clinical Decision Parameters", icon: Sliders, desc: "Confidence threshold, reasoning detail, model selection" },
    { id: "storage", label: "Offline Storage & Backup", icon: HardDrive, desc: "SQLite cache, database backup, clear temp files" },
    { id: "accessibility", label: "Accessibility & Human Factors", icon: Eye, desc: "Reduced motion, high contrast, font scaling" },
    { id: "appearance", label: "Appearance & Visual Themes", icon: Sun, desc: "Dark, light, and healthcare night mode" },
    { id: "security", label: "Privacy & Security Center", icon: ShieldCheck, desc: "AES encryption, PIN lock, audit logging" },
    { id: "diagnostics", label: "Device & System Diagnostics", icon: Cpu, desc: "CPU, VRAM, inference latency, DB integrity" },
    { id: "about", label: "About & Licenses", icon: Info, desc: "Version info, safety rules, support contact" },
  ];

  return (
    <div className="rounded-card bg-surface border border-rule p-3 space-y-2">
      <Label className="px-2 pt-1 block">Control Center Categories</Label>

      <div className="space-y-1">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              aria-current={isActive ? "true" : undefined}
              onClick={() => setActiveTab(cat.id)}
              className={cn(
                "w-full text-left p-2.5 rounded-control transition-all flex items-start space-x-3 border",
                isActive
                  ? "bg-action-subtle border-action"
                  : "bg-surface border-transparent opacity-80 hover:opacity-100 hover:border-rule-strong"
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-control shrink-0 mt-0.5",
                  isActive ? "bg-action text-on-action" : "bg-surface-raised text-ink-muted"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="space-y-0.5 truncate">
                <p className={cn("text-body-sm font-semibold truncate", isActive ? "text-action" : "text-ink")}>
                  {cat.label}
                </p>
                <BodySm className="text-ink-muted truncate leading-tight">{cat.desc}</BodySm>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
