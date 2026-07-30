"""Synonym-aware symptom evaluator and rule matching logic."""

import re
from typing import Dict, List, Set, Tuple

from backend.emergency.models import EmergencyRule


def normalize_text(text: str) -> str:
    """Normalize text by converting to lower case, trimming, and stripping punctuation."""
    if not text:
        return ""
    text = text.lower().strip()
    # Remove non-alphanumeric except spaces
    text = re.sub(r"[^\w\s]", "", text)
    # Collapse multiple spaces
    text = re.sub(r"\s+", " ", text)
    return text


def expand_symptoms_with_synonyms(
    input_symptoms: List[str],
    synonym_map: Dict[str, List[str]],
) -> Set[str]:
    """Expand input patient symptoms using synonym dictionary mapping to canonical clinical terms."""
    expanded: Set[str] = set()

    for raw_symptom in input_symptoms:
        norm = normalize_text(raw_symptom)
        if not norm:
            continue

        expanded.add(norm)

        # Reverse lookup in synonym_map (canonical_term -> list of colloquial terms)
        for canonical, colloquial_list in synonym_map.items():
            norm_canonical = normalize_text(canonical)
            # Check if input matches canonical term
            if norm == norm_canonical or norm_canonical in norm:
                expanded.add(norm_canonical)

            # Check if input matches any colloquial synonym
            for syn in colloquial_list:
                norm_syn = normalize_text(syn)
                if norm == norm_syn or norm_syn in norm or norm in norm_syn:
                    expanded.add(norm_canonical)
                    expanded.add(norm_syn)

    return expanded


def evaluate_rule_match(
    rule: EmergencyRule,
    expanded_patient_symptoms: Set[str],
) -> Tuple[bool, List[str], float]:
    """Evaluate whether patient symptoms satisfy emergency rule criteria.

    Returns:
        Tuple[is_matched, matched_symptoms_list, rule_match_score]
    """
    if not rule.enabled:
        return False, [], 0.0

    matched: List[str] = []
    total_required = len(rule.symptoms_required)

    for req_symptom in rule.symptoms_required:
        norm_req = normalize_text(req_symptom)

        # Direct exact or substring match in expanded symptoms
        match_found = False
        for patient_sym in expanded_patient_symptoms:
            if norm_req == patient_sym or norm_req in patient_sym or patient_sym in norm_req:
                match_found = True
                break

        if match_found:
            matched.append(req_symptom)

    matched_count = len(matched)
    is_matched = matched_count >= rule.min_match_count

    # Calculate match ratio score [0.0 to 1.0]
    score = (matched_count / total_required) if total_required > 0 else 0.0
    score = min(1.0, max(0.0, score))

    return is_matched, matched, score
