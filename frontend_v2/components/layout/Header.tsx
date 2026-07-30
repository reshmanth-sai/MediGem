"use client";

import React from "react";
import { OfflineBadge, ModelBadge } from "@/components/ui/Badge";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export function Header() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-40 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          💎 MediGem
        </span>
        <span className="text-xs text-slate-400 font-mono hidden sm:inline">v2.0.0</span>
      </div>

      <div className="flex items-center space-x-3">
        <OfflineBadge />
        <ModelBadge />
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-md transition-colors"
          aria-label="Toggle Theme"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}
