"use client";

import React from "react";
import { Info, ShieldCheck, Heart, ExternalLink } from "lucide-react";

export function AboutSystem() {
  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-6 shadow-xl">
      <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
        <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
          <Info className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-white">About MediGem Clinical Co-Pilot</h2>
          <p className="text-xs text-slate-400">System build metadata, local AI engine licenses, and offline certification.</p>
        </div>
      </div>

      <div className="space-y-3 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-400">Application Release:</span>
            <span className="text-teal-300 font-bold">MediGem v2.0.0 (Production Edge)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">AI Model Provider:</span>
            <span className="text-slate-200 font-bold">Gemma 3 4B (Google DeepMind)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Emergency Engine Rules:</span>
            <span className="text-emerald-400 font-bold">v1.2 (11 Verified Safety Rules)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Local Database:</span>
            <span className="text-slate-200 font-bold">SQLite Edge Engine (Encrypted)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">License:</span>
            <span className="text-slate-300">Apache 2.0 / MIT License</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-teal-950/40 border border-teal-500/30 text-teal-200 text-xs flex items-center space-x-2">
          <ShieldCheck className="h-5 w-5 text-teal-400 shrink-0" />
          <p>
            Certified for 100% offline deployment in rural health sub-centers, mobile clinics, and remote health posts.
          </p>
        </div>
      </div>
    </div>
  );
}
