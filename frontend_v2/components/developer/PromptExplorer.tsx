import React from "react";
import { Section } from "@/components/ui/Card";
import { BodySm } from "@/components/ui/Typography";

// The prompt files the backend composes from, by path. Their text lives in
// the repository; the browser does not fetch it.
const PROMPTS = {
  "backend/prompts/system": ["system.md", "analysis.md", "patient.md", "referral.md"],
  "backend/prompts/reasoning": ["base.md", "safety.md", "patient.md", "report.md", "ecg.md", "prescription.md", "wound.md"],
};

export function PromptExplorer() {
  return (
    <Section heading="Prompt sources" headingAs="h3">
      <BodySm className="text-ink-muted">
        backend/reasoning/prompt_composer.py assembles the system prompt from these files for the routed modality. Edit them in the repository; there is no runtime editor.
      </BodySm>
      <dl className="mt-3 space-y-3 text-body-sm">
        {Object.entries(PROMPTS).map(([dir, files]) => (
          <div key={dir}>
            <dt className="font-mono text-ink-muted">{dir}/</dt>
            <dd className="font-mono text-ink pl-4">{files.join("  ")}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
