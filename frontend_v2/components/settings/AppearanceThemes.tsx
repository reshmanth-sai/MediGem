"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, Sparkles, Check, Palette, Cpu, ShieldCheck } from "lucide-react";

export function AppearanceThemes() {
  const { theme, setTheme } = useTheme();
  const [activeThemeId, setActiveThemeId] = useState("dark");
  const [accentColor, setAccentColor] = useState("cyan");

  useEffect(() => {
    if (theme) {
      setActiveThemeId(theme);
    }
  }, [theme]);

  const applyTheme = (themeId: string) => {
    setTheme(themeId);
    setActiveThemeId(themeId);

    const root = document.documentElement;
    root.classList.remove("light", "dark", "theme-sapphire", "theme-titanium", "theme-amber");

    if (themeId === "light") {
      root.classList.add("light");
    } else if (themeId === "sapphire-theme") {
      root.classList.add("dark", "theme-sapphire");
    } else if (themeId === "titanium-theme") {
      root.classList.add("dark", "theme-titanium");
    } else if (themeId === "amber-theme") {
      root.classList.add("dark", "theme-amber");
    } else {
      root.classList.add("dark");
    }
  };

  const colorPalettes = [
    { id: "indigo", name: "Electric Indigo", hex: "#6366F1", bg: "bg-indigo-600" },
    { id: "emerald", name: "Emerald Green", hex: "#10B981", bg: "bg-emerald-500" },
    { id: "cyan", name: "Cyber Cyan", hex: "#06B6D4", bg: "bg-cyan-500" },
    { id: "amber", name: "Sunset Amber", hex: "#F59E0B", bg: "bg-amber-500" },
    { id: "sky", name: "Sky Blue", hex: "#0284C7", bg: "bg-sky-500" },
    { id: "teal", name: "Clinical Teal", hex: "#14B8A6", bg: "bg-teal-500" },
  ];

  const themes = [
    {
      id: "dark",
      name: "Calm Clinical Dark",
      desc: "Default healthcare command center dark mode. Minimizes eye strain during long shifts.",
      icon: Moon,
      bg: "bg-slate-900",
      border: "border-teal-500/60",
      accent: "text-teal-400",
      badge: "bg-teal-500 text-slate-950",
      previewBg: "bg-slate-950 border-slate-800 text-slate-200",
      previewBar: "bg-teal-400",
    },
    {
      id: "light",
      name: "Clean Clinical Light",
      desc: "High-luminance daytime mode for bright clinical environments and tablet rounds.",
      icon: Sun,
      bg: "bg-white text-slate-900",
      border: "border-sky-500/80",
      accent: "text-sky-600",
      badge: "bg-sky-600 text-white",
      previewBg: "bg-slate-100 text-slate-900 border-slate-300",
      previewBar: "bg-sky-500",
    },
    {
      id: "sapphire-theme",
      name: "Midnight Sapphire & Indigo",
      desc: "Deep oceanic blue sapphire theme with glowing electric indigo accents.",
      icon: Sparkles,
      bg: "bg-indigo-950/60",
      border: "border-indigo-500/80",
      accent: "text-indigo-400",
      badge: "bg-indigo-600 text-white",
      previewBg: "bg-indigo-950/90 border-indigo-800 text-indigo-200",
      previewBar: "bg-indigo-400",
    },
    {
      id: "titanium-theme",
      name: "Titanium Slate (Mac Studio)",
      desc: "Deep metallic titanium slate theme engineered for crisp vector rendering.",
      icon: Cpu,
      bg: "bg-slate-950/80",
      border: "border-emerald-500/80",
      accent: "text-emerald-400",
      badge: "bg-emerald-600 text-white",
      previewBg: "bg-slate-900 border-slate-700 text-slate-200",
      previewBar: "bg-emerald-400",
    },
    {
      id: "amber-theme",
      name: "Sunset Amber (Warm Dark)",
      desc: "Warm obsidian theme with amber accents designed for night vision comfort.",
      icon: ShieldCheck,
      bg: "bg-slate-950/80",
      border: "border-amber-500/80",
      accent: "text-amber-400",
      badge: "bg-amber-500 text-slate-950",
      previewBg: "bg-slate-900 border-slate-800 text-amber-200",
      previewBar: "bg-amber-400",
    },
    {
      id: "system",
      name: "System Match",
      desc: "Automatically matches host operating system appearance settings.",
      icon: Monitor,
      bg: "bg-slate-900",
      border: "border-slate-700",
      accent: "text-slate-300",
      badge: "bg-slate-700 text-white",
      previewBg: "bg-slate-900 border-slate-800 text-slate-200",
      previewBar: "bg-slate-400",
    },
  ];

  return (
    <div className="rounded-2xl theme-card p-6 space-y-6 shadow-xl border">
      {/* Header */}
      <div className="flex items-center space-x-3 pb-3 border-b border-inherit">
        <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
          <Palette className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Appearance & Visual Themes</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Select interface theme, primary brand color palette, and preview live layouts.</p>
        </div>
      </div>

      {/* Primary Accent Color Palette Picker */}
      <div className="space-y-3 p-4 rounded-xl theme-card border">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider font-mono">
            Primary Accent Color Palette
          </h4>
          <span className="text-[11px] text-teal-400 font-mono font-bold capitalize">Active: {accentColor}</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {colorPalettes.map((cp) => {
            const isSelected = accentColor === cp.id;
            return (
              <button
                key={cp.id}
                onClick={() => setAccentColor(cp.id)}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition-all ${
                  isSelected
                    ? "theme-card border-teal-500 shadow-lg scale-105"
                    : "theme-card border-inherit hover:border-slate-500"
                }`}
              >
                <div className={`h-6 w-6 rounded-full ${cp.bg} flex items-center justify-center shadow-md`}>
                  {isSelected && <Check className="h-3.5 w-3.5 text-white stroke-[3]" />}
                </div>
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{cp.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Theme Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((t) => {
          const Icon = t.icon;
          const isActive = activeThemeId === t.id;

          return (
            <div
              key={t.id}
              onClick={() => applyTheme(t.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all space-y-3 relative overflow-hidden group ${
                isActive
                  ? `${t.bg} ${t.border} shadow-xl scale-[1.02]`
                  : "theme-card border-inherit hover:border-slate-500"
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon className={`h-4 w-4 ${t.accent}`} />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</h4>
                </div>
                {isActive && (
                  <span className={`px-2 py-0.5 rounded font-extrabold text-[9.5px] uppercase tracking-wide shadow-sm ${t.badge}`}>
                    ACTIVE
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug h-10">{t.desc}</p>

              {/* Rich Live Theme Layout Preview Box */}
              <div className={`p-3 rounded-lg border text-[10px] font-mono space-y-2 transition-all ${t.previewBg}`}>
                <div className="flex justify-between items-center opacity-90">
                  <span className="font-bold">Clinical Workspace</span>
                  <span className="px-1.5 py-0.2 rounded bg-white/20 text-[9px]">ONLINE</span>
                </div>
                <div className={`h-1.5 rounded-full ${t.previewBar}`} />
                <div className="flex justify-between items-center pt-1 border-t border-white/20 text-[9px] opacity-70">
                  <span>Gemma 3 4B</span>
                  <span>100% Edge</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
