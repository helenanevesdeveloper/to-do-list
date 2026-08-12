"""Unit tests for the auth session entity."""

from datetime import UTC, datetime

import pytest

from app.auth.domain.entities.auth_session import AuthSession
from app.shared.exceptions import EmptyFieldError, ValidationError


def test_auth_session_accepts_valid_data() -> None:
    session = AuthSession(
        id="session-123",
        user_id="user-123",
        created_at=datetime(2026, 3, 26, 10, 0, tzinfo=UTC),
        expires_at=datetime(2026, 3, 26, 10, 15, tzinfo=UTC),
    )

    assert session.id == "session-123"
    assert session.user_id == "user-123"
    assert session.revoked_at is None


def test_auth_session_requires_non_empty_id() -> None:
    with pytest.raises(EmptyFieldError, match="id cannot be empty"):
        AuthSession(
            id=" ",
            user_id="user-123",
            created_at=datetime(2026, 3, 26, 10, 0, tzinfo=UTC),
            expires_at=datetime(2026, 3, 26, 10, 15, tzinfo=UTC),
        )


def test_auth_session_requires_expires_after_created_at() -> None:
    with pytest.raises(
        ValidationError,
        match="expires_at must be after created_at",
    ):
        AuthSession(
            id="session-123",
            user_id="user-123",
            created_at=datetime(2026, 3, 26, 10, 0, tzinfo=UTC),
            expires_at=datetime(2026, 3, 26, 10, 0, tzinfo=UTC),
        )
