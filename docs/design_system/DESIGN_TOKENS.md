# MediGem Framework-Independent Design Tokens

> **Single Source of Truth for Tokens (CSS Variables & JSON Spec)**

Design tokens provide framework-independent values for styling MediGem in React, Next.js, Gradio, Flutter, or native mobile platforms.

---

## 🎨 CSS Variables Specification

```css
:root {
  /* Brand Primary Teal Palette */
  --medigem-teal-50: #F0FDFA;
  --medigem-teal-100: #CCFBF1;
  --medigem-teal-200: #99F6E4;
  --medigem-teal-500: #14B8A6;
  --medigem-teal-600: #0D9488; /* Primary Brand Teal */
  --medigem-teal-700: #0F766E; /* Dark Accent Teal */
  --medigem-teal-900: #134E48;

  /* Neutral Slate Palette */
  --medigem-slate-50: #F8FAFC; /* Page Background */
  --medigem-slate-100: #F1F5F9;
  --medigem-slate-200: #E2E8F0; /* Border Color */
  --medigem-slate-300: #CBD5E1;
  --medigem-slate-500: #64748B; /* Muted Text */
  --medigem-slate-700: #334155;
  --medigem-slate-800: #1E293B; /* Card Dark Background */
  --medigem-slate-900: #0F172A; /* Primary Dark Text */

  /* Medical Semantic Colors */
  --medigem-emergency-bg: #FEE2E2;
  --medigem-emergency-text: #B91C1C;
  --medigem-emergency-border: #FCA5A5;

  --medigem-high-bg: #FFEDD5;
  --medigem-high-text: #C2410C;
  --medigem-high-border: #FDBA74;

  --medigem-warning-bg: #FEF9C3;
  --medigem-warning-text: #A16207;
  --medigem-warning-border: #FDE047;

  --medigem-success-bg: #DCFCE7;
  --medigem-success-text: #15803D;
  --medigem-success-border: #86EFAC;

  /* Spacing Scale (4px Grid) */
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-5: 20px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-10: 40px;
  --spacing-12: 48px;

  /* Border Radii */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-card: 14px;
  --radius-full: 9999px;

  /* Elevation Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-card: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
  --shadow-card-hover: 0 8px 16px -2px rgba(15, 23, 42, 0.08);

  /* Motion Curves */
  --motion-spring: cubic-bezier(0.4, 0, 0.2, 1);
  --duration-fast: 150ms;
  --duration-normal: 250ms;
}
```

---

## 📄 JSON Design Tokens Schema

```json
{
  "color": {
    "primary": { "value": "#0D9488" },
    "primary_dark": { "value": "#0F766E" },
    "background": { "value": "#F8FAFC" },
    "surface": { "value": "#FFFFFF" },
    "text_main": { "value": "#0F172A" },
    "text_muted": { "value": "#64748B" },
    "border": { "value": "#E2E8F0" }
  },
  "typography": {
    "font_family": { "value": "Inter, system-ui, sans-serif" },
    "h1": { "size": "1.75rem", "weight": "700", "line_height": "1.2" },
    "h2": { "size": "1.35rem", "weight": "600", "line_height": "1.3" },
    "body": { "size": "0.95rem", "weight": "400", "line_height": "1.5" },
    "caption": { "size": "0.8rem", "weight": "500", "line_height": "1.4" }
  },
  "spacing": {
    "grid_base": { "value": "4px" },
    "card_padding": { "value": "20px" },
    "section_gap": { "value": "24px" }
  }
}
```
