import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sample Cases",
  description: "Bundled example cases for walkthroughs.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
