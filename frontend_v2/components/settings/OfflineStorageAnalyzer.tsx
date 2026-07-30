"use client";

import React, { useState } from "react";
import { HardDrive, Database, Download, Trash2, RefreshCw, CheckCircle2 } from "lucide-react";

export function OfflineStorageAnalyzer() {
  const [cleared, setCleared] = useState(false);

  const handleClear = () => {
    setCleared(true);
    setTimeout(() => setCleared(false), 3000);
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-6 shadow-xl">
      <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
        <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
          <HardDrive className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-white">Offline Storage & Local Database Analyzer</h2>
          <p className="text-xs text-slate-400">Manage edge storage quota, SQLite patient database, and offline backups.</p>
        </div>
      </div>

      {/* Storage Breakdown Gauge Bar */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 font-bold">Local Edge Volume:</span>
          <span className="text-teal-300 font-bold">14.2 GB Free / 64 GB</span>
        </div>

        <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden flex border border-slate-800">
          <div className="bg-teal-400 h-full" style={{ width: "12%" }} title="Patient Records: 4.2 MB" />
          <div className="bg-emerald-400 h-full" style={{ width: "18%" }} title="Lab PDFs: 48.5 MB" />
          <div className="bg-amber-400 h-full" style={{ width: "8%" }} title="ECG Strips: 12.8 MB" />
          <div className="bg-slate-700 h-full" style={{ width: "62%" }} title="Free Storage: 14.2 GB" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] font-mono text-slate-400">
          <div className="flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-teal-400" />
            <span>Cases (4.2 MB)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Lab PDFs (48.5 MB)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span>ECGs (12.8 MB)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-700" />
            <span>Free Volume (14.2 GB)</span>
          </div>
        </div>
      </div>

      {/* Storage Maintenance Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={handleClear}
          className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 transition-colors flex items-center justify-center space-x-2"
        >
          <Trash2 className="h-4 w-4 text-rose-400" />
          <span>{cleared ? "Cache Cleared!" : "Clear Temp Cache"}</span>
        </button>

        <button className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 transition-colors flex items-center justify-center space-x-2">
          <RefreshCw className="h-4 w-4 text-teal-400" />
          <span>Optimize SQLite DB</span>
        </button>

        <button className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 transition-colors flex items-center justify-center space-x-2">
          <Download className="h-4 w-4 text-emerald-400" />
          <span>Export Local DB</span>
        </button>
      </div>
    </div>
  );
}
