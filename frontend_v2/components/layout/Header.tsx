"use client";

import React from "react";
import { Search, CloudOff, ShieldCheck, Bell, Moon, Sun, MapPin } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export function Header() {
  const { isDark, toggleTheme } = useTheme();

  const handleOpenCommand = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#090D16]/90 backdrop-blur-xl sticky top-0 z-40 px-6 flex items-center justify-between shadow-sm">
      {/* Brand & Version */}
      <div className="flex items-center space-x-3 shrink-0">
        <span className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
          💎 MediGem
        </span>
        <span className="text-[10px] text-teal-400 font-mono font-bold bg-teal-950/80 border border-teal-500/30 px-2 py-0.5 rounded">
          v3.3
        </span>
      </div>

      {/* Center Interactive Cmd + K Search Trigger Bar */}
      <div className="hidden md:flex flex-1 max-w-xl mx-8">
        <button
          onClick={handleOpenCommand}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 text-slate-400 hover:text-slate-200 transition-all text-xs shadow-inner group font-mono"
        >
          <div className="flex items-center space-x-2.5">
            <Search className="h-4 w-4 text-slate-500 group-hover:text-teal-400 transition-colors" />
            <span className="text-slate-400 group-hover:text-slate-200">Search patients, symptoms, IDs, protocols...</span>
          </div>
          <kbd className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-bold text-slate-400">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Telemetry & Status Badges */}
      <div className="flex items-center space-x-3 shrink-0 font-mono text-xs">
        {/* Clinic Location Status */}
        <div className="hidden xl:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-[11px]">
          <MapPin className="h-3.5 w-3.5 text-teal-400" />
          <span>Rampur Sub-Center</span>
          <span className="text-slate-500">•</span>
          <span className="text-emerald-400 font-bold">Shift Active</span>
        </div>

        {/* Offline Edge Status */}
        <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold shadow-sm">
          <CloudOff className="h-3.5 w-3.5 text-emerald-400" />
          <span>100% Edge Offline</span>
        </div>

        {/* Emergency Alert Notification Bell */}
        <button
          className="relative p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition-colors"
          title="1 STAT Emergency Pending"
        >
          <Bell className="h-4 w-4 text-rose-400" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 text-slate-950 text-[9px] font-extrabold flex items-center justify-center">
            1
          </span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition-colors"
          aria-label="Toggle Theme"
        >
          {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-teal-400" />}
        </button>
      </div>
    </header>
  );
}
