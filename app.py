"""Main Application Entry Point for MediGem Clinical Co-Pilot."""

import sys
from pathlib import Path

# Ensure project root is in python module search path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from backend.logging import logger
from frontend.app import build_app

if __name__ == "__main__":
    logger.info("Starting MediGem Offline AI Co-Pilot Gradio Application...")
    demo = build_app()
    demo.launch(
        server_name="0.0.0.0",
        server_port=7860,
        share=False,
    )
