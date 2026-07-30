"""Image processing and verification utilities."""

from pathlib import Path
from typing import Tuple, Union
from PIL import Image

from backend.exceptions import ImageProcessingError


def load_pil_image(image_path: Union[str, Path]) -> Image.Image:
    """Safely open and return a PIL Image."""
    path = Path(image_path)
    if not path.exists():
        raise ImageProcessingError(f"Image path does not exist: {image_path}")
    try:
        return Image.open(path)
    except Exception as e:
        raise ImageProcessingError(f"Failed to open image {image_path}: {e}") from e


def get_image_dimensions(image_path: Union[str, Path]) -> Tuple[int, int]:
    """Retrieve (width, height) of image without loading full pixel array into memory."""
    path = Path(image_path)
    if not path.exists():
        raise ImageProcessingError(f"Image path does not exist: {image_path}")
    try:
        with Image.open(path) as img:
            return img.size
    except Exception as e:
        raise ImageProcessingError(f"Failed to inspect image dimensions: {e}") from e


def convert_image_to_rgb(image: Image.Image) -> Image.Image:
    """Convert PIL image to RGB mode if not already in RGB format."""
    if image.mode != "RGB":
        return image.convert("RGB")
    return image


def is_valid_image(image_path: Union[str, Path]) -> bool:
    """Check if file can be opened as a valid image."""
    try:
        with Image.open(image_path) as img:
            img.verify()
        return True
    except Exception:
        return False
