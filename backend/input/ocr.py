"""OCR Service wrapping Tesseract and image text extraction engines."""

from abc import ABC, abstractmethod
from pathlib import Path
from typing import Optional
from PIL import Image
import pytesseract

from backend.input.exceptions import OCRError
from backend.input.models import ContentSource, ExtractedContent
from backend.logging import logger


class BaseOCREngine(ABC):
    """Abstract interface for OCR drivers."""

    @abstractmethod
    def extract_text(self, image_path: str, lang: str = "eng") -> ExtractedContent:
        """Extract text from image file path."""
        pass


class TesseractEngine(BaseOCREngine):
    """Tesseract OCR engine implementation."""

    def extract_text(self, image_path: str, lang: str = "eng") -> ExtractedContent:
        path = Path(image_path)
        if not path.exists():
            raise OCRError(f"Image file not found for OCR: {image_path}")

        try:
            img = Image.open(path)
            text = pytesseract.image_to_string(img, lang=lang).strip()

            data = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)
            confidences = [int(c) for c in data.get("conf", []) if int(c) >= 0]
            avg_conf = (sum(confidences) / len(confidences) / 100.0) if confidences else (0.85 if text else 0.0)

            return ExtractedContent(
                text=text,
                source=ContentSource.OCR_IMAGE,
                confidence=round(avg_conf, 2),
                language=lang,
                has_text=len(text) > 0,
            )
        except Exception as e:
            logger.warning(f"Tesseract OCR failed for {image_path}: {e}")
            return ExtractedContent(
                text="",
                source=ContentSource.OCR_IMAGE,
                confidence=0.0,
                language=lang,
                has_text=False,
            )


class OCRService:
    """Service wrapping OCR engine implementations."""

    def __init__(self, engine: Optional[BaseOCREngine] = None) -> None:
        self.engine: BaseOCREngine = engine or TesseractEngine()

    def extract_from_image(self, image_path: str, lang: str = "eng") -> ExtractedContent:
        """Extract text content from image file using active engine."""
        return self.engine.extract_text(image_path, lang=lang)


# Global Singleton OCRService Instance
ocr_service = OCRService()
