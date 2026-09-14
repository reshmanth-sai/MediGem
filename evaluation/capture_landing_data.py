"""Capture measured pipeline output for the landing page.

Runs the real MediGem stages (input processing, emergency gate, Gemma reasoning)
against the sample_data files and writes the results as JSON. Every number on
the landing page comes from this file, so nothing here is hardcoded or mocked.

Usage: .venv/bin/python -m evaluation.capture_landing_data [--runs N]
"""

from __future__ import annotations

import argparse
import json
import platform
import statistics
import subprocess
import sys
import time
from pathlib import Path
from typing import Any, Dict, List

from backend.config.constants import ImageType, MedicalModality
from backend.config.settings import settings
from backend.emergency.engine import emergency_engine
from backend.input.router import input_router
import importlib
from backend.schemas.analysis import AnalysisRequest, MedicalImage, PatientInput
from backend.services.orchestrator import orchestrator

# The package re-exports an instance under the same name as the module, so
# resolve the module itself to reach its output_validator binding.
mp = importlib.import_module("backend.pipeline.medical_pipeline")

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "frontend_v2" / "components" / "landing" / "data"

SAMPLES = [
    {
        "id": "lab",
        "label": "Lab report",
        "file": "sample_data/reports/cbc_lab_report.png",
        "modality": MedicalModality.LAB_REPORT,
        "image_type": ImageType.REPORT,
        "symptoms": ["fatigue", "pallor"],
        "age": 34,
        "gender": "Female",
    },
    {
        "id": "ecg",
        "label": "ECG",
        "file": "sample_data/ecg/sample_ecg_lead_ii.png",
        "modality": MedicalModality.ECG,
        "image_type": ImageType.ECG,
        "symptoms": ["palpitations"],
        "age": 58,
        "gender": "Male",
    },
    {
        "id": "prescription",
        "label": "Prescription",
        "file": "sample_data/prescriptions/handwritten_prescription.png",
        "modality": MedicalModality.PRESCRIPTION,
        "image_type": ImageType.PRESCRIPTION,
        "symptoms": ["follow-up visit"],
        "age": 46,
        "gender": "Female",
    },
    {
        "id": "wound",
        "label": "Wound image",
        "file": "sample_data/wounds/post_op_wound.png",
        "modality": MedicalModality.WOUND,
        "image_type": ImageType.WOUND,
        "symptoms": ["redness around incision", "mild pain"],
        "age": 41,
        "gender": "Male",
    },
]

# A symptom set that matches R-CARDIAC-01 so the gate demo shows a real block.
GATE_CASE = {"symptoms": ["chest tightness", "breathlessness"], "age": 52, "gender": "Male"}


def hardware() -> Dict[str, Any]:
    chip = ""
    try:
        chip = subprocess.check_output(["sysctl", "-n", "machdep.cpu.brand_string"], text=True).strip()
    except Exception:
        pass
    return {"chip": chip, "platform": platform.platform(), "python": platform.python_version()}


def capture_input(sample: Dict[str, Any]) -> Dict[str, Any]:
    t0 = time.perf_counter()
    p = input_router.process_input(
        request_id=f"LAND-{sample['id'].upper()}",
        modality=sample["modality"],
        file_path=str(ROOT / sample["file"]),
        raw_text=None,
    )
    ms = (time.perf_counter() - t0) * 1000
    q = p.quality
    return {
        "input_processing_ms": round(ms, 2),
        "ocr_performed": p.summary.ocr_performed,
        "processing_time_ms": round(p.summary.processing_time_ms, 2),
        "quality": None
        if q is None
        else {
            "blur_score": round(q.blur_score, 2),
            "brightness_score": round(q.brightness_score, 2),
            "contrast_score": round(q.contrast_score, 2),
            "resolution_score": round(q.resolution_score, 3),
            "quality_level": q.quality_level.value,
            "warnings": list(q.warnings),
        },
        "extracted": None
        if p.extracted_content is None
        else {
            "text": p.extracted_content.text,
            "confidence": round(p.extracted_content.confidence, 4),
            "language": p.extracted_content.language,
        },
        "image": None
        if getattr(p, "image_metadata", None) is None
        else {
            "width": p.image_metadata.width,
            "height": p.image_metadata.height,
            "file_size_bytes": p.image_metadata.file_size_bytes,
        },
    }


