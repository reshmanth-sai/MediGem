# MediGem AI & Medical UI Component Specifications

> **Specialized Specifications for Clinical Safety & AI Transparency Widgets**

---

## 🚨 1. Emergency Interception Banner

- **Purpose**: Rendered immediately when the Emergency Safety Engine detects acute symptoms in `< 0.3ms`.
- **Background**: `#FEF2F2`
- **Border**: `6px solid #DC2626` (Left accent border), `1px solid #FCA5A5`
- **Border Radius**: `14px`
- **Header Badge**: `🚨 ACUTE EMERGENCY INTERCEPTED (URGENCY: 10/10)`
- **Body Text**: Bold `#991B1B` explaining: *"Deterministic Emergency Safety Engine intercepted critical symptoms. LLM inference blocked for immediate patient safety."*

---

## 🟢 2. Risk Assessment Badge Card

- **Purpose**: Displays assessed risk level (`LOW`, `MODERATE`, `HIGH`, `EMERGENCY`) alongside urgency score.
- **Card Background**: `#FFFFFF`
- **Border**: `1px solid #E2E8F0`
- **Risk Badge Pill**:
  - `padding: 8px 16px`, `border-radius: 9999px`, `font-weight: 700`, `font-size: 1.05rem`
- **Urgency Score Indicator**: `#0F172A` text displaying `URGENCY SCORE: 6.5 / 10`.

---

## 💡 3. Reasoning Transparency Card ("Why Was This Recommendation Generated?")

- **Purpose**: Builds clinical trust by explaining empirical decision factors.
- **Background**: `#F0FDFA` (Light Teal Tint)
- **Border**: `1px solid #CCFBF1`
- **Title**: `💡 Why was this recommendation generated? (Reasoning Transparency)` in `#0F766E` SemiBold.
- **Bullet Items**: `#334155` text detailing:
  - Modality evaluated (e.g. `LAB_REPORT`, `ECG`, `WOUND`, `PRESCRIPTION`).
  - Emergency safety gate status (`PASSED` in `< 0.3ms`).
  - Document extraction provenance (e.g. *"PDF text layer extracted directly via PyMuPDF (OCR skipped, 100% text confidence)"*).
  - OpenCV visual quality score (e.g. *"Image quality rated GOOD (Laplacian blur variance 245.2)"*).

---

## ⟳ 4. Live Stage Pipeline Tracker

- **Purpose**: Visualizes pipeline stages in real time during analysis execution.
- **Layout**: 3-Column Grid displaying 9 stage items:
  1. `✓ Upload Complete`
  2. `✓ Input Processing`
  3. `✓ OCR Extraction`
  4. `✓ Context Fusion`
  5. `⟳ Gemma Reasoning` (Active pulsing teal animation)
  6. `□ Output Validation`
  7. `□ Safety Guard`
  8. `□ Explanation Builder`
  9. `□ Completed`
- **Active Stage Style**: `#0D9488` bold text with `animation: pulse 1.5s infinite`.
- **Completed Stage Style**: `#0F766E` SemiBold text with `✓` checkmark.

---

## 📋 5. Clinical Referral Memorandum Drawer

- **Purpose**: Displays printable clinical referral note for facility transfers.
- **Background**: `#FFFFFF`
- **Border**: `1px solid #CBD5E1`
- **Typography**: Monospace font (`'JetBrains Mono'`) representing a formal clinical memo header (`CLINICAL REFERRAL MEMORANDUM`).
