"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Home, PlusCircle, History, Award, Settings, Terminal, X } from "lucide-react";
import { ModalDialog } from "@/components/ui/Dialog";

export function CommandPalette() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const commands = [
    { title: "Home Dashboard", route: "/", icon: <Home className="h-4 w-4" /> },
    { title: "Start New Patient Case", route: "/new-case", icon: <PlusCircle className="h-4 w-4" /> },
    { title: "Clinical Case History", route: "/history", icon: <History className="h-4 w-4" /> },
    { title: "Demo Presets & Hackathon Mode", route: "/demo", icon: <Award className="h-4 w-4" /> },
    { title: "Evaluation Analytics Dashboard", route: "/evaluation", icon: <Terminal className="h-4 w-4" /> },
    { title: "Developer Workspace & Inspector", route: "/developer", icon: <Terminal className="h-4 w-4" /> },
    { title: "Settings & Accessibility", route: "/settings", icon: <Settings className="h-4 w-4" /> },
  ];

  const filtered = commands.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()));

  const handleNavigate = (route: string) => {
    setIsOpen(false);
    router.push(route);
  };

  if (!isOpen) return null;

  return (
    <ModalDialog isOpen={isOpen} onClose={() => setIsOpen(false)} title="⌘ Command Palette & Search" className="max-w-xl">
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search page..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 dark:text-white"
            autoFocus
          />
        </div>

        <div className="space-y-1 max-h-60 overflow-y-auto text-xs">
          {filtered.map((cmd) => (
            <div
              key={cmd.title}
              onClick={() => handleNavigate(cmd.route)}
              className="flex items-center space-x-3 p-2.5 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-950/60 hover:text-teal-700 dark:hover:text-teal-300 cursor-pointer transition-colors"
            >
              <div className="text-slate-400">{cmd.icon}</div>
              <span className="font-semibold text-slate-900 dark:text-white flex-1">{cmd.title}</span>
              <span className="text-[10px] font-mono text-slate-400">{cmd.route}</span>
            </div>
          ))}
        </div>
      </div>
    </ModalDialog>
  );
}
