import localFont from "next/font/local";

/*
 * The three families the whole site uses, served from the build rather than
 * from Fontshare or a public/ URL, so nothing about the UI needs an uplink.
 * next/font preloads the faces, hashes the files, and generates a
 * metric-matched fallback for each so the page does not shift when a face
 * lands. Every stylesheet reads them through the CSS variables below.
 *
 *   Switzer         the workstation UI and landing body text
 *   Sentient        landing statements only
 *   JetBrains Mono  readouts, identifiers, timestamps
 */

export const switzer = localFont({
  src: [
    { path: "../assets/fonts/Switzer-400.woff2", weight: "400", style: "normal" },
    { path: "../assets/fonts/Switzer-500.woff2", weight: "500", style: "normal" },
    { path: "../assets/fonts/Switzer-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

export const sentient = localFont({
  src: "../assets/fonts/Sentient-400.woff2",
  weight: "400",
  variable: "--font-serif",
  display: "swap",
  fallback: ["Iowan Old Style", "Times New Roman", "serif"],
  // Only the landing renders serif; the workstation never asks for it.
  preload: false,
});

export const jetbrainsMono = localFont({
  src: "../assets/fonts/JetBrainsMono-400.woff2",
  weight: "400",
  variable: "--font-mono",
  display: "swap",
  fallback: ["ui-monospace", "SF Mono", "Menlo", "monospace"],
});

export const fontClassNames = `${switzer.variable} ${sentient.variable} ${jetbrainsMono.variable}`;
