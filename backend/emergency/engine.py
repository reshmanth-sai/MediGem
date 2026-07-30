"""Deterministic Emergency Safety Engine execution module for MediGem."""

from pathlib import Path
from typing import Dict, List, Optional
import uuid

from backend.config.constants import RiskLevel
from backend.emergency.constants import EmergencyCategory, RecommendedAction, RulePriority
from backend.emergency.evaluator import evaluate_rule_match, expand_symptoms_with_synonyms
from backend.emergency.models import EmergencyRule, EmergencyResponse
from backend.emergency.rules import load_rules_and_synonyms, DEFAULT_RULES_JSON_PATH
from backend.logging import logger
from backend.utils import get_current_epoch_ms, get_current_utc_timestamp


class EmergencyEngine:
    """Deterministic, rule-based safety gate for emergency triage evaluation."""

    def __init__(self, json_path: Path = DEFAULT_RULES_JSON_PATH) -> None:
        self.rules_json_path = json_path
        self.rules: List[EmergencyRule] = []
        self.synonyms: Dict[str, List[str]] = {}
        self.reload_rules()

    def reload_rules(self) -> None:
        """Reload emergency rules and synonym mappings from JSON configuration."""
        self.rules, self.synonyms = load_rules_and_synonyms(self.rules_json_path)
        logger.info(f"EmergencyEngine initialized with {len(self.rules)} rules and {len(self.synonyms)} synonym groups.")

    def add_rule(self, rule: EmergencyRule) -> None:
        """Dynamically add or replace an emergency rule in memory."""
        # Replace if ID exists
        self.rules = [r for r in self.rules if r.rule_id != rule.rule_id]
        self.rules.append(rule)
        logger.info(f"Emergency rule '{rule.rule_id}' added/updated dynamically.")

    def enable_rule(self, rule_id: str) -> bool:
        """Enable an emergency rule by ID."""
        for rule in self.rules:
            if rule.rule_id == rule_id:
                rule.enabled = True
                return True
        return False

    def disable_rule(self, rule_id: str) -> bool:
        """Disable an emergency rule by ID."""
        for rule in self.rules:
            if rule.rule_id == rule_id:
                rule.enabled = False
                return True
        return False

    def evaluate(
        self,
        symptoms: List[str],
        patient_id: Optional[str] = None,
        request_id: Optional[str] = None,
    ) -> EmergencyResponse:
        """Evaluate patient symptoms against deterministic emergency rules.

        Returns an EmergencyResponse containing emergency status, rule match score,
        safe_for_ai_processing gate, and transparent human-readable matched_reason.
        """
        start_time = get_current_epoch_ms()
        tx_id = request_id or f"EMG-{uuid.uuid4().hex[:8].upper()}"

        if not symptoms or not any(s.strip() for s in symptoms if isinstance(s, str)):
            duration_ms = round(get_current_epoch_ms() - start_time, 2)
            logger.info(f"[{tx_id}] Emergency evaluation complete: No symptoms provided. Emergency=False.")
            return EmergencyResponse(
                emergency_detected=False,
                safe_for_ai_processing=True,
                matched_rules=[],
                matched_symptoms=[],
                emergency_category=None,
                priority=RulePriority.LOW.to_string(),
                rule_match_score=0.0,
                recommended_action=RecommendedAction.MONITOR_PATIENT.value,
                should_refer_immediately=False,
                should_call_ambulance=False,
                reason="No acute emergency symptoms reported.",
                matched_reason="No symptoms provided for emergency rule evaluation.",
                timestamp=get_current_utc_timestamp(),
                duration_ms=duration_ms,
            )

        # 1. Expand input symptoms using synonym dictionary
        expanded_symptoms = expand_symptoms_with_synonyms(symptoms, self.synonyms)

        # 2. Evaluate all active rules
        triggered_results = []
        for rule in self.rules:
            is_matched, matched_syms, score = evaluate_rule_match(rule, expanded_symptoms)
            if is_matched:
                triggered_results.append((rule, matched_syms, score))

        # 3. Decision resolution
        if not triggered_results:
            duration_ms = round(get_current_epoch_ms() - start_time, 2)
            logger.info(f"[{tx_id}] Emergency evaluation complete: {len(symptoms)} symptoms evaluated. No rules triggered. Emergency=False.")
            return EmergencyResponse(
                emergency_detected=False,
                safe_for_ai_processing=True,
                matched_rules=[],
                matched_symptoms=symptoms,
                emergency_category=None,
                priority=RulePriority.LOW.to_string(),
                rule_match_score=0.0,
                recommended_action=RecommendedAction.MONITOR_PATIENT.value,
                should_refer_immediately=False,
                should_call_ambulance=False,
                reason="Evaluated symptoms do not match acute emergency trigger rules.",
                matched_reason=f"Evaluated symptoms {symptoms} against {len(self.rules)} active rules. No emergency criteria met.",
                timestamp=get_current_utc_timestamp(),
                duration_ms=duration_ms,
            )

        # Sort matches by Priority (descending: CRITICAL -> HIGH -> MEDIUM -> LOW) then by score
        triggered_results.sort(key=lambda x: (x[0].priority.value, x[2]), reverse=True)

        primary_rule, primary_matched_syms, primary_score = triggered_results[0]
        all_matched_rule_ids = [r[0].rule_id for r in triggered_results]
        all_matched_symptoms = list(set(sym for r in triggered_results for sym in r[1]))

        # Action flags
        action = primary_rule.recommended_action
        should_ambulance = action in (RecommendedAction.CALL_AMBULANCE.value, RecommendedAction.CALL_AMBULANCE)
        should_refer = should_ambulance or action in (
            RecommendedAction.IMMEDIATE_REFERRAL.value,
            RecommendedAction.IMMEDIATE_REFERRAL,
            RecommendedAction.EMERGENCY_STABILIZATION.value,
            RecommendedAction.EMERGENCY_STABILIZATION,
        )

        # Transparent human-readable explanation
        matched_reason = (
            f"Triggered rule '{primary_rule.rule_id}' ({primary_rule.rule_name}) "
            f"with priority {primary_rule.priority.to_string()} and match score {primary_score:.2f}. "
            f"Matching clinical criteria: {primary_matched_syms} from patient input {symptoms}."
        )

        reason = (
            f"Emergency detected ({primary_rule.emergency_category.value}): "
            f"{primary_rule.rule_name}. Recommended Action: {action}."
        )

        duration_ms = round(get_current_epoch_ms() - start_time, 2)

        logger.warning(
            f"[{tx_id}] EMERGENCY DETECTED! Rule={primary_rule.rule_id}, Category={primary_rule.emergency_category.value}, "
            f"Priority={primary_rule.priority.to_string()}, Duration={duration_ms}ms"
        )

        return EmergencyResponse(
            emergency_detected=True,
            safe_for_ai_processing=False,  # Emergency gate blocks AI reasoning
            matched_rules=all_matched_rule_ids,
            matched_symptoms=all_matched_symptoms,
            emergency_category=primary_rule.emergency_category,
            priority=primary_rule.priority.to_string(),
            rule_match_score=round(primary_score, 2),
            recommended_action=action,
            should_refer_immediately=should_refer,
            should_call_ambulance=should_ambulance,
            reason=reason,
            matched_reason=matched_reason,
            timestamp=get_current_utc_timestamp(),
            duration_ms=duration_ms,
        )


# Global Singleton Emergency Engine Instance
emergency_engine = EmergencyEngine()
