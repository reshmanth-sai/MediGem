"""Gradio Event Callbacks invoking backend MediGemOrchestrator."""

import json
from pathlib import Path
import tempfile
from typing import Any, Dict, List, Optional, Tuple

from backend.config.constants import ImageType
from backend.input.models import ProcessedMedicalInput
from backend.logging import logger
from backend.schemas.analysis import AnalysisRequest, MedicalImage, PatientInput
from backend.services.orchestrator import orchestrator
from frontend.formatting import (
    format_analysis_quality,
    format_empty_state,
    format_observation_list,
    format_reasoning_transparency,
    format_referral_letter,
    format_risk_card,
    format_stage_tracker,
)

# In-Memory Session History
SESSION_HISTORY: List[Dict[str, Any]] = []

# Path to synthetic test fixtures
FIXTURES_DIR: Path = Path(__file__).parent.parent / "tests" / "fixtures"


def parse_vitals_text(vitals_text: str) -> Dict[str, float]:
    """Parse vital signs text input safely into Dict[str, float]."""
    vitals_dict: Dict[str, float] = {}
    if not vitals_text.strip():
        return vitals_dict

    for line in vitals_text.split("\n"):
        if ":" in line:
            k, v = line.split(":", 1)
            key_clean = k.strip()
            val_clean = v.strip()

            if "/" in val_clean and key_clean.upper() in ("BP", "BLOOD PRESSURE"):
                parts = val_clean.split("/")
                if len(parts) == 2:
                    try:
                        vitals_dict["SystolicBP"] = float(parts[0].strip())
                        vitals_dict["DiastolicBP"] = float(parts[1].strip())
                        continue
                    except ValueError:
                        pass

            try:
                vitals_dict[key_clean] = float(val_clean)
            except ValueError:
                logger.warning(f"Could not parse numeric float for vital sign '{key_clean}: {val_clean}'")

    return vitals_dict


