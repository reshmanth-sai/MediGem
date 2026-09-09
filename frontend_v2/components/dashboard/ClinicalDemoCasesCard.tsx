"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClinicalPresetItem {
  id: string;
  name: string;
  demographics: string;
  complaint: string;
  priority: "emergency" | "moderate" | "low";
  initials: string;
  href: string;
}

const PRESET_CASES: ClinicalPresetItem[] = [
  {
    id: "DEMO-ACUTE-CARDIAC",
    name: "Sunita Devi",
    demographics: "62 F · Rampur",
    complaint: "Acute chest pain & diaphoresis",
    priority: "emergency",
    initials: "SD",
    href: "/results/DEMO-ACUTE-CARDIAC",
  },
  {
    id: "CASE-8901",
    name: "Lakshmi Ammal",
    demographics: "62 F · Kovilpatti",
    complaint: "Hypertension & blurred vision",
    priority: "moderate",
    initials: "LA",
    href: "/results/CASE-8901",
  },
  {
    id: "DEMO-ECG",
    name: "Ramesh Kumar",
    demographics: "45 M · Salem Sector",
    complaint: "Palpitations & dyspnea (ECG)",
    priority: "moderate",
    initials: "RK",
    href: "/results/DEMO-ECG",
  },
  {
    id: "DEMO-LAB-CBC",
    name: "Rajesh Gupta",
    demographics: "38 M · Tirunelveli",
    complaint: "Severe microcytic anemia (CBC)",
    priority: "low",
    initials: "RG",
    href: "/results/DEMO-LAB-CBC",
  },
  {
    id: "DEMO-WOUND",
    name: "Priya Sundaram",
    demographics: "29 F · Rampur",
    complaint: "Post-op wound erythema",
    priority: "moderate",
    initials: "PS",
    href: "/results/DEMO-WOUND",
  },
  {
    id: "DEMO-PRESCRIPTION",
    name: "Anand Verma",
    demographics: "54 M · Block 2",
    complaint: "Prescription dosage check",
    priority: "low",
    initials: "AV",
    href: "/results/DEMO-PRESCRIPTION",
  },
];

export function ClinicalDemoCasesCard() {
  return (
    <section className="border-t border-rule pt-5 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between gap-4 pb-3 border-b border-rule">
          <div>
          <h2 className="text-h3 text-ink">Clinical registry</h2>
          <p className="text-body-sm text-ink-muted mt-1">
              Select any verified patient dossier to review clinical telemetry
            </p>
          </div>
          <Link
            href="/history"
            className="text-body-sm font-semibold text-action hover:underline shrink-0"
          >
            All cases →
          </Link>
        </div>

        <ul className="mt-3 divide-y divide-rule" role="list">
          {PRESET_CASES.map((item) => {
            const isEmergency = item.priority === "emergency";
            const isModerate = item.priority === "moderate";

            return (
              <li key={item.id} className="py-2.5 first:pt-0 last:pb-0">
                <Link
                  href={item.href as any}
                  className="flex items-center justify-between gap-3 group py-2 -mx-0 hover:bg-lavender/35 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-body-sm font-semibold text-ink truncate group-hover:text-action transition-colors">
                          {item.name}
                        </p>
                        <span className="text-label normal-case text-ink-muted shrink-0">
                          {item.demographics}
                        </span>
                      </div>
                      <p className="text-body-sm text-ink-muted truncate mt-0.5">
                        {item.complaint}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={cn("text-label normal-case font-semibold", isEmergency ? "text-risk-emergency" : isModerate ? "text-risk-high" : "text-risk-low")}>
                      {item.priority}
                    </span>
                    <ChevronRight
                      className="h-4 w-4 text-ink-muted group-hover:text-action group-hover:translate-x-0.5 transition-all"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