def capture_gate(iterations: int) -> Dict[str, Any]:
    """Time the deterministic gate on a matching and a non-matching case."""
    latencies: List[float] = []
    for _ in range(iterations):
        t0 = time.perf_counter()
        emergency_engine.evaluate(symptoms=GATE_CASE["symptoms"], patient_id="P-GATE", request_id="GATE")
        latencies.append((time.perf_counter() - t0) * 1000)
    benign: List[float] = []
    for _ in range(iterations):
        t0 = time.perf_counter()
        emergency_engine.evaluate(symptoms=["mild headache"], patient_id="P-GATE", request_id="GATE")
        benign.append((time.perf_counter() - t0) * 1000)
    r = emergency_engine.evaluate(symptoms=GATE_CASE["symptoms"], patient_id="P-GATE", request_id="GATE")
    rules = json.loads((ROOT / "backend" / "emergency" / "rules.json").read_text())
    rules = rules if isinstance(rules, list) else rules.get("rules", rules)
    return {
        "iterations": iterations,
        "match_case": {
            "symptoms": GATE_CASE["symptoms"],
            "emergency_detected": r.emergency_detected,
            "safe_for_ai_processing": r.safe_for_ai_processing,
            "category": r.emergency_category.value if r.emergency_category else None,
            "priority": str(r.priority),
            "matched_symptoms": list(r.matched_symptoms),
            "matched_reason": r.matched_reason,
            "recommended_action": str(r.recommended_action),
            "matched_rules": list(r.matched_rules),
        },
        "latency_ms": {
            "match_median": round(statistics.median(latencies), 3),
            "match_p95": round(sorted(latencies)[int(len(latencies) * 0.95) - 1], 3),
            "match_max": round(max(latencies), 3),
            "benign_median": round(statistics.median(benign), 3),
            "benign_max": round(max(benign), 3),
        },
        "rule_count": len(rules),
        "rules": [
            {
                "id": x["rule_id"],
                "name": x.get("rule_name"),
                "category": x.get("emergency_category"),
                "priority": x.get("priority"),
                "description": x.get("description"),
                "symptoms_required": x.get("symptoms_required", []),
                "min_match_count": x.get("min_match_count"),
                "recommended_action": x.get("recommended_action"),
            }
            for x in rules
        ],
    }


