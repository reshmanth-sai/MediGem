"use client";

import React, { useState } from "react";
import { Cpu, ShieldCheck } from "lucide-react";
import { H2, BodySm, Label } from "@/components/ui/Typography";
import { Field } from "@/components/ui/Field";
import { cn } from "@/lib/utils";

const MODEL_OPTIONS = [
  {
    id: "gemma3:4b",
    name: "Gemma 3 4B (Recommended)",
    tag: "Active",
    desc: "High-accuracy multimodal clinical reasoning. 3.8 GB VRAM footprint.",
  },
  {
    id: "smollm:135m",
    name: "SmolLM 135M (Low Power)",
    tag: "Fallback",
    desc: "Ultra-lightweight fallback for low-battery emergency situations.",
  },
];

export function AIClinicalConfig() {
  const [confidenceThreshold, setConfidenceThreshold] = useState(90);
  const [selectedModel, setSelectedModel] = useState("gemma3:4b");
  const [emergencyOverride, setEmergencyOverride] = useState(true);

  return (
    <div className="rounded-card bg-surface border border-rule p-6 space-y-6">
      <div className="flex items-center space-x-3 pb-3 border-b border-rule">
        <div className="p-2.5 rounded-control bg-action-subtle text-action border border-rule">
          <Cpu className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <H2>Clinical Decision &amp; Assessment Preferences</H2>
          <BodySm className="text-ink-muted">
            Configure local model execution, confidence thresholds, and safety screening parameters.
          </BodySm>
        </div>
      </div>

      {/* Setting 1: Local Model Selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Active Local Offline Model</Label>
          <span className="text-body-sm font-mono text-action">Ollama Engine</span>
        </div>
        <div role="radiogroup" aria-label="Active local offline model" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MODEL_OPTIONS.map((opt) => {
            const isActive = selectedModel === opt.id;
            return (
              <label key={opt.id} className="block cursor-pointer">
                {/*
                  Native radio kept focusable, visually hidden with sr-only
                  (not display:none), marked `peer` so the visible card below
                  can draw a real focus ring via peer-focus-visible. Mirrors
                  the same pattern used in AppearanceThemes.tsx.
                */}
                <input
                  type="radio"
                  name="ai-model"
                  value={opt.id}
                  checked={isActive}
                  onChange={() => setSelectedModel(opt.id)}
                  className="peer sr-only"
                />
                <span
                  className={cn(
                    "block p-3.5 rounded-control border transition-all space-y-1 peer-focus-visible:ring-2 peer-focus-visible:ring-focus peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface",
                    isActive ? "bg-action-subtle border-action" : "bg-ground border-rule hover:border-rule-strong"
                  )}
                >
                  <div className="flex items-center justify-between font-mono text-body-sm">
                    <span className={cn("font-semibold", isActive ? "text-action" : "text-ink")}>{opt.name}</span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-chip",
                        isActive ? "bg-action text-on-action" : "bg-surface-raised text-ink-muted"
                      )}
                    >
                      {opt.tag}
                    </span>
                  </div>
                  <p className="text-body-sm text-ink-muted leading-normal">{opt.desc}</p>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Setting 2: Assessment Confidence Threshold Slider */}
      <div className="p-4 rounded-control bg-ground border border-rule">
        <Field
          id="confidence-threshold"
          label={
            <span className="flex items-center justify-between">
              <span>Assessment Confidence Flagging Threshold</span>
              <span className="text-action font-semibold">{confidenceThreshold}%</span>
            </span>
          }
          helper={`Cases with assessment confidence below ${confidenceThreshold}% will automatically trigger a yellow caution flag requiring mandatory senior physician review.`}
        >
          <input
            type="range"
            min="80"
            max="98"
            value={confidenceThreshold}
            onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
            className="w-full h-2 bg-surface-raised rounded-chip appearance-none cursor-pointer accent-action"
          />
        </Field>
      </div>

      {/* Setting 3: Emergency Intercept Rules */}
      <div className="p-4 rounded-control bg-ground border border-rule">
        <Field
          id="emergency-override"
          label={
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-risk-low" aria-hidden="true" />
              <span>Deterministic emergency safety gate (&lt;0.3ms)</span>
            </span>
          }
          helper="Enforces 11 hardcoded safety rules that short-circuit LLM reasoning when acute cardiac, toxicological, or trauma emergency symptoms are present."
        >
          <input
            type="checkbox"
            role="switch"
            className="ui-switch"
            checked={emergencyOverride}
            onChange={(e) => setEmergencyOverride(e.target.checked)}
          />
        </Field>
      </div>
    </div>
  );
}
