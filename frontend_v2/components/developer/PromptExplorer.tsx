import React from "react";
import { Section } from "@/components/ui/Card";
import { BodySm } from "@/components/ui/Typography";

export function PromptExplorer() {
  const promptMeta = {
    version: "v1.0-production",
    modelTarget: "gemma3:4b",
    systemRole: "Senior Clinical Decision Support System for Rural Healthcare Workers",
    safetyConstraints: "Strict non-diagnostic boundaries & mandatory referral recommendations",
  };

  return (
    <Section heading="System Prompt & Instruction Context" headingAs="h3">
      <BodySm className="text-ink-muted">
        System instruction configuration and schema guidelines for Gemma 3 4B reasoning.
      </BodySm>
      <pre
        aria-label="System prompt configuration"
        className="font-mono text-body-sm p-3 bg-surface-raised text-ink border border-rule rounded-control overflow-x-auto whitespace-pre"
      >
        <code>{JSON.stringify(promptMeta, null, 2)}</code>
      </pre>
    </Section>
  );
}
