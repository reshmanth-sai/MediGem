import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Patient Intake",
  description: "Record a patient, their symptoms and documents, then run the assessment.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
