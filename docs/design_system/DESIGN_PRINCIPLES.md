# MediGem Healthcare Design Principles

> **10 Core Principles Governing Product Design & User Experience**

Every screen, component, and interaction in MediGem must adhere to these 10 core design principles.

---

## 🏛️ The 10 Core Design Principles

### 1. Safety Before Aesthetics 🚨
- Emergency alerts and critical risk indicators take absolute visual precedence over decorative elements. Acute emergency notifications MUST intercept the screen with high-contrast warning badges (`#DC2626`).

### 2. Strict Information Hierarchy 📊
- Screen layouts are structured logically: Patient Demographics (Input) ➔ File Ingestion (Workspace) ➔ Assessed Risk Level (Primary Output) ➔ Clinical Summaries ➔ Reasoning Transparency ➔ Export Actions. The most critical clinical result receives the largest screen area (40% proportional width).

### 3. Minimal Cognitive Load 🧠
- Overworked health workers operate under stress. Interfaces avoid cluttered toolbars, unnecessary popups, or distracting animations. Every visual element has a clear clinical purpose.

### 4. Progressive Disclosure 🔍
- Primary findings (Risk Level, Clinical Summary, Referral Reason) are displayed immediately. Complex technical provenance (OpenCV blur scores, OCR confidence, raw LLM token latencies) is collapsed inside the Developer Inspector accordion.

### 5. Accessibility First (WCAG 2.1 AA) ♿
- Text contrast ratios exceed 4.5:1 for standard text and 3:1 for large headers. Focus rings are clearly visible. Color is NEVER the sole carrier of clinical information (badges use text labels + unique icons alongside color).

### 6. Reasoning Transparency ("Why?") 💡
- Every AI recommendation includes a **Why was this recommendation generated?** card explaining empirical quality metrics, PDF text layer extraction, and rule checks to build clinical trust.

### 7. Human-Centered AI Boundaries 🤝
- Interface language explicitly maintains non-diagnostic clinical boundaries. Labels use *"Clinical Summary"* instead of *"Diagnosis"*, and *"Possible Findings"* instead of *"Definitive Disease"*.

### 8. Whitespace Over Heavy Borders 🌬️
- Surfaces rely on soft rounded cards (`border-radius: 14px`), subtle border colors (`#E2E8F0`), and clean vertical rhythm rather than harsh black divider lines.

### 9. Trust Through Simplicity ✨
- Clean white-first surfaces (`#F8FAFC` page background, `#FFFFFF` cards) with curated teal accents (`#0D9488`) project a professional clinical SaaS aesthetic.

### 10. Predictable Micro-Interactions 💫
- Interactive elements feature subtle, predictable hover states (`transform: translateY(-2px)`, `transition: all 0.2s ease`). Heavy, jarring animations are prohibited.
