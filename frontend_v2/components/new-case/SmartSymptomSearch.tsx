"use client";

import React, { useState } from "react";
import { Plus, X, Layers } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { H3, BodySm, Label } from "@/components/ui/Typography";

export interface SmartSymptomSearchErrors {
  symptoms?: string;
  duration?: string;
  severity?: string;
}

export interface SmartSymptomSearchProps {
  symptoms: string[];
  /**
   * Receives the complete next list rather than a useState updater. The draft
   * store's updateSymptoms takes a patch, not a SetStateAction, so a plain
   * callback is the shape both a store and a local useState can satisfy.
   */
  onSymptomsChange: (next: string[]) => void;
  duration: string;
  onDurationChange: (val: string) => void;
  severity: string;
  onSeverityChange: (val: string) => void;
  errors?: SmartSymptomSearchErrors;
  onBlurField?: (field: "symptoms" | "duration" | "severity") => void;
}

const COMMON_PRESET_SYMPTOMS = [
  { title: "Chest tightness", synonyms: ["chest pain", "angina", "substernal pressure"] },
  { title: "Palpitations", synonyms: ["racing heart", "tachycardia", "pounding chest"] },
  { title: "Shortness of breath", synonyms: ["dyspnea", "breathlessness", "air hunger"] },
  { title: "Severe headache", synonyms: ["migraine", "cephalea", "throbbing head"] },
  { title: "High fever", synonyms: ["pyrexia", "feverish", "chills", "rigors"] },
  { title: "Abdominal pain", synonyms: ["stomach ache", "belly pain", "epigastric pain"] },
  { title: "Dizziness", synonyms: ["lightheadedness", "vertigo", "unsteady"] },
  { title: "Nausea and vomiting", synonyms: ["emesis", "upset stomach", "queasy"] },
];

const SEVERITY_OPTIONS = [
  { value: "Mild", label: "Mild clinical severity" },
  { value: "Moderate", label: "Moderate severity" },
  { value: "Severe", label: "Severe or high distress" },
  { value: "Critical", label: "Critical emergency severity" },
];

const CONTROL_CLASS =
  "w-full h-11 px-3 text-body-sm bg-surface border border-rule-strong rounded-control text-ink placeholder:text-ink-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus transition-colors";

export function SmartSymptomSearch({
  symptoms,
  onSymptomsChange,
  duration,
  onDurationChange,
  severity,
  onSeverityChange,
  errors,
  onBlurField,
}: SmartSymptomSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const matchingPresets = COMMON_PRESET_SYMPTOMS.filter((s) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      s.title.toLowerCase().includes(term) ||
      s.synonyms.some((syn) => syn.toLowerCase().includes(term))
    );
  });

  const toggleSymptom = (sym: string) => {
    onSymptomsChange(
      symptoms.includes(sym)
        ? symptoms.filter((item) => item !== sym)
        : [...symptoms, sym]
    );
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const candidate = searchTerm.trim();
    if (candidate && !symptoms.includes(candidate)) {
      onSymptomsChange([...symptoms, candidate]);
      setSearchTerm("");
    }
  };

  return (
    <Card className="space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-rule">
        <span className="p-2.5 rounded-control bg-action-subtle text-action border border-rule">
          <Layers className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="space-y-1">
          <H3>Step 2: Presenting symptoms and clinical onset</H3>
          <BodySm className="text-ink-muted">
            Search symptoms by name or medical synonym, or pick from the common
            clinical presentations below.
          </BodySm>
        </div>
      </div>

      <form onSubmit={handleAddCustom} className="space-y-3">
        <Field
          id="symptoms"
          label="Symptoms"
          required
          helper="Type a symptom and press Enter to add it, or choose from the presets below. At least one symptom is required."
          error={errors?.symptoms}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onBlur={() => onBlurField?.("symptoms")}
            placeholder="chest, dyspnea, fever, vertigo"
            className={CONTROL_CLASS}
          />
        </Field>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 h-11 px-4 rounded-control bg-action text-on-action text-body-sm font-semibold hover:bg-action-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus transition-colors"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Add symptom</span>
        </button>
      </form>

      {symptoms.length > 0 && (
        <div className="space-y-2 p-3 rounded-card bg-surface-raised border border-rule">
          <Label as="p">Selected clinical symptoms ({symptoms.length})</Label>
          {/*
            Every selected symptom is always rendered. The row wraps rather
            than clipping to a fixed height, so no value is ever hidden behind
            a truncation the clinician cannot see or open.
          */}
          <ul className="flex flex-wrap gap-1.5 list-none p-0 m-0">
            {symptoms.map((sym) => (
              <li key={sym}>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-chip bg-action text-on-action text-body-sm font-semibold">
                  <span>{sym}</span>
                  <button
                    type="button"
                    onClick={() => toggleSymptom(sym)}
                    aria-label={`Remove ${sym}`}
                    className="rounded-chip focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-2">
        <Label as="p" id="preset-symptoms-label">
          Common symptom presentations
        </Label>
        <div
          role="group"
          aria-labelledby="preset-symptoms-label"
          className="flex flex-wrap gap-2"
        >
          {matchingPresets.map((s) => {
            const isSelected = symptoms.includes(s.title);
            return (
              <button
                key={s.title}
                type="button"
                aria-pressed={isSelected}
                onClick={() => toggleSymptom(s.title)}
                className={`px-3 py-2 rounded-control border text-body-sm font-semibold transition-colors flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
                  isSelected
                    ? "bg-action text-on-action border-action"
                    : "bg-surface-raised border-rule text-ink hover:border-rule-strong"
                }`}
              >
                <span>{s.title}</span>
                {isSelected ? (
                  <X className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Plus className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            );
          })}
          {matchingPresets.length === 0 && (
            <BodySm className="text-ink-muted">
              No preset matches that search. Press Enter to add it as a custom
              symptom.
            </BodySm>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-rule">
        <Field
          id="duration"
          label="Symptom duration or onset"
          required
          error={errors?.duration}
          helper="How long the symptoms have been present, for example 2 hours or 3 days."
        >
          <input
            type="text"
            value={duration}
            onChange={(e) => onDurationChange(e.target.value)}
            onBlur={() => onBlurField?.("duration")}
            className={CONTROL_CLASS}
          />
        </Field>

        <Field
          id="severity"
          label="Severity rating"
          required
          error={errors?.severity}
          helper="How distressing the symptoms are right now."
        >
          <select
            value={severity}
            onChange={(e) => onSeverityChange(e.target.value)}
            onBlur={() => onBlurField?.("severity")}
            className={CONTROL_CLASS}
          >
            <option value="">Select a severity</option>
            {SEVERITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
    </Card>
  );
}
