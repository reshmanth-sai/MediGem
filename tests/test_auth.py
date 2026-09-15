"""Local accounts, sessions and role enforcement."""

import os
import unittest
import warnings
from unittest.mock import patch

warnings.filterwarnings("ignore", category=DeprecationWarning)
os.environ.setdefault("MEDIGEM_DB_PATH", ":memory:")
os.environ.setdefault("MEDIGEM_DOCS_DIR", "/tmp/medigem-auth-test-docs")

import importlib  # noqa: E402

from fastapi.testclient import TestClient  # noqa: E402

from backend.store.cases import CaseStore  # noqa: E402
from backend.store.users import UserStore  # noqa: E402

api = importlib.import_module("backend.api.app")


class UserStoreTests(unittest.TestCase):
    def setUp(self) -> None:
        self.store = UserStore(":memory:")

    def test_first_account_and_login(self) -> None:
        self.assertTrue(self.store.setup_required())
        u = self.store.create(username="Admin", name="Site Admin", role="admin", password="correct horse")
        self.assertFalse(self.store.setup_required())
        self.assertEqual(u.username, "admin", "usernames are lowercased")
        token = self.store.login("ADMIN", "correct horse")
        self.assertIsNotNone(token)
        me = self.store.resolve(token)
        self.assertEqual(me.name, "Site Admin")

    def test_wrong_password_and_unknown_user_both_fail_without_distinguishing(self) -> None:
        self.store.create(username="admin", name="A", role="admin", password="correct horse")
        self.assertIsNone(self.store.login("admin", "wrong password"))
        self.assertIsNone(self.store.login("nobody", "whatever1"))

    def test_role_ordering(self) -> None:
        u = self.store.create(username="asha", name="Asha", role="anm", password="asha-pass-1")
        self.assertTrue(u.at_least("anm"))
        self.assertFalse(u.at_least("cho"))
        self.assertFalse(u.at_least("admin"))

    def test_duplicate_username_rejected(self) -> None:
        self.store.create(username="admin", name="A", role="admin", password="correct horse")
        with self.assertRaises(ValueError):
            self.store.create(username="ADMIN", name="B", role="anm", password="another-pass")

    def test_short_password_and_username_rejected(self) -> None:
        with self.assertRaises(ValueError):
            self.store.create(username="admin", name="A", role="admin", password="short")
        with self.assertRaises(ValueError):
            self.store.create(username="ab", name="A", role="admin", password="correct horse")

    def test_deactivated_user_cannot_log_in_or_keep_a_session(self) -> None:
        u = self.store.create(username="asha", name="Asha", role="anm", password="asha-pass-1")
        token = self.store.login("asha", "asha-pass-1")
        self.store.set_active(u.id, False)
        self.assertIsNone(self.store.resolve(token))
        self.assertIsNone(self.store.login("asha", "asha-pass-1"))

    def test_password_reset_invalidates_existing_sessions(self) -> None:
        self.store.create(username="asha", name="Asha", role="anm", password="asha-pass-1")
        token = self.store.login("asha", "asha-pass-1")
        self.store.set_password(self.store.resolve(token).id, "new-password-1")
        self.assertIsNone(self.store.resolve(token))
        self.assertIsNotNone(self.store.login("asha", "new-password-1"))

    def test_logout_ends_the_session(self) -> None:
        self.store.create(username="asha", name="Asha", role="anm", password="asha-pass-1")
        token = self.store.login("asha", "asha-pass-1")
        self.store.logout(token)
        self.assertIsNone(self.store.resolve(token))


