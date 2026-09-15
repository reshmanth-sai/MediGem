"""SQLite case store.

One table, one file, the standard library. A case is the intake that was
submitted, the AnalysisResponse the pipeline returned, and the clinician's
review of it. Everything the workstation lists comes from here once the API
is running; nothing else is persisted anywhere.

    MEDIGEM_DB_PATH   file to use (default <repo>/data/medigem.db)
    :memory:          in-process, for tests
"""

from __future__ import annotations

import json
import os
import sqlite3
import threading
import uuid
from dataclasses import dataclass, asdict, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

from backend.config.settings import settings

SCHEMA = """
CREATE TABLE IF NOT EXISTS cases (
    id             TEXT PRIMARY KEY,
    created_at     TEXT NOT NULL,
    updated_at     TEXT NOT NULL,
    patient        TEXT NOT NULL,   -- JSON: demographics, symptoms, vitals, notes, documents
    response       TEXT NOT NULL,   -- JSON: AnalysisResponse
    status         TEXT NOT NULL,   -- COMPLETED | DEGRADED | EMERGENCY_INTERCEPTED | FAILED
    risk_level     TEXT,            -- EMERGENCY | HIGH | MODERATE | LOW | NULL
    needs_referral INTEGER NOT NULL DEFAULT 0,
    requires_review INTEGER NOT NULL DEFAULT 1,
    reviewed_at    TEXT,
    reviewer       TEXT,
    review_note    TEXT,
    review_decision TEXT,           -- approved | modified | rejected | NULL
    plan           TEXT             -- JSON care plan, or NULL
);
CREATE INDEX IF NOT EXISTS cases_created ON cases (created_at DESC);
CREATE INDEX IF NOT EXISTS cases_risk ON cases (risk_level);

CREATE TABLE IF NOT EXISTS notes (
    id         TEXT PRIMARY KEY,
    case_id    TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    author     TEXT NOT NULL,
    text       TEXT NOT NULL,
    created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS notes_case ON notes (case_id, created_at);

CREATE TABLE IF NOT EXISTS documents (
    id           TEXT PRIMARY KEY,
    case_id      TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    name         TEXT NOT NULL,
    content_type TEXT NOT NULL,
    size_bytes   INTEGER NOT NULL,
    path         TEXT NOT NULL,
    added_by     TEXT NOT NULL,
    created_at   TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS documents_case ON documents (case_id, created_at);

-- Append-only. Every mutation on a case writes one row; the History tab reads it.
CREATE TABLE IF NOT EXISTS events (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id    TEXT NOT NULL,
    actor      TEXT NOT NULL,
    action     TEXT NOT NULL,
    payload    TEXT,
    created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS events_case ON events (case_id, id);
"""

# Columns added after the first release. Applied one by one; an existing
# column raises and is skipped.
MIGRATIONS = [
    "ALTER TABLE cases ADD COLUMN plan TEXT",
]


def _now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


@dataclass
class CaseRecord:
    id: str
    created_at: str
    updated_at: str
    patient: Dict[str, Any]
    response: Dict[str, Any]
    status: str
    risk_level: Optional[str]
    needs_referral: bool
    requires_review: bool
    reviewed_at: Optional[str] = None
    reviewer: Optional[str] = None
    review_note: Optional[str] = None
    review_decision: Optional[str] = None
    plan: Optional[Dict[str, Any]] = None
    notes: List[Dict[str, Any]] = field(default_factory=list)
    documents: List[Dict[str, Any]] = field(default_factory=list)
    events: List[Dict[str, Any]] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_row(cls, row: sqlite3.Row) -> "CaseRecord":
        return cls(
            id=row["id"],
            created_at=row["created_at"],
            updated_at=row["updated_at"],
            patient=json.loads(row["patient"]),
            response=json.loads(row["response"]),
            status=row["status"],
            risk_level=row["risk_level"],
            needs_referral=bool(row["needs_referral"]),
            requires_review=bool(row["requires_review"]),
            reviewed_at=row["reviewed_at"],
            reviewer=row["reviewer"],
            review_note=row["review_note"],
            review_decision=row["review_decision"],
            plan=json.loads(row["plan"]) if row["plan"] else None,
        )


