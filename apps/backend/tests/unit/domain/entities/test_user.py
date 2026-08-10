from datetime import UTC, datetime

import pytest

from app.domain.entities.user import User
from app.domain.exceptions import EmptyFieldError, ValidationError
from app.domain.value_objects.email import Email


def test_creates_user_with_valid_data() -> None:
    created_at = datetime(2026, 3, 3, 12, 0, tzinfo=UTC)

    user = User(
        id="user-123",
        email=Email("user@example.com"),
        password_hash="hashed-password",
        created_at=created_at,
    )

    assert user.id == "user-123"
    assert str(user.email) == "user@example.com"
    assert user.password_hash == "hashed-password"
    assert user.created_at == created_at
    assert user.is_active is True


def test_raises_for_empty_id() -> None:
    with pytest.raises(EmptyFieldError, match="id cannot be empty"):
        User(
            id="  ",
            email=Email("user@example.com"),
            password_hash="hashed-password",
            created_at=datetime.now(UTC),
        )


def test_raises_for_invalid_email_type() -> None:
    with pytest.raises(ValidationError, match="email must be an Email"):
        User(
            id="user-123",
            email="user@example.com",  # type: ignore[arg-type]
            password_hash="hashed-password",
            created_at=datetime.now(UTC),
        )


def test_raises_for_empty_password_hash() -> None:
    with pytest.raises(
        EmptyFieldError, match="password_hash cannot be empty"
    ):
        User(
            id="user-123",
            email=Email("user@example.com"),
            password_hash=" ",
            created_at=datetime.now(UTC),
        )


def test_raises_for_invalid_created_at_type() -> None:
    with pytest.raises(
        ValidationError, match="created_at must be a datetime"
    ):
        User(
            id="user-123",
            email=Email("user@example.com"),
            password_hash="hashed-password",
            created_at="2026-03-03T12:00:00Z",  # type: ignore[arg-type]
        )
