"""Local accounts and sessions.

Same SQLite file as the cases, standard library only: scrypt for passwords,
random tokens for sessions, the token's SHA-256 stored rather than the token.
There is no external identity provider on purpose; a sub-centre laptop has to
work with no uplink.

Roles, least to most:
    anm    intake, notes, documents, care plan
    cho    + review (sign-off)
    mo     + delete
    admin  + manage users
"""

from __future__ import annotations

import hashlib
import hmac
import os
import secrets
import sqlite3
import threading
import uuid
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

from backend.config.settings import settings

ROLES = ("anm", "cho", "mo", "admin")
RANK = {r: i for i, r in enumerate(ROLES)}
SESSION_HOURS = 12

SCHEMA = """
CREATE TABLE IF NOT EXISTS users (
    id            TEXT PRIMARY KEY,
    username      TEXT NOT NULL UNIQUE COLLATE NOCASE,
    name          TEXT NOT NULL,
    role          TEXT NOT NULL,
    password_salt BLOB NOT NULL,
    password_hash BLOB NOT NULL,
    active        INTEGER NOT NULL DEFAULT 1,
    created_at    TEXT NOT NULL,
    last_login_at TEXT
);
CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_user ON sessions (user_id);
"""


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _iso(dt: datetime) -> str:
    return dt.isoformat(timespec="seconds")


def _hash(password: str, salt: bytes) -> bytes:
    return hashlib.scrypt(password.encode("utf-8"), salt=salt, n=2**14, r=8, p=1, dklen=32)


@dataclass
class User:
    id: str
    username: str
    name: str
    role: str
    active: bool
    created_at: str
    last_login_at: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    def at_least(self, role: str) -> bool:
        return RANK[self.role] >= RANK[role]

    @classmethod
    def from_row(cls, row: sqlite3.Row) -> "User":
        return cls(
            id=row["id"], username=row["username"], name=row["name"], role=row["role"],
            active=bool(row["active"]), created_at=row["created_at"], last_login_at=row["last_login_at"],
        )


class UserStore:
    def __init__(self, path: Optional[str] = None) -> None:
        self.path = path or os.getenv("MEDIGEM_DB_PATH") or str(settings.BASE_DIR / "data" / "medigem.db")
        if self.path != ":memory:":
            Path(self.path).parent.mkdir(parents=True, exist_ok=True)
        self._conn = sqlite3.connect(self.path, check_same_thread=False)
        self._conn.row_factory = sqlite3.Row
        self._lock = threading.Lock()
        with self._lock:
            self._conn.execute("PRAGMA foreign_keys = ON")
            self._conn.executescript(SCHEMA)
            self._conn.commit()

    # ---- users ------------------------------------------------------------

    def count(self) -> int:
        with self._lock:
            return int(self._conn.execute("SELECT COUNT(*) FROM users").fetchone()[0])

    def setup_required(self) -> bool:
        return self.count() == 0

    def create(self, *, username: str, name: str, role: str, password: str) -> User:
        username = username.strip().lower()
        name = name.strip()
        if role not in ROLES:
            raise ValueError(f"role must be one of {ROLES}")
        if len(username) < 3 or not username.replace(".", "").replace("_", "").isalnum():
            raise ValueError("username must be at least 3 characters: letters, digits, dot or underscore")
        if len(password) < 8:
            raise ValueError("password must be at least 8 characters")
        if not name:
            raise ValueError("name is required")
        salt = secrets.token_bytes(16)
        uid = f"USR-{uuid.uuid4().hex[:8].upper()}"
        with self._lock:
            try:
                self._conn.execute(
                    "INSERT INTO users (id, username, name, role, password_salt, password_hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    (uid, username, name, role, salt, _hash(password, salt), _iso(_now())),
                )
            except sqlite3.IntegrityError as e:
                raise ValueError("username is already taken") from e
            self._conn.commit()
        return self.get(uid)  # type: ignore[return-value]

    def get(self, user_id: str) -> Optional[User]:
        with self._lock:
            row = self._conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        return User.from_row(row) if row else None

    def list(self) -> List[User]:
        with self._lock:
            rows = self._conn.execute("SELECT * FROM users ORDER BY created_at").fetchall()
        return [User.from_row(r) for r in rows]

    def set_active(self, user_id: str, active: bool) -> Optional[User]:
        with self._lock:
            cur = self._conn.execute("UPDATE users SET active = ? WHERE id = ?", (int(active), user_id))
            if not active:
                self._conn.execute("DELETE FROM sessions WHERE user_id = ?", (user_id,))
            self._conn.commit()
            if cur.rowcount == 0:
                return None
        return self.get(user_id)

    def set_password(self, user_id: str, password: str) -> bool:
        if len(password) < 8:
            raise ValueError("password must be at least 8 characters")
        salt = secrets.token_bytes(16)
        with self._lock:
            cur = self._conn.execute("UPDATE users SET password_salt = ?, password_hash = ? WHERE id = ?", (salt, _hash(password, salt), user_id))
            self._conn.execute("DELETE FROM sessions WHERE user_id = ?", (user_id,))
            self._conn.commit()
            return cur.rowcount > 0

    # ---- sessions ---------------------------------------------------------

    def login(self, username: str, password: str) -> Optional[str]:
        """Returns a session token, or None. Constant-time compare; a missing user still costs a hash."""
        with self._lock:
            row = self._conn.execute("SELECT * FROM users WHERE username = ?", (username.strip().lower(),)).fetchone()
        salt = row["password_salt"] if row else secrets.token_bytes(16)
        expected = row["password_hash"] if row else _hash("", salt)
        ok = hmac.compare_digest(_hash(password, salt), expected) and row is not None and bool(row["active"])
        if not ok:
            return None
        token = secrets.token_urlsafe(32)
        now = _now()
        with self._lock:
            self._conn.execute(
                "INSERT INTO sessions (token_hash, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)",
                (self._th(token), row["id"], _iso(now), _iso(now + timedelta(hours=SESSION_HOURS))),
            )
            self._conn.execute("UPDATE users SET last_login_at = ? WHERE id = ?", (_iso(now), row["id"]))
            self._conn.execute("DELETE FROM sessions WHERE expires_at < ?", (_iso(now),))
            self._conn.commit()
        return token

    def resolve(self, token: Optional[str]) -> Optional[User]:
        """The user for a token, extending the session on use."""
        if not token:
            return None
        now = _now()
        with self._lock:
            row = self._conn.execute(
                "SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at >= ? AND u.active = 1",
                (self._th(token), _iso(now)),
            ).fetchone()
            if row is None:
                return None
            self._conn.execute("UPDATE sessions SET expires_at = ? WHERE token_hash = ?", (_iso(now + timedelta(hours=SESSION_HOURS)), self._th(token)))
            self._conn.commit()
        return User.from_row(row)

    def logout(self, token: Optional[str]) -> None:
        if not token:
            return
        with self._lock:
            self._conn.execute("DELETE FROM sessions WHERE token_hash = ?", (self._th(token),))
            self._conn.commit()

    @staticmethod
    def _th(token: str) -> str:
        return hashlib.sha256(token.encode("utf-8")).hexdigest()


user_store = UserStore()
