"use client";

import React, { useState } from "react";
import { ShieldCheck, Lock, FileCheck, WifiOff, Key } from "lucide-react";
import { H2, BodySm } from "@/components/ui/Typography";
import { Field } from "@/components/ui/Field";

const SELECT_CLASS =
  "w-full sm:w-auto h-11 px-3 text-body-sm bg-surface border border-rule-strong rounded-control text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus transition-colors";

export function PrivacySecurityCenter() {
  const [autoLockTimeout, setAutoLockTimeout] = useState("15");

  return (
    <div className="clinical-panel bg-surface border border-rule p-5 space-y-5">
      <div className="flex items-center space-x-3 pb-3 border-b border-rule">
        <div className="p-2 rounded-[2px] bg-action-subtle text-action border border-rule">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <H2>Privacy & Security Protocol Matrix</H2>
          <BodySm className="text-ink-muted">
            Local data encryption, air-gap network isolation, and audit trail status.
          </BodySm>
        </div>
      </div>

      {/* Security Protocol Matrix (Continuous Ledger) */}
      <div className="divide-y divide-rule border border-rule bg-surface-raised/40 rounded-[2px]">
        <div className="p-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Lock className="h-4 w-4 text-risk-low shrink-0" aria-hidden="true" />
            <div>
              <p className="text-body-sm font-bold text-ink">AES-256 Edge Encryption</p>
              <BodySm className="text-ink-muted">Patient database encrypted at rest on local volume.</BodySm>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-[2px] bg-risk-low/10 text-risk-low border border-risk-low/30 shrink-0">
            ENCRYPTED
          </span>
        </div>

        <div className="p-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <WifiOff className="h-4 w-4 text-risk-low shrink-0" aria-hidden="true" />
            <div>
              <p className="text-body-sm font-bold text-ink">Zero Cloud Data Leakage</p>
              <BodySm className="text-ink-muted">100% offline air-gapped execution. No external telemetry.</BodySm>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-[2px] bg-risk-low/10 text-risk-low border border-risk-low/30 shrink-0">
            AIR-GAP ACTIVE
          </span>
        </div>

        <div className="p-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FileCheck className="h-4 w-4 text-action shrink-0" aria-hidden="true" />
            <div>
              <p className="text-body-sm font-bold text-ink">Clinical Audit Logging Active</p>
              <BodySm className="text-ink-muted">Every clinical assessment and clinician override is logged locally.</BodySm>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-[2px] bg-action-subtle text-action border border-action/30 shrink-0">
            AUDIT LOGGED
          </span>
        </div>

        <div className="p-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Key className="h-4 w-4 text-action shrink-0" aria-hidden="true" />
            <div>
              <p className="text-body-sm font-bold text-ink">Role-Based Access Control</p>
              <BodySm className="text-ink-muted">ANM / CHO Clinician credentials verified.</BodySm>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-[2px] bg-action-subtle text-action border border-action/30 shrink-0">
            RBAC VERIFIED
          </span>
        </div>
      </div>

      {/* PIN & Auto-Lock Timeout */}
      <div className="p-4 rounded-[2px] bg-surface-raised/50 border border-rule">
        <Field
          id="auto-lock-timeout"
          label="Auto-lock session timeout"
          helper="Locks clinician workstation after inactivity to prevent unauthorized access in shared sub-center spaces."
        >
          <select value={autoLockTimeout} onChange={(e) => setAutoLockTimeout(e.target.value)} className={SELECT_CLASS}>
            <option value="5">5 Minutes</option>
            <option value="15">15 Minutes (Default)</option>
            <option value="30">30 Minutes</option>
            <option value="never">Never (Shift Mode)</option>
          </select>
        </Field>
      </div>
    </div>
  );
}
