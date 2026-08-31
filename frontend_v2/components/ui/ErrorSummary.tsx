import React from "react";
import { cn } from "@/lib/utils";
import { H2 } from "@/components/ui/Typography";

export interface ErrorSummaryEntry {
  fieldId: string;
  message: string;
}

export interface ErrorSummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  errors: ErrorSummaryEntry[];
}

/**
 * ErrorSummary: focusable validation summary shown after a failed form
 * submit, per WCAG 2.2's "focusable error summary" pattern. Move focus to
 * it (ref.current.focus()) right after a failed submit so screen reader
 * users hear the problem list immediately. Renders nothing when there are
 * no errors so it never occupies space on a clean form.
 */
export const ErrorSummary = React.forwardRef<HTMLDivElement, ErrorSummaryProps>(
  ({ errors, className, ...props }, ref) => {
    if (errors.length === 0) {
      return null;
    }

    return (
      <div
        ref={ref}
        role="alert"
        tabIndex={-1}
        className={cn(
          "rounded-card border border-risk-emergency bg-surface p-4 space-y-2",
          className
        )}
        {...props}
      >
        <H2 className="text-h3 text-risk-emergency">There is a problem</H2>
        <ul className="space-y-1">
          {errors.map((entry) => (
            <li key={entry.fieldId}>
              <a
                href={`#${entry.fieldId}`}
                className="text-body-sm text-action underline underline-offset-4"
              >
                {entry.message}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
);
ErrorSummary.displayName = "ErrorSummary";
