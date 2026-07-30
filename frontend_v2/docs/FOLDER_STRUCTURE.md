# MediGem Frontend Directory Structure

> **Scalable Directory Hierarchy for Version 2**

```
frontend_v2/
├── app/                  # Next.js 15 App Router pages & layouts
├── components/           # Reusable UI primitives & clinical components
├── hooks/                # Custom React hooks (useTheme, useDebounce, useLocalStorage)
├── lib/                  # Shared utilities (api-client, formatters, motion, utils)
├── providers/            # Composed context providers (Theme, Toast, Dialog)
├── services/             # Service layer (BaseService, AnalysisService, HistoryService)
├── styles/               # Global CSS & Tailwind CSS v4 design tokens
├── types/                # TypeScript type definitions (patient, analysis, emergency, api)
└── docs/                 # Frontend architecture & engineering documentation
```
