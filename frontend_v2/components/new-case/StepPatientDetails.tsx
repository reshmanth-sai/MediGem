"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { TextField, Textarea } from "@/components/ui/Input";

export interface PatientDetailsFormData {
  patientName: string;
  patientId: string;
  age: number;
  gender: string;
  weightKg?: number;
  heightCm?: number;
  hrBpm?: number;
  systolicBp?: number;
  diastolicBp?: number;
  tempCelsius?: number;
  spO2Percent?: number;
  chiefComplaint: string;
  location?: string;
}

export function StepPatientDetails({
  formData,
  onChange,
}: {
  formData: PatientDetailsFormData;
  onChange: (field: keyof PatientDetailsFormData, val: any) => void;
}) {
  return (
    <Card className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Step 1: Patient Demographics & Vital Signs
        </h3>
        <p className="text-xs text-slate-500">
          Enter patient identification, physical measurements, and baseline vital signs
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <TextField
          label="Full Patient Name *"
          value={formData.patientName}
          onChange={(e) => onChange("patientName", e.target.value)}
          placeholder="e.g. Ramesh Kumar"
        />
        <TextField
          label="Patient ID (Optional)"
          value={formData.patientId}
          onChange={(e) => onChange("patientId", e.target.value)}
          placeholder="e.g. P-101"
        />
        <TextField
          label="Location / Facility"
          value={formData.location || ""}
          onChange={(e) => onChange("location", e.target.value)}
          placeholder="e.g. Sub-Center Clinic A"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <TextField
          label="Age (Years) *"
          type="number"
          value={formData.age}
          onChange={(e) => onChange("age", Number(e.target.value))}
        />
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Gender *
          </label>
          <select
            value={formData.gender}
            onChange={(e) => onChange("gender", e.target.value)}
            className="w-full h-10 px-3 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 dark:text-white"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <TextField
          label="Weight (kg)"
          type="number"
          value={formData.weightKg || ""}
          onChange={(e) => onChange("weightKg", Number(e.target.value))}
          placeholder="70"
        />
        <TextField
          label="Height (cm)"
          type="number"
          value={formData.heightCm || ""}
          onChange={(e) => onChange("heightCm", Number(e.target.value))}
          placeholder="172"
        />
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <h4 className="text-xs font-bold uppercase text-slate-500 mb-3">Vital Signs Parameters</h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <TextField
            label="Heart Rate (bpm)"
            type="number"
            value={formData.hrBpm || ""}
            onChange={(e) => onChange("hrBpm", Number(e.target.value))}
            placeholder="95"
          />
          <TextField
            label="Systolic BP (mmHg)"
            type="number"
            value={formData.systolicBp || ""}
            onChange={(e) => onChange("systolicBp", Number(e.target.value))}
            placeholder="138"
          />
          <TextField
            label="Diastolic BP (mmHg)"
            type="number"
            value={formData.diastolicBp || ""}
            onChange={(e) => onChange("diastolicBp", Number(e.target.value))}
            placeholder="88"
          />
          <TextField
            label="Temp (°C)"
            type="number"
            step="0.1"
            value={formData.tempCelsius || ""}
            onChange={(e) => onChange("tempCelsius", Number(e.target.value))}
            placeholder="37.2"
          />
          <TextField
            label="SpO2 (%)"
            type="number"
            value={formData.spO2Percent || ""}
            onChange={(e) => onChange("spO2Percent", Number(e.target.value))}
            placeholder="98"
          />
        </div>
      </div>

      <Textarea
        label="Chief Complaint Summary *"
        value={formData.chiefComplaint}
        onChange={(e) => onChange("chiefComplaint", e.target.value)}
        placeholder="Brief summary of main reason for clinical consultation..."
        rows={3}
      />
    </Card>
  );
}
