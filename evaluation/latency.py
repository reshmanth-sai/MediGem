"""Latency Profiler measuring stage-by-stage pipeline execution latencies."""

from dataclasses import dataclass
from typing import Dict, List


@dataclass
class LatencyRecord:
    """Latency breakdown record for a single pipeline execution."""
    fixture_id: str
    total_ms: float
    input_processing_ms: float
    ocr_ms: float
    context_fusion_ms: float
    gemma_inference_ms: float
    validation_ms: float


class LatencyProfiler:
    """Profiler aggregating pipeline latency statistics (min, max, mean, median)."""

    def __init__(self) -> None:
        self.records: List[LatencyRecord] = []

    def add_record(self, record: LatencyRecord) -> None:
        """Record latency breakdown."""
        self.records.append(record)

    def calculate_summary(self) -> Dict[str, Dict[str, float]]:
        """Compute statistical summary for each execution stage."""
        if not self.records:
            return {}

        totals = [r.total_ms for r in self.records]
        gemma = [r.gemma_inference_ms for r in self.records]

        return {
            "total_ms": {
                "mean": round(sum(totals) / len(totals), 2),
                "min": round(min(totals), 2),
                "max": round(max(totals), 2),
            },
            "gemma_inference_ms": {
                "mean": round(sum(gemma) / len(gemma), 2),
                "min": round(min(gemma), 2),
                "max": round(max(gemma), 2),
            },
        }
