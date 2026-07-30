import React from "react";
import { ShieldAlert, WifiOff, Lightbulb, Globe } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function WhyMediGem() {
  const features = [
    {
      title: "🛡️ Emergency First",
      description:
        "Automatically prioritizes life-threatening conditions before deeper AI analysis, ensuring critical cases receive immediate attention.",
      icon: <ShieldAlert className="h-6 w-6 text-red-600 dark:text-red-400" />,
      color: "border-l-4 border-l-red-600",
    },
    {
      title: "📡 Offline AI",
      description:
        "Runs locally with Gemma-powered intelligence, enabling diagnosis and clinical assistance even without internet connectivity.",
      icon: <WifiOff className="h-6 w-6 text-teal-600 dark:text-teal-400" />,
      color: "border-l-4 border-l-teal-600",
    },
    {
      title: "🧠 Explainable Reasoning",
      description:
        "Provides confidence scores, supporting findings, and transparent clinical reasoning instead of opaque AI decisions.",
      icon: <Lightbulb className="h-6 w-6 text-amber-500" />,
      color: "border-l-4 border-l-amber-500",
    },
    {
      title: "🌍 Built for Rural Healthcare",
      description:
        "Designed specifically for NGOs, mobile clinics, and primary healthcare centers serving underserved communities.",
      icon: <Globe className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
      color: "border-l-4 border-l-purple-600",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          Why MediGem?
        </h2>
        <span className="text-xs text-slate-500 font-medium">Core Product Value Proposition</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feat) => (
          <Card key={feat.title} className={`space-y-2 flex flex-col justify-between ${feat.color}`}>
            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 w-fit">{feat.icon}</div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{feat.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {feat.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
