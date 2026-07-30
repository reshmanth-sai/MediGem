"""Logging infrastructure for MediGem."""

import logging
import sys
from logging.handlers import RotatingFileHandler
from pathlib import Path
from typing import Optional

from rich.logging import RichHandler
from backend.config import settings


def setup_logger(
    name: str = "MediGem",
    log_file: Optional[Path] = None,
    level: int = logging.INFO,
) -> logging.Logger:
    """Create and configure a multi-handler logger with console and file output."""
    logger = logging.getLogger(name)
    logger.setLevel(level)

    # Avoid duplicate handlers if already initialized
    if logger.handlers:
        return logger

    # 1. Colored Console Handler using Rich
    console_handler = RichHandler(
        rich_tracebacks=True,
        markup=True,
        show_time=True,
        show_path=False,
    )
    console_handler.setLevel(level)
    logger.addHandler(console_handler)

    # 2. File Handler (Rotating log file in logs/app.log)
    if log_file is None:
        log_file = settings.LOGS_DIR / "app.log"

    log_file.parent.mkdir(parents=True, exist_ok=True)

    file_formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    file_handler = RotatingFileHandler(
        log_file,
        maxBytes=5 * 1024 * 1024,  # 5 MB
        backupCount=3,
        encoding="utf-8",
    )
    file_handler.setLevel(level)
    file_handler.setFormatter(file_formatter)
    logger.addHandler(file_handler)

    return logger


def get_logger(name: str = "MediGem") -> logging.Logger:
    """Factory function to retrieve named logger instances."""
    return setup_logger(name=name, level=logging.DEBUG if settings.DEBUG else logging.INFO)


# Default root application logger
logger = get_logger("MediGem")
