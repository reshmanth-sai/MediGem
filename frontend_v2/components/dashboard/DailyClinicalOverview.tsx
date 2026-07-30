"use client";

import React from "react";
import { Activity, ShieldCheck, HardDrive, CheckCircle2, TrendingUp, Cpu, Server } from "lucide-react";

export function DailyClinicalOverview() {
  const symptomTrends = [
    { label: "Chest Discomfort / Tightness", pct: 35, color: "bg-rose-500" },
    { label: "High Fever & Rigors", pct: 25, color: "bg-amber-500" },
    { label: "Hypertension / Elevated BP", pct: 20, color: "bg-teal-500" },
    { label: "Surgical / Wound Check", pct: 15, color: "bg-slate-500" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Column 1: Clinical Symptom Trends */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-teal-400" />
            <span>Today's Symptom Trends</span>
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">14 Cases</span>
        </div>

        <div className="space-y-2.5 pt-1">
          {symptomTrends.map((s) => (
            <div key={s.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium truncate">{s.label}</span>
                <span className="text-slate-400 font-mono text-[11px]">{s.pct}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Column 2: AI Reasoning & Safety Calibration */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>AI Calibration & Safety</span>
          </h3>
          <span className="text-[10px] text-emerald-400 font-mono font-bold">100% PASS</span>
        </div>

        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Average AI Confidence</p>
              <p className="text-base font-black text-white font-mono">94.8%</p>
            </div>
            <Cpu className="h-5 w-5 text-teal-400" />
          </div>

          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Zero Deterministic Safety Violations</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>11 Emergency Rules Active & Verified</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>No Cloud API Dependencies</span>
            </div>
          </div>
        </div>
      </div>

      {/* Column 3: Offline Backup & Edge Storage */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <HardDrive className="h-4 w-4 text-teal-400" />
            <span>Offline Edge Storage</span>
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">SQLite Edge</span>
        </div>

        <div className="space-y-3 pt-1">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Local Volume:</span>
              <span className="text-slate-200 font-bold">14.2 GB Free / 64 GB</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-teal-400 h-full rounded-full" style={{ width: "22%" }} />
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Pending Cloud Sync</p>
              <p className="text-xs font-bold text-emerald-400">0 Pending (Local Autonomous)</p>
            </div>
            <Server className="h-4 w-4 text-slate-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
