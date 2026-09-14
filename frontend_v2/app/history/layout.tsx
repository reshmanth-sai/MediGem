import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Patient Queue",
  description: "Every case in the queue, with filters and the patient record.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
