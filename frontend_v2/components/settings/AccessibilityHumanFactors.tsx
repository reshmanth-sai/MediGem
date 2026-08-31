"use client";

import React, { useState } from "react";
import { Eye, Volume2 } from "lucide-react";
import { Field } from "@/components/ui/Field";
import { H2, BodySm } from "@/components/ui/Typography";
import { useAccessibility } from "@/hooks/useAccessibility";

/**
 * Real, app-wide accessibility preferences (reduced motion, high contrast,
 * large text), backed by providers/AccessibilityProvider.tsx: toggling one
 * sets a data attribute on <html>, which styles/globals.css keys off of, and
 * persists to localStorage so the choice survives a reload. This replaces a
 * prior version of this panel where these three toggles were pure local
 * useState with no effect anywhere else in the app.
 *
 * Offline audio triage assistance (text-to-speech) is out of scope for this
 * task: no audio engine exists yet to wire it to, so it stays local state
 * with its helper text saying so plainly, rather than presenting a fake
 * "on" state as if it did something.
 */
export function AccessibilityHumanFactors() {
  const { reducedMotion, setReducedMotion, highContrast, setHighContrast, largeText, setLargeText } =
    useAccessibility();
  const [voiceAssistance, setVoiceAssistance] = useState(false);

  return (
    <div className="rounded-card bg-surface border border-rule p-6 space-y-6">
      <div className="flex items-center space-x-3 pb-3 border-b border-rule">
        <div className="p-2.5 rounded-control bg-action-subtle text-action border border-rule">
          <Eye className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <H2>Accessibility & Clinical Human Factors (WCAG 2.2 AA)</H2>
          <BodySm className="text-ink-muted">
            Tailored UI readability preferences for long clinical shifts and low-resource environments.
          </BodySm>
        </div>
      </div>

      <div className="space-y-3">
        <div className="p-4 rounded-control bg-ground border border-rule">
          <Field
            id="reduced-motion"
            label="Reduce screen animations"
            helper="Disables non-essential transition and animation effects app-wide. Recommended for clinicians sensitive to motion or operating low-spec hardware. Applies immediately and survives reload."
          >
            <input
              type="checkbox"
              role="switch"
              className="ui-switch"
              checked={reducedMotion}
              onChange={(e) => setReducedMotion(e.target.checked)}
            />
          </Field>
        </div>

        <div className="p-4 rounded-control bg-ground border border-rule">
          <Field
            id="high-contrast"
            label="High contrast & outdoor visibility mode"
            helper="Increases border and muted-text contrast app-wide. Improves screen readability under direct sunlight in field health camps. Applies immediately and survives reload."
          >
            <input
              type="checkbox"
              role="switch"
              className="ui-switch"
              checked={highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
            />
          </Field>
        </div>

        <div className="p-4 rounded-control bg-ground border border-rule">
          <Field
            id="large-text"
            label="Large text & high-legibility type scale"
            helper="Scales the root font size up app-wide for rapid scanning during high-volume triage shifts. Applies immediately and survives reload."
          >
            <input
              type="checkbox"
              role="switch"
              className="ui-switch"
              checked={largeText}
              onChange={(e) => setLargeText(e.target.checked)}
            />
          </Field>
        </div>

        <div className="p-4 rounded-control bg-ground border border-rule">
          <Field
            id="voice-assistance"
            label={
              <span className="flex items-center gap-1.5">
                <Volume2 className="h-4 w-4 text-action" aria-hidden="true" />
                <span>Offline audio triage assistance</span>
              </span>
            }
            helper="Text-to-speech voice readouts for emergency alert intercepts and severe vitals warnings. Not yet wired to an audio engine; this preference does not do anything yet."
          >
            <input
              type="checkbox"
              role="switch"
              className="ui-switch"
              checked={voiceAssistance}
              onChange={(e) => setVoiceAssistance(e.target.checked)}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}
