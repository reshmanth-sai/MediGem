# MediGem Zod Schema & Form Validation Guide

> **Zod Schema Definitions for Patient Intake**

```typescript
import { z } from "zod";

export const PatientDetailsSchema = z.object({
  patientName: z.string().min(1, "Patient name is required"),
  age: z.number().min(0).max(120),
  gender: z.enum(["Male", "Female", "Other"]),
  chiefComplaint: z.string().min(3, "Chief complaint required"),
});
```
