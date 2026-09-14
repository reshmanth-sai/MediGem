import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clinical Assistant",
  description: "Protocol lookup and triage support. It does not diagnose or prescribe.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
