# MediGem Version 2 Phased Migration Plan

> **5-Phase Seamless Transition Plan (Zero MedicalPipeline Rewrite)**

This document details the step-by-step migration from the current Gradio prototype to a production Next.js + FastAPI architecture.

---

## 🎯 5-Phase Migration Overview

```text
Phase 1: FastAPI Gateway Integration
   │ (Wraps existing MediGemOrchestrator without modifying backend code)
   ▼
Phase 2: Next.js Frontend Scaffolding
   │ (Builds App Router layout, TailwindCSS styling, shadcn/ui components)
   ▼
Phase 3: Client-Server API Binding
   │ (Connects Next.js React Query & Zustand state to FastAPI REST endpoints)
   ▼
Phase 4: Docker Containerization
   │ (Packages FastAPI, Next.js, and Ollama into unified Docker Compose offline bundle)
   ▼
Phase 5: Production Hardening
   │ (Adds local SQLite session persistence, security headers, and CI/CD pipelines)
```

---

## 📋 Phase-by-Phase Roadmap

### Phase 1: FastAPI Gateway Integration (Week 1–2)
- **Goal**: Expose existing Python backend via REST API.
- **Tasks**:
  1. Create `backend/api/` package containing FastAPI app definition.
  2. Implement `/api/v1/analyze`, `/api/v1/upload`, `/api/v1/health`, `/api/v1/metrics`.
  3. Bind Pydantic v2 schemas directly to request/response bodies.
  4. Verify zero changes required in `backend/services/orchestrator.py` or `backend/pipeline/`.

### Phase 2: Next.js Frontend Scaffolding (Week 3–4)
- **Goal**: Build modern React/TypeScript presentation layer.
- **Tasks**:
  1. Initialize Next.js 14 App Router project in `frontend_v2/`.
  2. Install TailwindCSS and shadcn/ui component library.
  3. Port Clinical SaaS design tokens (`#0D9488` teal accents, 14px rounded cards).
  4. Build 3-column proportional grid components.

### Phase 3: Client-Server API Binding (Week 5–6)
- **Goal**: Connect frontend to FastAPI backend.
- **Tasks**:
  1. Implement `api-client.ts` targeting `/api/v1/` endpoints.
  2. Create `useAnalysisStore.ts` Zustand state for history caching.
  3. Implement Framer Motion live stage progress tracker.

### Phase 4: Docker Containerization (Week 7–8)
- **Goal**: Package system for offline edge clinic deployment.
- **Tasks**:
  1. Write multi-stage `Dockerfile` for FastAPI backend and Next.js frontend.
  2. Write `docker-compose.yml` linking frontend, backend, and local Ollama container.
  3. Package offline installer scripts for Windows, macOS, and Linux.

### Phase 5: Production Hardening (Week 9–10)
- **Goal**: Prepare for pilot clinic deployment.
- **Tasks**:
  1. Implement local SQLite session persistence.
  2. Configure HTTPS/CORS security headers.
  3. Set up GitHub Actions CI/CD workflows.
