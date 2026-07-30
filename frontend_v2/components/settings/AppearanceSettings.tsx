"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <Card className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Appearance & Visual Theme
        </h3>
        <p className="text-xs text-slate-500">
          Select interface theme, color density, and font scaling preferences
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { id: "light", label: "Light Theme", icon: <Sun className="h-5 w-5 text-amber-500" /> },
          { id: "dark", label: "Dark Theme", icon: <Moon className="h-5 w-5 text-teal-400" /> },
          { id: "system", label: "System Theme", icon: <Monitor className="h-5 w-5 text-slate-400" /> },
        ].map((th) => (
          <button
            key={th.id}
            onClick={() => setTheme(th.id)}
            className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-2 text-xs font-semibold transition-all ${
              theme === th.id
                ? "bg-teal-50 dark:bg-teal-950 border-teal-600 text-teal-900 dark:text-teal-200"
                : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            {th.icon}
            <span>{th.label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}
