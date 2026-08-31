"use client";

import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { AccessibilityProvider } from "./AccessibilityProvider";
import { ToastProvider } from "./ToastProvider";
import { DialogProvider } from "./DialogProvider";

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      <AccessibilityProvider>
        <ToastProvider>
          <DialogProvider>{children}</DialogProvider>
        </ToastProvider>
      </AccessibilityProvider>
    </ThemeProvider>
  );
}
