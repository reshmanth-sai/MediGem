"use client";

import React, { useState } from "react";
import { CheckCircle2, Edit3, MessageSquare, Printer, XCircle } from "lucide-react";
import { ClinicalCaseData } from "@/lib/casesData";
import { Button } from "@/components/ui/Button";
import { BodySm, Label } from "@/components/ui/Typography";

type DecisionState = "pending" | "approved" | "modified" | "rejected";

interface StickyDecisionFooterProps {
  caseData: ClinicalCaseData;
  onOpenReferral: () => void;
}

const DECISION_STATUS: Record<DecisionState, string | null> = {
  pending: null,
  approved: "Approved",
  modified: "Modified",
  rejected: "Rejected",
};

/**
 * The clinician decision bar for the results route. The assessment above is
 * decision support; nothing leaves this screen without a person acting here.
 */
export function StickyDecisionFooter({ caseData, onOpenReferral }: StickyDecisionFooterProps) {
  const [decisionState, setDecisionState] = useState<DecisionState>("pending");
  const [note, setNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);

  const status = DECISION_STATUS[decisionState];

  const handleApprove = () => {
    setDecisionState("approved");
    onOpenReferral();
  };

  const handleReject = () => {
    setDecisionState("rejected");
    setShowNoteInput(true);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-rule bg-surface p-3 md:left-[68px]">
      <div className="mx-auto flex max-w-[1500px] flex-col items-center justify-between gap-3 md:flex-row md:pr-44">
        <div className="space-y-1">
          <Label>Clinician decision</Label>
          <BodySm className="text-ink-muted">
            {caseData.patientName} remains under clinician authority. MediGem does
            not act on this assessment.
            {status ? ` Current decision: ${status}.` : ""}
          </BodySm>
        </div>

        <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
          <Button
            variant="primary"
            size="md"
            leftIcon={<CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
            onClick={handleApprove}
          >
            Approve referral
          </Button>

          <Button
            variant="secondary"
            size="md"
            leftIcon={<Edit3 className="h-4 w-4" aria-hidden="true" />}
            onClick={() => setDecisionState("modified")}
          >
            Modify
          </Button>

          <Button
            variant="secondary"
            size="md"
            leftIcon={<XCircle className="h-4 w-4" aria-hidden="true" />}
            onClick={handleReject}
          >
            Reject assessment
          </Button>

          <Button
            variant="ghost"
            size="md"
            leftIcon={<MessageSquare className="h-4 w-4" aria-hidden="true" />}
            onClick={() => setShowNoteInput(!showNoteInput)}
            aria-expanded={showNoteInput}
          >
            Clinician note
          </Button>

          <Button
            variant="ghost"
            size="md"
            leftIcon={<Printer className="h-4 w-4" aria-hidden="true" />}
            onClick={onOpenReferral}
          >
            Print
          </Button>
        </div>
      </div>

      {showNoteInput && (
        <div className="mx-auto mt-3 max-w-[1500px] space-y-2">
          <label className="block" htmlFor="clinician-note">
            <Label>Clinician note and override rationale</Label>
          </label>
          <textarea
            id="clinician-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Record observations, disagreement with the assessment, or override rationale."
            rows={2}
            className="w-full rounded-control border border-rule bg-surface-raised p-2.5 text-body-sm text-ink placeholder:text-ink-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          />
          <div className="flex justify-end">
            <Button variant="secondary" size="sm" onClick={() => setShowNoteInput(false)}>
              Save note
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
