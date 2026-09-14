"""The HTTP layer over the orchestrator: gate first, honest health, no patient files left behind."""

import os
import unittest
import warnings
from unittest.mock import patch

# Tests must never write to the real case store.
os.environ.setdefault("MEDIGEM_DB_PATH", ":memory:")

warnings.filterwarnings("ignore", category=DeprecationWarning)

import importlib  # noqa: E402

from fastapi.testclient import TestClient  # noqa: E402

from backend.api import app  # noqa: E402

# The package re-exports the FastAPI instance under the module's own name;
# patching module globals needs the module itself.
api = importlib.import_module("backend.api.app")
from backend.config.settings import settings  # noqa: E402


class ApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.client = TestClient(app)

    def test_rules_lists_every_enabled_rule(self) -> None:
        r = self.client.get("/rules")
        self.assertEqual(r.status_code, 200)
        rules = r.json()
        self.assertGreaterEqual(len(rules), 1)
        self.assertIn("R-CARDIAC-01", [x["id"] for x in rules])
        self.assertEqual(rules[0]["priority"], "CRITICAL")

    def test_gate_matches_cardiac_case(self) -> None:
        r = self.client.post("/gate/evaluate", json={"symptoms": ["chest tightness", "breathlessness"]})
        self.assertEqual(r.status_code, 200)
        body = r.json()
        self.assertTrue(body["emergency_detected"])
        self.assertFalse(body["safe_for_ai_processing"])
        self.assertEqual(body["recommended_action"], "CALL_AMBULANCE")

    def test_gate_passes_benign_case(self) -> None:
        r = self.client.post("/gate/evaluate", json={"symptoms": ["mild headache"]})
        self.assertFalse(r.json()["emergency_detected"])

    def test_analyze_intercepts_before_any_model_call(self) -> None:
        with patch("backend.pipeline.medical_pipeline.ai_manager.generate") as gen:
            r = self.client.post(
                "/analyze",
                data={"patient_id": "P1", "age": 62, "gender": "Female", "symptoms": '["chest tightness","breathlessness"]'},
            )
            gen.assert_not_called()
        self.assertEqual(r.status_code, 200)
        body = r.json()
        self.assertEqual(body["status"], "EMERGENCY_INTERCEPTED")
        self.assertEqual(body["risk_assessment"]["risk_level"], "EMERGENCY")
        self.assertIsNone(body["reasoning"])

    def test_analyze_requires_demographics(self) -> None:
        r = self.client.post("/analyze", data={"symptoms": "cough"})
        self.assertEqual(r.status_code, 422)

    def test_analyze_rejects_unsupported_upload(self) -> None:
        r = self.client.post(
            "/analyze",
            data={"age": 30, "gender": "Male", "image_type": "REPORT"},
            files={"image": ("x.txt", b"hello", "text/plain")},
        )
        self.assertEqual(r.status_code, 415)

    def test_upload_is_removed_after_analysis(self) -> None:
        before = set(settings.TMP_DIR.glob("REQ-*")) if settings.TMP_DIR.exists() else set()
        with patch("backend.api.app.orchestrator.process_analysis_request") as run, patch.object(api, "case_store", api.case_store.__class__(":memory:")):
            from backend.schemas import AnalysisResponse

            run.return_value = AnalysisResponse(request_id="REQ-X", summary="stub", status="COMPLETED")
            self.client.post(
                "/analyze",
                data={"age": 30, "gender": "Male", "image_type": "WOUND"},
                files={"image": ("w.png", b"\x89PNG\r\n\x1a\n", "image/png")},
            )
        after = set(settings.TMP_DIR.glob("REQ-*")) if settings.TMP_DIR.exists() else set()
        self.assertEqual(before, after)

    def test_api_key_required_when_configured(self) -> None:
        with patch.object(api, "API_KEY", "secret"):
            r = self.client.post("/gate/evaluate", json={"symptoms": ["cough"]})
            self.assertEqual(r.status_code, 401)
            r = self.client.post("/gate/evaluate", json={"symptoms": ["cough"]}, headers={"X-API-Key": "wrong"})
            self.assertEqual(r.status_code, 401)
            r = self.client.post("/gate/evaluate", json={"symptoms": ["cough"]}, headers={"X-API-Key": "secret"})
            self.assertEqual(r.status_code, 200)
            # Reads stay open.
            self.assertEqual(self.client.get("/rules").status_code, 200)

    def test_analyze_is_rate_limited_per_client(self) -> None:
        with patch.object(api, "analyze_limiter", api.SlidingWindow(2)):
            with patch("backend.pipeline.medical_pipeline.ai_manager.generate"):
                data = {"age": 30, "gender": "Male", "symptoms": '["chest tightness","breathlessness"]'}
                self.assertEqual(self.client.post("/analyze", data=data).status_code, 200)
                self.assertEqual(self.client.post("/analyze", data=data).status_code, 200)
                self.assertEqual(self.client.post("/analyze", data=data).status_code, 429)

    def test_health_reports_gate_and_model(self) -> None:
        r = self.client.get("/health")
        self.assertEqual(r.status_code, 200)
        body = r.json()
        self.assertEqual(body["model"], settings.MODEL_NAME)
        self.assertGreaterEqual(body["gate_rule_count"], 1)
        self.assertGreater(body["gate_latency_ms"], 0)
        self.assertIn(body["ollama_connected"], (True, False))


if __name__ == "__main__":
    unittest.main()