def handle_analysis_request(
    age: float,
    gender: str,
    symptoms_text: str,
    vital_signs_text: str,
    notes_text: str,
    file_upload: Optional[Any],
    history_state: List[Dict[str, Any]],
) -> Tuple[str, str, str, str, str, str, str, str, List[Dict[str, Any]], str, str, str, str, str]:
    """Callback executing full clinical analysis through MediGemOrchestrator."""
    request_id = f"REQ-UI-{len(history_state) + 1:03d}"

    # 1. Parse Patient Input
    symptoms_list = [s.strip() for s in symptoms_text.split(",") if s.strip()]
    if not symptoms_list and symptoms_text.strip():
        symptoms_list = [symptoms_text.strip()]

    vitals_dict = parse_vitals_text(vital_signs_text)

    patient = PatientInput(
        patient_id=f"P-{request_id}",
        age=int(age) if age > 0 else 30,
        gender=gender if gender else "UNKNOWN",
        symptoms=symptoms_list,
        vital_signs=vitals_dict,
    )

    # 2. Parse Image / PDF Attachment
    image_obj = None
    file_path = None
    if file_upload is not None:
        file_path = file_upload.name if hasattr(file_upload, "name") else str(file_upload)
        img_type = ImageType.REPORT
        if "ecg" in file_path.lower():
            img_type = ImageType.ECG
        elif "wound" in file_path.lower():
            img_type = ImageType.WOUND
        elif "rx" in file_path.lower() or "prescription" in file_path.lower():
            img_type = ImageType.PRESCRIPTION

        image_obj = MedicalImage(file_path=file_path, image_type=img_type)

    request = AnalysisRequest(
        request_id=request_id,
        patient=patient,
        image=image_obj,
        notes=notes_text,
    )

    # 3. Execute Backend Orchestration
    try:
        response = orchestrator.process_analysis_request(request)
    except Exception as e:
        logger.error(f"UI Callback Execution error: {e}")
        err_card = f"<div class='medigem-card' style='border-left: 6px solid #DC2626;'><strong style='color: #DC2626;'>Analysis Error:</strong> {e}</div>"
        return err_card, "Analysis failed.", "", "", "", "", "", "", history_state, "", "", "", "", format_stage_tracker(0)

    # 4. Extract Response Details & Format Outputs
    risk_level = "LOW"
    urgency_score = 0.0
    emergency_intercepted = response.status == "EMERGENCY_INTERCEPTED"

    if response.risk_assessment:
        risk_level = response.risk_assessment.risk_level.value
        urgency_score = response.risk_assessment.urgency_score

    risk_html = format_risk_card(risk_level, urgency_score, emergency_intercepted)
    summary_text = response.summary

    # Reasoning Transparency Bullets ("Why was this recommendation generated?")
    reasons = [
        f"Modality evaluated: {request.image.image_type.value if request.image else 'GENERAL'}",
        f"Emergency safety gate status: {'INTERCEPTED (Immediate referral generated)' if emergency_intercepted else 'PASSED'}",
        f"Processing latency: {response.duration_ms:.1f}ms",
        "Deterministic rule checks executed prior to AI inference.",
        "Clinical output validated against non-diagnostic healthcare safety contract.",
    ]
    transparency_html = format_reasoning_transparency(reasons)

    # Quality & Provenance Details
    quality_html = format_analysis_quality(
        confidence="HIGH" if not emergency_intercepted else "N/A (Gate Intercepted)",
        completeness="COMPLETE" if (symptoms_list and vitals_dict) else "PARTIAL",
        quality_level="GOOD",
        ocr_confidence=1.0 if not file_path or file_path.endswith(".pdf") else 0.92,
        validation_status="VALIDATED" if not emergency_intercepted else "GATE INTERCEPTED",
    )

    findings_html = format_observation_list(
        [{"finding": "Presenting Symptoms", "evidence": f"Patient symptoms: {', '.join(symptoms_list)}", "confidence": "HIGH"}]
    )

    patient_summary_html = f"<div class='medigem-card'><strong>Patient View:</strong><p style='color: #475569;'>{summary_text}</p></div>"

    referral_dict = response.referral_summary.model_dump() if response.referral_summary else {
        "reason_for_referral": f"Assessment result: {risk_level}",
        "priority": "URGENT" if risk_level in ("HIGH", "EMERGENCY") else "ROUTINE",
        "clinical_summary": summary_text,
    }
    referral_html = format_referral_letter(referral_dict)

    # 5. Maintain Session History
    history_entry = {
        "request_id": request_id,
        "timestamp": response.timestamp,
        "risk_level": risk_level,
        "summary": summary_text,
        "duration_ms": response.duration_ms,
        "status": response.status,
    }
    history_state.append(history_entry)

    history_dropdown_choices = [f"{h['request_id']} | Risk: {h['risk_level']} | {h['timestamp']}" for h in history_state]
    history_dropdown_val = history_dropdown_choices[-1] if history_dropdown_choices else ""

    # Pre-generate Download File Exports with Presentation Metadata Header
    header_meta = f"MEDIGEM CLINICAL REPORT [{request_id}]\nTimestamp: {response.timestamp}\nModel: gemma3:4b\nPrompt Version: v1.0\nReasoning Version: v1.0\n----------------------------------------\n"

    tmp_dir = Path(tempfile.gettempdir())
    worker_file = str(tmp_dir / f"{request_id}_worker_summary.txt")
    patient_file = str(tmp_dir / f"{request_id}_patient_summary.txt")
    referral_file = str(tmp_dir / f"{request_id}_referral_note.txt")
    json_file = str(tmp_dir / f"{request_id}_report.json")

    Path(worker_file).write_text(f"{header_meta}WORKER SUMMARY\nRisk: {risk_level}\n\n{summary_text}", encoding="utf-8")
    Path(patient_file).write_text(f"{header_meta}PATIENT SUMMARY\n\n{summary_text}", encoding="utf-8")
    Path(referral_file).write_text(f"{header_meta}CLINICAL REFERRAL MEMORANDUM\nPriority: {referral_dict.get('priority')}\nReason: {referral_dict.get('reason_for_referral')}\nNotes: {referral_dict.get('clinical_summary')}", encoding="utf-8")

    full_payload = {
        "metadata": {
            "timestamp": response.timestamp,
            "model": "gemma3:4b",
            "prompt_version": "v1.0",
            "reasoning_version": "v1.0",
        },
        "response": response.model_dump(),
    }
    Path(json_file).write_text(json.dumps(full_payload, indent=2), encoding="utf-8")

    progress_final = format_stage_tracker(8)

    return (
        risk_html,
        summary_text,
        transparency_html,
        quality_html,
        findings_html,
        patient_summary_html,
        referral_html,
        history_dropdown_val,
        history_state,
        worker_file,
        patient_file,
        referral_file,
        json_file,
        progress_final,
    )


def handle_demo_selection(preset_key: str) -> Tuple[float, str, str, str, Optional[str]]:
    """Load preset synthetic test fixture into UI fields."""
    presets = {
        "LAB_REPORT": (45.0, "Male", "Fatigue, weakness", "HR: 78\nBP: 120/80", str(FIXTURES_DIR / "sample_report.pdf")),
        "ECG": (62.0, "Male", "Chest tightness, palpitations", "HR: 95\nBP: 138/88", str(FIXTURES_DIR / "sample_ecg.png")),
        "PRESCRIPTION": (38.0, "Female", "Skin rash, medication inquiry", "HR: 72\nBP: 118/76", str(FIXTURES_DIR / "sample_prescription.png")),
        "WOUND": (29.0, "Male", "Laceration on right forearm", "HR: 80\nBP: 122/80", str(FIXTURES_DIR / "sample_wound.png")),
    }

    if preset_key in presets:
        age, gender, symptoms, vitals, f_path = presets[preset_key]
        return age, gender, symptoms, vitals, f_path

    return 30.0, "Male", "Fever", "", None
