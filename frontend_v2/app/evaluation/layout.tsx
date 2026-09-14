import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Evaluation",
  description: "Measured pipeline performance and quality.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
