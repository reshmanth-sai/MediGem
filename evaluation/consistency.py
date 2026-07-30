"""Consistency Evaluator measuring output stability across multiple inference runs."""

from typing import Any, Dict, List
from backend.logging import logger
from backend.schemas.analysis import AnalysisRequest, AnalysisResponse
from backend.services.orchestrator import orchestrator


class ConsistencyEvaluator:
    """Evaluator executing repeated runs to measure risk level stability and output consistency."""

    def evaluate_consistency(self, request: AnalysisRequest, runs: int = 3) -> Dict[str, Any]:
        """Execute multiple analysis runs and measure risk level consistency."""
        responses: List[AnalysisResponse] = []
        risk_levels: List[str] = []

        for i in range(runs):
            resp = orchestrator.process_analysis_request(request)
            responses.append(resp)
            r_level = resp.risk_assessment.risk_level.value if resp.risk_assessment else "LOW"
            risk_levels.append(r_level)

        is_consistent = len(set(risk_levels)) == 1
        logger.info(f"Consistency evaluation complete across {runs} runs: Risk levels={risk_levels} (Consistent={is_consistent}).")

        return {
            "runs": runs,
            "risk_levels": risk_levels,
            "is_consistent": is_consistent,
            "consistent_risk_level": risk_levels[0] if is_consistent else None,
        }


# Global Singleton ConsistencyEvaluator Instance
consistency_evaluator = ConsistencyEvaluator()
