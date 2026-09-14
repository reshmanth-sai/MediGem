import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Protocols",
  description: "Clinical guidelines and protocols available offline.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
