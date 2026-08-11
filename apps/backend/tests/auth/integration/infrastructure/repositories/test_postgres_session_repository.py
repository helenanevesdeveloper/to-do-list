import os
from collections.abc import Iterator
from datetime import UTC, datetime
from uuid import uuid4

import psycopg
import pytest

from app.auth.domain.entities.auth_session import AuthSession
from app.environment import load_environment
from app.auth.infrastructure.repositories.postgres_session_repository import (
    PostgresSessionRepository,
)


@pytest.fixture
def database_url() -> str:
    load_environment()
    value = os.getenv("DATABASE_URL")
    if not value:
        pytest.skip("DATABASE_URL is not configured")
    try:
        with psycopg.connect(value):
            pass
    except psycopg.OperationalError as exc:
        pytest.skip(f"database is not reachable: {exc}")
    return value


@pytest.fixture
def repository(database_url: str) -> PostgresSessionRepository:
    return PostgresSessionRepository(database_url=database_url)


@pytest.fixture
def created_session_ids(database_url: str) -> Iterator[list[str]]:
    session_ids: list[str] = []
    yield session_ids

    if not session_ids:
        return

    with psycopg.connect(database_url) as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                "DELETE FROM auth_sessions WHERE id = ANY(%s)",
                (session_ids,),
            )


@pytest.fixture
def created_user_ids(database_url: str) -> Iterator[list[str]]:
    user_ids: list[str] = []
    yield user_ids

    if not user_ids:
        return

    with psycopg.connect(database_url) as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                "DELETE FROM users WHERE id = ANY(%s)",
                (user_ids,),
            )


def test_save_and_revoke_persist_session_state(
    repository: PostgresSessionRepository,
    database_url: str,
    created_session_ids: list[str],
    created_user_ids: list[str],
) -> None:
    user_id = f"user-{uuid4()}"
    session = AuthSession(
        id=f"session-{uuid4()}",
        user_id=user_id,
        created_at=datetime(2026, 3, 30, 10, 0, tzinfo=UTC),
        expires_at=datetime(2026, 3, 30, 10, 15, tzinfo=UTC),
    )
    created_session_ids.append(session.id)
    created_user_ids.append(user_id)

    with psycopg.connect(database_url) as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO users (id, email, password_hash, is_active, created_at)
                VALUES (%s, %s, %s, %s, %s)
                """,
                (
                    user_id,
                    f"{uuid4().hex}@example.com",
                    "hashed-password",
                    True,
                    datetime(2026, 3, 30, 9, 55, tzinfo=UTC),
                ),
            )

    saved_session = repository.save(session)
    revoked_session = repository.revoke(
        session_id=session.id,
        revoked_at=datetime(2026, 3, 30, 10, 5, tzinfo=UTC),
    )
    found_session = repository.find_by_id(session.id)

    assert saved_session.id == session.id
    assert revoked_session is not None
    assert revoked_session.revoked_at == datetime(
        2026, 3, 30, 10, 5, tzinfo=UTC
    )
    assert found_session is not None
    assert found_session.revoked_at == datetime(
        2026, 3, 30, 10, 5, tzinfo=UTC
    )


def test_revoke_updates_existing_session(
    repository: PostgresSessionRepository,
    database_url: str,
    created_session_ids: list[str],
    created_user_ids: list[str],
) -> None:
    user_id = f"user-{uuid4()}"
    session_id = f"session-{uuid4()}"
    created_session_ids.append(session_id)
    created_user_ids.append(user_id)

    with psycopg.connect(database_url) as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO users (id, email, password_hash, is_active, created_at)
                VALUES (%s, %s, %s, %s, %s)
                """,
                (
                    user_id,
                    f"{uuid4().hex}@example.com",
                    "hashed-password",
                    True,
                    datetime(2026, 3, 30, 9, 55, tzinfo=UTC),
                ),
            )
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
                    session_id,
                    user_id,
                    datetime(2026, 3, 30, 10, 0, tzinfo=UTC),
                    datetime(2026, 3, 30, 10, 15, tzinfo=UTC),
                    None,
                ),
            )
    revoked_session = repository.revoke(
        session_id=session_id,
        revoked_at=datetime(2026, 3, 30, 10, 5, tzinfo=UTC),
    )

    found_session = repository.find_by_id(session_id)

    assert revoked_session is not None
    assert revoked_session.id == session_id
    assert revoked_session.revoked_at == datetime(
        2026, 3, 30, 10, 5, tzinfo=UTC
    )
    assert found_session is not None
    assert found_session.revoked_at == datetime(
        2026, 3, 30, 10, 5, tzinfo=UTC
    )


def test_revoke_returns_none_when_session_does_not_exist(
    repository: PostgresSessionRepository,
) -> None:
    result = repository.revoke(
        session_id=f"missing-{uuid4()}",
        revoked_at=datetime(2026, 3, 30, 10, 5, tzinfo=UTC),
    )

    assert result is None
