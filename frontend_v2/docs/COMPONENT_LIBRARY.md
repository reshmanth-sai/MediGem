# MediGem Reusable Component Library Specification

> **Exhaustive Component API Reference for Version 2**

---

## 📦 Component Index

### 1. Typography Primitives (`components/ui/Typography.tsx`)
- `<Display>`: Page hero text (36px Bold)
- `<PageTitle>`: Page header (28px Bold)
- `<SectionTitle>`: Section header (21.6px SemiBold)
- `<CardTitle>`: Card title (17.6px SemiBold)
- `<BodyText>`: Primary text (15.2px Regular)
- `<Caption>`: Captions (12.5px Medium)
- `<CodeBlock>`: JetBrains Monospace formatted code
- `<MedicalLabel>`: UPPERCASE teal category header

### 2. Buttons (`components/ui/Button.tsx`)
- Variants: `primary`, `secondary`, `outline`, `ghost`, `danger`, `emergency`, `success`
- Sizes: `sm`, `md`, `lg`, `icon`

### 3. Medical AI Widgets (`components/medical/` & `components/ai/`)
- `<EmergencyBanner>`: Acute emergency interception alert (`< 0.3ms`)
- `<RiskIndicator>`: Urgency score & risk level badge
- `<ReasoningTransparency>`: "Why was this recommendation generated?" card
- `<StageTracker>`: Live 9-stage pipeline progress tracker (Framer Motion)
- `<QualityMetricsCard>`: OpenCV blur score & OCR confidence metrics
- `<ReferralMemo>`: Printable clinical referral memorandum
