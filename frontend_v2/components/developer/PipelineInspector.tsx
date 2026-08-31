"use client";

import React, { useState } from "react";
import { ChevronRight, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Section } from "@/components/ui/Card";
import { Label, BodySm } from "@/components/ui/Typography";

const PIPELINE_STAGES = [
  { id: 1, name: "1. Patient Input Processing", status: "VALIDATED", latency: "0.12ms", details: "Pydantic v2 patient data validation" },
  { id: 2, name: "2. Emergency Safety Engine", status: "INTERCEPTED (under 0.3ms)", latency: "0.28ms", details: "Evaluated 11 rule groups & 12 synonym groups" },
  { id: 3, name: "3. PyMuPDF OCR & Image Blur", status: "PROVENANCE HIGH", latency: "140ms", details: "Extracted PDF text layer & OpenCV blur score" },
  { id: 4, name: "4. Context Fusion Engine", status: "MERGED", latency: "8.5ms", details: "Merged vitals, symptoms & document extractions" },
  { id: 5, name: "5. System Prompt Composer", status: "COMPOSED", latency: "1.2ms", details: "Formulated clinical instruction context" },
  { id: 6, name: "6. Gemma 3 4B Local LLM", status: "INFERRED", latency: "5200ms", details: "Ollama local edge reasoning execution" },
  { id: 7, name: "7. Pydantic Output Guard", status: "PASSED", latency: "2.1ms", details: "Enforced JSON output schema contract" },
  { id: 8, name: "8. Clinical Report Builder", status: "GENERATED", latency: "15ms", details: "Built clinical summary & referral memorandum" },
];

export function PipelineInspector() {
  const [selectedStage, setSelectedStage] = useState(PIPELINE_STAGES[0]);

  return (
    <Section
      heading={
        <span className="inline-flex items-center gap-2">
          <Terminal className="h-4 w-4 text-ink-muted shrink-0" aria-hidden="true" />
          8-Stage AI Pipeline Inspector
        </span>
      }
      headingAs="h3"
      headingAdornment={<Label>Total latency 5.36s</Label>}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <ul className="space-y-1" role="list">
          {PIPELINE_STAGES.map((stage) => {
            const isSelected = selectedStage.id === stage.id;
            return (
              <li key={stage.id}>
                <button
                  type="button"
                  onClick={() => setSelectedStage(stage)}
                  aria-pressed={isSelected}
                  className={cn(
                    "w-full p-2.5 rounded-control border text-body-sm text-left transition-colors flex items-center justify-between gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                    isSelected
                      ? "bg-action-subtle text-action border-action/40 font-semibold"
                      : "bg-surface text-ink border-rule hover:bg-surface-raised"
                  )}
                >
                  <span className="truncate">{stage.name}</span>
                  <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>

        <div
          className="md:col-span-2 p-4 rounded-card bg-surface-raised border border-rule space-y-3"
          aria-live="polite"
        >
          <div className="flex items-center justify-between gap-3 border-b border-rule pb-2">
            <h4 className="text-h3 text-ink">{selectedStage.name}</h4>
            <span className="font-mono tabular text-body-sm text-ink-muted shrink-0">
              {selectedStage.latency}
            </span>
          </div>
          <BodySm className="text-ink-muted">{selectedStage.details}</BodySm>
          <p className="font-mono text-body-sm text-ink">
            <span className="text-ink-muted">Status: </span>
            {selectedStage.status}
          </p>
        </div>
      </div>
    </Section>
  );
}
