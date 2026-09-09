import React from "react";
import { ShieldAlert, WifiOff, Lightbulb, Globe } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { H2, Label, BodySm } from "@/components/ui/Typography";

export function WhyMediGem() {
  const features = [
    {
      title: "Emergency First",
      headline: "Critical cases prioritized before inference reasoning",
      description: "Deterministic gate intercepts acute cardiac and stroke presentations in under 0.3ms.",
      icon: <ShieldAlert className="h-5 w-5 text-ink-muted" aria-hidden="true" />,
    },
    {
      title: "Offline Operation",
      headline: "Runs locally with on-device models without internet",
      description: "100% local Ollama inference designed for zero-connectivity clinics.",
      icon: <WifiOff className="h-5 w-5 text-action" aria-hidden="true" />,
    },
    {
      title: "Explainable Reasoning",
      headline: "Transparent assessment rationale and supporting findings",
      description: "Replaces opaque black boxes with verifiable clinical provenance.",
      icon: <Lightbulb className="h-5 w-5 text-ink-muted" aria-hidden="true" />,
    },
    {
      title: "Built for Rural Healthcare",
      headline: "Tailored for NGOs, sub-centers and mobile units",
      description: "Empowers community health workers in low-resource environments.",
      icon: <Globe className="h-5 w-5 text-ink-muted" aria-hidden="true" />,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-rule">
        <H2>Clinical Design Principles</H2>
        <Label>Core System Principles</Label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feat) => (
          <div
            key={feat.title}
            className="p-4 rounded-control bg-surface border border-rule flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="p-2 rounded-control bg-surface-raised border border-rule w-fit text-action">
                {feat.icon}
              </div>
              <div>
                <h3 className="text-body-sm font-semibold text-ink">{feat.title}</h3>
                <BodySm className="text-ink font-medium leading-snug mt-0.5">{feat.headline}</BodySm>
              </div>
              <BodySm className="text-ink-muted leading-relaxed">{feat.description}</BodySm>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
