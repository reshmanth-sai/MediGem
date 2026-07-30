"use client";

import React from "react";
import { Settings, Cpu, ShieldCheck, Database, HardDrive, BatteryCharging, WifiOff, CheckCircle2 } from "lucide-react";

export function ControlCenterHeader() {
  return (
    <div className="relative overflow-hidden rounded-2xl theme-card border p-5 shadow-lg space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <Settings className="h-3 w-3" /> CLINICAL CONTROL CENTER
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="h-3 w-3" /> 100% OPERATIONAL
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            System Control Center & Clinical Preferences
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
            Operational health telemetry, AI reasoning parameters, offline storage, accessibility & security controls
          </p>
        </div>
      </div>

      {/* Operational Health Telemetry Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-3 border-t border-inherit text-xs font-mono">
        <div className="p-2 rounded-xl theme-card border flex items-center space-x-2">
          <WifiOff className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <div className="truncate">
            <p className="text-[9.5px] text-slate-500 dark:text-slate-400 uppercase">Offline Status</p>
            <p className="text-emerald-400 font-bold text-[11px]">100% Edge Air-Gap</p>
          </div>
        </div>

        <div className="p-2 rounded-xl theme-card border flex items-center space-x-2">
          <Cpu className="h-3.5 w-3.5 text-teal-400 shrink-0" />
          <div className="truncate">
            <p className="text-[9.5px] text-slate-500 dark:text-slate-400 uppercase">AI Engine</p>
            <p className="text-teal-400 font-bold text-[11px]">gemma3:4b (Local)</p>
          </div>
        </div>

        <div className="p-2 rounded-xl theme-card border flex items-center space-x-2">
          <ShieldCheck className="h-3.5 w-3.5 text-sky-400 shrink-0" />
          <div className="truncate">
            <p className="text-[9.5px] text-slate-500 dark:text-slate-400 uppercase">Safety Gate</p>
            <p className="text-sky-400 font-bold text-[11px]">11 Rules (&lt;0.28ms)</p>
          </div>
        </div>

        <div className="p-2 rounded-xl theme-card border flex items-center space-x-2">
          <Database className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <div className="truncate">
            <p className="text-[9.5px] text-slate-500 dark:text-slate-400 uppercase">Edge DB</p>
            <p className="text-emerald-400 font-bold text-[11px]">SQLite Connected</p>
          </div>
        </div>

        <div className="p-2 rounded-xl theme-card border flex items-center space-x-2">
          <HardDrive className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <div className="truncate">
            <p className="text-[9.5px] text-slate-500 dark:text-slate-400 uppercase">Storage</p>
            <p className="text-amber-400 font-bold text-[11px]">14.2 GB Free</p>
          </div>
        </div>

        <div className="p-2 rounded-xl theme-card border flex items-center space-x-2">
          <BatteryCharging className="h-3.5 w-3.5 text-purple-400 shrink-0" />
          <div className="truncate">
            <p className="text-[9.5px] text-slate-500 dark:text-slate-400 uppercase">Power State</p>
            <p className="text-purple-400 font-bold text-[11px]">94% Charged</p>
          </div>
        </div>
      </div>
    </div>
  );
}