def capture_reasoning(sample: Dict[str, Any], runs: int) -> Dict[str, Any]:
    """Run the full orchestrator N times; keep the last validated reasoning output."""
    captured: Dict[str, Any] = {}
    original = mp.output_validator.validate_output

    def spy(raw):
        out = original(raw)
        captured["reasoning"] = out.model_dump(mode="json")
        captured["validated"] = True
        return out

    mp.output_validator.validate_output = spy
    durations: List[float] = []
    statuses: List[str] = []
    validated: List[bool] = []
    try:
        for i in range(runs):
            captured["validated"] = False
            req = AnalysisRequest(
                request_id=f"LAND-{sample['id'].upper()}-{i}",
                patient=PatientInput(
                    patient_id=f"P-{sample['id'].upper()}",
                    age=sample["age"],
                    gender=sample["gender"],
                    symptoms=sample["symptoms"],
                ),
                image=MedicalImage(file_path=str(ROOT / sample["file"]), image_type=sample["image_type"]),
                notes=None,
            )
            resp = orchestrator.process_analysis_request(req)
            # The pipeline reports COMPLETED even when the model returned an
            # empty payload and it fell back to a safe summary. Only a run that
            # produced a validated ClinicalReasoningOutput counts as measured.
            ok = bool(captured.get("validated"))
            validated.append(ok)
            statuses.append(resp.status if ok else "FALLBACK")
            if ok:
                durations.append(float(resp.duration_ms or 0.0))
            print(f"  {sample['id']} run {i + 1}/{runs}: {'validated' if ok else 'FALLBACK'} {resp.duration_ms:.0f} ms", file=sys.stderr)
    finally:
        mp.output_validator.validate_output = original
    if not durations:
        raise SystemExit(f"{sample['id']}: no validated runs; refusing to write unmeasured data")
    return {
        "runs": runs,
        "validated_runs": sum(validated),
        "fallback_runs": runs - sum(validated),
        "statuses": statuses,
        "pipeline_ms": {
            "median": round(statistics.median(durations), 2),
            "min": round(min(durations), 2),
            "max": round(max(durations), 2),
            "all": [round(d, 2) for d in durations],
        },
        "response": {
            "summary": resp.summary,
            "status": resp.status,
            "risk_level": resp.risk_assessment.risk_level.value if resp.risk_assessment else None,
            "risk_flags": list(resp.risk_assessment.risk_flags) if resp.risk_assessment else [],
            "recommended_action": resp.risk_assessment.recommended_action if resp.risk_assessment else None,
        },
        "reasoning": captured.get("reasoning"),
    }


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--runs", type=int, default=5)
    ap.add_argument("--gate-iterations", type=int, default=2000)
    args = ap.parse_args()

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    meta = {
        "captured_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "model": settings.MODEL_NAME,
        "ollama_host": settings.OLLAMA_HOST,
        "hardware": hardware(),
        "runs_per_modality": args.runs,
        "gate_iterations": args.gate_iterations,
    }

    print("gate", file=sys.stderr)
    gate = capture_gate(args.gate_iterations)

    modalities: Dict[str, Any] = {}
    for s in SAMPLES:
        print(s["id"], file=sys.stderr)
        modalities[s["id"]] = {
            "label": s["label"],
            "file": s["file"],
            "modality": s["modality"].value,
            "symptoms": s["symptoms"],
            "input": capture_input(s),
            **capture_reasoning(s, args.runs),
        }

    # End-to-end through the orchestrator on the gate case: proves the block path.
    t0 = time.perf_counter()
    blocked = orchestrator.process_analysis_request(
        AnalysisRequest(
            request_id="LAND-GATE",
            patient=PatientInput(patient_id="P-GATE", age=GATE_CASE["age"], gender=GATE_CASE["gender"], symptoms=GATE_CASE["symptoms"]),
            image=None,
            notes=None,
        )
    )
    gate["orchestrator_block"] = {
        "status": blocked.status,
        "summary": blocked.summary,
        "duration_ms": blocked.duration_ms,
        "wall_ms": round((time.perf_counter() - t0) * 1000, 3),
        "risk_level": blocked.risk_assessment.risk_level.value if blocked.risk_assessment else None,
    }

    all_durations = [d for m in modalities.values() for d in m["pipeline_ms"]["all"]]
    validated_total = sum(m["validated_runs"] for m in modalities.values())
    fallback_total = sum(m["fallback_runs"] for m in modalities.values())
    ocr_confs = [
        m["input"]["extracted"]["confidence"]
        for m in modalities.values()
        if m["input"]["extracted"] and m["input"]["ocr_performed"]
    ]
    summary = {
        "total_runs": validated_total + fallback_total,
        "validated_runs": validated_total,
        "fallback_runs": fallback_total,
        "pipeline_ms_median": round(statistics.median(all_durations), 2),
        "pipeline_ms_min": round(min(all_durations), 2),
        "pipeline_ms_max": round(max(all_durations), 2),
        "ocr_confidence_mean": round(statistics.mean(ocr_confs), 4) if ocr_confs else None,
        "ocr_samples": len(ocr_confs),
        "gate_latency_ms_median": gate["latency_ms"]["match_median"],
        "gate_latency_ms_max": gate["latency_ms"]["match_max"],
        "gate_rule_count": gate["rule_count"],
        "supported_inputs": len(SAMPLES),
    }

    (OUT_DIR / "capture.json").write_text(
        json.dumps({"meta": meta, "summary": summary, "gate": gate, "modalities": modalities}, indent=2)
    )
    print(json.dumps({"meta": meta, "summary": summary}, indent=2))


if __name__ == "__main__":
    main()
