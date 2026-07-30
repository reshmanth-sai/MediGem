"""Pluggable Input Router resolving processors by InputType."""

from pathlib import Path
from typing import Dict, Optional
from backend.config.constants import MedicalModality
from backend.input.exceptions import UnsupportedInputTypeError
from backend.input.models import InputType, ProcessedMedicalInput
from backend.input.processor import (
    BaseInputProcessor,
    ImageProcessor,
    PdfProcessor,
    TextProcessor,
)
from backend.logging import logger


class InputRouter:
    """Pluggable input router registering and dispatching input processors by InputType."""

    def __init__(self) -> None:
        self._processors: Dict[InputType, BaseInputProcessor] = {}
        self._register_default_processors()

    def _register_default_processors(self) -> None:
        """Register default image, PDF, and text processors."""
        self.register_processor(InputType.IMAGE, ImageProcessor())
        self.register_processor(InputType.PDF, PdfProcessor())
        self.register_processor(InputType.TEXT, TextProcessor())

    def register_processor(self, input_type: InputType, processor: BaseInputProcessor) -> None:
        """Register or override processor for specific InputType."""
        self._processors[input_type] = processor
        logger.info(f"Registered InputProcessor '{processor.__class__.__name__}' for InputType '{input_type.value}'.")

    def infer_input_type(self, file_path: Optional[str] = None, raw_text: Optional[str] = None) -> InputType:
        """Infer InputType from file extension or raw text payload."""
        if file_path:
            ext = Path(file_path).suffix.lower()
            if ext in (".png", ".jpg", ".jpeg", ".bmp", ".tiff", ".webp"):
                return InputType.IMAGE
            elif ext == ".pdf":
                return InputType.PDF

        if raw_text:
            return InputType.TEXT

        raise UnsupportedInputTypeError("Could not infer InputType from file path or text payload.")

    def process_input(
        self,
        request_id: str,
        modality: MedicalModality = MedicalModality.GENERAL,
        file_path: Optional[str] = None,
        raw_text: Optional[str] = None,
        override_type: Optional[InputType] = None,
    ) -> ProcessedMedicalInput:
        """Resolve processor and execute input processing pipeline."""
        input_type = override_type or self.infer_input_type(file_path, raw_text)

        if input_type not in self._processors:
            raise UnsupportedInputTypeError(f"No processor registered for InputType '{input_type.value}'.")

        processor = self._processors[input_type]
        logger.info(f"[{request_id}] Dispatching input to processor '{processor.__class__.__name__}' for type '{input_type.value}'.")
        return processor.process_input(
            request_id=request_id,
            modality=modality,
            file_path=file_path,
            raw_text=raw_text,
        )


# Global Singleton InputRouter Instance
input_router = InputRouter()
