"""Fixtures that pin the TypeScript port of the emergency gate to this engine.

The landing page runs the gate in the browser (frontend_v2/lib/gate). That
copy is only honest if it answers exactly as the Python engine does, so this
module evaluates a fixed set of inputs with the real engine and writes the
answers to frontend_v2/lib/gate/parity.fixtures.json. The frontend test suite
replays every input through the port and compares; tests/test_gate_parity.py
fails when the engine or rules change and the fixtures were not regenerated.

Regenerate with:  python -m tests.gate_parity
"""

import json
from pathlib import Path
from typing import Any, Dict, List

from backend.emergency.engine import EmergencyEngine
from backend.emergency.rules import DEFAULT_RULES_JSON_PATH

ROOT = Path(__file__).resolve().parent.parent
FIXTURES_PATH = ROOT / "frontend_v2" / "lib" / "gate" / "parity.fixtures.json"
FRONTEND_RULES_PATH = ROOT / "frontend_v2" / "lib" / "gate" / "rules.json"

# Hand-picked inputs: the landing presets, known weak spots, and edge cases
# in normalisation. The generated inputs below cover every rule term and
# every synonym on its own.
HAND_INPUTS: List[List[str]] = [
    [],
    ["", "   "],
    ["chest tightness", "breathlessness"],
    ["slurred speech", "arm weakness"],
    ["mild headache"],
    ["Mild fatigue", "slight dry skin"],
    ["fever and delirium", "chest tightness"],
    ["cobra bite on right ankle", "rapid swelling"],
    ["seene mein dard"],
    ["saans nahi aa rahi"],
    ["सीने में दर्द"],
    ["CHEST   PAIN!!!"],
    ["  passed-out  "],
    ["pain"],
    ["a"],
    ["bleeding"],
    ["cough for two weeks", "night sweats"],
    ["pregnant", "vaginal bleeding during pregnancy"],
    ["hives and gasping"],
    ["fever"],
    ["high fever with confusion", "seizure"],
    ["overdose", "unresponsive"],
    ["third-degree burn on both arms"],
    ["headache, dizziness"],
    ["stroke"],
    ["no chest pain"],
]


# The coverage matrix on the developer page: for each rule, phrasings a
# clinician would expect to fire it (in English, and in romanised Hindi as a
# CHO would type it) and phrasings that should leave it alone.
# The expectation is written by hand; whether the rule actually fired comes
# from the engine. Rows where the two disagree are the gate's known gaps.
COVERAGE: Dict[str, Dict[str, List[str]]] = {
    "R-CARDIAC-01": {
        "fire": ["chest pain", "chest tightness", "pressure in my chest"],
        "fire_hindi": ["seene mein dard"],
        "silent": ["chest x-ray normal", "no chest pain"],
    },
    "R-STROKE-01": {
        "fire": ["slurred speech", "facial drooping", "face drooping on one side"],
        "fire_hindi": ["lakwa"],
        "silent": ["speech therapy follow-up"],
    },
    "R-RESP-01": {
        "fire": ["difficulty breathing", "cannot breathe", "can't breathe"],
        "fire_hindi": ["saans lene mein takleef"],
        "silent": ["breathing normally"],
    },
    "R-TRAUMA-01": {
        "fire": ["heavy bleeding", "bleeding a lot"],
        "fire_hindi": ["khoon beh raha hai"],
        "silent": ["bleeding stopped", "bleeding gums"],
    },
    "R-NEURO-01": {
        "fire": ["seizure", "fainted", "passed-out"],
        "fire_hindi": ["behosh"],
        "silent": ["feels faint"],
    },
    "R-SEPSIS-01": {
        "fire": ["fever and delirium", "high fever and confused"],
        "fire_hindi": ["tez bukhar aur behoshi"],
        "silent": ["fever"],
    },
    "R-TOXIC-01": {
        "fire": ["overdose", "swallowed poison", "drank pesticide"],
        "silent": ["took paracetamol as prescribed"],
    },
    "R-SNAKE-01": {
        "fire": ["cobra bite", "bitten by a snake"],
        "fire_hindi": ["saanp ne kaata"],
        "silent": ["dog bite"],
    },
    "R-BURNS-01": {
        "fire": ["third degree burn", "third-degree burn", "burnt by fire"],
        "silent": ["sunburn"],
    },
    "R-ANAPHYLAXIS-01": {
        "fire": ["throat swelling", "severe allergic reaction", "swollen throat"],
        "silent": ["mild rash"],
    },
    "R-OB-01": {
        "fire": ["vaginal bleeding during pregnancy", "pregnant and bleeding"],
        "silent": ["routine pregnancy checkup"],
    },
}


def _coverage(engine: EmergencyEngine) -> List[Dict[str, Any]]:
    rows = []
    for rule_id, groups in COVERAGE.items():
        for group in ("fire", "fire_hindi", "silent"):
            for phrase in groups.get(group, []):
                rows.append({
                    "rule_id": rule_id,
                    "phrase": phrase,
                    "language": "hi-Latn" if group == "fire_hindi" else "en",
                    "should_fire": group != "silent",
                    "fired": rule_id in engine.evaluate([phrase]).matched_rules,
                })
    return rows


def _generated_inputs(rules_doc: Dict[str, Any]) -> List[List[str]]:
    inputs: List[List[str]] = []
    for canonical, synonyms in rules_doc["synonyms"].items():
        inputs.append([canonical])
        inputs.extend([s] for s in synonyms)
    for rule in rules_doc["rules"]:
        inputs.extend([s] for s in rule["symptoms_required"])
        inputs.append(list(rule["symptoms_required"]))
    return inputs


def _answer(engine: EmergencyEngine, symptoms: List[str]) -> Dict[str, Any]:
    r = engine.evaluate(symptoms)
    return {
        "emergency_detected": r.emergency_detected,
        "safe_for_ai_processing": r.safe_for_ai_processing,
        "matched_rules": r.matched_rules,
        # The engine builds this from a set, so its order is not stable.
        "matched_symptoms": sorted(r.matched_symptoms),
        "emergency_category": r.emergency_category.value if r.emergency_category else None,
        "priority": r.priority,
        "rule_match_score": r.rule_match_score,
        "recommended_action": r.recommended_action,
        "should_refer_immediately": r.should_refer_immediately,
        "should_call_ambulance": r.should_call_ambulance,
    }


def build_fixtures() -> Dict[str, Any]:
    rules_doc = json.loads(DEFAULT_RULES_JSON_PATH.read_text(encoding="utf-8"))
    engine = EmergencyEngine()
    seen = set()
    cases = []
    for symptoms in HAND_INPUTS + _generated_inputs(rules_doc):
        key = json.dumps(symptoms)
        if key in seen:
            continue
        seen.add(key)
        cases.append({"input": symptoms, "expected": _answer(engine, symptoms)})
    return {"source": "backend/emergency/rules.json", "cases": cases, "coverage": _coverage(engine)}


def render(doc: Dict[str, Any]) -> str:
    return json.dumps(doc, indent=2, ensure_ascii=False) + "\n"


if __name__ == "__main__":
    FIXTURES_PATH.parent.mkdir(parents=True, exist_ok=True)
    FIXTURES_PATH.write_text(render(build_fixtures()), encoding="utf-8")
    FRONTEND_RULES_PATH.write_text(DEFAULT_RULES_JSON_PATH.read_text(encoding="utf-8"), encoding="utf-8")
    print(f"wrote {FIXTURES_PATH.relative_to(ROOT)} and {FRONTEND_RULES_PATH.relative_to(ROOT)}")
