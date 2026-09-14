import type { Metadata } from "next";
import { RootProvider } from "@/providers";
import { fontClassNames } from "./fonts";
import "@/styles/globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

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
