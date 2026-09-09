"use client";

import React, { useRef, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { WhyMediGem } from "@/components/dashboard/WhyMediGem";
import { JudgeDashboard } from "@/components/judge/JudgeDashboard";
import { AnalysisTypesGrid } from "@/components/dashboard/AnalysisTypesGrid";
import { PipelineWorkflow } from "@/components/dashboard/PipelineWorkflow";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { EducationalTips } from "@/components/dashboard/EducationalTips";
import { Footer } from "@/components/dashboard/Footer";
import { H1, Body } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";
import { BookOpen, ShieldCheck, Award, HeartPulse, Layers, WifiOff } from "lucide-react";

type TabId = "architecture" | "principles" | "guidance" | "executive";

export default function LearningPage() {
  const [activeTab, setActiveTab] = useState<TabId>("architecture");
  const tabRefs = useRef<Partial<Record<TabId, HTMLButtonElement | null>>>({});

  const tabs = [
    { id: "architecture", label: "Clinical Modalities", icon: Layers },
    { id: "principles", label: "Safety Principles", icon: ShieldCheck },
    { id: "guidance", label: "Clinical Guidance", icon: HeartPulse },
    { id: "executive", label: "Executive Summary", icon: Award },
  ] as const;

  /**
   * The WAI-ARIA tabs pattern: Left and Right move between tabs and wrap at
   * both ends, Home and End jump to the first and last. Selection follows
   * focus, so the panel changes as the arrow keys move, and the roving
   * tabIndex below keeps the tablist a single tab stop rather than four.
   */
  const handleTabKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    const lastIndex = tabs.length - 1;
    let nextIndex: number;

    if (event.key === "ArrowRight") nextIndex = index === lastIndex ? 0 : index + 1;
    else if (event.key === "ArrowLeft") nextIndex = index === 0 ? lastIndex : index - 1;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = lastIndex;
    else return;

    event.preventDefault();
    const nextTab = tabs[nextIndex];
    setActiveTab(nextTab.id);
    tabRefs.current[nextTab.id]?.focus();
  };

  return (
    <AppShell>
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
        {/* Learning hub header */}
        <div className="rounded-card border border-rule bg-surface p-8 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-chip text-label bg-action-subtle text-action border border-action/30">
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" /> Clinical guidelines &amp; protocols
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-chip text-label bg-surface-raised text-ink-muted border border-rule">
              <WifiOff className="h-3.5 w-3.5" aria-hidden="true" /> Offline reference
            </span>
          </div>

          <div className="space-y-3 max-w-3xl">
            <H1 className="text-display">Clinical Guidelines &amp; Protocols Hub</H1>
            <Body className="text-ink-muted">
              Reference specifications for rural triage protocols, multimodal clinical document
              ingestion, deterministic safety screening, and primary care decision workflows.
            </Body>
          </div>

          {/* Section tabs */}
          <div
            role="tablist"
            aria-label="Learning hub sections"
            className="flex flex-wrap gap-2 pt-4 border-t border-rule"
          >
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  ref={(node) => {
                    tabRefs.current[tab.id] = node;
                  }}
                  role="tab"
                  type="button"
                  id={`tab-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "h-11 px-4 rounded-control text-body-sm font-semibold transition-colors flex items-center gap-2 border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                    isActive
                      ? "bg-action-subtle text-action border-action/40"
                      : "bg-surface text-ink-muted border-rule hover:bg-surface-raised hover:text-ink"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab panels */}
        {activeTab === "architecture" && (
          <div
            role="tabpanel"
            id="panel-architecture"
            aria-labelledby="tab-architecture"
            className="space-y-8"
          >
            <PipelineWorkflow />
            <AnalysisTypesGrid />
          </div>
        )}

        {activeTab === "principles" && (
          <div
            role="tabpanel"
            id="panel-principles"
            aria-labelledby="tab-principles"
            className="space-y-8"
          >
            <WhyMediGem />
          </div>
        )}

        {activeTab === "guidance" && (
          <div
            role="tabpanel"
            id="panel-guidance"
            aria-labelledby="tab-guidance"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <ActivityTimeline />
            <EducationalTips />
          </div>
        )}

        {activeTab === "executive" && (
          <div
            role="tabpanel"
            id="panel-executive"
            aria-labelledby="tab-executive"
            className="space-y-8"
          >
            <JudgeDashboard />
          </div>
        )}

        <Footer />
      </div>
    </AppShell>
  );
}
