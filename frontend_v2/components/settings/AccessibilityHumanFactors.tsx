"use client";

import React, { useState } from "react";
import { Eye, CheckCircle2, Sparkles, Volume2 } from "lucide-react";

export function AccessibilityHumanFactors() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [voiceAssistance, setVoiceAssistance] = useState(false);

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-6 shadow-xl">
      <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
        <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
          <Eye className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-white">Accessibility & Clinical Human Factors (WCAG 2.2 AA)</h2>
          <p className="text-xs text-slate-400">Tailored UI readability preferences for long clinical shifts and low-resource environments.</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Item 1: Reduced Motion */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div className="space-y-0.5 max-w-xl">
            <h4 className="text-xs font-bold text-white">Reduce Screen Animations</h4>
            <p className="text-xs text-slate-400">
              Disables non-essential transition animations. Recommended for clinicians sensitive to motion or operating low-spec hardware.
            </p>
          </div>
          <input
            type="checkbox"
            checked={reducedMotion}
            onChange={(e) => setReducedMotion(e.target.checked)}
            className="h-5 w-5 rounded bg-slate-900 border-slate-700 text-teal-400 focus:ring-teal-500 cursor-pointer"
          />
        </div>

        {/* Item 2: High Contrast */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div className="space-y-0.5 max-w-xl">
            <h4 className="text-xs font-bold text-white">High Contrast & Outdoor Visibility Mode</h4>
            <p className="text-xs text-slate-400">
              Increases border contrast ratios (7:1 WCAG AAA). Improves screen readability under direct sunlight in field health camps.
            </p>
          </div>
          <input
            type="checkbox"
            checked={highContrast}
            onChange={(e) => setHighContrast(e.target.checked)}
            className="h-5 w-5 rounded bg-slate-900 border-slate-700 text-teal-400 focus:ring-teal-500 cursor-pointer"
          />
        </div>

        {/* Item 3: Large Text */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div className="space-y-0.5 max-w-xl">
            <h4 className="text-xs font-bold text-white">Large Text & High-Legibility Type Scale</h4>
            <p className="text-xs text-slate-400">
              Scales default font size up by 15% and enforces bold font weights for rapid scanning during high-volume triage shifts.
            </p>
          </div>
          <input
            type="checkbox"
            checked={largeText}
            onChange={(e) => setLargeText(e.target.checked)}
            className="h-5 w-5 rounded bg-slate-900 border-slate-700 text-teal-400 focus:ring-teal-500 cursor-pointer"
          />
        </div>

        {/* Item 4: Offline Voice Assistance */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div className="space-y-0.5 max-w-xl">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Volume2 className="h-4 w-4 text-teal-400" />
              <span>Offline Audio Triage Assistance</span>
            </h4>
            <p className="text-xs text-slate-400">
              Provides text-to-speech voice readouts for emergency alert intercepts and severe vitals warnings.
            </p>
          </div>
          <input
            type="checkbox"
            checked={voiceAssistance}
            onChange={(e) => setVoiceAssistance(e.target.checked)}
            className="h-5 w-5 rounded bg-slate-900 border-slate-700 text-teal-400 focus:ring-teal-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
