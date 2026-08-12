"""Integration tests for the Postgres user repository."""

import os
from collections.abc import Iterator
from datetime import UTC, datetime

import psycopg
import pytest

from app.auth.domain.entities.user import User
from app.shared.exceptions import UserAlreadyExistsError
from app.shared.runtime import generate_uuid
from app.auth.domain.value_objects.email import Email
from app.environment import load_environment
from app.auth.infrastructure.repositories.postgres_user_repository import (
    PostgresUserRepository,
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
def repository(database_url: str) -> PostgresUserRepository:
    return PostgresUserRepository(database_url=database_url)


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


def test_save_persists_user_and_finders_return_saved_user(
    repository: PostgresUserRepository,
    created_user_ids: list[str],
) -> None:
    user = User(
        id=generate_uuid(),
        email=Email(f"{generate_uuid()}@example.com"),
        password_hash="hashed-password",
        created_at=datetime(2026, 3, 4, 12, 0, tzinfo=UTC),
    )

    saved_user = repository.save(user)
    created_user_ids.append(user.id)

    found_by_id = repository.find_by_id(user.id)
    found_by_email = repository.find_by_email(user.email)

    assert saved_user.id == user.id
    assert found_by_id is not None
    assert found_by_email is not None
    assert found_by_id.id == user.id
    assert str(found_by_id.email) == str(user.email)
    assert found_by_id.password_hash == user.password_hash
    assert found_by_id.created_at == user.created_at
    assert found_by_id.is_active is True
    assert found_by_email.id == user.id


def test_find_by_id_returns_none_when_user_does_not_exist(
    repository: PostgresUserRepository,
) -> None:
    result = repository.find_by_id(generate_uuid())

    assert result is None


def test_save_raises_for_duplicate_email(
    repository: PostgresUserRepository,
    created_user_ids: list[str],
) -> None:
    email = Email(f"{generate_uuid()}@example.com")
    existing_user = User(
        id=generate_uuid(),
        email=email,
        password_hash="hashed-password",
        created_at=datetime(2026, 3, 4, 12, 30, tzinfo=UTC),
    )
    repository.save(existing_user)
    created_user_ids.append(existing_user.id)

    duplicate_user = User(
        id=generate_uuid(),
        email=email,
        password_hash="another-hash",
        created_at=datetime(2026, 3, 4, 12, 31, tzinfo=UTC),
    )

    with pytest.raises(
        UserAlreadyExistsError,
        match=f"user with email '{email}' already exists",
    ):
        repository.save(duplicate_user)
