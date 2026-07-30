"use client";

import React, { useState } from "react";
import { Brain, Cpu, ShieldCheck, Sparkles, Sliders } from "lucide-react";

export function AIClinicalConfig() {
  const [confidenceThreshold, setConfidenceThreshold] = useState(90);
  const [transparencyMode, setTransparencyMode] = useState(true);
  const [selectedModel, setSelectedModel] = useState("gemma3:4b");
  const [emergencyOverride, setEmergencyOverride] = useState(true);

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-6 shadow-xl">
      <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
        <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
          <Brain className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-white">AI Engine & Clinical Reasoning Preferences</h2>
          <p className="text-xs text-slate-400">Configure local model reasoning, confidence thresholds, and safety gate parameters.</p>
        </div>
      </div>

      {/* Setting 1: Local Model Selection */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
          <span>Active Local Offline Model</span>
          <span className="text-[10.5px] font-mono text-teal-400">Ollama Engine</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            onClick={() => setSelectedModel("gemma3:4b")}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-1 ${
              selectedModel === "gemma3:4b"
                ? "bg-teal-950/50 border-teal-500/60 text-white shadow-md"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="font-bold text-teal-300">Gemma 3 4B (Recommended)</span>
              <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[10px]">Active</span>
            </div>
            <p className="text-xs text-slate-300 leading-normal">High-accuracy multimodal clinical reasoning. 3.8 GB VRAM footprint.</p>
          </div>

          <div
            onClick={() => setSelectedModel("smollm:135m")}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-1 ${
              selectedModel === "smollm:135m"
                ? "bg-teal-950/50 border-teal-500/60 text-white shadow-md"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="font-bold text-slate-300">SmolLM 135M (Low Power)</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">Fallback</span>
            </div>
            <p className="text-xs text-slate-400 leading-normal">Ultra-lightweight fallback for low-battery emergency situations.</p>
          </div>
        </div>
      </div>

      {/* Setting 2: AI Confidence Threshold Slider */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="font-bold text-white">AI Confidence Flagging Threshold:</span>
          <span className="text-teal-300 font-bold text-sm">{confidenceThreshold}%</span>
        </div>
        <input
          type="range"
          min="80"
          max="98"
          value={confidenceThreshold}
          onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
        />
        <p className="text-[11px] text-slate-400">
          Cases with AI confidence below {confidenceThreshold}% will automatically trigger a yellow caution flag requiring mandatory senior physician review.
        </p>
      </div>

      {/* Setting 3: Emergency Intercept Rules */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
        <div className="space-y-0.5 max-w-xl">
          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Deterministic Emergency Safety Gate (&lt;0.3ms)</span>
          </h4>
          <p className="text-xs text-slate-400">
            Enforces 11 hardcoded safety rules that short-circuit LLM reasoning when acute cardiac, toxicological, or trauma emergency symptoms are present.
          </p>
        </div>
        <input
          type="checkbox"
          checked={emergencyOverride}
          onChange={(e) => setEmergencyOverride(e.target.checked)}
          className="h-5 w-5 rounded bg-slate-900 border-slate-700 text-teal-400 focus:ring-teal-500 cursor-pointer"
        />
      </div>
    </div>
  );
}
