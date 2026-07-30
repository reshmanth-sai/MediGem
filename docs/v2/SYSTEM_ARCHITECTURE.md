# MediGem Version 2 System Architecture Blueprint

> **Production-Grade 3-Tier Architecture Specification**

MediGem Version 2 evolves the current hackathon prototype into a scalable, API-first clinical SaaS platform while preserving **100% of the existing `MedicalPipeline` logic, Emergency Safety Engine rules, and Gemma AI Provider infrastructure**.

---

## 🏛️ High-Level 3-Tier Architecture Diagram

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               NEXT.JS 14+ REACT FRONTEND                               │
│  • Next.js App Router  • TailwindCSS / shadcn UI  • Zustand State  • Framer Motion    │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ REST API Calls (HTTP / JSON)
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               FASTAPI REST BACKEND API                                 │
│  • Pydantic v2 Requests/Responses  • Dependency Injection  • CORS & Security Headers   │
│  • Endpoint Routes (/api/v1/analyze, /api/v1/upload, /api/v1/history, /api/v1/health) │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ Direct Service Call
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        PRESERVED CORE BACKEND ENGINE (100%)                            │
│  1. Emergency Safety Engine (Deterministic Gate < 0.3ms)                              │
│  2. Input Processing Framework (PyMuPDF & OpenCV Quality Engine)                       │
│  3. Context Fusion Engine (Immutable ReasoningContext)                                 │
│  4. Gemma Inference Layer (Ollama Local / Gemma 3 4B)                                  │
│  5. SafetyGuard & OutputValidator (Non-Diagnostic Safety Contract)                     │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ├────────► SQLite / PostgreSQL Database
                                            └────────► Local OS Asset Storage
```

---

## 🧩 Architectural Tier Responsibilities

### Tier 1: Next.js 14+ Presentation Layer
- **Tech Stack**: Next.js 14 (App Router), React 18, TypeScript, TailwindCSS, shadcn/ui, Framer Motion, Zustand state management, TanStack React Query.
- **Responsibilities**: Responsive clinical UI, real-time stage progress animations, interactive preset gallery, client-side validation, dark/light theme switching, offline cache storage via IndexedDB.

### Tier 2: FastAPI REST API Gateway Layer
- **Tech Stack**: FastAPI, Uvicorn, Pydantic v2, Python 3.14+.
- **Responsibilities**: RESTful routing, payload validation, CORS security, file upload handling, async task execution, error handling middleware, OpenAPI documentation (`/docs`).

### Tier 3: Preserved Core Medical Engine & Storage
- **Tech Stack**: Existing `MediGemOrchestrator`, `EmergencyEngine`, `InputRouter`, `ContextFusionEngine`, `GemmaProvider`, `OutputValidator`.
- **Database**: SQLite (Default for offline edge deployment) / PostgreSQL (Optional for multi-user hospital deployment).
- **Asset Storage**: Encrypted local filesystem storage for uploaded PDF/Image files.
