import type { Route } from "next";
import {
  LayoutGrid,
  Users,
  ClipboardCheck,
  ArrowRightLeft,
  MessageSquare,
  BookOpen,
  Sliders,
  Terminal,
  Gauge,
  type LucideIcon,
} from "lucide-react";

export interface NavigationItem {
  label: string;
  href: Route;
  icon: LucideIcon;
  /** Short form for the collapsed rail's tooltip and accessible name. */
  short?: string;
}

export interface NavigationGroup {
  id: string;
  label: string;
  items: NavigationItem[];
}

// One list for the desktop rail and the phone drawer. Each destination
// appears once; the product page is a footer link, not a workstation route.
export const NAVIGATION: NavigationGroup[] = [
  {
    id: "care",
    label: "Care",
    items: [
      { label: "Workstation", href: "/workstation", icon: LayoutGrid },
      { label: "Patient queue", href: "/history", icon: Users },
      { label: "Assessments", href: "/assessments", icon: ClipboardCheck },
      { label: "Referrals", href: "/transfers", icon: ArrowRightLeft },
      { label: "Clinical assistant", href: "/assistant", icon: MessageSquare },
      { label: "Protocols & guidelines", href: "/learning", icon: BookOpen, short: "Protocols" },
    ],
  },
  {
    id: "system",
    label: "System",
    items: [
      { label: "Pipeline inspector", href: "/developer", icon: Terminal },
      { label: "Measured performance", href: "/evaluation", icon: Gauge, short: "Performance" },
      { label: "System controls", href: "/settings", icon: Sliders },
    ],
  },
];

export function isNavActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/assessments") return pathname.startsWith("/assessments") || pathname.startsWith("/results");
  return pathname === href || pathname.startsWith(`${href}/`);
}
