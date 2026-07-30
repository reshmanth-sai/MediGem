"""Metadata Extractor for images and PDF documents."""

from pathlib import Path
from typing import Optional
import fitz  # PyMuPDF
from PIL import Image

from backend.input.exceptions import DocumentParsingError
from backend.input.models import DocumentMetadata, ImageMetadata
from backend.logging import logger


class MetadataExtractor:
    """Extractor for image and PDF document technical metadata."""

    @staticmethod
    def extract_image_metadata(image_path: str) -> ImageMetadata:
        """Extract width, height, channels, DPI, and file size from image."""
        path = Path(image_path)
        if not path.exists():
            raise FileNotFoundError(f"Image file not found: {image_path}")

        file_size = path.stat().st_size
        mime = f"image/{path.suffix.lstrip('.').lower()}"

        try:
            with Image.open(path) as img:
                width, height = img.size
                channels = len(img.getbands())
                dpi_info = img.info.get("dpi")
                dpi = int(dpi_info[0]) if dpi_info and isinstance(dpi_info, (tuple, list)) else None

                return ImageMetadata(
                    width=width,
                    height=height,
                    channels=channels,
                    resolution_dpi=dpi,
                    file_size_bytes=file_size,
                    mime_type=mime,
                )
        except Exception as e:
            logger.error(f"Failed to extract image metadata for {image_path}: {e}")
            raise DocumentParsingError(f"Could not parse image metadata for {image_path}: {e}") from e

    @staticmethod
    def extract_pdf_metadata(pdf_path: str) -> DocumentMetadata:
        """Extract page count, file size, text layer, and embedded images from PDF."""
        path = Path(pdf_path)
        if not path.exists():
            raise FileNotFoundError(f"PDF file not found: {pdf_path}")

        file_size = path.stat().st_size

        try:
            doc = fitz.open(pdf_path)
            page_count = len(doc)

            has_text = False
            has_images = False

            for page in doc:
                text = page.get_text().strip()
                if len(text) > 20:
                    has_text = True
                image_list = page.get_images()
                if len(image_list) > 0:
                    has_images = True

            doc.close()

            return DocumentMetadata(
                page_count=page_count,
                format="PDF",
                file_size_bytes=file_size,
                has_text_layer=has_text,
                has_images=has_images,
            )
        except Exception as e:
            logger.error(f"Failed to extract PDF metadata for {pdf_path}: {e}")
            raise DocumentParsingError(f"Could not parse PDF metadata for {pdf_path}: {e}") from e


# Global Singleton MetadataExtractor Instance
metadata_extractor = MetadataExtractor()
