import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-control font-semibold transition-[background-color,color,transform] duration-150 ease-out active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:pointer-events-none disabled:text-ink-disabled disabled:bg-surface-raised",
  {
    variants: {
      variant: {
        primary: "bg-action text-on-action hover:bg-action-hover active:bg-action-active",
        secondary: "bg-surface-raised text-ink border border-rule hover:bg-rule",
        outline: "border border-action text-action hover:bg-action-subtle",
        ghost: "text-action hover:bg-action-subtle",
        text: "text-action underline-offset-4 hover:underline",
        danger: "bg-risk-emergency text-on-action hover:brightness-90",
      },
      size: {
        lg: "h-[52px] px-6 text-body",
        md: "h-11 px-4 text-body-sm",
        sm: "h-9 px-3 text-body-sm relative before:absolute before:inset-x-0 before:top-1/2 before:-translate-y-1/2 before:min-h-[44px] before:content-['']",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" />
        ) : (
          leftIcon && (
            <span className="inline-flex" aria-hidden="true">
              {leftIcon}
            </span>
          )
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className="inline-flex" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);
Button.displayName = "Button";
