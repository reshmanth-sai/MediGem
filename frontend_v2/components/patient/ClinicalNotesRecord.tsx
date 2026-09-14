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
        <h2 className="text-base sm:text-lg font-bold text-ink">Clinical Notes</h2>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-body-sm text-ink-muted hover:text-ink font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="text-body-sm text-action hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              Save
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-body-sm font-medium text-action hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Edit</span>
          </button>
        )}
      </div>

      {/* Chief Complaint */}
      <div>
        <h3 className="text-body-sm font-bold text-ink">
          Chief Complaint
        </h3>
        <p className="text-body-sm text-ink mt-1 leading-relaxed">
          {chiefComplaint}
        </p>
      </div>

      {/* History of Present Illness */}
      <div>
        <h3 className="text-body-sm font-bold text-ink">
          History of Present Illness
        </h3>
        {isEditing ? (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full mt-1.5 p-3 border border-rule rounded-card text-body-sm text-ink bg-surface-sunken leading-relaxed focus:border-action focus:outline-none focus:ring-1 focus:ring-action"
            aria-label="Edit history of present illness"
          />
        ) : (
          <p className="text-body-sm text-ink mt-1 leading-relaxed">
            {notes}
          </p>
        )}
      </div>
    </div>
  );
}
