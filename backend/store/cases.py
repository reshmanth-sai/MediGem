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
from dataclasses import dataclass, asdict
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
    review_decision TEXT            -- approved | modified | rejected | NULL
);
CREATE INDEX IF NOT EXISTS cases_created ON cases (created_at DESC);
CREATE INDEX IF NOT EXISTS cases_risk ON cases (risk_level);
"""


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
        )


class CaseStore:
    def __init__(self, path: Optional[str] = None) -> None:
        self.path = path or os.getenv("MEDIGEM_DB_PATH") or str(settings.BASE_DIR / "data" / "medigem.db")
        if self.path != ":memory:":
            Path(self.path).parent.mkdir(parents=True, exist_ok=True)
        # One connection, one lock: the API is a single process and SQLite
        # serialises writes anyway. check_same_thread is off because FastAPI
        # runs sync handlers in a thread pool.
        self._conn = sqlite3.connect(self.path, check_same_thread=False)
        self._conn.row_factory = sqlite3.Row
        self._lock = threading.Lock()
        with self._lock:
            self._conn.executescript(SCHEMA)

    # ---- writes -----------------------------------------------------------

    def create(self, patient: Dict[str, Any], response: Dict[str, Any]) -> CaseRecord:
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
            self._conn.commit()
        return rec

    def review(self, case_id: str, decision: str, reviewer: str, note: Optional[str] = None) -> Optional[CaseRecord]:
        if decision not in ("approved", "modified", "rejected"):
            raise ValueError("decision must be approved, modified or rejected")
        now = _now()
        with self._lock:
            cur = self._conn.execute(
                "UPDATE cases SET reviewed_at = ?, reviewer = ?, review_note = ?, review_decision = ?, requires_review = 0, updated_at = ? WHERE id = ?",
                (now, reviewer, note, decision, now, case_id),
            )
            self._conn.commit()
            if cur.rowcount == 0:
                return None
        return self.get(case_id)

    def delete(self, case_id: str) -> bool:
        with self._lock:
            cur = self._conn.execute("DELETE FROM cases WHERE id = ?", (case_id,))
            self._conn.commit()
            return cur.rowcount > 0

    # ---- reads ------------------------------------------------------------

    def get(self, case_id: str) -> Optional[CaseRecord]:
        with self._lock:
            row = self._conn.execute("SELECT * FROM cases WHERE id = ?", (case_id,)).fetchone()
        return CaseRecord.from_row(row) if row else None

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
