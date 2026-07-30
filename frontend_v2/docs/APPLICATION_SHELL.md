# MediGem Application Shell Architecture

> **Root Framework, Responsive Shell & Layout Specification**

---

## 🏛️ Application Shell Architecture Overview

```text
┌────────────────────────────────────────────────────────────────────────┐
│                               Header.tsx                               │
│  💎 MediGem  •  Breadcrumbs  •  🟢 OFFLINE FIRST  •  MODEL: GEMMA 3 4B │
├───────────────────────────┬────────────────────────────────────────────┤
│        Sidebar.tsx        │             Active Route Content           │
│  • New Clinical Case      │  (app/page.tsx, app/new-case/page.tsx,     │
│  • Session History        │   app/history/page.tsx, app/demo/page.tsx, │
│  • Demo Presets           │   app/evaluation/page.tsx, etc.)           │
│  • Evaluation Dashboard   │                                            │
│  • Developer Inspector    │                                            │
│  • Settings               │                                            │
└───────────────────────────┴────────────────────────────────────────────┘
```

---

## ⌨️ Command Palette (`⌘K` / `Ctrl+K`)

Pressing `⌘K` or `Ctrl+K` opens the global command palette modal (`CommandPalette.tsx`), allowing health workers to navigate instantly between routes or trigger actions without using a mouse.
