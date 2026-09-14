import type { Route } from "next";
import {
  LayoutGrid,
  Users,
  ClipboardCheck,
  ArrowRightLeft,
  MessageSquare,
  ShieldCheck,
  BookOpen,
  Sliders,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export interface NavigationItem {
  label: string;
  href: Route;
  icon: LucideIcon;
}

export interface NavigationGroup {
  label: string;
  items: NavigationItem[];
}

// One list for the desktop sidebar and the mobile drawer.
export const NAVIGATION: NavigationGroup[] = [
  {
    label: "Care",
    items: [
      { label: "Clinical Workstation", href: "/workstation", icon: LayoutGrid },
      { label: "Patient Queue", href: "/history", icon: Users },
      { label: "Assessments", href: "/assessments", icon: ClipboardCheck },
      { label: "Referral Transfers", href: "/transfers", icon: ArrowRightLeft },
      { label: "Clinical Assistant", href: "/assistant", icon: MessageSquare },
      { label: "Protocols", href: "/learning", icon: ShieldCheck },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Product page", href: "/", icon: Sparkles },
      { label: "Guidelines", href: "/learning", icon: BookOpen },
      { label: "System Controls", href: "/settings", icon: Sliders },
    ],
  },
];

export function isNavActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/") return false; // the product page is never "current" inside the workstation
  if (href === "/assessments") return pathname.startsWith("/assessments") || pathname.startsWith("/results");
  return pathname.startsWith(href);
}
