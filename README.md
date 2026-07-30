# MediGem

> **Offline AI Co-Pilot for Rural Healthcare Workers**

MediGem is a multimodal, offline-first AI assistant designed for healthcare providers in resource-constrained and rural environments. Built for the **Build with Gemma Hackathon**.

---

## 🛠️ Technology Stack

- **Primary AI Engine**: Ollama (Gemma 3 4B / Gemma 2B / MedGemma)
- **Language & Runtime**: Python 3.14+
- **Frontend / UI**: Gradio
- **Computer Vision & Image Processing**: OpenCV, Pillow (PIL), Scikit-Image
- **Document & Data Processing**: PyMuPDF (`fitz`), PyTesseract, Pandas, NumPy
- **API & Schemas**: Pydantic, Python-Dotenv, Requests
- **UI Terminal & Formatting**: Rich, Markdown

---

## 📂 Project Directory Structure

```
MediGem/
├── app.py                  # Main application entry point (Placeholder)
├── backend/                # Modular backend package
│   ├── ai/                 # Ollama LLM integration & offline inference
│   ├── emergency/          # Triage & emergency protocols
│   ├── prompts/            # Prompt templates & system instructions
│   ├── models/             # Data models & schemas
│   ├── services/           # Business logic & domain services
│   ├── utils/              # Utility helpers & file parsers
│   ├── config/             # Environment configuration & settings
│   └── validation/         # Input & output validation logic
├── frontend/               # Gradio UI components & layouts
├── assets/                 # Static assets, branding, and test images
├── outputs/                # Generated reports & exported artifacts
├── sample_data/            # Sample healthcare datasets
│   ├── ecg/                # Sample ECG wave images/data
│   ├── prescriptions/      # Sample prescription scans
│   ├── reports/            # Lab reports & clinical notes
│   └── wounds/             # Wound visual inspection samples
├── tests/                  # Automated verification & test suite
│   ├── test_dependencies.py
│   ├── test_gradio.py
│   └── test_image_processing.py
├── docs/                   # Project documentation
├── .env.example            # Environment settings template
├── .gitignore              # Git ignore configuration
├── README.md               # Project overview & guide
└── requirements.txt        # Frozen Python dependencies
```

---

## 🚀 Environment Setup & Installation

### Prerequisites
1. **Python 3.10+** (Python 3.14 used)
2. **Git**
3. **Ollama CLI** (`brew install ollama` or official installer)

### 1. Clone & Navigate
```bash
git clone <repository-url>
cd MediGem
```

### 2. Virtual Environment Setup
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Setup Ollama & Gemma Models
Ensure Ollama service is running:
```bash
brew services start ollama
# OR
ollama serve
```

Pull the required Gemma models:
```bash
ollama pull gemma3:4b
# or fallback fast model
ollama pull gemma2:2b
```

---

## 🧪 Verification & Testing

Run the environment test suite to verify all core dependencies and tools:

```bash
# 1. Verify python package imports
python tests/test_dependencies.py

# 2. Verify Gradio interface setup
python tests/test_gradio.py

# 3. Verify Image processing capabilities
python tests/test_image_processing.py
```

---

## 💻 How to Start Development

Once the hackathon begins:
1. Copy `.env.example` to `.env` and adjust configuration if necessary:
   ```bash
   cp .env.example .env
   ```
2. Activate virtual environment:
   ```bash
   source .venv/bin/activate
   ```
3. Run `app.py`:
   ```bash
   python app.py
   ```
