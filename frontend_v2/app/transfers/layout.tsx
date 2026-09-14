import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Referral Transfers",
  description: "Referrals raised from this facility and their status.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
