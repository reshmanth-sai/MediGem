"""Rule database loading and persistence module for Emergency Safety Engine."""

import json
from pathlib import Path
from typing import Dict, List, Tuple

from backend.emergency.exceptions import InvalidRuleDefinitionError
from backend.emergency.models import EmergencyRule


DEFAULT_RULES_JSON_PATH: Path = Path(__file__).parent / "rules.json"


def load_rules_and_synonyms(
    json_path: Path = DEFAULT_RULES_JSON_PATH,
) -> Tuple[List[EmergencyRule], Dict[str, List[str]]]:
    """Load emergency rules and synonym mapping dictionary from JSON configuration file."""
    if not json_path.exists():
        raise InvalidRuleDefinitionError(f"Rules JSON file not found at: {json_path}")

    try:
        data = json.loads(json_path.read_text(encoding="utf-8"))
        synonyms: Dict[str, List[str]] = data.get("synonyms", {})
        raw_rules = data.get("rules", [])

        rules: List[EmergencyRule] = []
        for raw in raw_rules:
            rule = EmergencyRule.model_validate(raw)
            rules.append(rule)

        return rules, synonyms
    except Exception as e:
        raise InvalidRuleDefinitionError(f"Failed to load rules from JSON: {e}") from e


def save_rules_to_json(
    rules: List[EmergencyRule],
    synonyms: Dict[str, List[str]],
    json_path: Path = DEFAULT_RULES_JSON_PATH,
) -> None:
    """Save current rules and synonyms into JSON configuration file."""
    try:
        data = {
            "synonyms": synonyms,
            "rules": [rule.model_dump() for rule in rules],
        }
        json_path.parent.mkdir(parents=True, exist_ok=True)
        json_path.write_text(json.dumps(data, indent=2), encoding="utf-8")
    except Exception as e:
        raise InvalidRuleDefinitionError(f"Failed to save rules to JSON: {e}") from e
