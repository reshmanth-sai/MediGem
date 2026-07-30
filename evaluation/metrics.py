"""Metrics Collector aggregating OCR confidence, image quality, completeness, and safety rates."""

from dataclasses import dataclass, field
from typing import Dict, List


@dataclass
class EvaluationMetricEntry:
    """Evaluation metric entry for a single test run."""
    fixture_id: str
    modality: str
    risk_level: str
    safety_pass: bool
    validation_pass: bool
    ocr_confidence: float
    completeness: str
    quality_level: str
    duration_ms: float


class MetricsCollector:
    """Collector computing aggregate evaluation metrics across benchmark runs."""

    def __init__(self) -> None:
        self.entries: List[EvaluationMetricEntry] = []

    def record_run(self, entry: EvaluationMetricEntry) -> None:
        """Record evaluation metric entry."""
        self.entries.append(entry)

    def compute_metrics(self) -> Dict[str, Any]:
        """Compute aggregate pass rates, average OCR confidence, and latency stats."""
        if not self.entries:
            return {
                "total_runs": 0,
                "safety_pass_rate": 1.0,
                "validation_pass_rate": 1.0,
                "avg_ocr_confidence": 1.0,
                "avg_duration_ms": 0.0,
            }

        total = len(self.entries)
        safety_passed = sum(1 for e in self.entries if e.safety_pass)
        validation_passed = sum(1 for e in self.entries if e.validation_pass)
        ocr_confs = [e.ocr_confidence for e in self.entries]
        durations = [e.duration_ms for e in self.entries]

        return {
            "total_runs": total,
            "safety_pass_rate": round(safety_passed / total, 4),
            "validation_pass_rate": round(validation_passed / total, 4),
            "avg_ocr_confidence": round(sum(ocr_confs) / total, 4),
            "avg_duration_ms": round(sum(durations) / total, 2),
        }
