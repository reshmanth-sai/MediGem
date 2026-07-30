"""File manipulation and path utility functions."""

import os
from pathlib import Path
from typing import Set, Union

from backend.config.constants import ALLOWED_FILE_EXTENSIONS
from backend.exceptions import AppValidationError


def ensure_directory_exists(path: Union[str, Path]) -> Path:
    """Ensure directory exists on local filesystem."""
    dir_path = Path(path)
    dir_path.mkdir(parents=True, exist_ok=True)
    return dir_path


def is_allowed_file(filename: str, allowed_extensions: Set[str] = ALLOWED_FILE_EXTENSIONS) -> bool:
    """Check if file extension is within allowed set."""
    ext = Path(filename).suffix.lower()
    return ext in allowed_extensions


def get_file_size_bytes(file_path: Union[str, Path]) -> int:
    """Retrieve file size in bytes."""
    path = Path(file_path)
    if not path.exists():
        raise AppValidationError(f"File not found: {file_path}")
    return path.stat().st_size


def read_text_file(file_path: Union[str, Path], encoding: str = "utf-8") -> str:
    """Safely read text file contents."""
    path = Path(file_path)
    if not path.exists():
        raise AppValidationError(f"File not found: {file_path}")
    return path.read_text(encoding=encoding)


def write_text_file(file_path: Union[str, Path], content: str, encoding: str = "utf-8") -> Path:
    """Safely write text content to file, creating parent directories if missing."""
    path = Path(file_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding=encoding)
    return path
