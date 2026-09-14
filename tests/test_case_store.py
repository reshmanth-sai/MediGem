"""The SQLite case store and its routes."""

import os
import unittest
import warnings
from unittest.mock import patch

warnings.filterwarnings("ignore", category=DeprecationWarning)
os.environ.setdefault("MEDIGEM_DB_PATH", ":memory:")

import importlib  # noqa: E402

from fastapi.testclient import TestClient  # noqa: E402

from backend.store.cases import CaseStore  # noqa: E402

api = importlib.import_module("backend.api.app")


class StoreTests(unittest.TestCase):
    def setUp(self) -> None:
        self.store = CaseStore(":memory:")

    def test_create_derives_flags_from_the_response(self) -> None:
        rec = self.store.create(
            patient={"patient_id": "P1", "age": 40, "gender": "Male", "symptoms": ["cough"]},
            response={
                "status": "COMPLETED",
                "risk_assessment": {"risk_level": "MODERATE"},
                "reasoning": {"recommendations": {"needs_referral": True, "requires_human_review": True}},
            },
        )
        self.assertTrue(rec.id.startswith("CASE-"))
        self.assertEqual(rec.risk_level, "MODERATE")
        self.assertTrue(rec.needs_referral)
        self.assertTrue(rec.requires_review)

    def test_intercepted_run_is_a_referral_even_without_reasoning(self) -> None:
        rec = self.store.create(
            patient={"patient_id": "P2"},
            response={"status": "EMERGENCY_INTERCEPTED", "risk_assessment": {"risk_level": "EMERGENCY"}, "reasoning": None},
        )
        self.assertTrue(rec.needs_referral)
        self.assertEqual(rec.risk_level, "EMERGENCY")

    def test_review_clears_the_flag_and_records_who(self) -> None:
        rec = self.store.create(patient={}, response={"status": "COMPLETED"})
        out = self.store.review(rec.id, "approved", "Dr. A", "fine")
        self.assertIsNotNone(out)
        self.assertFalse(out.requires_review)
        self.assertEqual(out.reviewer, "Dr. A")
        self.assertIsNone(self.store.review("CASE-NOPE", "approved", "Dr. A"))
        with self.assertRaises(ValueError):
            self.store.review(rec.id, "meh", "Dr. A")

    def test_list_filters_and_orders_newest_first(self) -> None:
        a = self.store.create(patient={}, response={"status": "COMPLETED", "risk_assessment": {"risk_level": "LOW"}})
        b = self.store.create(patient={}, response={"status": "EMERGENCY_INTERCEPTED", "risk_assessment": {"risk_level": "EMERGENCY"}})
        ids = [r.id for r in self.store.list()]
        self.assertEqual(set(ids), {a.id, b.id})
        self.assertEqual([r.id for r in self.store.list(risk_level="EMERGENCY")], [b.id])
        self.assertEqual([r.id for r in self.store.list(needs_referral=False)], [a.id])
        self.assertTrue(self.store.delete(a.id))
        self.assertEqual(self.store.count(), 1)


class CaseRoutesTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.client = TestClient(api.app)

    def test_analyze_persists_and_the_case_round_trips(self) -> None:
        with patch.object(api, "case_store", CaseStore(":memory:")) as store:
            with patch("backend.pipeline.medical_pipeline.ai_manager.generate"):
                r = self.client.post(
                    "/analyze",
                    data={"patient_id": "P1", "patient_name": "Test Person", "age": 62, "gender": "Female", "symptoms": '["chest tightness","breathlessness"]'},
                )
            self.assertEqual(r.status_code, 200)
            cid = r.json()["case_id"]
            self.assertTrue(cid)
            listed = self.client.get("/cases").json()
            self.assertEqual([c["id"] for c in listed], [cid])
            self.assertEqual(listed[0]["patient"]["patient_name"], "Test Person")
            self.assertEqual(self.client.get("/cases/NOPE").status_code, 404)
            reviewed = self.client.post(f"/cases/{cid}/review", json={"decision": "approved", "reviewer": "Dr. V"}).json()
            self.assertFalse(reviewed["requires_review"])
            self.assertEqual(self.client.get("/health").json()["case_count"], 1)
            self.assertEqual(self.client.delete(f"/cases/{cid}").status_code, 204)
            self.assertEqual(store.count(), 0)

    def test_persist_false_stores_nothing(self) -> None:
        with patch.object(api, "case_store", CaseStore(":memory:")) as store:
            with patch("backend.pipeline.medical_pipeline.ai_manager.generate"):
                r = self.client.post("/analyze", data={"age": 30, "gender": "Male", "symptoms": '["chest tightness","breathlessness"]', "persist": "false"})
            self.assertIsNone(r.json()["case_id"])
            self.assertEqual(store.count(), 0)


if __name__ == "__main__":
    unittest.main()
