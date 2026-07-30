# MediGem Version 2 REST API Specification

> **OpenAPI 3.0 RESTful Endpoint Specification**

FastAPI serves as the API-first backend gateway, exposing structured REST endpoints for the Next.js frontend.

---

## 📡 API Endpoint Index

```text
POST /api/v1/analyze    Execute clinical analysis
POST /api/v1/upload     Upload medical image or PDF file
GET  /api/v1/history    Retrieve session history timeline
GET  /api/v1/health     System health and Ollama model diagnostics
GET  /api/v1/metrics    System benchmark & evaluation metrics
POST /api/v1/demo       Load synthetic demo preset
POST /api/v1/export     Generate downloadable summary files
```

---

## 📝 Detailed Endpoint Contracts

### 1. `POST /api/v1/analyze`
Executes complete clinical analysis through `MediGemOrchestrator`.

#### Request Body
```json
{
  "request_id": "REQ-V2-001",
  "patient": {
    "patient_id": "P-101",
    "age": 45,
    "gender": "Male",
    "symptoms": ["Chest tightness", "Palpitations"],
    "vital_signs": {
      "HR": 95,
      "SystolicBP": 138,
      "DiastolicBP": 88
    }
  },
  "image": {
    "file_path": "/uploads/ecg_strip.png",
    "image_type": "ECG"
  },
  "notes": "Patient presents in rural clinic"
}
```

#### Response (200 OK)
```json
{
  "request_id": "REQ-V2-001",
  "status": "COMPLETED",
  "timestamp": "2026-07-30T12:00:00Z",
  "duration_ms": 5420.5,
  "risk_assessment": {
    "risk_level": "MODERATE",
    "urgency_score": 6.5,
    "rionale": "Elevated vital signs and rhythm observations."
  },
  "summary": "Non-diagnostic clinical summary...",
  "observations": [
    {
      "finding": "Elevated Heart Rate",
      "evidence": "HR recorded at 95 bpm",
      "confidence": "HIGH"
    }
  ],
  "referral_summary": {
    "reason_for_referral": "Rhythm assessment and evaluation required",
    "priority": "ROUTINE",
    "clinical_summary": "Summary text..."
  }
}
```

---

### 2. `GET /api/v1/health`
Returns backend health status, Ollama model connectivity, and emergency gate readiness.

#### Response (200 OK)
```json
{
  "status": "PASS",
  "version": "2.0.0",
  "ollama": {
    "connected": true,
    "model": "gemma3:4b"
  },
  "emergency_engine": {
    "active": true,
    "rules_count": 11
  }
}
```
