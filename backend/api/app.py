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

from fastapi import Depends, FastAPI, File, Form, HTTPException, Request, Response, UploadFile
from fastapi.responses import FileResponse
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
from backend.store import case_store, user_store
from backend.store.users import ROLES, User
from backend.utils import get_current_utc_timestamp

API_VERSION = "1"
STARTED_AT = time.time()

# Browser origins allowed to call this API. The Next dev server and a
# production origin, comma-separated in MEDIGEM_CORS_ORIGINS.
DEFAULT_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]

ALLOWED_UPLOAD_TYPES = {"image/png", "image/jpeg", "image/webp", "application/pdf"}

# Public exposure. When MEDIGEM_API_KEY is set, every POST must carry it in
# X-API-Key; GET /health and /rules stay open. Unset means local use only,
# which is the default and how the tests run.
API_KEY = os.getenv("MEDIGEM_API_KEY", "")
# Per-client budget for /analyze, which is a ten-second model run.
ANALYZE_PER_MINUTE = int(os.getenv("MEDIGEM_ANALYZE_PER_MINUTE", "6"))


# Sessions ride in an HttpOnly cookie. Same-site by default (the workstation
# and API on one machine); set MEDIGEM_COOKIE_SAMESITE=none (implies Secure)
# when the site and the API are on different hosts over HTTPS.
COOKIE_NAME = "medigem_session"
COOKIE_SAMESITE = os.getenv("MEDIGEM_COOKIE_SAMESITE", "lax").lower()
COOKIE_SECURE = os.getenv("MEDIGEM_COOKIE_SECURE", "1" if COOKIE_SAMESITE == "none" else "0") == "1"


def current_user(request: Request) -> Optional[User]:
    return user_store.resolve(request.cookies.get(COOKIE_NAME))


def require_user(request: Request) -> User:
    """A signed-in user. While no account exists yet the API is open and the actor is the X-Actor header."""
    user = current_user(request)
    if user is not None:
        return user
    if user_store.setup_required():
        name = request.headers.get("x-actor", "").strip()[:120] or "setup"
        return User(id="setup", username="setup", name=name, role="admin", active=True, created_at="")
    raise HTTPException(401, "Sign in to continue.")


def require_role(role: str):
    def dep(user: User = Depends(require_user)) -> User:
        if not user.at_least(role):
            raise HTTPException(403, f"This action needs the {role} role or higher.")
        return user

    return dep


def actor_of(request: Request) -> str:
    """Who is acting: the session user, or the X-Actor header only while setup is pending."""
    return require_user(request).name


def require_api_key(request: Request) -> None:
    """Service-to-service callers (the site's assistant route) may present the key instead of a session."""
    if not API_KEY:
        return
    if current_user(request) is not None:
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
    case_count: int
    setup_required: bool = True
    gate_latency_ms: float
    uptime_seconds: float
    timestamp: str


class ReviewRequest(BaseModel):
    decision: str = Field(..., description="approved, modified or rejected")
    note: Optional[str] = None


class LoginIn(BaseModel):
    username: str = Field(..., min_length=1)
    password: str = Field(..., min_length=1)


class UserIn(BaseModel):
    username: str = Field(..., min_length=3, max_length=40)
    name: str = Field(..., min_length=1, max_length=120)
    role: str = Field(..., pattern="^(anm|cho|mo|admin)$")
    password: str = Field(..., min_length=8, max_length=200)


class UserOut(BaseModel):
    id: str
    username: str
    name: str
    role: str
    active: bool
    created_at: str
    last_login_at: Optional[str] = None


class MeOut(BaseModel):
    user: Optional[UserOut]
    setup_required: bool
    roles: List[str] = list(ROLES)


class PatientPatch(BaseModel):
    patient_id: Optional[str] = None
    patient_name: Optional[str] = None
    age: Optional[int] = Field(None, ge=0, le=120)
    gender: Optional[str] = None
    location: Optional[str] = None
    chief_complaint: Optional[str] = None


class PlanIn(BaseModel):
    next_step: str = Field(..., min_length=1)
    follow_up: Optional[str] = None
    urgency: Optional[str] = None
    note: Optional[str] = None


class NoteIn(BaseModel):
    text: str = Field(..., min_length=1, max_length=4000)


class CaseOut(BaseModel):
    id: str
    created_at: str
    updated_at: str
    patient: Dict[str, Any]
    response: Dict[str, Any]
    status: str
    risk_level: Optional[str]
    needs_referral: bool
    requires_review: bool
    reviewed_at: Optional[str] = None
    reviewer: Optional[str] = None
    review_note: Optional[str] = None
    review_decision: Optional[str] = None
    plan: Optional[Dict[str, Any]] = None
    notes: List[Dict[str, Any]] = Field(default_factory=list)
    documents: List[Dict[str, Any]] = Field(default_factory=list)
    events: List[Dict[str, Any]] = Field(default_factory=list)


