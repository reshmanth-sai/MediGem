import React from "react";
import { ShieldAlert, WifiOff, Lightbulb, Globe } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { H2, Label, BodySm } from "@/components/ui/Typography";

export function WhyMediGem() {
  const features = [
    {
      title: "Emergency First",
      headline: "Critical cases prioritized before AI reasoning",
      description: "Deterministic gate intercepts acute cardiac and stroke presentations in under 0.3ms.",
      icon: <ShieldAlert className="h-7 w-7 text-ink-muted" aria-hidden="true" />,
    },
    {
      title: "Offline AI",
      headline: "Runs locally with Gemma without internet",
      description: "100% local Ollama inference designed for zero-connectivity clinics.",
      icon: <WifiOff className="h-7 w-7 text-action" aria-hidden="true" />,
    },
    {
      title: "Explainable Reasoning",
      headline: "Transparent confidence scores and supporting findings",
      description: "Replaces opaque AI black boxes with verifiable clinical provenance.",
      icon: <Lightbulb className="h-7 w-7 text-ink-muted" aria-hidden="true" />,
    },
    {
      title: "Built for Rural Healthcare",
      headline: "Tailored for NGOs, sub-centers and mobile units",
      description: "Empowers community health workers in low-resource environments.",
      icon: <Globe className="h-7 w-7 text-ink-muted" aria-hidden="true" />,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <H2>Why MediGem?</H2>
        <Label>Core Product Value Proposition</Label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map((feat) => (
          <Card key={feat.title} className="flex flex-col justify-between transition-colors duration-300">
            <div className="space-y-3">
              <div className="p-3 rounded-card bg-surface-raised border border-rule w-fit">
                {feat.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-body-sm font-bold text-ink">{feat.title}</h3>
                <BodySm className="font-semibold text-ink leading-snug">{feat.headline}</BodySm>
              </div>
              <BodySm className="text-ink-muted leading-relaxed">{feat.description}</BodySm>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
