"use client";

import React, { useState } from "react";
import { Edit3, Check } from "lucide-react";

export interface ClinicalNotesRecordProps {
  initialNotes?: string;
  chiefComplaint?: string;
  onSave?: (notes: string) => void;
}

export function ClinicalNotesRecord({
  initialNotes = "Known case of hypertension for 4 years on irregular medication. Reports mild blurred vision and occipital headache for 2 days. No chest pain. No vomiting. Reports mild blurred vision. Appears conscious and oriented.",
  chiefComplaint = "Headache and dizziness reported for 2 days.",
  onSave,
}: ClinicalNotesRecordProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(initialNotes);

  const handleSave = () => {
    setIsEditing(false);
    onSave?.(notes);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-slate-900">Clinical Notes</h2>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              Save
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Edit</span>
          </button>
        )}
      </div>

      {/* Chief Complaint */}
      <div>
        <h3 className="text-xs sm:text-sm font-bold text-slate-900">
          Chief Complaint
        </h3>
        <p className="text-xs sm:text-sm text-slate-700 mt-1">
          {chiefComplaint}
        </p>
      </div>

      {/* History of Present Illness */}
      <div>
        <h3 className="text-xs sm:text-sm font-bold text-slate-900">
          History of Present Illness
        </h3>
        {isEditing ? (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full mt-1.5 p-3 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 leading-relaxed focus:border-blue-500 focus:outline-none"
            aria-label="Edit history of present illness"
          />
        ) : (
          <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
            {notes}
          </p>
        )}
      </div>
    </div>
  );
}
