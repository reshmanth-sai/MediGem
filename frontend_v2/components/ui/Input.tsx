import React from "react";
import { cn } from "@/lib/utils";
import { Field } from "@/components/ui/Field";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const TextField = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, required, ...props }, ref) => {
    const generatedId = React.useId();
    const fieldId = id || generatedId;

    const input = (
      <input
        ref={ref}
        id={fieldId}
        required={required}
        className={cn(
          "w-full h-11 px-3 text-body-sm bg-surface border border-rule-strong rounded-control text-ink placeholder:text-ink-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus transition-colors",
          error && "border-risk-emergency",
          className
        )}
        {...props}
      />
    );

    if (!label) {
      return input;
    }

    return (
      <Field id={fieldId} label={label} helper={helperText} error={error} required={required}>
        {input}
      </Field>
    );
  }
);
TextField.displayName = "TextField";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, required, ...props }, ref) => {
    const generatedId = React.useId();
    const fieldId = id || generatedId;

    const textarea = (
      <textarea
        ref={ref}
        id={fieldId}
        required={required}
        className={cn(
          "w-full p-3 text-body-sm bg-surface border border-rule-strong rounded-control text-ink placeholder:text-ink-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus transition-colors",
          error && "border-risk-emergency",
          className
        )}
        {...props}
      />
    );

    if (!label) {
      return textarea;
    }

    return (
      <Field id={fieldId} label={label} helper={helperText} error={error} required={required}>
        {textarea}
      </Field>
    );
  }
);
Textarea.displayName = "Textarea";
