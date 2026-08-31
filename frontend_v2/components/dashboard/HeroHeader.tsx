"use client";

import React from "react";
import Link from "next/link";
import { PlusCircle, PlayCircle, ShieldCheck, Cpu, BookOpen, WifiOff } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { H1, Body } from "@/components/ui/Typography";

export function HeroHeader() {
  return (
    <div className="rounded-card border border-rule bg-surface p-8 sm:p-10 space-y-6">
      {/* Top Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-chip text-label bg-surface-raised text-ink-muted border border-rule">
          <WifiOff className="h-3.5 w-3.5" aria-hidden="true" /> Offline first
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-chip text-label bg-surface-raised text-ink-muted border border-rule">
          <Cpu className="h-3.5 w-3.5" aria-hidden="true" /> Model: Gemma 3 4B
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-chip text-label bg-surface-raised text-ink-muted border border-rule">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Emergency gate active (under 0.3ms)
        </span>
      </div>

      {/* Title & Tagline */}
      <div className="space-y-3 max-w-3xl">
        <H1 className="text-display">Welcome to MediGem Clinical Co-Pilot</H1>
        <Body className="text-ink-muted">
          Offline multimodal AI assistant empowering rural healthcare workers with fast, safe, and
          transparent clinical decision support.
        </Body>
      </div>

      {/* Hero Primary Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
        <Link
          href="/new-case"
          className={buttonVariants({ size: "lg", className: "w-full sm:w-auto" })}
        >
          <span className="inline-flex" aria-hidden="true">
            <PlusCircle className="h-5 w-5" />
          </span>
          Start New Case
        </Link>

        <Link
          href="/learning"
          className={buttonVariants({
            size: "lg",
            variant: "secondary",
            className: "w-full sm:w-auto",
          })}
        >
          <span className="inline-flex" aria-hidden="true">
            <BookOpen className="h-5 w-5" />
          </span>
          Explore Learning Hub
        </Link>

        <Link
          href="/demo"
          className={buttonVariants({
            size: "lg",
            variant: "outline",
            className: "w-full sm:w-auto",
          })}
        >
          <span className="inline-flex" aria-hidden="true">
            <PlayCircle className="h-5 w-5" />
          </span>
          Open Demo Presets
        </Link>
      </div>
    </div>
  );
}
