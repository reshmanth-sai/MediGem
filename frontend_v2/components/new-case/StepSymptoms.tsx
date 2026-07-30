"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { TextField, Textarea } from "@/components/ui/Input";

const COMMON_SYMPTOMS = [
  "Chest tightness",
  "Palpitations",
  "Shortness of breath",
  "Severe headache",
  "High fever",
  "Abdominal pain",
  "Dizziness",
  "Nausea",
  "Cough",
  "Fatigue",
];

export function StepSymptoms({
  symptoms,
  duration,
  severity,
  notes,
  onChange,
}: {
  symptoms: string[];
  duration: string;
  severity: string;
  notes: string;
  onChange: (field: string, val: any) => void;
}) {
  const [inputVal, setInputVal] = useState("");

  const addSymptom = (sym: string) => {
    if (sym && !symptoms.includes(sym)) {
      onChange("symptoms", [...symptoms, sym]);
      setInputVal("");
    }
  };

  const removeSymptom = (sym: string) => {
    onChange(
      "symptoms",
      symptoms.filter((s) => s !== sym)
    );
  };

  return (
    <Card className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Step 2: Presenting Symptoms & Onset Details
        </h3>
        <p className="text-xs text-slate-500">
          Select or enter presenting symptoms, onset duration, and severity level
        </p>
      </div>

      <div className="space-y-3">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Select Common Symptoms or Add Custom
        </label>
        <div className="flex flex-wrap gap-2">
          {COMMON_SYMPTOMS.map((sym) => {
            const isSelected = symptoms.includes(sym);
            return (
              <button
                key={sym}
                onClick={() => (isSelected ? removeSymptom(sym) : addSymptom(sym))}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                  isSelected
                    ? "bg-teal-600 text-white border-teal-600"
                    : "bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-teal-600"
                }`}
              >
                {sym} {isSelected ? "✓" : "+"}
              </button>
            );
          })}
        </div>

        <div className="flex space-x-2 pt-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSymptom(inputVal);
              }
            }}
            placeholder="Type custom symptom and press Enter..."
            className="flex-1 h-9 px-3 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 dark:text-white"
          />
          <button
            onClick={() => addSymptom(inputVal)}
            className="px-3 py-1.5 bg-teal-600 text-white text-xs font-semibold rounded-md hover:bg-teal-700 transition-colors flex items-center space-x-1"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add</span>
          </button>
        </div>

        {symptoms.length > 0 && (
          <div className="pt-2">
            <span className="text-xs font-semibold text-slate-500 block mb-2">
              Selected Symptoms ({symptoms.length}):
            </span>
            <div className="flex flex-wrap gap-2">
              {symptoms.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1 bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 rounded-full border border-teal-300 dark:border-teal-800 font-semibold"
                >
                  {s}
                  <button onClick={() => removeSymptom(s)} className="hover:text-red-600">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField
          label="Symptom Duration / Onset"
          value={duration}
          onChange={(e) => onChange("duration", e.target.value)}
          placeholder="e.g. 2 hours ago, 3 days"
        />
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Severity Rating
          </label>
          <select
            value={severity}
            onChange={(e) => onChange("severity", e.target.value)}
            className="w-full h-10 px-3 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 dark:text-white"
          >
            <option value="Mild">Mild</option>
            <option value="Moderate">Moderate</option>
            <option value="Severe">Severe</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      <Textarea
        label="Additional Symptom Notes"
        value={notes}
        onChange={(e) => onChange("notes", e.target.value)}
        placeholder="Enter detailed description of symptom progression or aggravating factors..."
        rows={3}
      />
    </Card>
  );
}
