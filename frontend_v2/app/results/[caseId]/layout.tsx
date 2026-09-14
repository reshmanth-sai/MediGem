import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case",
  description: "One patient's record and assessment.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
