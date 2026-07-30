# MediGem Frontend State Management Architecture

> **Separation of Server, Client, UI, Form, and Session State**

MediGem enforces a clean separation of concerns across state categories:

---

## 📊 State Categories & Tooling

```text
┌─────────────────┬───────────────────────────┬───────────────────────────────────┐
│ State Category  │ Responsible Tool          │ Scope / Example                   │
├─────────────────┼───────────────────────────┼───────────────────────────────────┤
│ Server State    │ TanStack React Query      │ API responses, analysis result    │
│ Client State    │ Zustand                   │ Active case, session history      │
│ UI State        │ React Context / Providers │ Dialog open, Toast notifications  │
│ Theme State     │ next-themes               │ Light / Dark / Night mode         │
│ Form State      │ React Hook Form + Zod     │ Patient age, symptoms, vitals     │
└─────────────────┴───────────────────────────┴───────────────────────────────────┘
```
