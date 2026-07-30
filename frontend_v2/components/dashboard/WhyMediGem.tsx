import React from "react";
import { ShieldAlert, WifiOff, Lightbulb, Globe } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function WhyMediGem() {
  const features = [
    {
      title: "🛡️ Emergency First",
      headline: "Critical cases prioritized before AI reasoning",
      description: "Deterministic gate intercepts acute cardiac & stroke in < 0.3ms.",
      icon: <ShieldAlert className="h-7 w-7 text-red-500" />,
      border: "border-l-4 border-l-red-500",
    },
    {
      title: "📡 Offline AI",
      headline: "Runs locally with Gemma without internet",
      description: "100% local Ollama inference designed for zero-connectivity clinics.",
      icon: <WifiOff className="h-7 w-7 text-teal-400" />,
      border: "border-l-4 border-l-teal-500",
    },
    {
      title: "🧠 Explainable Reasoning",
      headline: "Transparent confidence scores & supporting findings",
      description: "Replaces opaque AI black-boxes with verifiable clinical provenance.",
      icon: <Lightbulb className="h-7 w-7 text-amber-400" />,
      border: "border-l-4 border-l-amber-500",
    },
    {
      title: "🌍 Built for Rural Healthcare",
      headline: "Tailored for NGOs, sub-centers & mobile units",
      description: "Empowers community health workers in low-resource environments.",
      icon: <Globe className="h-7 w-7 text-purple-400" />,
      border: "border-l-4 border-l-purple-500",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          Why MediGem?
        </h2>
        <span className="text-xs text-slate-500 font-medium">Core Product Value Proposition</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map((feat) => (
          <Card
            key={feat.title}
            className={`p-5 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 ${feat.border}`}
          >
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 w-fit">
                {feat.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {feat.title}
                </h3>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                  {feat.headline}
                </p>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {feat.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
