"""Settings loader and configuration manager for MediGem."""

import os
from pathlib import Path
from typing import List, Optional
from dotenv import load_dotenv

from backend.config.constants import (
    DEFAULT_APP_NAME,
    DEFAULT_MODEL_NAME,
    DEFAULT_OLLAMA_HOST,
    DEFAULT_PORT,
    MAX_UPLOAD_SIZE_MB,
)

# Load environment variables from .env if present
load_dotenv()


class Settings:
    """Application configuration and directory initialization settings."""

    def __init__(self, env_file: Optional[str] = None) -> None:
        if env_file and os.path.exists(env_file):
            load_dotenv(env_file, override=True)

        self.APP_NAME: str = os.getenv("APP_NAME", DEFAULT_APP_NAME)
        self.MODEL_NAME: str = os.getenv("PRIMARY_MODEL", os.getenv("MODEL_NAME", DEFAULT_MODEL_NAME))
        self.MED_MODEL: str = os.getenv("MED_MODEL", "medgemma")
        self.OLLAMA_HOST: str = os.getenv("OLLAMA_HOST", DEFAULT_OLLAMA_HOST)
        self.DEBUG: bool = os.getenv("DEBUG", "True").lower() in ("true", "1", "yes")
        self.PORT: int = int(os.getenv("PORT", str(DEFAULT_PORT)))
        self.MAX_FILE_SIZE_MB: int = int(os.getenv("MAX_FILE_SIZE_MB", str(MAX_UPLOAD_SIZE_MB)))

        # Base Directory Paths
        self.BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
        self.LOGS_DIR: Path = self.BASE_DIR / "logs"
        self.OUTPUTS_DIR: Path = self.BASE_DIR / "outputs"
        self.OUTPUTS_ANALYSIS_DIR: Path = self.OUTPUTS_DIR / "analysis"
        self.OUTPUTS_REFERRALS_DIR: Path = self.OUTPUTS_DIR / "referrals"
        self.OUTPUTS_REPORTS_DIR: Path = self.OUTPUTS_DIR / "reports"
        self.TMP_DIR: Path = self.BASE_DIR / "tmp"

        self._ensure_directories()

    def _ensure_directories(self) -> None:
        """Create essential application directories if missing."""
        required_dirs: List[Path] = [
            self.LOGS_DIR,
            self.OUTPUTS_DIR,
            self.OUTPUTS_ANALYSIS_DIR,
            self.OUTPUTS_REFERRALS_DIR,
            self.OUTPUTS_REPORTS_DIR,
            self.TMP_DIR,
        ]
        for directory in required_dirs:
            directory.mkdir(parents=True, exist_ok=True)

    def validate(self) -> bool:
        """Verify configuration health."""
        if not self.OLLAMA_HOST.startswith(("http://", "https://")):
            raise ValueError(f"Invalid OLLAMA_HOST URL: {self.OLLAMA_HOST}")
        return True


# Global Singleton Settings Instance
settings = Settings()
