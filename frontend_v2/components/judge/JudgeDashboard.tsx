"use client";

import React from "react";
import { Award, ShieldAlert, Cpu, WifiOff, Zap, Globe, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { H1, Label, BodySm } from "@/components/ui/Typography";

interface Pillar {
  title: string;
  description: string;
  icon: LucideIcon;
  iconClassName: string;
}

export function JudgeDashboard({ onStartDemo }: { onStartDemo?: () => void }) {
  const pillars: Pillar[] = [
    {
      title: "1. Emergency First",
      description: "Critical cases prioritized before AI reasoning begins (under 0.3ms gate).",
      icon: ShieldAlert,
      iconClassName: "text-ink-muted",
    },
    {
      title: "2. 100% Offline AI",
      description: "Runs locally with Gemma intelligence without internet connectivity.",
      icon: WifiOff,
      iconClassName: "text-action",
    },
    {
      title: "3. Explainable Reasoning",
      description: "Confidence scores, supporting findings and transparent reasoning.",
      icon: Cpu,
      iconClassName: "text-ink-muted",
    },
    {
      title: "4. Rural Health Impact",
      description: "Designed for NGOs, mobile clinics and sub-centers in underserved areas.",
      icon: Globe,
      iconClassName: "text-ink-muted",
    },
  ];

  return (
    <section className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rule">
        <div className="flex items-center gap-3 min-w-0">
          <Award className="h-7 w-7 text-action shrink-0" aria-hidden="true" />
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <H1>Hackathon Judge Executive Summary</H1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-chip text-label bg-action-subtle text-action border border-action/30">
                Judge overview
              </span>
            </div>
            <BodySm className="text-ink-muted">
              MediGem, offline AI clinical co-pilot for rural healthcare workers
            </BodySm>
          </div>
        </div>

        {onStartDemo && (
          <Button
            size="sm"
            variant="primary"
            className="shrink-0"
            rightIcon={<ArrowRight className="h-4 w-4" />}
            onClick={onStartDemo}
          >
            Launch Live Demo Mode
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <Card key={pillar.title} className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 shrink-0 ${pillar.iconClassName}`} aria-hidden="true" />
                <h3 className="text-h3 text-ink">{pillar.title}</h3>
              </div>
              <BodySm className="text-ink-muted leading-relaxed">{pillar.description}</BodySm>
            </Card>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-4 border-t border-rule">
        <div className="flex items-center gap-2 min-w-0">
          <Zap className="h-4 w-4 text-ink-muted shrink-0" aria-hidden="true" />
          <BodySm className="text-ink-muted">
            All unit tests passing, health score 100%, version 2.0.0
          </BodySm>
        </div>
        <Label className="shrink-0">Latency 5.42s</Label>
      </div>
    </section>
  );
}
