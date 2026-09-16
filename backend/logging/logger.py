"""Logging infrastructure for MediGem."""

import atexit
import logging
import queue
import sys
from logging.handlers import QueueHandler, QueueListener, RotatingFileHandler
from pathlib import Path
from typing import Optional

from rich.logging import RichHandler
from backend.config import settings

_log_queue: queue.Queue = queue.Queue(-1)
_listener: Optional[QueueListener] = None


def _get_or_create_listener(log_file: Optional[Path] = None, level: int = logging.INFO) -> QueueListener:
    """Initialize the background QueueListener once with Rich console and rotating file handlers."""
    global _listener
    if _listener is not None:
        return _listener

    console_handler = RichHandler(
        rich_tracebacks=True,
        markup=True,
        show_time=True,
        show_path=False,
    )
    console_handler.setLevel(level)

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

    _listener = QueueListener(_log_queue, console_handler, file_handler, respect_handler_level=True)
    _listener.start()
    atexit.register(_listener.stop)
    return _listener


def setup_logger(
    name: str = "MediGem",
    log_file: Optional[Path] = None,
    level: int = logging.INFO,
) -> logging.Logger:
    """Create and configure a non-blocking logger dispatching to a background QueueListener."""
    logger = logging.getLogger(name)
    logger.setLevel(level)

    # Avoid duplicate handlers if already initialized
    if logger.handlers:
        return logger

    _get_or_create_listener(log_file=log_file, level=level)
    logger.addHandler(QueueHandler(_log_queue))

    return logger


def get_logger(name: str = "MediGem") -> logging.Logger:
    """Factory function to retrieve named logger instances."""
    return setup_logger(name=name, level=logging.DEBUG if settings.DEBUG else logging.INFO)


# Default root application logger
logger = get_logger("MediGem")
