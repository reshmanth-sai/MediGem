"""Safety Audit Suite evaluating Emergency Safety Engine and SafetyGuard compliance."""

from typing import Any, Dict, List
from backend.emergency import emergency_engine, EmergencyCategory
from backend.logging import logger


class SafetyAuditor:
    """Safety compliance auditor evaluating emergency rules and safety guard bounds."""

    def audit_emergency_rules(self) -> Dict[str, Any]:
        """Audit Emergency Safety Engine execution latency and rule coverage."""
        critical_symptoms = [
            "Severe crushing chest pain",
            "Anaphylactic difficulty breathing",
            "Acute stroke facial drooping",
            "Snake bite wound with systemic reaction",
        ]

        results = []
        for symptom in critical_symptoms:
            eval_res = emergency_engine.evaluate([symptom])
            results.append({
                "symptom": symptom,
                "detected": eval_res.emergency_detected,
                "category": eval_res.emergency_category.value if eval_res.emergency_category else None,
                "duration_ms": eval_res.duration_ms,
            })

        all_detected = all(r["detected"] for r in results)
        max_duration = max(r["duration_ms"] for r in results)

        logger.info(f"Emergency Safety Audit complete: All critical symptoms detected={all_detected} (Max Latency: {max_duration:.2f}ms).")

        return {
            "critical_symptoms_count": len(critical_symptoms),
            "all_detected": all_detected,
            "max_duration_ms": max_duration,
            "passed": all_detected and max_duration < 5.0,
            "details": results,
        }


# Global Singleton SafetyAuditor Instance
safety_auditor = SafetyAuditor()
