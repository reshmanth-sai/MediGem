"use client";

import React from "react";
import Link from "next/link";
import { PlusCircle, PlayCircle, ShieldCheck, Cpu, BookOpen } from "lucide-react";
import { OfflineBadge } from "@/components/ui/Badge";

export function HeroHeader() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950/80 to-slate-900 border border-teal-800/80 p-8 sm:p-10 shadow-2xl space-y-6">
      {/* Background Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

      {/* Top Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <OfflineBadge />
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-slate-800/80 text-teal-300 border border-teal-700/60">
          <Cpu className="h-3.5 w-3.5" /> MODEL: GEMMA 3 4B
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Emergency Gate Active (&lt; 0.3ms)
        </span>
      </div>

      {/* Title & Tagline */}
      <div className="space-y-3 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
          Welcome to <span className="bg-gradient-to-r from-teal-400 to-emerald-300 bg-clip-text text-transparent">MediGem</span> Clinical Co-Pilot
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
          Offline multimodal AI assistant empowering rural healthcare workers with fast, safe, and transparent clinical decision support.
        </p>
      </div>

      {/* Hero Primary Action ⭐⭐⭐⭐⭐ */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
        <Link href="/new-case" className="block">
          <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 text-base font-extrabold shadow-xl shadow-teal-500/20 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-3 group border border-emerald-300">
            <PlusCircle className="h-6 w-6 text-slate-950 group-hover:rotate-90 transition-transform duration-300" />
            <span>Start New Case</span>
          </button>
        </Link>

        <Link href="/learning" className="block">
          <button className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-teal-950/80 hover:bg-teal-900/90 text-teal-300 hover:text-teal-200 text-sm font-bold border border-teal-600/60 hover:border-teal-500 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-teal-950/40">
            <BookOpen className="h-5 w-5 text-teal-400" />
            <span>Explore Learning Hub</span>
          </button>
        </Link>

        <Link href="/demo" className="block">
          <button className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white text-sm font-semibold border border-slate-700/80 hover:border-slate-600 transition-all flex items-center justify-center space-x-2">
            <PlayCircle className="h-5 w-5 text-teal-400" />
            <span>Open Demo Presets</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
