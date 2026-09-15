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
        from backend.store.users import UserStore

        cls._user_store_patch = patch.object(api, "user_store", UserStore(":memory:"))
        cls._user_store_patch.start()
        cls._limiter_patch = patch.object(api, "analyze_limiter", api.SlidingWindow(10_000))
        cls._limiter_patch.start()

    @classmethod
    def tearDownClass(cls) -> None:
        cls._user_store_patch.stop()
        cls._limiter_patch.stop()

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


class CaseEditsTests(unittest.TestCase):
    """Patient edits, care plan, notes, documents and the event log behind them."""

    def setUp(self) -> None:
        os.environ["MEDIGEM_DOCS_DIR"] = os.path.join(os.environ.get("TMPDIR", "/tmp"), "medigem-test-docs")
        self.store = CaseStore(":memory:")
        self.case = self.store.create({"patient_name": "A", "symptoms": ["cough"]}, {"status": "COMPLETED"}, actor="Dr. T")

    def test_every_mutation_is_an_event(self) -> None:
        cid = self.case.id
        self.store.update_patient(cid, {"patient_name": "B", "symptoms": ["ignored"]}, "Dr. T")
        self.store.set_plan(cid, {"next_step": "Recheck", "follow_up": "3 days", "urgency": "Routine"}, "Dr. T")
        self.store.add_note(cid, "Dr. T", "Counselled.")
        self.store.add_document(cid, name="c.png", content_type="image/png", data=b"\x89PNG", added_by="Dr. T")
        self.store.review(cid, "approved", "Dr. T")
        rec = self.store.get(cid)
        self.assertEqual([e["action"] for e in rec.events], ["created", "patient_updated", "plan_updated", "note_added", "document_added", "reviewed"])
        self.assertEqual(rec.patient["patient_name"], "B")
        self.assertEqual(rec.patient["symptoms"], ["cough"], "symptoms are what was assessed and must not change")
        self.assertEqual(rec.plan["updated_by"], "Dr. T")
        self.assertEqual(len(rec.notes), 1)
        self.assertEqual(rec.documents[0]["size_bytes"], 4)

    def test_unchanged_patient_patch_writes_no_event(self) -> None:
        self.store.update_patient(self.case.id, {"patient_name": "A"}, "Dr. T")
        self.assertEqual([e["action"] for e in self.store.get(self.case.id).events], ["created"])

    def test_empty_note_is_rejected(self) -> None:
        with self.assertRaises(ValueError):
            self.store.add_note(self.case.id, "Dr. T", "   ")

    def test_delete_removes_children_and_files(self) -> None:
        doc = self.store.add_document(self.case.id, name="c.png", content_type="image/png", data=b"x", added_by="Dr. T")
        path = self.store.get_document(self.case.id, doc["id"])["path"]
        self.assertTrue(os.path.exists(path))
        self.assertTrue(self.store.delete(self.case.id, "Dr. T"))
        self.assertFalse(os.path.exists(path))
        self.assertIsNone(self.store.get(self.case.id))


class CaseEditRoutesTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.client = TestClient(api.app)
        from backend.store.users import UserStore

        cls._user_store_patch = patch.object(api, "user_store", UserStore(":memory:"))
        cls._user_store_patch.start()
        cls._limiter_patch = patch.object(api, "analyze_limiter", api.SlidingWindow(10_000))
        cls._limiter_patch.start()

    @classmethod
    def tearDownClass(cls) -> None:
        cls._user_store_patch.stop()
        cls._limiter_patch.stop()

    def test_routes_round_trip_with_actor_header(self) -> None:
        os.environ["MEDIGEM_DOCS_DIR"] = os.path.join(os.environ.get("TMPDIR", "/tmp"), "medigem-test-docs")
        with patch.object(api, "case_store", CaseStore(":memory:")):
            with patch("backend.pipeline.medical_pipeline.ai_manager.generate"):
                cid = self.client.post("/analyze", data={"age": 40, "gender": "Male", "symptoms": '["chest tightness","breathlessness"]'}, headers={"X-Actor": "Dr. T"}).json()["case_id"]
            h = {"X-Actor": "Dr. T"}
            self.assertEqual(self.client.patch(f"/cases/{cid}/patient", json={"patient_name": "Z", "age": 41}, headers=h).json()["patient"]["patient_name"], "Z")
            self.assertEqual(self.client.patch(f"/cases/{cid}/patient", json={"age": 500}, headers=h).status_code, 422)
            self.assertEqual(self.client.put(f"/cases/{cid}/plan", json={"next_step": "Recheck"}, headers=h).json()["plan"]["next_step"], "Recheck")
            self.assertEqual(self.client.post(f"/cases/{cid}/notes", json={"text": "ok"}, headers=h).status_code, 201)
            r = self.client.post(f"/cases/{cid}/documents", files={"file": ("a.png", b"\x89PNG", "image/png")}, headers=h)
            self.assertEqual(r.status_code, 201)
            did = r.json()["documents"][0]["id"]
            self.assertEqual(self.client.get(f"/cases/{cid}/documents/{did}").status_code, 200)
            self.assertEqual(self.client.post(f"/cases/{cid}/documents", files={"file": ("x.exe", b"MZ", "application/octet-stream")}, headers=h).status_code, 415)
            actions = [e["action"] for e in self.client.get(f"/cases/{cid}/events").json()]
            self.assertEqual(actions, ["created", "patient_updated", "plan_updated", "note_added", "document_added"])
            self.assertTrue(all(e["actor"] == "Dr. T" for e in self.client.get(f"/cases/{cid}/events").json()))
            self.assertEqual(self.client.post("/cases/NOPE/notes", json={"text": "x"}, headers=h).status_code, 404)
