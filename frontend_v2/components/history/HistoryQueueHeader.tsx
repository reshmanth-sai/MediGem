"use client";

import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { caseCounters } from "@/lib/caseStats";

export function HistoryQueueHeader() {
  const c = caseCounters();
  return (
    <PageHeader
      title="Patient queue"
      subtitle="Every case in the queue, ordered by clinical severity. Select a row to open the record beside it."
      meta={[`${c.total} cases`, `${c.emergency} emergency`, `${c.pendingReview} pending review`, `${c.referrals} referrals open`]}
    />
  );
}
