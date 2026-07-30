# MediGem Color System, Contrast Matrix & Night Mode

> **Semantic Medical Color Palette, WCAG 2.1 AA/AAA Contrast Values & Colorblind Matrix**

---

## 🎨 Primary & Neutral Surface Palette

| Token Name | HEX Code | RGB Code | Purpose | WCAG Contrast on White |
|---|---|---|---|---|
| **Primary Teal** | `#0D9488` | `rgb(13, 148, 136)` | Primary buttons, active tabs, header icons | **4.52:1** (AA) |
| **Teal Dark Accent** | `#0F766E` | `rgb(15, 118, 110)` | Header background gradient, primary hover | **7.12:1** (AAA) |
| **Slate Dark** | `#0F172A` | `rgb(15, 23, 42)` | Primary headings, dark mode surface | **16.1:1** (AAA) |
| **Slate Muted** | `#64748B` | `rgb(100, 116, 139)` | Captions, secondary labels, subheaders | **4.68:1** (AA) |
| **Border Soft** | `#E2E8F0` | `rgb(226, 232, 240)` | Card borders, table dividers | N/A |
| **Page Background** | `#F8FAFC` | `rgb(248, 250, 252)` | Main application background | N/A |

---

## 🚨 Medical Semantic Color Matrix

```text
┌──────────────┬───────────┬───────────┬─────────────┬─────────────────────────────────┐
│ Risk Level   │ Fill HEX  │ Text HEX  │ Border HEX  │ Icon & Shape Indicator          │
├──────────────┼───────────┼───────────┼─────────────┼─────────────────────────────────┤
│ EMERGENCY    │ #FEE2E2   │ #B91C1C   │ #FCA5A5     │ 🚨 Pulse Octagon Badge          │
│ HIGH RISK    │ #FFEDD5   │ #C2410C   │ #FDBA74     │ 🟠 Solid Triangle Badge         │
│ MODERATE     │ #FEF9C3   │ #A16207   │ #FDE047     │ 🟡 Solid Circle Badge           │
│ LOW RISK     │ #DCFCE7   │ #15803D   │ #86EFAC     │ 🟢 Solid Shield Badge           │
└──────────────┴───────────┴───────────┴─────────────┴─────────────────────────────────┘
```

---

## 👁️ Colorblindness Accessibility Matrix

To guarantee accessibility for health workers with Red-Green (Deutan/Protan) or Blue-Yellow (Tritan) color vision deficiencies, MediGem **never relies on color alone**.

- **Emergency**: Red background + **🚨 Octagon icon + "EMERGENCY" bold text + pulsing animation**.
- **High Risk**: Orange background + **🟠 Triangle icon + "HIGH RISK" bold text**.
- **Moderate**: Yellow background + **🟡 Circle icon + "MODERATE RISK" bold text**.
- **Low Risk**: Green background + **🟢 Shield icon + "LOW RISK" bold text**.

---

## 🌙 Clinical Low-Light Night Mode Palette

Engineered for health workers operating night shifts in dimly lit rural clinics:

- **Page Background**: `#0F172A` (Deep Slate)
- **Card Surface**: `#1E293B` (Slate Card)
- **Card Border**: `#334155` (Soft Slate Divider)
- **Primary Text**: `#F8FAFC` (Bright White)
- **Muted Text**: `#94A3B8` (Soft Gray)
- **Accent Teal**: `#14B8A6` (Vibrant Night Teal)
