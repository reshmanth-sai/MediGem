"use client";

import React, { useState } from "react";
import { Search, Plus, X, Sparkles, Layers, Activity } from "lucide-react";

interface SmartSymptomSearchProps {
  symptoms: string[];
  setSymptoms: React.Dispatch<React.SetStateAction<string[]>>;
  duration: string;
  setDuration: (val: string) => void;
  severity: string;
  setSeverity: (val: string) => void;
}

export function SmartSymptomSearch({
  symptoms,
  setSymptoms,
  duration,
  setDuration,
  severity,
  setSeverity,
}: SmartSymptomSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const commonPresetSymptoms = [
    { title: "Chest tightness", synonyms: ["chest pain", "angina", "substernal pressure"] },
    { title: "Palpitations", synonyms: ["racing heart", "tachycardia", "pounding chest"] },
    { title: "Shortness of breath", synonyms: ["dyspnea", "breathlessness", "air hunger"] },
    { title: "Severe headache", synonyms: ["migraine", "cephalea", "throbbing head"] },
    { title: "High fever", synonyms: ["pyrexia", "feverish", "chills", "rigors"] },
    { title: "Abdominal pain", synonyms: ["stomach ache", "belly pain", "epigastric pain"] },
    { title: "Dizziness", synonyms: ["lightheadedness", "vertigo", "unsteady"] },
    { title: "Nausea & vomiting", synonyms: ["emesis", "upset stomach", "queasy"] },
  ];

  // Filter symptoms by term or medical synonyms
  const matchingPresets = commonPresetSymptoms.filter((s) => {
    const term = searchTerm.toLowerCase();
    if (!term) return true;
    return (
      s.title.toLowerCase().includes(term) ||
      s.synonyms.some((syn) => syn.toLowerCase().includes(term))
    );
  });

  const toggleSymptom = (sym: string) => {
    setSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((item) => item !== sym) : [...prev, sym]
    );
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() && !symptoms.includes(searchTerm.trim())) {
      setSymptoms((prev) => [...prev, searchTerm.trim()]);
      setSearchTerm("");
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-5 shadow-xl">
      <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
        <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
          <Layers className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-white">Presenting Symptoms & Clinical Onset</h2>
          <p className="text-xs text-slate-400">Search symptoms with medical synonym recognition or select common clinical presentations.</p>
        </div>
      </div>

      {/* Spotlight-Style Symptom Command Search Bar */}
      <form onSubmit={handleAddCustom} className="space-y-2">
        <label className="text-xs font-bold text-slate-300 flex items-center justify-between font-mono">
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-teal-400" /> Spotlight Medical Symptom Search
          </span>
          <span className="text-[10px] text-slate-500">Press Enter to Add Custom</span>
        </label>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type symptom (e.g. 'chest', 'dyspnea', 'fever', 'vertigo')..."
            className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-medium transition-colors"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add</span>
          </button>
        </div>
      </form>

      {/* Selected Symptoms Chips */}
      {symptoms.length > 0 && (
        <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
          <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">Selected Clinical Symptoms ({symptoms.length})</p>
          <div className="flex flex-wrap gap-1.5">
            {symptoms.map((sym) => (
              <span
                key={sym}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-500 text-slate-950 text-xs font-extrabold shadow-sm"
              >
                <span>{sym}</span>
                <button type="button" onClick={() => toggleSymptom(sym)} className="hover:text-rose-900 transition-colors">
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Preset Symptom Chips */}
      <div className="space-y-2">
        <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">Common Symptom Presentations</p>
        <div className="flex flex-wrap gap-2">
          {matchingPresets.map((s) => {
            const isSelected = symptoms.includes(s.title);
            return (
              <button
                key={s.title}
                type="button"
                onClick={() => toggleSymptom(s.title)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-teal-500 text-slate-950 border-teal-400 font-extrabold shadow-md"
                    : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
                }`}
              >
                <span>{s.title}</span>
                {isSelected ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5 text-slate-500" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Onset Duration & Severity Rating */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300">Symptom Duration / Onset</label>
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g. 2 hours ago, 3 days"
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300">Severity Rating</label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-semibold"
          >
            <option value="Mild">Mild Clinical Severity</option>
            <option value="Moderate">Moderate Severity</option>
            <option value="Severe">Severe / High Distress</option>
            <option value="Critical">Critical Emergency Severity</option>
          </select>
        </div>
      </div>
    </div>
  );
}
