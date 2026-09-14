import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clinical Workstation",
  description: "Queue, alerts and today's cases.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
