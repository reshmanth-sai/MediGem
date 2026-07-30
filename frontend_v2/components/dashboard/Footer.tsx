import React from "react";
import { ShieldCheck, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-xs text-slate-500 dark:text-slate-400 mt-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-900 dark:text-white">💎 MediGem v2.0.0</span>
          <span>•</span>
          <span className="flex items-center text-teal-600 dark:text-teal-400 font-medium">
            <ShieldCheck className="h-3.5 w-3.5 mr-1" /> 100% Offline Clinical SaaS
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <a
            href="https://github.com/reshmanth-sai/MediGem"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <Github className="h-4 w-4" />
            <span>GitHub Repository</span>
          </a>
          <span>•</span>
          <span>MIT License</span>
        </div>
      </div>
    </footer>
  );
}
