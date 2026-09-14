import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Assessments",
  description: "Completed assessments awaiting or cleared for review.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