class AnalyzeOut(AnalysisResponse):
    """The pipeline's answer plus the id it was stored under."""

    case_id: Optional[str] = None


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
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
        allow_headers=["*"],
        allow_credentials=True,
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
            case_count=case_store.count(),
            setup_required=user_store.setup_required(),
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

    @app.post("/analyze", response_model=AnalyzeOut, dependencies=[Depends(require_user), Depends(rate_limit_analyze)])
    async def analyze(
        patient_id: str = Form("UNKNOWN"),
        age: Optional[int] = Form(None),
        gender: Optional[str] = Form(None),
        symptoms: str = Form("", description="JSON array or comma-separated list."),
        notes: Optional[str] = Form(None),
        patient_name: Optional[str] = Form(None),
        location: Optional[str] = Form(None),
        chief_complaint: Optional[str] = Form(None),
        persist: bool = Form(True, description="Store the case. False for throwaway runs."),
        heart_rate_bpm: Optional[float] = Form(None),
        blood_pressure_sys: Optional[float] = Form(None),
        blood_pressure_dia: Optional[float] = Form(None),
        spo2_percent: Optional[float] = Form(None),
        temperature_c: Optional[float] = Form(None),
        image_type: Optional[str] = Form(None, description="ECG, REPORT, PRESCRIPTION or WOUND."),
        image: Optional[UploadFile] = File(None),
        request: Request = None,  # type: ignore[assignment]
    ) -> AnalyzeOut:
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
            result = orchestrator.process_analysis_request(req)
            out = AnalyzeOut(**result.model_dump())
            if persist:
                stored = case_store.create(
                    patient={
                        "patient_id": patient.patient_id,
                        "patient_name": patient_name,
                        "age": patient.age,
                        "gender": patient.gender,
                        "location": location,
                        "chief_complaint": chief_complaint,
                        "symptoms": patient.symptoms,
                        "vital_signs": patient.vital_signs,
                        "notes": notes,
                        "documents": [image.filename] if image is not None and image.filename else [],
                        "image_type": image_type,
                    },
                    response=result.model_dump(mode="json"),
                    actor=actor_of(request),
                )
                out.case_id = stored.id
            return out
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

    @app.get("/auth/me", response_model=MeOut)
    def me(request: Request) -> MeOut:
        user = current_user(request)
        return MeOut(user=UserOut(**user.to_dict()) if user else None, setup_required=user_store.setup_required())

    @app.post("/auth/setup", response_model=UserOut, status_code=201)
    def setup(body: UserIn, response: Response) -> UserOut:
        """Creates the first account. Only works while there are no users; the caller is signed in as it."""
        if not user_store.setup_required():
            raise HTTPException(409, "Setup is complete; sign in as an admin to add users.")
        try:
            user = user_store.create(username=body.username, name=body.name, role="admin", password=body.password)
        except ValueError as e:
            raise HTTPException(422, str(e))
        token = user_store.login(body.username, body.password)
        _set_cookie(response, token)
        return UserOut(**user.to_dict())

    @app.post("/auth/login", response_model=UserOut)
    def login(body: LoginIn, response: Response) -> UserOut:
        token = user_store.login(body.username, body.password)
        if token is None:
            raise HTTPException(401, "Wrong username or password.")
        _set_cookie(response, token)
        user = user_store.resolve(token)
        return UserOut(**user.to_dict())  # type: ignore[union-attr]

    @app.post("/auth/logout", status_code=204)
    def logout(request: Request, response: Response) -> None:
        user_store.logout(request.cookies.get(COOKIE_NAME))
        response.delete_cookie(COOKIE_NAME, samesite=COOKIE_SAMESITE, secure=COOKIE_SECURE)  # type: ignore[arg-type]

    @app.get("/users", response_model=List[UserOut], dependencies=[Depends(require_role("admin"))])
    def list_users() -> List[UserOut]:
        return [UserOut(**u.to_dict()) for u in user_store.list()]

    @app.post("/users", response_model=UserOut, status_code=201, dependencies=[Depends(require_role("admin"))])
    def create_user(body: UserIn) -> UserOut:
        try:
            return UserOut(**user_store.create(username=body.username, name=body.name, role=body.role, password=body.password).to_dict())
        except ValueError as e:
            raise HTTPException(422, str(e))

    @app.post("/users/{user_id}/deactivate", response_model=UserOut, dependencies=[Depends(require_role("admin"))])
    def deactivate_user(user_id: str, me_user: User = Depends(require_user)) -> UserOut:
        if me_user.id == user_id:
            raise HTTPException(409, "You cannot deactivate your own account.")
        u = user_store.set_active(user_id, False)
        if u is None:
            raise HTTPException(404, "No such user.")
        return UserOut(**u.to_dict())

    @app.get("/cases", response_model=List[CaseOut], dependencies=[Depends(require_user)])
    def list_cases(risk_level: Optional[str] = None, needs_referral: Optional[bool] = None, limit: int = 200) -> List[CaseOut]:
        return [CaseOut(**r.to_dict()) for r in case_store.list(risk_level=risk_level, needs_referral=needs_referral, limit=min(limit, 1000))]

    @app.get("/cases/{case_id}", response_model=CaseOut, dependencies=[Depends(require_user)])
    def get_case(case_id: str) -> CaseOut:
        rec = case_store.get(case_id)
        if rec is None:
            raise HTTPException(404, "No such case.")
        return CaseOut(**rec.to_dict())

    @app.post("/cases/{case_id}/review", response_model=CaseOut)
    def review_case(case_id: str, body: ReviewRequest, user: User = Depends(require_role("cho"))) -> CaseOut:
        try:
            # The reviewer is whoever is signed in, never the request body.
            rec = case_store.review(case_id, body.decision, user.name, body.note)
        except ValueError as e:
            raise HTTPException(422, str(e))
        if rec is None:
            raise HTTPException(404, "No such case.")
        return CaseOut(**rec.to_dict())

    @app.delete("/cases/{case_id}", status_code=204)
    def delete_case(case_id: str, user: User = Depends(require_role("mo"))) -> None:
        if not case_store.delete(case_id, user.name):
            raise HTTPException(404, "No such case.")

    @app.patch("/cases/{case_id}/patient", response_model=CaseOut, dependencies=[Depends(require_user)])
    def patch_patient(case_id: str, body: PatientPatch, request: Request) -> CaseOut:
        patch = {k: v for k, v in body.model_dump().items() if v is not None}
        rec = case_store.update_patient(case_id, patch, actor_of(request))
        if rec is None:
            raise HTTPException(404, "No such case.")
        return CaseOut(**rec.to_dict())

    @app.put("/cases/{case_id}/plan", response_model=CaseOut, dependencies=[Depends(require_user)])
    def put_plan(case_id: str, body: PlanIn, request: Request) -> CaseOut:
        rec = case_store.set_plan(case_id, body.model_dump(), actor_of(request))
        if rec is None:
            raise HTTPException(404, "No such case.")
        return CaseOut(**rec.to_dict())

    @app.post("/cases/{case_id}/notes", response_model=CaseOut, status_code=201, dependencies=[Depends(require_user)])
    def post_note(case_id: str, body: NoteIn, request: Request) -> CaseOut:
        rec = case_store.add_note(case_id, actor_of(request), body.text)
        if rec is None:
            raise HTTPException(404, "No such case.")
        return CaseOut(**rec.to_dict())

    @app.post("/cases/{case_id}/documents", response_model=CaseOut, status_code=201, dependencies=[Depends(require_user)])
    async def post_document(case_id: str, request: Request, file: UploadFile = File(...)) -> CaseOut:
        if file.content_type not in ALLOWED_UPLOAD_TYPES:
            raise HTTPException(415, f"Unsupported file type {file.content_type}.")
        data = await file.read()
        if len(data) > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
            raise HTTPException(413, f"File exceeds {settings.MAX_FILE_SIZE_MB} MB.")
        if not file.filename:
            raise HTTPException(422, "A file name is required.")
        doc = case_store.add_document(case_id, name=file.filename, content_type=file.content_type or "application/octet-stream", data=data, added_by=actor_of(request))
        if doc is None:
            raise HTTPException(404, "No such case.")
        return CaseOut(**case_store.get(case_id).to_dict())  # type: ignore[union-attr]

    @app.get("/cases/{case_id}/documents/{doc_id}", dependencies=[Depends(require_user)])
    def get_document(case_id: str, doc_id: str) -> FileResponse:
        doc = case_store.get_document(case_id, doc_id)
        if doc is None or not Path(doc["path"]).exists():
            raise HTTPException(404, "No such document.")
        return FileResponse(doc["path"], media_type=doc["content_type"], filename=doc["name"])

    @app.get("/cases/{case_id}/events", dependencies=[Depends(require_user)])
    def get_events(case_id: str) -> List[Dict[str, Any]]:
        rec = case_store.get(case_id)
        if rec is None:
            raise HTTPException(404, "No such case.")
        return rec.events

    return app


def _set_cookie(response: Response, token: Optional[str]) -> None:
    if not token:
        return
    response.set_cookie(
        COOKIE_NAME, token, httponly=True, samesite=COOKIE_SAMESITE, secure=COOKIE_SECURE,  # type: ignore[arg-type]
        max_age=12 * 3600, path="/",
    )


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
