"use client";

import React, { Suspense } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { DemoDataRibbon } from "./DemoDataRibbon";
import { CommandPalette, CommandPaletteProvider } from "@/components/search/CommandPalette";
import { ProductTour } from "@/components/tour/ProductTour";
import { CasesProvider } from "@/providers/CasesProvider";
import { useSession } from "@/providers/SessionProvider";
import { SignInScreen } from "@/components/auth/SignInScreen";
import { EcgMark } from "./Sidebar";

/*
 * The workstation behind a sign-in wall, but only when there is somewhere to
 * sign into: with no pipeline API configured (replay/example mode) there is
 * no account system to gate against, so the shell renders straight through.
 * A brief "still checking" state avoids flashing the workstation before a
 * pending /auth/me redirects to the login screen.
 */
function Gate({ children }: { children: React.ReactNode }) {
  const session = useSession();

  if (!session.ready) {
    return (
      <div className="min-h-screen bg-ground flex items-center justify-center" role="status" aria-live="polite">
        <EcgMark className="text-risk-high h-8 w-14 motion-safe:animate-pulse" />
        <span className="sr-only">Loading</span>
      </div>
    );
  }

  if (session.status === "setup" || session.status === "signed-out") {
    return <SignInScreen />;
  }

  return <>{children}</>;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <CommandPaletteProvider>
      <CasesProvider>
      <Gate>
      <div className="min-h-screen bg-ground text-ink flex">
        {/*
          WCAG 2.4.1 bypass block. Without it, every route walks a keyboard user
          through the entire sidebar before reaching any page content. This is
          the first focusable element in the shell, stays invisible until it
          takes focus, and then paints over the top left corner. `main` carries
          tabIndex={-1} so following the link actually moves focus into the
          landmark rather than only scrolling to it.
        */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:inline-flex focus:h-11 focus:items-center focus:rounded-control focus:border focus:border-action focus:bg-surface focus:px-4 focus:text-body-sm focus:font-semibold focus:text-ink focus:outline-2 focus:outline-offset-2 focus:outline-focus"
        >
          Skip to main content
        </a>

        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <DemoDataRibbon />
          <main
            id="main-content"
            tabIndex={-1}
            className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0"
          >
            {children}
          </main>
        </div>

        <CommandPalette />
        <Suspense fallback={null}>
          <ProductTour />
        </Suspense>
      </div>
      </Gate>
      </CasesProvider>
    </CommandPaletteProvider>
  );
}
