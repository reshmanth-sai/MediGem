# MediGem Page Wireframes & UI State Machine

> **Layout Grids, Screen Wireframes & UI State Transition Matrix**

---

## 🔄 Interactive UI State Machine Matrix

```text
┌──────────────┐     File Ingestion / Click Execute      ┌──────────────────┐
│  IDLE STATE  │ ──────────────────────────────────────► │ PROCESSING STATE │
└──────────────┘                                         └────────┬─────────┘
       ▲                                                          │
       │                                       Emergency Detected │ Emergency Passed
       │                                                  │       │
       │                                                  ▼       ▼
       │                                         ┌──────────────────────────┐
       │                                         │ EMERGENCY INTERCEPTED    │
       │                                         │ OR RESULTS RENDERED      │
       │                                         └────────┬─────────────────┘
       │                                                  │
       │ Click Reset / New Analysis                       │ Export Triggered
       └──────────────────────────────────────────────────┴─────────► Export Generated
```

---

## 📐 Proportional 3-Column Workspace Wireframe (Desktop)

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ BRAND HEADER: 💎 MediGem Clinical Co-Pilot | 🟢 OFFLINE FIRST | MODEL: GEMMA 3 4B      │
├───────────────────────────┬───────────────────────────────┬────────────────────────────┤
│ 👤 LEFT SIDEBAR (25%)     │ 📁 CENTER WORKSPACE (35%)     │ 📋 RIGHT RESULTS (40%)     │
├───────────────────────────┼───────────────────────────────┼────────────────────────────┤
│ • Patient Age & Gender    │ • Drag & Drop Upload Zone     │ • Risk Assessment Badge    │
│ • Presenting Symptoms     │ • Demo Preset Gallery Cards   │ • Clinical Summary Textbox │
│ • Vital Signs Entry       │ • Execute Analysis Button     │ • Reasoning Transparency   │
│ • Healthcare Worker Notes │ • Live Stage Progress Tracker │ • Analysis Quality Card    │
│ • Session History Timeline│   (✓ Upload -> ⟳ Gemma)       │ • Supporting Observations  │
│                           │                               │ • Patient View & Referral  │
│                           │                               │ • Download Exports (txt)   │
└───────────────────────────┴───────────────────────────────┴────────────────────────────┘
```
