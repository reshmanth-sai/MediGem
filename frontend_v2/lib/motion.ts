/**
 * Whether motion should be suppressed right now: the OS preference, or the
 * workstation's own override (Settings > Accessibility sets data-motion on
 * <html>). Read at effect time so a render that started with the server's
 * "false" can still bail before starting an animation.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.documentElement.getAttribute("data-motion") === "reduce"
  );
}
