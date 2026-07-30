# MediGem Version 2 Frontend Architecture Specification

> **Next.js 15 App Router, React 19, TypeScript & Clean Architecture Blueprint**

---

## 🏛️ System Architecture Overview

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        NEXT.JS 15 APP ROUTER LAYOUT                    │
│  RootLayout (layout.tsx) ➔ RootProvider (Composed Theme, Toast, Dialog) │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      FEATURE & PRESENTATION LAYERS                     │
│  • Clinical Form Components    • Ingestion & Upload Dropzone           │
│  • Stage Tracker (Motion)      • Results & Reasoning Transparency Cards │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Service Invocations
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      SERVICE & API CLIENT LAYER                        │
│  • BaseService & ApiClient (Fetch, Timeout, Retries, Interceptors)      │
│  • AnalysisService & HistoryService                                    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ REST HTTP Calls
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        FASTAPI BACKEND REST API                        │
│  • /api/v1/analyze   • /api/v1/upload   • /api/v1/health   • /api/v1/demo │
└────────────────────────────────────────────────────────────────────────┘
```
