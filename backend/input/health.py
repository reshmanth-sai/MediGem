"""Diagnostic health check module for Input Processing Framework running real sample inputs."""

import os
import tempfile
import fitz
from PIL import Image, ImageDraw

from backend.config import settings
from backend.input.models import InputType, ProcessedMedicalInput
from backend.input.router import input_router
from backend.logging import logger
from backend.pipeline.context import MedicalModality


def check_input_health() -> bool:
    """Execute diagnostic check on Input Processing Framework using real sample files."""
    tmp_dir = settings.TMP_DIR
    sample_img_path = tmp_dir / "diag_sample.png"
    sample_pdf_path = tmp_dir / "diag_sample.pdf"

    try:
        # 1. Create real sample image
        img = Image.new("RGB", (300, 200), color=(255, 255, 255))
        d = ImageDraw.Draw(img)
        d.text((10, 10), "MediGem Diagnostic Sample Image", fill=(0, 0, 0))
        img.save(sample_img_path)

        # 2. Create real sample PDF with text layer
        doc = fitz.open()
        page = doc.new_page(width=300, height=200)
        page.insert_text((10, 30), "MediGem Diagnostic Sample PDF Text Layer")
        doc.save(str(sample_pdf_path))
        doc.close()

        # 3. Test Image Processing through Router
        processed_img: ProcessedMedicalInput = input_router.process_input(
            request_id="HEALTH-IMG-01",
            modality=MedicalModality.GENERAL,
            file_path=str(sample_img_path),
        )
        assert processed_img.input_type == InputType.IMAGE
        assert processed_img.image_metadata is not None
        assert processed_img.quality is not None

        # 4. Test PDF Processing through Router (Text layer extraction)
        processed_pdf: ProcessedMedicalInput = input_router.process_input(
            request_id="HEALTH-PDF-01",
            modality=MedicalModality.LAB_REPORT,
            file_path=str(sample_pdf_path),
        )
        assert processed_pdf.input_type == InputType.PDF
        assert processed_pdf.document_metadata is not None
        assert processed_pdf.extracted_content is not None
        assert processed_pdf.extracted_content.has_text

        # 5. Test Plain Text Processing
        processed_txt: ProcessedMedicalInput = input_router.process_input(
            request_id="HEALTH-TXT-01",
            modality=MedicalModality.GENERAL,
            raw_text="Fever and chills",
        )
        assert processed_txt.input_type == InputType.TEXT
        assert processed_txt.extracted_content is not None

        logger.info("Input Processing Framework diagnostic health check PASSED cleanly.")
        return True

    except Exception as e:
        logger.error(f"Input Processing Framework diagnostic health check FAILED: {e}")
        return False
    finally:
        # Cleanup temporary diagnostic files
        if sample_img_path.exists():
            sample_img_path.unlink()
        if sample_pdf_path.exists():
            sample_pdf_path.unlink()
