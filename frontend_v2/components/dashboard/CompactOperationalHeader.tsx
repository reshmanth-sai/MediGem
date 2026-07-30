"use client";

import React from "react";
import Link from "next/link";
import { PlusCircle, ShieldCheck, Cpu, WifiOff, Users, AlertTriangle, Clock, ArrowUpRight } from "lucide-react";

export function CompactOperationalHeader() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/70 border border-slate-800 p-5 shadow-lg space-y-4">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-80 h-full bg-teal-500/5 blur-2xl pointer-events-none" />

      {/* Main Header Content - 120-160px layout */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Greeting & Context */}
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-950/90 text-emerald-300 border border-emerald-500/30">
              <WifiOff className="h-3 w-3 text-emerald-400" /> OFFLINE AI READY
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-slate-800 text-teal-300 border border-slate-700">
              <Cpu className="h-3 w-3" /> GEMMA 3 4B
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              <ShieldCheck className="h-3 w-3 text-teal-400" /> Emergency Gate Active (&lt;0.3ms)
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Good Morning, <span className="text-teal-300">Dr. Vikram</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Clinical Co-Pilot Active • Primary Sub-Center, Rampur • Offline Edge Engine
          </p>
        </div>

        {/* Primary CTA Button */}
        <div className="shrink-0">
          <Link href="/new-case">
            <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs sm:text-sm font-extrabold shadow-lg shadow-teal-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 border border-teal-300">
              <PlusCircle className="h-4 w-4 text-slate-950" />
              <span>Start New Patient Intake</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Operational Counters Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80">
        <div className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800">
          <Users className="h-4 w-4 text-teal-400 shrink-0" />
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Patients Today</p>
            <p className="text-sm font-black text-white">14</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-rose-950/40 border border-rose-800/40">
          <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 animate-pulse" />
          <div>
            <p className="text-[10px] uppercase font-bold text-rose-400">Emergency Alert</p>
            <p className="text-sm font-black text-rose-300">1 Critical</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800">
          <Clock className="h-4 w-4 text-amber-400 shrink-0" />
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Pending Review</p>
            <p className="text-sm font-black text-amber-300">3 Cases</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800">
          <ArrowUpRight className="h-4 w-4 text-emerald-400 shrink-0" />
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Referrals Today</p>
            <p className="text-sm font-black text-emerald-300">4 Generated</p>
          </div>
        </div>
      </div>
    </div>
  );
}
