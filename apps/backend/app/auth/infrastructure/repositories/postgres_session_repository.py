from dataclasses import dataclass
from datetime import datetime

import psycopg
from psycopg.rows import class_row

from app.auth.domain.entities import AuthSession


@dataclass(slots=True, frozen=True)
class AuthSessionRow:
    id: str
    user_id: str
    created_at: datetime
    expires_at: datetime
    revoked_at: datetime | None


class PostgresSessionRepository:
    def __init__(self, database_url: str) -> None:
        self.database_url = database_url

    def find_by_id(self, session_id: str) -> AuthSession | None:
        with psycopg.connect(self.database_url) as connection:
            with connection.cursor(row_factory=class_row(AuthSessionRow)) as cursor:
                cursor.execute(
                    """
                    SELECT id, user_id, created_at, expires_at, revoked_at
                    FROM auth_sessions
                    WHERE id = %s
                    """,
                    (session_id,),
                )
                row = cursor.fetchone()

        return None if row is None else self._row_to_session(row)

    def save(self, session: AuthSession) -> AuthSession:
        with psycopg.connect(self.database_url) as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    INSERT INTO auth_sessions (
                        id,
                        user_id,
                        created_at,
                        expires_at,
                        revoked_at
                    )
                    VALUES (%s, %s, %s, %s, %s)
                    """,
                    (
                        session.id,
                        session.user_id,
                        session.created_at,
                        session.expires_at,
                        session.revoked_at,
                    ),
                )

        return session

    def revoke(
        self,
        session_id: str,
        revoked_at: datetime,
    ) -> AuthSession | None:
        with psycopg.connect(self.database_url) as connection:
            with connection.cursor(row_factory=class_row(AuthSessionRow)) as cursor:
                cursor.execute(
                    """
                    UPDATE auth_sessions
                    SET revoked_at = %s
                    WHERE id = %s
                    RETURNING id, user_id, created_at, expires_at, revoked_at
                    """,
                    (revoked_at, session_id),
                )
                row = cursor.fetchone()

        return None if row is None else self._row_to_session(row)

    def _row_to_session(self, row: AuthSessionRow) -> AuthSession:
        session_id = row.id
        user_id = row.user_id
        created_at = row.created_at
        expires_at = row.expires_at
        revoked_at = row.revoked_at

        if not isinstance(session_id, str):
            raise TypeError("database returned invalid session id")
        if not isinstance(user_id, str):
            raise TypeError("database returned invalid user_id")
        if not isinstance(created_at, datetime):
            raise TypeError("database returned invalid created_at")
        if not isinstance(expires_at, datetime):
            raise TypeError("database returned invalid expires_at")
        if revoked_at is not None and not isinstance(revoked_at, datetime):
            raise TypeError("database returned invalid revoked_at")

        return AuthSession(
            id=session_id,
            user_id=user_id,
            created_at=created_at,
            expires_at=expires_at,
            revoked_at=revoked_at,
        )
