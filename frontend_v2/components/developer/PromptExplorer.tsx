import React from "react";
import { CodeBlock } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";

export function PromptExplorer() {
  const promptMeta = {
    version: "v1.0-production",
    modelTarget: "gemma3:4b",
    systemRole: "Senior Clinical AI Assistant for Rural Healthcare Workers",
    safetyConstraints: "Strict non-diagnostic boundaries & mandatory referral recommendations",
  };

  return (
    <Card className="space-y-3">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
        System Prompt & Instruction Context Explorer
      </h3>
      <p className="text-xs text-slate-500">
        System instruction configuration and schema guidelines for Gemma 3 4B reasoning:
      </p>
      <CodeBlock>{JSON.stringify(promptMeta, null, 2)}</CodeBlock>
    </Card>
  );
}
