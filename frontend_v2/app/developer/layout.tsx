import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pipeline Inspector",
  description: "Prompts, logs and pipeline diagnostics.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
