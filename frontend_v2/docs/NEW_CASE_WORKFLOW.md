# MediGem New Case Guided Intake Workflow Architecture

> **6-Step Guided Clinical Intake & Form Validation Blueprint**

---

## 🗺️ Guided Intake User Journey Map

```text
┌─────────────────┐     Click "New Case"     ┌────────────────────────┐
│  HOME DASHBOARD │ ────────────────────────►│  STEP 1: PATIENT INFO  │
└─────────────────┘                          └───────────┬────────────┘
                                                         │
                                                         ▼
┌─────────────────┐     Click "Next Step"    ┌────────────────────────┐
│ STEP 3: HISTORY │ ◄────────────────────────│   STEP 2: SYMPTOMS     │
└────────┬────────┘                          └────────────────────────┘
         │
         ▼
┌─────────────────┐     Click "Next Step"    ┌────────────────────────┐
│ STEP 4: UPLOADS │ ────────────────────────►│  STEP 5: CASE REVIEW   │
└─────────────────┘                          └───────────┬────────────┘
                                                         │
                                                         ▼
                                             ┌────────────────────────┐
                                             │ STEP 6: CONFIRM & RUN  │
                                             └────────────────────────┘
```
