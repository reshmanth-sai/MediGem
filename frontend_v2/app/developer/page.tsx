import { AppShell } from "@/components/layout/AppShell";
import { DashboardTemplate } from "@/components/templates/Templates";
import { CodeBlock } from "@/components/ui/Typography";

export default function DeveloperPage() {
  const mockConfig = {
    model: "gemma3:4b",
    backend: "FastAPI REST Gateway",
    emergencyGate: "Active (< 0.3ms)",
    contextFusion: "Immutable ReasoningContext",
    safetyGuard: "Non-Diagnostic Safety Contract",
  };

  return (
    <AppShell>
      <DashboardTemplate title="Developer & System Inspector" subtitle="Raw JSON state, token provenance, and pipeline diagnostics">
        <CodeBlock>{JSON.stringify(mockConfig, null, 2)}</CodeBlock>
      </DashboardTemplate>
    </AppShell>
  );
}
