"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LayoutGrid,
  PlusCircle,
  Stethoscope,
  Brain,
  Award,
  FileText,
  BarChart2,
  Terminal,
  Settings,
  ShieldCheck,
  Pin,
  ChevronDown,
  Sun,
  Moon,
  Monitor,
  User,
  LogOut,
  WifiOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const sections = [
    {
      title: "CLINICAL WORKSPACE",
      items: [
        { label: "Dashboard", href: "/", icon: LayoutGrid },
        { label: "Start New Case", href: "/new-case", icon: PlusCircle },
        { label: "Case Results", href: "/results/CASE-8901", icon: Stethoscope },
      ],
    },
    {
      title: "AI INTELLIGENCE & DEMO",
      items: [
        { label: "AI Co-Pilot & Demo", href: "/demo", icon: Brain },
        { label: "Live Presentation", href: "/presentation", icon: Award },
      ],
    },
    {
      title: "DOCUMENTS & REPORTS",
      items: [
        { label: "Case Vault & History", href: "/history", icon: FileText },
        { label: "Evaluation Benchmarks", href: "/evaluation", icon: BarChart2 },
      ],
    },
    {
      title: "SYSTEM",
      items: [
        { label: "Developer Inspector", href: "/developer", icon: Terminal },
        { label: "Settings & Sandbox", href: "/settings", icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-72 bg-[#090D16] text-slate-300 border-r border-slate-800/80 p-4 flex flex-col justify-between hidden md:flex shrink-0 min-h-screen select-none">
      <div className="space-y-4">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 pt-1">
          <div className="flex items-center space-x-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-teal-500/20">
              💎
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-1.5">
                MediGem <span className="text-[10px] text-teal-400 font-mono font-bold">WORKSPACE</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg transition-colors">
              <ShieldCheck className="h-4 w-4" />
            </button>
            <button className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg transition-colors">
              <Pin className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* User Switcher Card */}
        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-colors">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-white">
              RK
            </div>
            <div>
              <p className="text-xs font-bold text-white">Ramesh Kumar</p>
              <p className="text-[10px] text-slate-400">Health Worker • Primary Sub-Center</p>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-500" />
        </div>

        {/* Categorized Menu Items */}
        <nav className="space-y-4 pt-1">
          {sections.map((sec) => (
            <div key={sec.title} className="space-y-1">
              <p className="text-[9.5px] font-bold uppercase tracking-wider text-slate-500 px-3">
                {sec.title}
              </p>
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link key={item.label} href={item.href as any} className="block">
                      <div
                        className={cn(
                          "flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all group",
                          isActive
                            ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 shadow-md shadow-emerald-950/40"
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300"
                          )}
                        />
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Controls */}
      <div className="space-y-3 pt-3 border-t border-slate-800/80">
        {/* Offline Session Badge Card */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>100% Offline Mode</span>
            </div>
            <p className="text-[11px] text-slate-300 font-mono">Gemma 3 4B Active</p>
          </div>
          <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-1 rounded-lg">
            LOCAL
          </span>
        </div>

        {/* Interface Theme Switcher */}
        <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-xs font-medium pl-1">Interface Theme</span>
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setTheme("light")}
              className={cn(
                "p-1 rounded transition-colors",
                theme === "light" ? "bg-slate-800 text-amber-400" : "text-slate-500 hover:text-slate-300"
              )}
            >
              <Sun className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={cn(
                "p-1 rounded transition-colors",
                theme === "dark" ? "bg-slate-800 text-teal-400" : "text-slate-500 hover:text-slate-300"
              )}
            >
              <Moon className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setTheme("system")}
              className={cn(
                "p-1 rounded transition-colors",
                theme === "system" ? "bg-slate-800 text-slate-300" : "text-slate-500 hover:text-slate-300"
              )}
            >
              <Monitor className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* User Profile Pill */}
        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2.5">
            <div className="h-7 w-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
              <User className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-white text-xs">Guest User</p>
              <p className="text-[10px] text-slate-500">Offline Clinical Mode</p>
            </div>
          </div>
          <button className="p-1 text-slate-500 hover:text-slate-300">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
