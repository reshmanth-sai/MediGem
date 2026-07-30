"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { WorkspaceTemplate } from "@/components/templates/Templates";
import { Card } from "@/components/ui/Card";
import { TextField, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { MedicalUploadDropzone } from "@/components/ui/UploadDropzone";
import { StageTracker } from "@/components/ai/StageTracker";
import { EmptyState } from "@/components/ui/Feedback";

export default function NewCasePage() {
  return (
    <AppShell>
      <WorkspaceTemplate
        leftSidebar={
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Patient Demographics</h3>
            <TextField label="Patient ID" defaultValue="P-101" />
            <div className="grid grid-cols-2 gap-2">
              <TextField label="Age" type="number" defaultValue="45" />
              <TextField label="Gender" defaultValue="Male" />
            </div>
            <TextField label="Symptoms" defaultValue="Chest tightness, Palpitations" />
            <Textarea label="Clinical Notes" placeholder="Enter health worker notes..." rows={3} />
          </Card>
        }
        centerWorkspace={
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Medical File Upload</h3>
            <MedicalUploadDropzone />
            <Button variant="primary" className="w-full" size="lg">
              Execute Clinical Analysis
            </Button>
            <StageTracker />
          </Card>
        }
        rightResults={
          <EmptyState
            title="Analysis Results Panel"
            message="Results, risk assessment, and reasoning transparency will render here upon completion."
          />
        }
      />
    </AppShell>
  );
}
