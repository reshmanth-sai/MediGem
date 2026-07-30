"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Activity, History, FileText, Award, Terminal, Settings } from "lucide-react";
import { ModalDialog } from "@/components/ui/Dialog";

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const commands = [
    { label: "New Clinical Case", path: "/new-case", icon: <Activity className="h-4 w-4" /> },
    { label: "View Case History", path: "/history", icon: <History className="h-4 w-4" /> },
    { label: "Load Demo Presets", path: "/demo", icon: <FileText className="h-4 w-4" /> },
    { label: "Judge Evaluation Dashboard", path: "/evaluation", icon: <Award className="h-4 w-4" /> },
    { label: "Developer Inspector", path: "/developer", icon: <Terminal className="h-4 w-4" /> },
    { label: "Settings & Configurations", path: "/settings", icon: <Settings className="h-4 w-4" /> },
  ];

  const filtered = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  const navigate = (path: string) => {
    setIsOpen(false);
    setSearch("");
    router.push(path);
  };

  return (
    <ModalDialog isOpen={isOpen} onClose={() => setIsOpen(false)} title="⌘K Command Palette">
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command or search workspace..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
            autoFocus
          />
        </div>

        <div className="space-y-1 max-h-60 overflow-y-auto">
          {filtered.length > 0 ? (
            filtered.map((cmd) => (
              <button
                key={cmd.path}
                onClick={() => navigate(cmd.path)}
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-slate-800 hover:text-teal-700 rounded-md transition-colors text-left"
              >
                {cmd.icon}
                <span>{cmd.label}</span>
              </button>
            ))
          ) : (
            <p className="text-xs text-slate-400 p-3 text-center">No matching commands found.</p>
          )}
        </div>
      </div>
    </ModalDialog>
  );
}
