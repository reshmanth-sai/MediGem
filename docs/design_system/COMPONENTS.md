# MediGem Atomic Component Library Specifications

> **Visual Specifications, Interaction States & Padding for Core UI Components**

---

## 🔘 Button Components

```text
┌─────────────────┬─────────────────┬──────────────┬──────────────────┬─────────────────┐
│ Variant         │ Background HEX  │ Text Color   │ Border           │ Hover State     │
├─────────────────┼─────────────────┼──────────────┼──────────────────┼─────────────────┤
│ Primary         │ #0D9488         │ #FFFFFF      │ None             │ #0F766E, Y(-2px)│
│ Secondary       │ #FFFFFF         │ #0F172A      │ 1px solid #CBD5E1│ #F8FAFC, #0D9488 │
│ Emergency       │ #DC2626         │ #FFFFFF      │ None             │ #B91C1C, Pulse  │
│ Ghost           │ Transparent     │ #0D9488      │ None             │ #F0FDFA         │
│ Disabled        │ #E2E8F0         │ #94A3B8      │ None             │ Cursor: not-allowed│
└─────────────────┴─────────────────┴──────────────┴──────────────────┴─────────────────┘
```

- **Height**: Large (`44px`), Medium (`36px`), Small (`32px`).
- **Border Radius**: `8px` (`--radius-md`).
- **Padding**: Large (`0 20px`), Medium (`0 16px`), Small (`0 12px`).

---

## 📝 Input Components

### 1. Text Field & Textarea
- **Background**: `#FFFFFF`
- **Border**: `1px solid #CBD5E1` (`--radius-md: 8px`)
- **Focus State**: `border-color: #0D9488`, `box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.15)`
- **Label**: `0.85rem` Medium (`#334155`), `margin-bottom: 6px`

### 2. Drag-and-Drop Upload Area
- **Background**: `#F8FAFC`
- **Border**: `2px dashed #CBD5E1` (`--radius-card: 14px`)
- **Hover State**: Background `#F0FDFA`, Border `#0D9488`
- **Icon**: `📁 Medical File Upload` (PDF, PNG, JPG)

---

## 🃏 Card Components

### Standard Clinical Card (`.medigem-card`)
- **Background**: `#FFFFFF`
- **Border**: `1px solid #E2E8F0`
- **Border Radius**: `14px` (`--radius-card`)
- **Padding**: `20px` (`--spacing-5`)
- **Shadow**: `0 1px 3px 0 rgba(0, 0, 0, 0.05)`
- **Hover Transition**: `transform: translateY(-2px)`, `box-shadow: 0 8px 16px -2px rgba(15, 23, 42, 0.08)`, `border-color: #CBD5E1`
