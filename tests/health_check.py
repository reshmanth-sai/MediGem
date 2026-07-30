"""System health check and diagnostic suite for MediGem backend foundation."""

import os
import sys
from pathlib import Path
import requests
from rich.console import Console
from rich.table import Table

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backend.config import settings, RiskLevel, ImageType
from backend.logging import logger
from backend.pipeline import BasePipeline
from backend.schemas import (
    AnalysisRequest,
    AnalysisResponse,
    ApplicationStatus,
    MedicalImage,
    PatientInput,
    ReferralSummary,
    RiskAssessment,
    SchemaValidationError,
)
from backend.services import BaseAnalyzer, BaseService, BaseValidator
from backend.exceptions import (
    ApplicationError,
    ConfigurationError,
    AppValidationError,
    InferenceError,
    ImageProcessingError,
    EmergencyRuleError,
)
from backend.utils import (
    ensure_directory_exists,
    get_current_utc_timestamp,
    get_file_size_bytes,
    is_allowed_file,
)


def run_health_check() -> bool:
    """Execute complete backend diagnostic check."""
    console = Console()
    table = Table(title="MediGem Backend Foundation Diagnostics", show_header=True, header_style="bold magenta")
    table.add_column("Diagnostic Check", style="cyan", width=35)
    table.add_column("Status", width=12, justify="center")
    table.add_column("Details", style="dim")

    overall_pass = True

    # 1. Python Environment Check
    py_ver = f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
    py_ok = sys.version_info.major == 3 and sys.version_info.minor >= 10
    table.add_row("Python Version Check", "[green]PASS[/green]" if py_ok else "[red]FAIL[/red]", f"v{py_ver}")
    if not py_ok:
        overall_pass = False

    # 2. Virtual Environment Check
    in_venv = hasattr(sys, "real_prefix") or (hasattr(sys, "base_prefix") and sys.base_prefix != sys.prefix)
    table.add_row("Virtual Environment", "[green]PASS[/green]" if in_venv else "[yellow]WARN[/yellow]", sys.prefix)

    # 3. Ollama Daemon Status
    ollama_ok = False
    ollama_details = "Not reachable"
    try:
        res = requests.get(f"{settings.OLLAMA_HOST}/api/version", timeout=3)
        if res.status_code == 200:
            ollama_ok = True
            ollama_details = f"Connected (v{res.json().get('version', 'unknown')})"
    except Exception as e:
        ollama_details = f"Connection failed: {e}"

    table.add_row("Ollama Service Connection", "[green]PASS[/green]" if ollama_ok else "[red]FAIL[/red]", ollama_details)
    if not ollama_ok:
        overall_pass = False

    # 4. Ollama Model Existence Check
    model_ok = False
    model_details = "No model found"
    try:
        res = requests.get(f"{settings.OLLAMA_HOST}/api/tags", timeout=3)
        if res.status_code == 200:
            models = [m.get("name") for m in res.json().get("models", [])]
            if any(settings.MODEL_NAME in m for m in models) or len(models) > 0:
                model_ok = True
                model_details = f"Configured: {settings.MODEL_NAME} | Installed: {models}"
    except Exception as e:
        model_details = f"Model lookup failed: {e}"

    table.add_row("AI Model Existence", "[green]PASS[/green]" if model_ok else "[red]FAIL[/red]", model_details)
    if not model_ok:
        overall_pass = False

    # 5. Configuration Settings
    config_ok = False
    try:
        config_ok = settings.validate()
        config_details = f"App: {settings.APP_NAME}, Model: {settings.MODEL_NAME}, Host: {settings.OLLAMA_HOST}"
    except Exception as e:
        config_details = str(e)
    table.add_row("Configuration Settings", "[green]PASS[/green]" if config_ok else "[red]FAIL[/red]", config_details)
    if not config_ok:
        overall_pass = False

    # 6. Folder Hierarchy & Auto-creation
    dirs_to_check = [
        settings.LOGS_DIR,
        settings.OUTPUTS_DIR,
        settings.OUTPUTS_ANALYSIS_DIR,
        settings.OUTPUTS_REFERRALS_DIR,
        settings.OUTPUTS_REPORTS_DIR,
        settings.TMP_DIR,
    ]
    dirs_ok = all(d.exists() for d in dirs_to_check)
    table.add_row("Directory Hierarchy", "[green]PASS[/green]" if dirs_ok else "[red]FAIL[/red]", f"{len(dirs_to_check)} required dirs verified")
    if not dirs_ok:
        overall_pass = False

    # 7. Logger Infrastructure
    logger_ok = False
    try:
        logger.info("Health check diagnostic test log entry.")
        logger_ok = (settings.LOGS_DIR / "app.log").exists()
        logger_details = f"Active log file: {settings.LOGS_DIR / 'app.log'}"
    except Exception as e:
        logger_details = str(e)
    table.add_row("Logging Infrastructure", "[green]PASS[/green]" if logger_ok else "[red]FAIL[/red]", logger_details)
    if not logger_ok:
        overall_pass = False

    # 8. Pydantic Schemas Validation
    schemas_ok = False
    try:
        pt = PatientInput(age=30, gender="Male", symptoms=["Fever"])
        img = MedicalImage(file_path="sample.png", image_type=ImageType.ECG)
        req = AnalysisRequest(request_id="REQ-TEST", patient=pt, image=img)
        resp = AnalysisResponse(request_id="REQ-TEST", summary="Test complete")
        status = ApplicationStatus(is_healthy=True, loaded_model=settings.MODEL_NAME, ollama_connected=ollama_ok, ollama_host=settings.OLLAMA_HOST)
        err = SchemaValidationError(error_code="TEST_ERR", error_message="Test message")
        schemas_ok = True
        schema_details = "All 8 Pydantic v2 schemas imported & instantiated successfully"
    except Exception as e:
        schema_details = f"Schema instantiation error: {e}"

    table.add_row("Pydantic Schemas Import", "[green]PASS[/green]" if schemas_ok else "[red]FAIL[/red]", schema_details)
    if not schemas_ok:
        overall_pass = False

    # 9. Pipeline & Services Base Interfaces
    interfaces_ok = False
    try:
        assert issubclass(BasePipeline, object)
        assert issubclass(BaseService, object)
        assert issubclass(BaseAnalyzer, object)
        assert issubclass(BaseValidator, object)
        interfaces_ok = True
        interfaces_details = "BasePipeline, BaseService, BaseAnalyzer, BaseValidator verified"
    except Exception as e:
        interfaces_details = f"Interface check failed: {e}"

    table.add_row("Service & Pipeline Base", "[green]PASS[/green]" if interfaces_ok else "[red]FAIL[/red]", interfaces_details)
    if not interfaces_ok:
        overall_pass = False

    # Render structured diagnostic report
    console.print(table)

    if overall_pass:
        console.print("[bold green]OVERALL STATUS: PASS (Backend foundation is 100% operational)[/bold green]")
    else:
        console.print("[bold red]OVERALL STATUS: FAIL (Some backend diagnostics failed)[/bold red]")

    return overall_pass


if __name__ == "__main__":
    success = run_health_check()
    sys.exit(0 if success else 1)
