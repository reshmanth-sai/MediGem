"use client";

import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { AccessibilityProvider } from "./AccessibilityProvider";
import { ToastProvider } from "./ToastProvider";
import { DialogProvider } from "./DialogProvider";
import { SessionProvider } from "./SessionProvider";

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      <AccessibilityProvider>
        <ToastProvider>
          <DialogProvider>
            <SessionProvider>{children}</SessionProvider>
          </DialogProvider>
        </ToastProvider>
      </AccessibilityProvider>
    </ThemeProvider>
  );
}
