"""Content Extractor pipeline orchestrating searchable text layer vs optional OCR extraction."""

from typing import Optional, Tuple
import fitz  # PyMuPDF

from backend.input.models import ContentSource, ExtractedContent, InputType
from backend.input.ocr import ocr_service
from backend.logging import logger
from backend.pipeline.context import MedicalModality


class ContentExtractor:
    """Smart content extractor selecting PDF text layer, plain text, or optional OCR."""

    @staticmethod
    def extract_content(
        input_type: InputType,
        modality: MedicalModality,
        file_path: Optional[str] = None,
        raw_text_input: Optional[str] = None,
    ) -> Tuple[Optional[ExtractedContent], bool]:
        """Extract text content and return (ExtractedContent, ocr_performed_boolean)."""
        ocr_performed = False

        # 1. Plain Text Input
        if input_type == InputType.TEXT or raw_text_input:
            text = raw_text_input or ""
            return ExtractedContent(
                text=text.strip(),
                source=ContentSource.MANUAL_TEXT,
                confidence=1.0,
                language="eng",
                has_text=len(text.strip()) > 0,
            ), ocr_performed

        # 2. PDF Document Input
        if input_type == InputType.PDF and file_path:
            try:
                doc = fitz.open(file_path)
                full_text = []
                for page in doc:
                    txt = page.get_text().strip()
                    if txt:
                        full_text.append(txt)
                doc.close()

                combined_text = "\n\n".join(full_text).strip()
                if combined_text:
                    logger.info(f"Extracted {len(combined_text)} chars directly from PDF text layer (OCR skipped).")
                    return ExtractedContent(
                        text=combined_text,
                        source=ContentSource.TEXT_LAYER,
                        confidence=1.0,
                        language="eng",
                        has_text=True,
                    ), ocr_performed
            except Exception as e:
                logger.warning(f"Failed to read PDF text layer for {file_path}: {e}")

        # 3. Image Input: Run OCR ONLY for Lab Reports and Prescriptions!
        if input_type == InputType.IMAGE and file_path:
            if modality in (MedicalModality.LAB_REPORT, MedicalModality.PRESCRIPTION):
                logger.info(f"Modality '{modality.value}' requires text extraction. Running Tesseract OCR.")
                ocr_performed = True
                content = ocr_service.extract_from_image(file_path)
                return content, ocr_performed
            else:
                logger.info(f"Modality '{modality.value}' does not require text extraction. OCR skipped.")
                return None, False

        return None, False


# Global Singleton ContentExtractor Instance
content_extractor = ContentExtractor()
