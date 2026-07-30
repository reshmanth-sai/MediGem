# MediGem Version 2 Frontend Architecture Specification

> **Next.js 14+ / React / TailwindCSS / shadcn/ui Presentation Design**

The Version 2 frontend replaces Gradio with a modern, responsive React/TypeScript application built on Next.js 14 App Router.

---

## 🎨 Technology Stack & UI Components

- **Framework**: Next.js 14+ (App Router, Server & Client Components)
- **Language**: TypeScript 5.0+
- **Styling**: TailwindCSS 3.4+
- **Component Library**: shadcn/ui (Radix UI primitives)
- **Animations**: Framer Motion 11+
- **State Management**: Zustand 4.5+ (Local UI state & history caching)
- **Data Fetching**: TanStack React Query v5 (Caching, automatic retry policies)

---

## 📁 Next.js App Directory Hierarchy

```
frontend_v2/
├── app/
│   ├── layout.tsx              # Root clinical SaaS layout & font loader
│   ├── page.tsx                # Landing dashboard & workspace overview
│   ├── analysis/
│   │   └── page.tsx            # Main 3-column analysis workspace
│   ├── history/
│   │   └── page.tsx            # Session timeline & export archive
│   ├── evaluation/
│   │   └── page.tsx            # Benchmark & judge evaluation dashboard
│   └── api/                    # Next.js route handlers
├── components/
│   ├── ui/                     # shadcn/ui atomic primitives (Button, Card, Badge)
│   ├── clinical/
│   │   ├── PatientForm.tsx     # Demographics & vital signs entry
│   ├── IngestionZone.tsx   # Drag-and-drop file upload & preview
│   ├── DemoGallery.tsx     # 1-Click preset cards with visual thumbnails
│   ├── StageTracker.tsx    # Framer Motion animated pipeline progress tracker
│   ├── RiskBadgeCard.tsx   # Color-coded risk assessment badge
│   ├── TransparencyCard.tsx# "Why was this recommendation generated?" card
│   └── ReferralDrawer.tsx  # Printable referral Memorandum modal
├── store/
│   └── useAnalysisStore.ts     # Zustand global UI state manager
└── lib/
    └── api-client.ts           # Axios / fetch wrapper targeting FastAPI backend
```
