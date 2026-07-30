"use client";

import React, { useState } from "react";
import { ShieldCheck, Lock, FileCheck, WifiOff, Key, Clock } from "lucide-react";

export function PrivacySecurityCenter() {
  const [autoLockTimeout, setAutoLockTimeout] = useState("15");

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-6 shadow-xl">
      <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
        <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-white">Privacy & Security Control Center</h2>
          <p className="text-xs text-slate-400">Local data encryption, air-gap network isolation, and audit trail status.</p>
        </div>
      </div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-3">
          <Lock className="h-5 w-5 text-emerald-400 shrink-0" />
          <div>
            <p className="text-xs font-bold text-white">AES-256 Edge Encryption</p>
            <p className="text-[11px] text-slate-400">Patient database encrypted at rest on local volume.</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-3">
          <WifiOff className="h-5 w-5 text-emerald-400 shrink-0" />
          <div>
            <p className="text-xs font-bold text-white">Zero Cloud Data Leakage</p>
            <p className="text-[11px] text-slate-400">100% offline air-gapped execution. No external telemetry.</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-3">
          <FileCheck className="h-5 w-5 text-teal-400 shrink-0" />
          <div>
            <p className="text-xs font-bold text-white">Clinical Audit Logging Active</p>
            <p className="text-[11px] text-slate-400">Every AI inference and human override is logged locally.</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-3">
          <Key className="h-5 w-5 text-teal-400 shrink-0" />
          <div>
            <p className="text-xs font-bold text-white">Role-Based Access Control</p>
            <p className="text-[11px] text-slate-400">ANM / CHO Clinician credentials verified.</p>
          </div>
        </div>
      </div>

      {/* PIN & Auto-Lock Timeout */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-teal-400" /> Auto-Lock Session Timeout:
          </span>
          <select
            value={autoLockTimeout}
            onChange={(e) => setAutoLockTimeout(e.target.value)}
            className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-teal-300 font-bold focus:outline-none"
          >
            <option value="5">5 Minutes</option>
            <option value="15">15 Minutes (Default)</option>
            <option value="30">30 Minutes</option>
            <option value="never">Never (Shift Mode)</option>
          </select>
        </div>
        <p className="text-[11px] text-slate-400">
          Locks clinician workstation after inactivity to prevent unauthorized access in shared sub-center spaces.
        </p>
      </div>
    </div>
  );
}
