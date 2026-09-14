import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Controls",
  description: "Appearance, accessibility, privacy and device settings.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
