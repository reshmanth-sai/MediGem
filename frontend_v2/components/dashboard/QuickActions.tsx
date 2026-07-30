"use client";

import React from "react";
import Link from "next/link";
import { PlusCircle, History, PlayCircle, Award, Terminal, Settings, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function QuickActions() {
  const actions = [
    {
      title: "New Patient Case",
      description: "Upload medical image or report and enter patient symptoms for instant reasoning.",
      href: "/new-case",
      icon: <PlusCircle className="h-6 w-6 text-teal-600 dark:text-teal-400" />,
      color: "border-l-4 border-l-teal-600",
    },
    {
      title: "Recent Cases Timeline",
      description: "Review prior patient clinical summaries and generated referral memorandums.",
      href: "/history",
      icon: <History className="h-6 w-6 text-teal-600 dark:text-teal-400" />,
      color: "border-l-4 border-l-slate-600",
    },
    {
      title: "Synthetic Demo Presets",
      description: "1-Click loader with pre-filled ECG, Lab Reports, Prescriptions, and Wound images.",
      href: "/demo",
      icon: <PlayCircle className="h-6 w-6 text-teal-600 dark:text-teal-400" />,
      color: "border-l-4 border-l-emerald-600",
    },
    {
      title: "Evaluation Dashboard",
      description: "Inspect system accuracy, safety pass rates, and latency benchmark statistics.",
      href: "/evaluation",
      icon: <Award className="h-6 w-6 text-teal-600 dark:text-teal-400" />,
      color: "border-l-4 border-l-amber-600",
    },
    {
      title: "Developer Inspector",
      description: "Examine raw JSON states, token latencies, and OpenCV image quality variance.",
      href: "/developer",
      icon: <Terminal className="h-6 w-6 text-teal-600 dark:text-teal-400" />,
      color: "border-l-4 border-l-purple-600",
    },
    {
      title: "Settings & Config",
      description: "Configure local Ollama service endpoints, default models, and storage rules.",
      href: "/settings",
      icon: <Settings className="h-6 w-6 text-teal-600 dark:text-teal-400" />,
      color: "border-l-4 border-l-slate-400",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          Quick Actions
        </h2>
        <span className="text-xs text-slate-500 font-medium">Select an action to proceed</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((act) => (
          <Link key={act.title} href={act.href}>
            <Card className={`h-full flex flex-col justify-between group cursor-pointer ${act.color}`}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900">{act.icon}</div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {act.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {act.description}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