class AuthRouteTests(unittest.TestCase):
    def setUp(self) -> None:
        self.users = UserStore(":memory:")
        self.cases = CaseStore(":memory:")
        self.patches = [
            patch.object(api, "user_store", self.users),
            patch.object(api, "case_store", self.cases),
            patch.object(api, "analyze_limiter", api.SlidingWindow(10_000)),
        ]
        for p in self.patches:
            p.start()
        self.client = TestClient(api.app)

    def tearDown(self) -> None:
        for p in self.patches:
            p.stop()

    def test_everything_open_before_setup_then_locked_down_after(self) -> None:
        # No account exists yet: the whole API is open, or nobody could ever
        # sign in. This is the only window where that is true.
        self.assertTrue(self.client.get("/auth/me").json()["setup_required"])
        with patch("backend.pipeline.medical_pipeline.ai_manager.generate"):
            r = self.client.post("/analyze", data={"age": 40, "gender": "Male", "symptoms": '["chest tightness","breathlessness"]'}, headers={"X-Actor": "Setup Person"})
        self.assertEqual(r.status_code, 200)
        self.assertEqual(self.client.get("/cases").status_code, 200)

        # The moment an account exists, the open window closes for good.
        self.client.post("/auth/setup", json={"username": "admin", "name": "Site Admin", "role": "admin", "password": "correct horse"})
        self.client.post("/auth/logout")
        self.assertEqual(self.client.get("/cases").status_code, 401, "reads need a session once an account exists")
        with patch("backend.pipeline.medical_pipeline.ai_manager.generate"):
            r = self.client.post("/analyze", data={"age": 40, "gender": "Male", "symptoms": '["chest tightness","breathlessness"]'})
        self.assertEqual(r.status_code, 401, "analyze needs a session once an account exists")

    def test_setup_creates_an_admin_and_signs_in(self) -> None:
        r = self.client.post("/auth/setup", json={"username": "admin", "name": "Site Admin", "role": "anm", "password": "correct horse"})
        self.assertEqual(r.status_code, 201)
        self.assertEqual(r.json()["role"], "admin", "the first account is always admin regardless of the requested role")
        self.assertIn("medigem_session", r.cookies)
        self.assertEqual(self.client.get("/auth/me").json()["user"]["username"], "admin")
        self.assertEqual(self.client.post("/auth/setup", json={"username": "second", "name": "Second", "role": "admin", "password": "whatever123"}).status_code, 409)

    def test_role_gates_review_and_delete(self) -> None:
        self.client.post("/auth/setup", json={"username": "admin", "name": "Admin", "role": "admin", "password": "correct horse"})
        self.client.post("/users", json={"username": "asha", "name": "Asha Devi", "role": "anm", "password": "asha-pass-1"})
        with patch("backend.pipeline.medical_pipeline.ai_manager.generate"):
            cid = self.client.post("/analyze", data={"age": 40, "gender": "Male", "symptoms": '["chest tightness","breathlessness"]'}).json()["case_id"]
        self.client.post("/auth/logout")
        self.client.post("/auth/login", json={"username": "asha", "password": "asha-pass-1"})
        self.assertEqual(self.client.post(f"/cases/{cid}/notes", json={"text": "seen"}).status_code, 201, "anm can note")
        self.assertEqual(self.client.post(f"/cases/{cid}/review", json={"decision": "approved"}).status_code, 403, "anm cannot review")
        self.assertEqual(self.client.delete(f"/cases/{cid}").status_code, 403, "anm cannot delete")
        self.client.post("/auth/logout")
        self.client.post("/auth/login", json={"username": "admin", "password": "correct horse"})
        r = self.client.post(f"/cases/{cid}/review", json={"decision": "approved"})
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.json()["reviewer"], "Admin", "the reviewer is the session user, not request input")
        self.assertEqual(self.client.delete(f"/cases/{cid}").status_code, 204)

    def test_events_record_the_real_actor_not_a_header(self) -> None:
        self.client.post("/auth/setup", json={"username": "admin", "name": "Site Admin", "role": "admin", "password": "correct horse"})
        with patch("backend.pipeline.medical_pipeline.ai_manager.generate"):
            cid = self.client.post(
                "/analyze",
                data={"age": 40, "gender": "Male", "symptoms": '["chest tightness","breathlessness"]'},
                headers={"X-Actor": "Someone Else"},
            ).json()["case_id"]
        events = self.client.get(f"/cases/{cid}/events").json()
        self.assertEqual(events[0]["actor"], "Site Admin", "the signed-in session wins over any X-Actor header")

    def test_only_admin_can_manage_users(self) -> None:
        self.client.post("/auth/setup", json={"username": "admin", "name": "Admin", "role": "admin", "password": "correct horse"})
        self.client.post("/users", json={"username": "asha", "name": "Asha Devi", "role": "anm", "password": "asha-pass-1"})
        self.client.post("/auth/logout")
        self.client.post("/auth/login", json={"username": "asha", "password": "asha-pass-1"})
        self.assertEqual(self.client.get("/users").status_code, 403)
        self.assertEqual(self.client.post("/users", json={"username": "x", "name": "x", "role": "anm", "password": "whatever1"}).status_code, 403)

    def test_admin_cannot_deactivate_self(self) -> None:
        self.client.post("/auth/setup", json={"username": "admin", "name": "Admin", "role": "admin", "password": "correct horse"})
        me_id = self.client.get("/auth/me").json()["user"]["id"]
        self.assertEqual(self.client.post(f"/users/{me_id}/deactivate").status_code, 409)

    def test_logout_then_protected_routes_401(self) -> None:
        self.client.post("/auth/setup", json={"username": "admin", "name": "Admin", "role": "admin", "password": "correct horse"})
        self.client.post("/auth/logout")
        self.assertEqual(self.client.get("/cases").status_code, 401)
        self.assertIsNone(self.client.get("/auth/me").json()["user"])


if __name__ == "__main__":
    unittest.main()
