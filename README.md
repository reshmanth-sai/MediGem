# MediGem

> **Offline AI Co-Pilot for Rural Healthcare Workers**

MediGem is a multimodal, offline-first AI assistant designed for healthcare providers in resource-constrained and rural environments. Built for the **Build with Gemma Hackathon**.

---

## 🛠️ Technology Stack

- **Primary AI Engine**: Ollama (Gemma 3 4B / Gemma 2B / MedGemma)
- **Safety Gate**: Deterministic Rule-Based Emergency Engine (No AI / Zero LLM Dependency)
- **Backend Architecture**: Clean Architecture, Pydantic v2, Python 3.14+
- **Frontend / UI**: Gradio
- **Computer Vision & Image Processing**: OpenCV, Pillow (PIL), Scikit-Image
- **Document & Data Processing**: PyMuPDF (`fitz`), PyTesseract, Pandas, NumPy
- **Logging & Diagnostics**: Rich, Standard Logging

---

## 🚨 Emergency Safety Engine Architecture (Phase 3)

The **Emergency Safety Engine** operates as an immediate, deterministic safety gate. It evaluates patient symptoms **BEFORE** any LLM or AI inference occurs.

### Workflow Gate
```text
Patient Input (Symptoms)
        ↓
Text Normalization & Synonym Expansion
        ↓
Emergency Safety Engine (JSON Rule Database)
        ↓
Emergency Detected?
  ├─► YES ──► Immediate Emergency Response (Ambulance / Referral)
  │            safe_for_ai_processing = False (Gemma BLOCKED)
  └─► NO  ──► Continue to Gemma AI Multimodal Analysis
               safe_for_ai_processing = True
```

### Key Architectural Characteristics
1. **100% Deterministic**: No AI, Ollama, or probabilistic reasoning.
2. **Externalized JSON Rules**: Rules are stored separately in `backend/emergency/rules.json`.
3. **Synonym Matching**: Synonym dictionary resolves colloquial expressions (e.g., `"passed out"` -> `"loss of consciousness"`, `"dyspnea"` -> `"shortness of breath"`).
4. **Transparent Explanations**: Generates human-readable `matched_reason` for auditing.
5. **Score & Priority**: Computes `rule_match_score` and resolves conflicts using priority hierarchy (`CRITICAL` > `HIGH` > `MEDIUM` > `LOW`).

---

## 📂 Project Directory Structure

```
MediGem/
├── app.py                  # Main application entry point (Placeholder)
├── backend/                # Modular backend package
│   ├── config/             # Environment settings & constants
│   ├── emergency/          # Emergency Safety Engine
│   │   ├── constants.py    # EmergencyCategory, RulePriority, RecommendedAction
│   │   ├── engine.py       # Priority resolution engine & transparent explanation builder
│   │   ├── evaluator.py    # Synonym-aware symptom evaluator & matching algorithm
│   │   ├── exceptions.py   # EmergencyEngineError, InvalidRuleDefinitionError
│   │   ├── models.py       # EmergencyRule, EmergencyResponse schemas
│   │   ├── rules.json      # Externalized JSON rule database & synonym dictionary
│   │   └── rules.py        # JSON rule loader & persistence manager
│   ├── exceptions/         # Custom exception hierarchy
│   ├── logging/            # Central logging infrastructure
│   ├── pipeline/           # Abstract pipeline workflow interfaces
│   ├── schemas/            # Modular Pydantic v2 schemas
│   ├── services/           # Abstract Base Class interfaces
│   └── utils/              # Generic helper utilities
├── frontend/               # Gradio UI components & layouts
├── logs/                   # Application log files (app.log)
├── outputs/                # Generated reports & exported artifacts
├── sample_data/            # Sample healthcare datasets
├── tests/                  # Automated verification & test suite
│   ├── health_check.py            # System diagnostic & health check suite
│   ├── test_emergency_engine.py   # Emergency engine unit tests
│   ├── test_dependencies.py       # Package import verification
│   ├── test_gradio.py             # Gradio interface verification
│   ├── test_image_processing.py   # Image loader verification
│   └── test_offline_inference.py  # Ollama Gemma inference test
├── tmp/                    # Temporary working files
├── .env.example            # Environment configuration template
├── .gitignore              # Git ignore configuration
├── README.md               # Project overview & guide
└── requirements.txt        # Frozen Python dependencies
```

---

## 💡 How to Add New Emergency Rules

Rules are completely decoupled from Python code. To add a new emergency trigger rule:

Add an entry to `backend/emergency/rules.json`:

```json
{
  "rule_id": "R-HEAT-01",
  "rule_name": "Heat Stroke Emergency",
  "description": "Triggers on high fever with absence of sweating during extreme heat.",
  "symptoms_required": ["extreme heat fever", "no sweating"],
  "min_match_count": 1,
  "priority": 3,
  "recommended_action": "IMMEDIATE_REFERRAL",
  "emergency_category": "GENERAL_EMERGENCY",
  "enabled": true
}
```

Or add dynamically at runtime in Python:
```python
from backend.emergency import emergency_engine, EmergencyRule, RulePriority, EmergencyCategory

custom_rule = EmergencyRule(
    rule_id="R-HEAT-01",
    rule_name="Heat Stroke Emergency",
    description="Custom heat stroke trigger",
    symptoms_required=["extreme heat fever"],
    min_match_count=1,
    priority=RulePriority.HIGH,
    emergency_category=EmergencyCategory.GENERAL_EMERGENCY,
)
emergency_engine.add_rule(custom_rule)
```

---

## 🧪 Verification & Unit Testing

Run the emergency engine test suite:

```bash
python -m unittest tests/test_emergency_engine.py
```

Run system health diagnostics:
```bash
python tests/health_check.py
```
