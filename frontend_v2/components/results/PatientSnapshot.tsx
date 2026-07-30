"use client";

import React, { useState } from "react";
import { User, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function PatientSnapshot({
  patientId = "P-101",
  name = "Ramesh Kumar",
  age = 45,
  gender = "Male",
  vitals = "HR: 95 bpm | BP: 138/88 mmHg | Temp: 37.2°C | SpO2: 98%",
  complaint = "Patient presents in rural clinic with chest tightness and palpitations.",
}: {
  patientId?: string;
  name?: string;
  age?: number;
  gender?: string;
  vitals?: string;
  complaint?: string;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between cursor-pointer select-none" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 dark:text-white">
          <User className="h-4 w-4 text-teal-600" />
          <span>Patient Snapshot Overview ({name} • {patientId})</span>
        </div>
        <button className="text-slate-400 hover:text-slate-600">
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <p><span className="text-slate-500">Age / Gender:</span> <strong>{age}y/o {gender}</strong></p>
            <p><span className="text-slate-500">Baseline Vitals:</span> <strong>{vitals}</strong></p>
          </div>
          <div className="space-y-1">
            <p><span className="text-slate-500">Chief Complaint:</span> <strong>{complaint}</strong></p>
          </div>
        </div>
      )}
    </Card>
  );
}
