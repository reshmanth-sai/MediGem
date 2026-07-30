"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { WhyMediGem } from "@/components/dashboard/WhyMediGem";
import { JudgeDashboard } from "@/components/judge/JudgeDashboard";
import { AnalysisTypesGrid } from "@/components/dashboard/AnalysisTypesGrid";
import { PipelineWorkflow } from "@/components/dashboard/PipelineWorkflow";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { EducationalTips } from "@/components/dashboard/EducationalTips";
import { Footer } from "@/components/dashboard/Footer";
import { BookOpen, Cpu, ShieldCheck, Award, HeartPulse, Layers, Sparkles } from "lucide-react";

export default function LearningPage() {
  const [activeTab, setActiveTab] = useState<"architecture" | "principles" | "guidance" | "executive">("architecture");

  const tabs = [
    { id: "architecture", label: "AI Architecture & Modalities", icon: Layers },
    { id: "principles", label: "Core Principles", icon: ShieldCheck },
    { id: "guidance", label: "Clinical Guidance & Tips", icon: HeartPulse },
    { id: "executive", label: "Hackathon Summary", icon: Award },
  ] as const;

  return (
    <AppShell>
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
        {/* Learning Hub Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 border border-teal-800/80 p-8 shadow-2xl space-y-4">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-teal-950/80 text-teal-300 border border-teal-500/40">
              <BookOpen className="h-3.5 w-3.5" /> KNOWLEDGE & LEARNING HUB
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
              <Sparkles className="h-3.5 w-3.5" /> Offline AI Guide
            </span>
          </div>

          <div className="space-y-2 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              MediGem <span className="bg-gradient-to-r from-teal-400 to-emerald-300 bg-clip-text text-transparent">Learning & Architecture</span> Hub
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              Explore the technical architecture, offline multimodal AI pipeline, clinical safety rules, and operational guidelines behind MediGem Clinical Co-Pilot.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800/80">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                    isActive
                      ? "bg-teal-500 text-slate-950 border-teal-400 shadow-lg shadow-teal-500/20"
                      : "bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Contents */}
        {activeTab === "architecture" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Interactive Multimodal AI Pipeline */}
            <PipelineWorkflow />
            {/* Supported Clinical Analysis Modalities */}
            <AnalysisTypesGrid />
          </div>
        )}

        {activeTab === "principles" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Why MediGem Feature Cards */}
            <WhyMediGem />
          </div>
        )}

        {activeTab === "guidance" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
            <ActivityTimeline />
            <EducationalTips />
          </div>
        )}

        {activeTab === "executive" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Hackathon Judge Executive Summary */}
            <JudgeDashboard />
          </div>
        )}

        {/* Footer */}
        <Footer />
      </div>
    </AppShell>
  );
}
