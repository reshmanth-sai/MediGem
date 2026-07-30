"""Time and ISO-8601 formatting utilities."""

from datetime import datetime, timezone
import time


def get_current_utc_timestamp() -> str:
    """Return current UTC time in ISO-8601 string format."""
    return datetime.now(timezone.utc).isoformat()


def get_current_epoch_ms() -> float:
    """Return current timestamp in milliseconds since Unix epoch."""
    return time.time() * 1000.0
