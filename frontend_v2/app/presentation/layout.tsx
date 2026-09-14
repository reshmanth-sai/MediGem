import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Presentation",
  description: "Presenter flow for demonstrations.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
