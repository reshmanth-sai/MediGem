"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin, ChevronDown, Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export function Header() {
  const { isDark, toggleTheme } = useTheme();
  const [currentTime, setCurrentTime] = useState("Tue, Sep 9, 2025  10:24 AM");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      };
      setCurrentTime(now.toLocaleString("en-US", options).replace(",", ""));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenCommand = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white sticky top-0 z-40 px-6 sm:px-8 flex items-center justify-between gap-4">
      {/* LEFT: Search Bar */}
      <div className="w-80 sm:w-96">
        <button
          onClick={handleOpenCommand}
          className="w-full flex items-center justify-between gap-3 px-3.5 h-10 bg-white border border-slate-200 rounded-lg text-slate-400 hover:border-slate-300 transition-colors text-xs sm:text-sm shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          aria-label="Search patient, protocol, or command..."
        >
          <span className="flex items-center gap-2.5 min-w-0">
            <Search className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
            <span className="truncate text-slate-400 font-normal">
              Search patient, protocol, or command...
            </span>
          </span>
          <kbd className="text-[11px] font-mono bg-slate-100 border border-slate-200 text-slate-500 rounded px-1.5 py-0.5 shrink-0">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* RIGHT: Location, Status & Date & Theme Toggle */}
      <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm shrink-0">
        {/* Location Dropdown */}
        <button
          type="button"
          className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 font-medium transition-colors cursor-pointer"
        >
          <MapPin className="h-4 w-4 text-slate-500 shrink-0" aria-hidden="true" />
          <span>Rampur Sub-Center</span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
        </button>

        {/* Shift Active Indicator */}
        <div className="flex items-center gap-2 font-medium text-slate-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
          <span>Shift Active</span>
        </div>

        {/* Timestamp */}
        <div className="hidden md:block text-slate-500 font-normal text-xs sm:text-sm">
          {currentTime}
        </div>

        {/* Theme Toggle (Accessible + Header quick toggle) */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
        >
          {isDark ? (
            <Sun className="h-4 w-4 text-amber-500" aria-hidden="true" />
          ) : (
            <Moon className="h-4 w-4 text-slate-500" aria-hidden="true" />
          )}
        </button>
      </div>
    </header>
  );
}
