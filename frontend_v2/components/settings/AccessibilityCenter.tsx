"use client";

import React, { useState } from "react";
import { Eye, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function AccessibilityCenter() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);

  return (
    <Card className="space-y-4">
      <div className="flex items-center space-x-2">
        <Eye className="h-5 w-5 text-teal-600 dark:text-teal-400" />
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            WCAG AA Accessibility Center
          </h3>
          <p className="text-xs text-slate-500">
            Configure accessibility preferences for screen readers, high contrast, and reduced motion
          </p>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        {[
          { label: "Respect Reduced Motion Preferences", state: reducedMotion, setFn: setReducedMotion, desc: "Disables non-essential Framer Motion animations" },
          { label: "High Contrast Mode", state: highContrast, setFn: setHighContrast, desc: "Increases contrast ratios for low-light conditions" },
          { label: "Large Text & High Legibility", state: largeText, setFn: setLargeText, desc: "Scales font size for healthcare workers in low-resource clinics" },
        ].map((item) => (
          <div
            key={item.label}
            onClick={() => item.setFn(!item.state)}
            className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer select-none"
          >
            <div>
              <p className="font-bold text-slate-900 dark:text-white">{item.label}</p>
              <p className="text-[11px] text-slate-500">{item.desc}</p>
            </div>
            <div className={`h-5 w-5 rounded flex items-center justify-center border ${item.state ? "bg-teal-600 border-teal-600 text-white" : "border-slate-300"}`}>
              {item.state && <Check className="h-3.5 w-3.5" />}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