class CaseStore:
    def __init__(self, path: Optional[str] = None) -> None:
        self.path = path or os.getenv("MEDIGEM_DB_PATH") or str(settings.BASE_DIR / "data" / "medigem.db")
        base = Path(self.path).parent if self.path != ":memory:" else Path(os.getenv("MEDIGEM_DOCS_DIR") or (settings.BASE_DIR / "data"))
        if self.path != ":memory:":
            base.mkdir(parents=True, exist_ok=True)
        # Files added to a case by a clinician. Intake uploads are still
        # transient; these are the ones deliberately attached afterwards.
        self.documents_dir = Path(os.getenv("MEDIGEM_DOCS_DIR") or (base / "documents"))
        # One connection, one lock: the API is a single process and SQLite
        # serialises writes anyway. check_same_thread is off because FastAPI
        # runs sync handlers in a thread pool.
        self._conn = sqlite3.connect(self.path, check_same_thread=False)
        self._conn.row_factory = sqlite3.Row
        self._lock = threading.Lock()
        with self._lock:
            self._conn.execute("PRAGMA foreign_keys = ON")
            self._conn.executescript(SCHEMA)
            for stmt in MIGRATIONS:
                try:
                    self._conn.execute(stmt)
                except sqlite3.OperationalError:
                    pass  # already applied
            self._conn.commit()

    # ---- writes -----------------------------------------------------------

    def _event(self, case_id: str, actor: str, action: str, payload: Optional[Dict[str, Any]], now: Optional[str] = None) -> None:
        """Caller holds the lock and commits."""
        self._conn.execute(
            "INSERT INTO events (case_id, actor, action, payload, created_at) VALUES (?, ?, ?, ?, ?)",
            (case_id, actor, action, json.dumps(payload) if payload is not None else None, now or _now()),
        )

    def _touch(self, case_id: str, now: str) -> None:
        self._conn.execute("UPDATE cases SET updated_at = ? WHERE id = ?", (now, case_id))

    def create(self, patient: Dict[str, Any], response: Dict[str, Any], actor: Optional[str] = None) -> CaseRecord:
        now = _now()
        risk = (response.get("risk_assessment") or {}).get("risk_level")
        reasoning = response.get("reasoning") or {}
        recs = reasoning.get("recommendations") or {}
        intercepted = response.get("status") == "EMERGENCY_INTERCEPTED"
        needs_referral = intercepted or bool(recs.get("needs_referral")) or response.get("referral_summary") is not None
        requires_review = bool(recs.get("requires_human_review", True))
        rec = CaseRecord(
            id=f"CASE-{uuid.uuid4().hex[:8].upper()}",
            created_at=now,
            updated_at=now,
            patient=patient,
            response=response,
            status=str(response.get("status", "COMPLETED")),
            risk_level=risk,
            needs_referral=needs_referral,
            requires_review=requires_review,
        )
        with self._lock:
            self._conn.execute(
                "INSERT INTO cases (id, created_at, updated_at, patient, response, status, risk_level, needs_referral, requires_review)"
                " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (rec.id, now, now, json.dumps(patient), json.dumps(response), rec.status, risk, int(needs_referral), int(requires_review)),
            )
            self._event(rec.id, actor or "system", "created", {"status": rec.status, "risk_level": risk}, now)
            self._conn.commit()
        return self.get(rec.id) or rec

    def review(self, case_id: str, decision: str, reviewer: str, note: Optional[str] = None) -> Optional[CaseRecord]:
        if decision not in ("approved", "modified", "rejected"):
            raise ValueError("decision must be approved, modified or rejected")
        now = _now()
        with self._lock:
            cur = self._conn.execute(
                "UPDATE cases SET reviewed_at = ?, reviewer = ?, review_note = ?, review_decision = ?, requires_review = 0, updated_at = ? WHERE id = ?",
                (now, reviewer, note, decision, now, case_id),
            )
            if cur.rowcount == 0:
                return None
            self._event(case_id, reviewer, "reviewed", {"decision": decision, "note": note}, now)
            self._conn.commit()
        return self.get(case_id)

    # ---- the clinician's own edits ---------------------------------------

    PATIENT_FIELDS = ("patient_id", "patient_name", "age", "gender", "location", "chief_complaint")

    def update_patient(self, case_id: str, patch: Dict[str, Any], actor: str) -> Optional[CaseRecord]:
        """Demographics only. Symptoms, vitals and the response are what was assessed and stay as recorded."""
        clean = {k: v for k, v in patch.items() if k in self.PATIENT_FIELDS}
        now = _now()
        with self._lock:
            row = self._conn.execute("SELECT patient FROM cases WHERE id = ?", (case_id,)).fetchone()
            if row is None:
                return None
            patient = json.loads(row["patient"])
            changed = {k: v for k, v in clean.items() if patient.get(k) != v}
            patient.update(clean)
            self._conn.execute("UPDATE cases SET patient = ?, updated_at = ? WHERE id = ?", (json.dumps(patient), now, case_id))
            if changed:
                self._event(case_id, actor, "patient_updated", {"fields": changed}, now)
            self._conn.commit()
        return self.get(case_id)

    def set_plan(self, case_id: str, plan: Dict[str, Any], actor: str) -> Optional[CaseRecord]:
        now = _now()
        stored = {**plan, "updated_by": actor, "updated_at": now}
        with self._lock:
            cur = self._conn.execute("UPDATE cases SET plan = ?, updated_at = ? WHERE id = ?", (json.dumps(stored), now, case_id))
            if cur.rowcount == 0:
                return None
            self._event(case_id, actor, "plan_updated", plan, now)
            self._conn.commit()
        return self.get(case_id)

    def add_note(self, case_id: str, author: str, text: str) -> Optional[CaseRecord]:
        text = text.strip()
        if not text:
            raise ValueError("note text is required")
        now = _now()
        with self._lock:
            if self._conn.execute("SELECT 1 FROM cases WHERE id = ?", (case_id,)).fetchone() is None:
                return None
            note_id = f"NOTE-{uuid.uuid4().hex[:8].upper()}"
            self._conn.execute("INSERT INTO notes (id, case_id, author, text, created_at) VALUES (?, ?, ?, ?, ?)", (note_id, case_id, author, text, now))
            self._touch(case_id, now)
            self._event(case_id, author, "note_added", {"note_id": note_id, "text": text}, now)
            self._conn.commit()
        return self.get(case_id)

    def add_document(self, case_id: str, *, name: str, content_type: str, data: bytes, added_by: str) -> Optional[Dict[str, Any]]:
        """Stores the bytes under the store's documents directory and records them."""
        now = _now()
        with self._lock:
            if self._conn.execute("SELECT 1 FROM cases WHERE id = ?", (case_id,)).fetchone() is None:
                return None
            doc_id = f"DOC-{uuid.uuid4().hex[:8].upper()}"
            suffix = Path(name).suffix.lower()[:8]
            target = self.documents_dir / case_id / f"{doc_id}{suffix}"
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(data)
            self._conn.execute(
                "INSERT INTO documents (id, case_id, name, content_type, size_bytes, path, added_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                (doc_id, case_id, name, content_type, len(data), str(target), added_by, now),
            )
            self._touch(case_id, now)
            self._event(case_id, added_by, "document_added", {"document_id": doc_id, "name": name, "size_bytes": len(data)}, now)
            self._conn.commit()
        return self.get_document(case_id, doc_id)

    def get_document(self, case_id: str, doc_id: str) -> Optional[Dict[str, Any]]:
        with self._lock:
            row = self._conn.execute("SELECT * FROM documents WHERE id = ? AND case_id = ?", (doc_id, case_id)).fetchone()
        return dict(row) if row else None

    def delete(self, case_id: str, actor: str = "system") -> bool:
        with self._lock:
            docs = self._conn.execute("SELECT path FROM documents WHERE case_id = ?", (case_id,)).fetchall()
            cur = self._conn.execute("DELETE FROM cases WHERE id = ?", (case_id,))
            if cur.rowcount == 0:
                return False
            self._event(case_id, actor, "deleted", None)
            self._conn.commit()
        for d in docs:
            try:
                Path(d["path"]).unlink()
            except OSError:
                pass
        return True

    # ---- reads ------------------------------------------------------------

    def get(self, case_id: str) -> Optional[CaseRecord]:
        with self._lock:
            row = self._conn.execute("SELECT * FROM cases WHERE id = ?", (case_id,)).fetchone()
            if row is None:
                return None
            rec = CaseRecord.from_row(row)
            rec.notes = [dict(r) for r in self._conn.execute("SELECT id, author, text, created_at FROM notes WHERE case_id = ? ORDER BY created_at", (case_id,)).fetchall()]
            rec.documents = [
                dict(r) for r in self._conn.execute("SELECT id, name, content_type, size_bytes, added_by, created_at FROM documents WHERE case_id = ? ORDER BY created_at", (case_id,)).fetchall()
            ]
            rec.events = [
                {**dict(r), "payload": json.loads(r["payload"]) if r["payload"] else None}
                for r in self._conn.execute("SELECT id, actor, action, payload, created_at FROM events WHERE case_id = ? ORDER BY id", (case_id,)).fetchall()
            ]
        return rec

    def events_for(self, case_id: str) -> List[Dict[str, Any]]:
        return self.get(case_id).events if self.get(case_id) else []

    def list(self, *, risk_level: Optional[str] = None, needs_referral: Optional[bool] = None, limit: int = 200) -> List[CaseRecord]:
        clauses: List[str] = []
        args: List[Any] = []
        if risk_level:
            clauses.append("risk_level = ?")
            args.append(risk_level)
        if needs_referral is not None:
            clauses.append("needs_referral = ?")
            args.append(int(needs_referral))
        where = f"WHERE {' AND '.join(clauses)}" if clauses else ""
        with self._lock:
            rows = self._conn.execute(f"SELECT * FROM cases {where} ORDER BY created_at DESC LIMIT ?", (*args, limit)).fetchall()
        return [CaseRecord.from_row(r) for r in rows]

    def count(self) -> int:
        with self._lock:
            return int(self._conn.execute("SELECT COUNT(*) FROM cases").fetchone()[0])


case_store = CaseStore()
