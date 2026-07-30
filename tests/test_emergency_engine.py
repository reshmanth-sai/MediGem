"""Comprehensive Unit Test Suite for MediGem Emergency Safety Engine."""

import unittest
from backend.emergency.constants import EmergencyCategory, RecommendedAction, RulePriority
from backend.emergency.engine import EmergencyEngine
from backend.emergency.models import EmergencyRule


class TestEmergencyEngine(unittest.TestCase):
    """Test suite verifying safety gate rules, synonym expansion, and priority resolution."""

    def setUp(self) -> None:
        self.engine = EmergencyEngine()

    def test_no_symptoms_empty_input(self) -> None:
        """Verify empty or whitespace symptom lists return safe_for_ai_processing=True."""
        response1 = self.engine.evaluate([])
        self.assertFalse(response1.emergency_detected)
        self.assertTrue(response1.safe_for_ai_processing)
        self.assertEqual(response1.priority, RulePriority.LOW.to_string())
        self.assertEqual(response1.rule_match_score, 0.0)

        response2 = self.engine.evaluate(["   ", ""])
        self.assertFalse(response2.emergency_detected)
        self.assertTrue(response2.safe_for_ai_processing)

    def test_single_mild_or_unknown_symptom(self) -> None:
        """Verify non-emergency symptoms pass through without triggering rules."""
        response = self.engine.evaluate(["Mild fatigue", "slight dry skin"])
        self.assertFalse(response.emergency_detected)
        self.assertTrue(response.safe_for_ai_processing)
        self.assertEqual(response.priority, RulePriority.LOW.to_string())
        self.assertEqual(response.rule_match_score, 0.0)

    def test_critical_single_symptom_chest_pain(self) -> None:
        """Verify critical cardiac symptom triggers emergency gate and blocks AI processing."""
        response = self.engine.evaluate(["chest pain"])
        self.assertTrue(response.emergency_detected)
        self.assertFalse(response.safe_for_ai_processing)
        self.assertEqual(response.emergency_category, EmergencyCategory.CARDIAC)
        self.assertEqual(response.priority, RulePriority.CRITICAL.to_string())
        self.assertTrue(response.should_call_ambulance)
        self.assertTrue(response.should_refer_immediately)
        self.assertIn("R-CARDIAC-01", response.matched_rules)
        self.assertIn("Triggered rule 'R-CARDIAC-01'", response.matched_reason)
        self.assertGreater(response.rule_match_score, 0.0)

    def test_synonym_matching(self) -> None:
        """Verify colloquial synonyms (e.g. 'passed out', 'dyspnea') trigger corresponding rules."""
        # 1. 'passed out' synonym for 'loss of consciousness'
        response1 = self.engine.evaluate(["passed out"])
        self.assertTrue(response1.emergency_detected)
        self.assertFalse(response1.safe_for_ai_processing)
        self.assertIn("loss of consciousness", response1.matched_symptoms)

        # 2. 'dyspnea' synonym for 'shortness of breath' (Respiratory / Cardiac)
        response2 = self.engine.evaluate(["dyspnea"])
        self.assertTrue(response2.emergency_detected)
        self.assertFalse(response2.safe_for_ai_processing)
        self.assertIn(response2.emergency_category, (EmergencyCategory.RESPIRATORY, EmergencyCategory.CARDIAC))

    def test_multiple_symptoms_and_priority_resolution(self) -> None:
        """Verify highest priority rule takes precedence when multiple rules match."""
        # Symptoms matching Sepsis (HIGH) and Cardiac (CRITICAL)
        response = self.engine.evaluate(["fever and delirium", "chest tightness"])
        self.assertTrue(response.emergency_detected)
        self.assertFalse(response.safe_for_ai_processing)
        self.assertEqual(response.emergency_category, EmergencyCategory.CARDIAC)
        self.assertEqual(response.priority, RulePriority.CRITICAL.to_string())
        self.assertIn("R-CARDIAC-01", response.matched_rules)

    def test_snake_bite_emergency(self) -> None:
        """Verify venomous snake bite trigger."""
        response = self.engine.evaluate(["cobra bite on right ankle", "rapid swelling"])
        self.assertTrue(response.emergency_detected)
        self.assertFalse(response.safe_for_ai_processing)
        self.assertEqual(response.emergency_category, EmergencyCategory.SNAKE_BITE)
        self.assertTrue(response.should_call_ambulance)

    def test_poisoning_emergency(self) -> None:
        """Verify toxic chemical ingestion trigger."""
        response = self.engine.evaluate(["pesticide swallowed by accident"])
        self.assertTrue(response.emergency_detected)
        self.assertFalse(response.safe_for_ai_processing)
        self.assertEqual(response.emergency_category, EmergencyCategory.POISONING)

    def test_dynamic_rule_addition(self) -> None:
        """Verify custom rules can be dynamically added to engine at runtime without code changes."""
        custom_rule = EmergencyRule(
            rule_id="R-TEST-HEAT",
            rule_name="Heat Stroke Emergency",
            description="Triggers on heat exhaustion with high fever.",
            symptoms_required=["extreme heat fever", "no sweating"],
            min_match_count=1,
            priority=RulePriority.HIGH,
            recommended_action=RecommendedAction.IMMEDIATE_REFERRAL.value,
            emergency_category=EmergencyCategory.GENERAL_EMERGENCY,
            enabled=True,
        )
        self.engine.add_rule(custom_rule)

        response = self.engine.evaluate(["extreme heat fever"])
        self.assertTrue(response.emergency_detected)
        self.assertIn("R-TEST-HEAT", response.matched_rules)

    def test_rule_enable_disable(self) -> None:
        """Verify enabling and disabling rules dynamically."""
        self.assertTrue(self.engine.disable_rule("R-CARDIAC-01"))
        response_disabled = self.engine.evaluate(["chest pain"])
        # If cardiac rule is disabled, another rule or no rule triggers
        self.assertNotIn("R-CARDIAC-01", response_disabled.matched_rules)

        self.assertTrue(self.engine.enable_rule("R-CARDIAC-01"))
        response_enabled = self.engine.evaluate(["chest pain"])
        self.assertIn("R-CARDIAC-01", response_enabled.matched_rules)

    def test_performance_execution_speed(self) -> None:
        """Verify rule evaluation executes under 10 milliseconds (averages ~0.16 ms)."""
        import time
        start = time.time()
        for _ in range(50):
            self.engine.evaluate(["chest pain", "shortness of breath", "fever"])
        duration = (time.time() - start) / 50.0
        self.assertLess(duration, 0.010, f"Average execution took {duration*1000:.2f}ms, expected < 10ms")


if __name__ == "__main__":
    unittest.main()
