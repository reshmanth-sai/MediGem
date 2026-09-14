"""FastAPI layer over the MediGem orchestrator.

The Next.js workstation (frontend_v2) talks to the pipeline through this and
nothing else. Every route wraps an object that already exists:

    GET  /health          ai_manager.health_check + gate summary
    GET  /rules           emergency_engine.rules
    POST /gate/evaluate   emergency_engine.evaluate
    POST /analyze         orchestrator.process_analysis_request (multipart)

Run with:  uvicorn backend.api.app:app --port 8000
"""

from __future__ import annotations

import os
import time
import uuid
from pathlib import Path
from typing import Any, Dict, List, Optional

import hmac
import threading
from collections import deque

from fastapi import Depends, FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from backend.config.constants import ImageType
from backend.config.settings import settings
from backend.emergency import emergency_engine
from backend.emergency.models import EmergencyResponse
from backend.exceptions import ApplicationError
from backend.logging import logger
from backend.schemas import AnalysisRequest, AnalysisResponse, MedicalImage, PatientInput
from backend.services.orchestrator import orchestrator
from backend.utils import get_current_utc_timestamp

API_VERSION = "1"
STARTED_AT = time.time()

# Browser origins allowed to call this API. The Next dev server and a
# production origin, comma-separated in MEDIGEM_CORS_ORIGINS.
DEFAULT_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"]

ALLOWED_UPLOAD_TYPES = {"image/png", "image/jpeg", "image/webp", "application/pdf"}

# Public exposure. When MEDIGEM_API_KEY is set, every POST must carry it in
# X-API-Key; GET /health and /rules stay open. Unset means local use only,
# which is the default and how the tests run.
API_KEY = os.getenv("MEDIGEM_API_KEY", "")
# Per-client budget for /analyze, which is a ten-second model run.
ANALYZE_PER_MINUTE = int(os.getenv("MEDIGEM_ANALYZE_PER_MINUTE", "6"))


def require_api_key(request: Request) -> None:
    if not API_KEY:
        return
    supplied = request.headers.get("x-api-key", "")
    if not hmac.compare_digest(supplied, API_KEY):
        raise HTTPException(401, "Missing or invalid API key.")


class SlidingWindow:
    """Requests per client per minute, in memory. Enough for one API process."""

    def __init__(self, limit: int, window_s: float = 60.0) -> None:
        self.limit = limit
        self.window_s = window_s
        self._hits: Dict[str, deque] = {}
        self._lock = threading.Lock()

    def allow(self, key: str) -> bool:
        now = time.monotonic()
        with self._lock:
            q = self._hits.setdefault(key, deque())
            while q and now - q[0] > self.window_s:
                q.popleft()
            if len(q) >= self.limit:
                return False
            q.append(now)
            return True


analyze_limiter = SlidingWindow(ANALYZE_PER_MINUTE)


def client_key(request: Request) -> str:
    fwd = request.headers.get("x-forwarded-for", "")
    if fwd:
        return fwd.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def rate_limit_analyze(request: Request) -> None:
    if not analyze_limiter.allow(client_key(request)):
        raise HTTPException(429, f"Rate limit: {ANALYZE_PER_MINUTE} analyses per minute per client.")


class GateRequest(BaseModel):
    symptoms: List[str] = Field(default_factory=list)
    patient_id: Optional[str] = None


class HealthResponse(BaseModel):
    ok: bool
    api_version: str
    model: str
    ollama_host: str
    ollama_connected: bool
    provider_details: str
    gate_rule_count: int
    gate_latency_ms: float
    uptime_seconds: float
    timestamp: str


class RuleSummary(BaseModel):
    id: str
    name: str
    category: str
    priority: str
    recommended_action: str
    symptoms_required: List[str]
    min_match_count: int
    description: str


def _origins() -> List[str]:
    raw = os.getenv("MEDIGEM_CORS_ORIGINS", "")
    extra = [o.strip() for o in raw.split(",") if o.strip()]
    return DEFAULT_ORIGINS + extra


