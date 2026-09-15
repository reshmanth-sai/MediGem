"""The browser copy of the gate must be regenerated whenever the engine changes."""

import unittest

from backend.emergency.rules import DEFAULT_RULES_JSON_PATH
from tests.gate_parity import FIXTURES_PATH, FRONTEND_RULES_PATH, build_fixtures, render


class TestGateParityFixtures(unittest.TestCase):
    def test_fixtures_match_the_engine(self) -> None:
        self.assertTrue(FIXTURES_PATH.exists(), "run: python -m tests.gate_parity")
        self.assertEqual(
            FIXTURES_PATH.read_text(encoding="utf-8"),
            render(build_fixtures()),
            "gate fixtures are stale; run: python -m tests.gate_parity",
        )

    def test_frontend_rules_are_a_copy_of_the_backend_rules(self) -> None:
        self.assertEqual(
            FRONTEND_RULES_PATH.read_text(encoding="utf-8"),
            DEFAULT_RULES_JSON_PATH.read_text(encoding="utf-8"),
            "frontend rules drifted; run: python -m tests.gate_parity",
        )


if __name__ == "__main__":
    unittest.main()
