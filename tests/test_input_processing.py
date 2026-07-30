"""Unit test suite for Input Processing Framework (Phase 7)."""

import unittest
from pathlib import Path
import fitz
from PIL import Image, ImageDraw
from pydantic import ValidationError

from backend.config import settings
from backend.input import (
    ContentExtractor,
    ContentSource,
    ExtractedContent,
    InputRouter,
    InputType,
    MetadataExtractor,
    ProcessedMedicalInput,
    QualityAssessmentEngine,
    QualityLevel,
    check_input_health,
    content_extractor,
    input_router,
    metadata_extractor,
    quality_engine,
)
from backend.pipeline import MedicalModality


class TestInputProcessingFramework(unittest.TestCase):
    """Test suite verifying InputRouter, ContentExtractor, MetadataExtractor, QualityAssessmentEngine, and ProcessedMedicalInput."""

    @classmethod
    def setUpClass(cls) -> None:
        cls.tmp_dir = settings.TMP_DIR
        cls.sample_img_path = cls.tmp_dir / "test_sample_img.png"
        cls.sample_pdf_path = cls.tmp_dir / "test_sample_pdf.pdf"

        # Create sample image
        img = Image.new("RGB", (400, 300), color=(240, 240, 240))
        d = ImageDraw.Draw(img)
        d.text((20, 20), "Sample Lab Report Blood Test Results", fill=(0, 0, 0))
        img.save(cls.sample_img_path)

        # Create sample PDF with text layer
        doc = fitz.open()
        page = doc.new_page(width=400, height=300)
        page.insert_text((20, 30), "Clinical Lab Report Text Layer Data")
        doc.save(str(cls.sample_pdf_path))
        doc.close()

    @classmethod
    def tearDownClass(cls) -> None:
        if cls.sample_img_path.exists():
            cls.sample_img_path.unlink()
        if cls.sample_pdf_path.exists():
            cls.sample_pdf_path.unlink()

    # 1. Test Input Router Inference & Routing
    def test_input_router_type_inference(self) -> None:
        router = InputRouter()
        self.assertEqual(router.infer_input_type(file_path=str(self.sample_img_path)), InputType.IMAGE)
        self.assertEqual(router.infer_input_type(file_path=str(self.sample_pdf_path)), InputType.PDF)
        self.assertEqual(router.infer_input_type(raw_text="Fever symptoms"), InputType.TEXT)

    # 2. Test Metadata Extractor
    def test_metadata_extractor(self) -> None:
        img_meta = metadata_extractor.extract_image_metadata(str(self.sample_img_path))
        self.assertEqual(img_meta.width, 400)
        self.assertEqual(img_meta.height, 300)
        self.assertGreater(img_meta.file_size_bytes, 0)

        pdf_meta = metadata_extractor.extract_pdf_metadata(str(self.sample_pdf_path))
        self.assertEqual(pdf_meta.page_count, 1)
        self.assertTrue(pdf_meta.has_text_layer)

    # 3. Test Quality Assessment Engine
    def test_quality_assessment_engine(self) -> None:
        quality = quality_engine.evaluate_image_quality(str(self.sample_img_path))
        self.assertIsNotNone(quality.blur_score)
        self.assertIsInstance(quality.quality_level, QualityLevel)

    # 4. Test Content Extractor (PDF text layer without OCR & Optional OCR)
    def test_content_extractor_pdf_text_layer(self) -> None:
        content, ocr_performed = content_extractor.extract_content(
            input_type=InputType.PDF,
            modality=MedicalModality.LAB_REPORT,
            file_path=str(self.sample_pdf_path),
        )
        self.assertFalse(ocr_performed)
        self.assertIsNotNone(content)
        self.assertEqual(content.source, ContentSource.TEXT_LAYER)
        self.assertIn("Clinical Lab Report", content.text)

    def test_content_extractor_image_ocr_skipped_for_ecg(self) -> None:
        content, ocr_performed = content_extractor.extract_content(
            input_type=InputType.IMAGE,
            modality=MedicalModality.ECG,
            file_path=str(self.sample_img_path),
        )
        self.assertFalse(ocr_performed)
        self.assertIsNone(content)

    # 5. Test ProcessedMedicalInput Creation & Immutability
    def test_processed_medical_input_immutability(self) -> None:
        processed: ProcessedMedicalInput = input_router.process_input(
            request_id="REQ-INPUT-01",
            modality=MedicalModality.LAB_REPORT,
            file_path=str(self.sample_pdf_path),
        )

        self.assertEqual(processed.request_id, "REQ-INPUT-01")
        self.assertEqual(processed.input_type, InputType.PDF)
        self.assertEqual(processed.modality, MedicalModality.LAB_REPORT)

        # Verify immutability (frozen Pydantic model)
        with self.assertRaises(ValidationError):
            processed.request_id = "MUTATED"  # type: ignore

    # 6. Test Health Check Execution
    def test_check_input_health(self) -> None:
        health_ok = check_input_health()
        self.assertTrue(health_ok)


if __name__ == "__main__":
    unittest.main()
