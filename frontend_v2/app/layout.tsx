import type { Metadata } from "next";
import { Public_Sans, Atkinson_Hyperlegible_Mono } from "next/font/google";
import { RootProvider } from "@/providers";
import "@/styles/globals.css";

const sans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const mono = Atkinson_Hyperlegible_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MediGem - Offline AI Clinical Co-Pilot",
  description: "Multimodal offline AI assistant for rural healthcare workers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      {/*
        Colour comes from the body rule in styles/globals.css, which reads the
        --ground and --ink tokens the active theme class defines. There is no
        bg-/text- utility here: bg-background and text-foreground named tokens
        that this Tailwind config never declared, so they emitted no CSS.
      */}
      <body className="antialiased min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
