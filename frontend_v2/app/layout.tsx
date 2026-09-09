import type { Metadata } from "next";
import { RootProvider } from "@/providers";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "MediGem Clinical Workstation",
  description: "Clinical decision support workstation for rural healthcare facilities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      {/*
        Typeface and colour come from styles/globals.css. Switzer is loaded
        from Fontshare once and is the sole UI family across the workstation.
      */}
      <body className="antialiased min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
