import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/lib/siteUrl";
import { RootProvider } from "@/providers";
import { fontClassNames } from "./fonts";
import "@/styles/globals.css";


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "MediGem", template: "%s · MediGem" },
  description: "Clinical decision support that runs entirely on local hardware. Lab reports, ECGs, prescriptions and wound images, assessed without an uplink.",
  applicationName: "MediGem",
  openGraph: {
    type: "website",
    siteName: "MediGem",
    title: "MediGem",
    description: "Care that works when the network doesn't. Clinical decision support, built for disconnected care.",
  },
  twitter: { card: "summary_large_image" },
  // The workstation is a demo surface with synthetic patients; only the
  // product page is meant to be indexed. robots.ts carries the path rules.
  robots: { index: true, follow: true },
};

/*
 * `viewport-fit=cover` lets the page paint into the notch and home-indicator
 * strips, which is what makes `env(safe-area-inset-*)` resolve to real values
 * -- without it those insets are always 0px and the .pad-safe-* utilities in
 * globals.css do nothing. Anything pinned to a viewport edge pads itself with
 * the matching inset.
 *
 * No `maximum-scale` or `user-scalable=no`: pinch zoom stays available, which
 * WCAG 1.4.4 requires and a clinician reading a small readout outdoors needs.
 * The zoom this app used to force came from sub-16px form controls, fixed in
 * globals.css rather than by locking the viewport.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#111815" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={fontClassNames}
      suppressHydrationWarning
    >
      {/*
        Colour comes from styles/globals.css; the typefaces come from
        app/fonts.ts, exposed as --font-sans / --font-serif / --font-mono.
      */}
      <body className="antialiased min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
