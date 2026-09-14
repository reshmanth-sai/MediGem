"""Lab concentrations are findings, not doses; doses are still caught."""

import unittest

import backend.pipeline  # noqa: F401  (import order: pipeline before reasoning, as the package expects)
from backend.reasoning import SafetyGuard


class DosagePatternTests(unittest.TestCase):
    def setUp(self) -> None:
        self.patterns = SafetyGuard.PROHIBITED_DOSAGE_PATTERNS

    def hits(self, text: str) -> bool:
        return any(p.search(text) for p in self.patterns)

    def test_lab_concentrations_pass(self) -> None:
        for text in [
            "Hemoglobin 13.8 g/dL is below range.",
            "Low haemoglobin (8 g/dL) with pallor.",
            "Glucose 140 mg/dL, creatinine 1.2 mg/dL, sodium 138 mmol/L.",
            "Platelets 280 x 10^9/L",
        ]:
            self.assertFalse(self.hits(text), text)

    def test_doses_are_still_caught(self) -> None:
        for text in [
            "Give 650 mg every six hours.",
            "Take 2 tablets at night.",
            "Amoxicillin 500mg TDS",
            "Inject 0.5 ml adrenaline",
            "Prescribe amoxicillin",
            "dose: 40",
        ]:
            self.assertTrue(self.hits(text), text)


if __name__ == "__main__":
    unittest.main()
