"use client";

import React from "react";
import Link from "next/link";
import { Users, PlusCircle, AlertTriangle, Clock, ArrowUpRight, Search, ShieldCheck } from "lucide-react";

export function HistoryQueueHeader() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/80 border border-slate-800 p-5 shadow-lg space-y-4">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-teal-950 text-teal-300 border border-teal-500/30">
              <Users className="h-3 w-3" /> CLINICAL QUEUE & VAULT
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="h-3 w-3" /> 100% Offline DB
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Patient Queue & Clinical History Workstation
          </h1>
          <p className="text-xs text-slate-400 font-normal">
            Prioritized by clinical severity • Real-time explainable AI decision support
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="shrink-0 flex items-center space-x-3">
          <Link href="/new-case">
            <button className="px-5 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs sm:text-sm font-extrabold shadow-lg shadow-teal-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-2 border border-teal-300">
              <PlusCircle className="h-4 w-4 text-slate-950" />
              <span>Start New Patient Intake</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Operational Counters Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80">
        <div className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800">
          <Users className="h-4 w-4 text-teal-400 shrink-0" />
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Total Cases Recorded</p>
            <p className="text-sm font-black text-white font-mono">128</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-rose-950/40 border border-rose-800/40">
          <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 animate-pulse" />
          <div>
            <p className="text-[10px] uppercase font-bold text-rose-400">Critical Emergencies</p>
            <p className="text-sm font-black text-rose-300 font-mono">14 Cases</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800">
          <Clock className="h-4 w-4 text-amber-400 shrink-0" />
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Pending Review</p>
            <p className="text-sm font-black text-amber-300 font-mono">3 Waiting</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800">
          <ArrowUpRight className="h-4 w-4 text-emerald-400 shrink-0" />
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Referrals Today</p>
            <p className="text-sm font-black text-emerald-300 font-mono">4 Generated</p>
          </div>
        </div>
      </div>
    </div>
  );
}
