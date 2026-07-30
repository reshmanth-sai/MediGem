"use client";

import React from "react";
import Link from "next/link";
import { AlertOctagon, ArrowRight, ShieldAlert, Zap } from "lucide-react";

export function EmergencyAlertBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-950 via-rose-900 to-slate-950 border border-rose-600/60 p-4 shadow-xl shadow-rose-950/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse-slow">
      <div className="flex items-start space-x-3.5">
        <div className="p-2.5 rounded-xl bg-rose-600 text-white shrink-0 shadow-lg shadow-rose-600/40">
          <AlertOctagon className="h-6 w-6 animate-bounce" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase bg-rose-500 text-slate-950">
              CRITICAL SAFETY INTERCEPT
            </span>
            <span className="text-xs text-rose-300 font-mono font-semibold flex items-center gap-1">
              <Zap className="h-3 w-3 text-rose-400" /> Triggered in 0.28ms
            </span>
          </div>
          <h3 className="text-sm font-bold text-white tracking-tight">
            Anitha S. (62F, Sundarpur) — Acute Coronary Syndrome Risk Detected
          </h3>
          <p className="text-xs text-rose-200/90 leading-normal">
            Severe crushing substernal chest pain, diaphoresis, BP 155/95, HR 110 bpm. Immediate referral protocol generated.
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 shrink-0 w-full sm:w-auto justify-end">
        <Link href="/results/DEMO-ACUTE-CARDIAC">
          <button className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 text-xs font-black transition-all flex items-center space-x-1.5 shadow-md border border-rose-300">
            <ShieldAlert className="h-4 w-4" />
            <span>Open STAT Referral Protocol</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </button>
        </Link>
      </div>
    </div>
  );
}
