"use client";

import type { Route } from "next";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { THEME_STORAGE_KEY } from "@/providers/ThemeProvider";

// Route change to the workstation: a single ink panel wipes up, then the
// navigation happens behind it. Reduced motion navigates directly.
export function Curtain() {
  const el = useRef<HTMLDivElement>(null);
  const router = useRouter();
  useEffect(() => {
    // First arrival from the ink-dark product page lands on the Night theme
    // so the wipe resolves into a matching ground. A theme the person has
    // already chosen is never overridden.
    const matchGround = () => {
      try {
        if (window.localStorage.getItem(THEME_STORAGE_KEY) === null) {
          window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify("night"));
        }
      } catch {
        // Storage unavailable; the workstation keeps its default.
      }
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[data-curtain]");
      if (!a) return;
      matchGround();
      if (prefersReducedMotion() || e.metaKey || e.ctrlKey) return;
      e.preventDefault();
      const href = (a.getAttribute("href") ?? "/workstation") as Route;
      router.prefetch(href);
      gsap.fromTo(
        el.current,
        { scaleY: 0 },
        { scaleY: 1, duration: 0.7, ease: "power4.inOut", onComplete: () => router.push(href) }
      );
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);
  return <div ref={el} className="curtain" aria-hidden="true" />;
}
