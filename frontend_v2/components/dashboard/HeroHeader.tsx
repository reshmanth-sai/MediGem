"use client";

import React from "react";
import Link from "next/link";
import { PlusCircle, PlayCircle, ShieldCheck } from "lucide-react";
import { OfflineBadge, ModelBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function HeroHeader() {
  return (
    <div className="relative rounded-2xl bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 p-8 sm:p-10 text-white shadow-xl overflow-hidden border border-teal-700/50">
      {/* Background Decorative Accent */}
      <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <OfflineBadge className="bg-teal-950/80 text-teal-300 border-teal-700" />
          <ModelBadge model="gemma3:4b" className="bg-slate-900/80 text-slate-300 border-slate-700" />
          <span className="inline-flex items-center text-xs font-semibold text-teal-300 bg-teal-950/60 px-2.5 py-0.5 rounded-full border border-teal-800">
            <ShieldCheck className="h-3.5 w-3.5 mr-1 text-teal-400" /> Emergency Gate Active (&lt; 0.3ms)
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Welcome to <span className="text-teal-300">MediGem</span> Clinical Co-Pilot
          </h1>
          <p className="text-base sm:text-lg text-teal-100/90 max-w-2xl leading-relaxed">
            Offline multimodal AI assistant empowering rural healthcare workers with fast, safe, and transparent clinical reasoning.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link href="/new-case">
            <Button size="lg" variant="primary" leftIcon={<PlusCircle className="h-5 w-5" />}>
              Start New Case
            </Button>
          </Link>
          <Link href="/demo">
            <Button
              size="lg"
              variant="outline"
              leftIcon={<PlayCircle className="h-5 w-5" />}
              className="border-teal-400/40 text-teal-100 hover:bg-teal-800/40"
            >
              Open Demo Presets
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
