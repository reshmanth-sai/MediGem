import type { Metadata } from "next";
import { RootProvider } from "@/providers";
import "@/styles/globals.css";

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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
