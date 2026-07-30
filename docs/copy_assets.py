"""Asset copying utility populating docs/diagrams/ and docs/screenshots/."""

import shutil
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
EVAL_DIR = PROJECT_ROOT / "evaluation"
DOCS_DIR = PROJECT_ROOT / "docs"

DIAGRAMS_SRC = EVAL_DIR / "diagrams"
SCREENSHOTS_SRC = EVAL_DIR / "screenshots"

DIAGRAMS_DEST = DOCS_DIR / "diagrams"
SCREENSHOTS_DEST = DOCS_DIR / "screenshots"

DIAGRAMS_DEST.mkdir(parents=True, exist_ok=True)
SCREENSHOTS_DEST.mkdir(parents=True, exist_ok=True)

# Copy Diagrams
if DIAGRAMS_SRC.exists():
    for f in DIAGRAMS_SRC.glob("*"):
        if f.is_file():
            shutil.copy2(f, DIAGRAMS_DEST / f.name)

# Copy Screenshots
if SCREENSHOTS_SRC.exists():
    for f in SCREENSHOTS_SRC.glob("*"):
        if f.is_file():
            shutil.copy2(f, SCREENSHOTS_DEST / f.name)

print("Visual assets copied successfully to docs/diagrams/ and docs/screenshots/.")
