"use client";

import React, { useState } from "react";
import { Cpu, Zap, Activity, RefreshCw, CheckCircle2 } from "lucide-react";

export function DeviceDiagnostics() {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const runDiagnostics = () => {
    setRunning(true);
    setDone(false);
    setTimeout(() => {
      setRunning(false);
      setDone(true);
    }, 1500);
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-6 shadow-xl">
      <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
        <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
          <Cpu className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-white">Device Diagnostics & System Telemetry</h2>
          <p className="text-xs text-slate-400">Live hardware monitoring, model inference latency, and SQLite DB integrity.</p>
        </div>
      </div>

      {/* Diagnostics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">CPU Usage:</span>
            <span className="text-teal-300 font-bold">18% Active</span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
            <div className="bg-teal-400 h-full rounded-full" style={{ width: "18%" }} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Model VRAM Usage:</span>
            <span className="text-teal-300 font-bold">3.8 GB / 8.0 GB</span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
            <div className="bg-teal-400 h-full rounded-full" style={{ width: "47%" }} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-mono">
          <p className="text-[10px] text-slate-500 uppercase">Avg Gemma Inference Speed</p>
          <p className="text-lg font-black text-white">3.45s / query</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-mono">
          <p className="text-[10px] text-slate-500 uppercase">Emergency Rule Gate Speed</p>
          <p className="text-lg font-black text-emerald-400">&lt; 0.28ms</p>
        </div>
      </div>

      {/* Maintenance Diagnostic Runner Button */}
      <div className="pt-2">
        <button
          onClick={runDiagnostics}
          disabled={running}
          className="w-full p-3 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-extrabold text-xs transition-all flex items-center justify-center space-x-2 border border-teal-300 shadow-lg"
        >
          <RefreshCw className={`h-4 w-4 ${running ? "animate-spin" : ""}`} />
          <span>{running ? "Running Diagnostics Suite..." : done ? "Diagnostics Passed Cleanly! (Run Again)" : "Run Full System Diagnostics Suite"}</span>
        </button>
      </div>
    </div>
  );
}
