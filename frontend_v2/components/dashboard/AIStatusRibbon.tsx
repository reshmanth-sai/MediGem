"use client";

import React from "react";
import { Cpu, ShieldCheck, Database, HardDrive, BatteryCharging, Zap, WifiOff, Activity } from "lucide-react";

export function AIStatusRibbon() {
  return (
    <div className="rounded-xl bg-slate-950 border border-slate-800/80 px-4 py-2.5 shadow-md flex flex-wrap items-center justify-between text-xs font-mono text-slate-300 gap-3">
      {/* Offline Status */}
      <div className="flex items-center space-x-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-emerald-400 font-bold flex items-center gap-1">
          <WifiOff className="h-3 w-3" /> 100% OFFLINE READY
        </span>
      </div>

      {/* Model Status */}
      <div className="flex items-center space-x-1.5">
        <Cpu className="h-3.5 w-3.5 text-teal-400" />
        <span className="text-slate-400">Model:</span>
        <span className="text-teal-300 font-bold">gemma3:4b (Ollama)</span>
      </div>

      {/* Safety Gate Latency */}
      <div className="flex items-center space-x-1.5">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
        <span className="text-slate-400">Safety Gate:</span>
        <span className="text-white font-bold">&lt; 0.28ms</span>
      </div>

      {/* Edge DB */}
      <div className="flex items-center space-x-1.5">
        <Database className="h-3.5 w-3.5 text-teal-400" />
        <span className="text-slate-400">Edge DB:</span>
        <span className="text-emerald-400 font-bold">Connected</span>
      </div>

      {/* Storage */}
      <div className="flex items-center space-x-1.5">
        <HardDrive className="h-3.5 w-3.5 text-slate-400" />
        <span className="text-slate-400">Storage:</span>
        <span className="text-slate-200">14.2 GB Free</span>
      </div>

      {/* Battery */}
      <div className="flex items-center space-x-1.5">
        <BatteryCharging className="h-3.5 w-3.5 text-emerald-400" />
        <span className="text-slate-400">Battery:</span>
        <span className="text-emerald-300 font-bold">94% Charged</span>
      </div>
    </div>
  );
}
