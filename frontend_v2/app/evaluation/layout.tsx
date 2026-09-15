import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Measured performance",
  description: "Latency, schema validity, and OCR confidence, read from a recorded capture run.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
