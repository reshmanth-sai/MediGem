"""Script generating synthetic test fixtures for prompt regression benchmarking."""

from pathlib import Path
import fitz
from PIL import Image, ImageDraw

FIXTURES_DIR = Path(__file__).parent / "fixtures"
FIXTURES_DIR.mkdir(parents=True, exist_ok=True)

# 1. Generate ECG sample fixture
ecg_path = FIXTURES_DIR / "sample_ecg.png"
img_ecg = Image.new("RGB", (400, 200), color=(255, 255, 255))
d_ecg = ImageDraw.Draw(img_ecg)
d_ecg.line([(0, 100), (100, 100), (120, 40), (140, 160), (160, 100), (400, 100)], fill=(255, 0, 0), width=3)
d_ecg.text((10, 10), "Synthetic 12-Lead ECG Sample", fill=(0, 0, 0))
img_ecg.save(ecg_path)

# 2. Generate Lab Report PDF sample fixture
report_path = FIXTURES_DIR / "sample_report.pdf"
doc = fitz.open()
page = doc.new_page(width=400, height=300)
page.insert_text((20, 30), "SYNTHETIC BLOOD LAB REPORT\nPatient: P-FIXTURE-101\nHemoglobin: 11.5 g/dL\nWBC Count: 14,500 /uL (ELEVATED)\nGlucose: 105 mg/dL")
doc.save(str(report_path))
doc.close()

# 3. Generate Prescription sample fixture
rx_path = FIXTURES_DIR / "sample_prescription.png"
img_rx = Image.new("RGB", (350, 250), color=(255, 255, 255))
d_rx = ImageDraw.Draw(img_rx)
d_rx.text((20, 20), "Rx: Amoxicillin Verification\nTake oral tablet twice daily.", fill=(0, 0, 0))
img_rx.save(rx_path)

# 4. Generate Wound sample fixture
wound_path = FIXTURES_DIR / "sample_wound.png"
img_w = Image.new("RGB", (300, 300), color=(220, 180, 160))
d_w = ImageDraw.Draw(img_w)
d_w.ellipse([(100, 100), (200, 200)], fill=(180, 40, 40), outline=(120, 20, 20), width=2)
d_w.text((10, 10), "Synthetic Wound Inspection Sample", fill=(0, 0, 0))
img_w.save(wound_path)

print("Test fixtures generated successfully in tests/fixtures/")