def _gate_latency_ms() -> float:
    """Median of a short burst on the canonical matching case, in milliseconds."""
    samples = []
    for _ in range(50):
        t0 = time.perf_counter()
        emergency_engine.evaluate(symptoms=["chest tightness", "breathlessness"], patient_id="HEALTH")
        samples.append((time.perf_counter() - t0) * 1000)
    samples.sort()
    return round(samples[len(samples) // 2], 3)


def _rule_summary(r: Any) -> RuleSummary:
    def val(x: Any) -> str:
        # IntEnum priorities read as their name (CRITICAL), str enums as their value.
        if hasattr(x, "name") and isinstance(getattr(x, "value", None), int):
            return x.name
        return x.value if hasattr(x, "value") else str(x)

    return RuleSummary(
        id=r.rule_id,
        name=r.rule_name,
        category=val(r.emergency_category),
        priority=val(r.priority),
        recommended_action=val(r.recommended_action),
        symptoms_required=list(r.symptoms_required),
        min_match_count=int(r.min_match_count),
        description=getattr(r, "description", ""),
    )


def create_app() -> FastAPI:
    app = FastAPI(
        title="MediGem API",
        version=API_VERSION,
        description="HTTP interface to the local clinical decision-support pipeline.",
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=_origins(),
        allow_methods=["GET", "POST"],
        allow_headers=["*"],
    )

    @app.get("/health", response_model=HealthResponse)
    def health() -> HealthResponse:
        status = ai_status()
        return HealthResponse(
            ok=status.is_available,
            api_version=API_VERSION,
            model=settings.MODEL_NAME,
            ollama_host=settings.OLLAMA_HOST,
            ollama_connected=status.is_available,
            provider_details=status.details,
            gate_rule_count=len(emergency_engine.rules),
            gate_latency_ms=_gate_latency_ms(),
            uptime_seconds=round(time.time() - STARTED_AT, 1),
            timestamp=get_current_utc_timestamp(),
        )

    @app.get("/rules", response_model=List[RuleSummary])
    def rules() -> List[RuleSummary]:
        return [_rule_summary(r) for r in emergency_engine.rules]

    @app.post("/gate/evaluate", response_model=EmergencyResponse, dependencies=[Depends(require_api_key)])
    def gate(body: GateRequest) -> EmergencyResponse:
        return emergency_engine.evaluate(symptoms=body.symptoms, patient_id=body.patient_id, request_id=f"GATE-{uuid.uuid4().hex[:8]}")

    @app.post("/analyze", response_model=AnalysisResponse, dependencies=[Depends(require_api_key), Depends(rate_limit_analyze)])
    async def analyze(
        patient_id: str = Form("UNKNOWN"),
        age: Optional[int] = Form(None),
        gender: Optional[str] = Form(None),
        symptoms: str = Form("", description="JSON array or comma-separated list."),
        notes: Optional[str] = Form(None),
        heart_rate_bpm: Optional[float] = Form(None),
        blood_pressure_sys: Optional[float] = Form(None),
        blood_pressure_dia: Optional[float] = Form(None),
        spo2_percent: Optional[float] = Form(None),
        temperature_c: Optional[float] = Form(None),
        image_type: Optional[str] = Form(None, description="ECG, REPORT, PRESCRIPTION or WOUND."),
        image: Optional[UploadFile] = File(None),
    ) -> AnalysisResponse:
        request_id = f"REQ-{uuid.uuid4().hex[:10].upper()}"

        vitals: Dict[str, float] = {}
        for key, value in (
            ("heart_rate_bpm", heart_rate_bpm),
            ("blood_pressure_sys", blood_pressure_sys),
            ("blood_pressure_dia", blood_pressure_dia),
            ("spo2_percent", spo2_percent),
            ("temperature_c", temperature_c),
        ):
            if value is not None:
                vitals[key] = float(value)

        if age is None or not gender:
            raise HTTPException(422, "age and gender are required.")
        patient = PatientInput(
            patient_id=patient_id or "UNKNOWN",
            age=age,
            gender=gender,
            symptoms=_parse_symptoms(symptoms),
            vital_signs=vitals,
            notes=notes,
        )

        medical_image: Optional[MedicalImage] = None
        saved_path: Optional[Path] = None
        if image is not None and image.filename:
            if image.content_type not in ALLOWED_UPLOAD_TYPES:
                raise HTTPException(415, f"Unsupported upload type {image.content_type}.")
            if not image_type:
                raise HTTPException(422, "image_type is required when an image is uploaded.")
            try:
                itype = ImageType(image_type.upper())
            except ValueError:
                raise HTTPException(422, f"image_type must be one of {[t.value for t in ImageType]}.")
            data = await image.read()
            if len(data) > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
                raise HTTPException(413, f"Upload exceeds {settings.MAX_FILE_SIZE_MB} MB.")
            suffix = Path(image.filename).suffix.lower() or ".bin"
            settings.TMP_DIR.mkdir(parents=True, exist_ok=True)
            saved_path = settings.TMP_DIR / f"{request_id}{suffix}"
            saved_path.write_bytes(data)
            medical_image = MedicalImage(image_id=f"IMG-{request_id}", file_path=str(saved_path), image_type=itype)

        req = AnalysisRequest(
            request_id=request_id,
            patient=patient,
            image=medical_image,
            notes=notes,
            timestamp=get_current_utc_timestamp(),
        )

        try:
            return orchestrator.process_analysis_request(req)
        except ApplicationError as e:
            logger.error(f"[{request_id}] Analysis rejected: {e}")
            raise HTTPException(422, str(e))
        finally:
            # Uploads are transient. Nothing about a patient stays on disk.
            if saved_path is not None:
                try:
                    saved_path.unlink()
                except OSError:
                    pass

    return app


def ai_status():
    from backend.ai.manager import ai_manager

    try:
        return ai_manager.health_check()
    except Exception as e:  # noqa: BLE001 - a health probe must not raise
        from backend.ai.models import ProviderStatus

        return ProviderStatus(
            provider_name="ollama",
            is_available=False,
            model_name=settings.MODEL_NAME,
            host=settings.OLLAMA_HOST,
            details=f"health check failed: {e}",
        )


def _parse_symptoms(raw: str) -> List[str]:
    raw = (raw or "").strip()
    if not raw:
        return []
    if raw.startswith("["):
        import json

        try:
            parsed = json.loads(raw)
            if isinstance(parsed, list):
                return [str(s).strip() for s in parsed if str(s).strip()]
        except json.JSONDecodeError:
            pass
    return [s.strip() for s in raw.split(",") if s.strip()]


app = create_app()
