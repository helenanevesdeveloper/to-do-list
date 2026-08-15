"""Unit tests for the register-user use case."""

from datetime import UTC, datetime
from unittest.mock import Mock

import pytest

from app.auth.application.dto.register_user_input import RegisterUserInput
from app.auth.application.use_cases.register_user import RegisterUserUseCase
from app.auth.domain.entities.user import User
from app.auth.domain.services.password_policy import PasswordPolicy
from app.auth.domain.value_objects.email import Email
from app.shared.exceptions import (
    InvalidEmailError,
    UserAlreadyExistsError,
    WeakPasswordError,
)


def build_user_repository(existing_user: User | None = None) -> Mock:
    repository = Mock()
    repository.find_by_email.return_value = existing_user
    repository.save.side_effect = lambda user: user
    return repository


def build_password_hasher(*, hashed_value: str = "hashed-password") -> Mock:
    password_hasher = Mock()
    password_hasher.hash.return_value = hashed_value
    return password_hasher


def test_registers_user_successfully() -> None:
    repository = build_user_repository()
    password_hasher = build_password_hasher(hashed_value="hashed-123")
    created_at = datetime(2026, 3, 4, 10, 30, tzinfo=UTC)
    use_case = RegisterUserUseCase(
        user_repository=repository,
        password_policy=PasswordPolicy(),
        password_hasher=password_hasher,
        generate_user_id=lambda: "user-123",
        now=lambda: created_at,
    )

    result = use_case.execute(
        RegisterUserInput(
            email="  USER@example.com ",
            password="StrongPass1",
        )
    )

    repository.find_by_email.assert_called_once_with(Email("user@example.com"))
    saved_user = repository.save.call_args.args[0]
    assert saved_user.id == "user-123"
    assert str(saved_user.email) == "user@example.com"
    assert saved_user.password_hash == "hashed-123"
    assert saved_user.created_at == created_at
    password_hasher.hash.assert_called_once_with("StrongPass1")
    assert result.id == "user-123"
    assert result.email == "user@example.com"
    assert result.created_at == created_at.isoformat()
    assert result.is_active is True


def test_raises_when_user_already_exists() -> None:
    existing_user = User(
        id="existing-1",
        email=Email("user@example.com"),
        password_hash="hashed-password",
        created_at=datetime(2026, 3, 4, 9, 0, tzinfo=UTC),
    )
    repository = build_user_repository(existing_user=existing_user)
    password_hasher = build_password_hasher()
    use_case = RegisterUserUseCase(
        user_repository=repository,
        password_policy=PasswordPolicy(),
        password_hasher=password_hasher,
    )

    with pytest.raises(
        UserAlreadyExistsError, match="user with this email already exists"
    ):
        use_case.execute(
            RegisterUserInput(
                email="user@example.com",
                password="StrongPass1",
            )
        )

    repository.save.assert_not_called()
    password_hasher.hash.assert_not_called()


def test_raises_for_invalid_email_before_repository_lookup() -> None:
    repository = build_user_repository()
    password_hasher = build_password_hasher()
    use_case = RegisterUserUseCase(
        user_repository=repository,
        password_policy=PasswordPolicy(),
        password_hasher=password_hasher,
    )

    with pytest.raises(
        InvalidEmailError, match="email must be a valid email address"
    ):
        use_case.execute(
            RegisterUserInput(
                email="invalid-email",
                password="StrongPass1",
            )
        )

    repository.find_by_email.assert_not_called()
    repository.save.assert_not_called()
    password_hasher.hash.assert_not_called()


def test_raises_for_weak_password_before_repository_lookup() -> None:
    repository = build_user_repository()
    password_hasher = build_password_hasher()
    use_case = RegisterUserUseCase(
        user_repository=repository,
        password_policy=PasswordPolicy(),
        password_hasher=password_hasher,
    )

    with pytest.raises(WeakPasswordError) as error:
        use_case.execute(
            RegisterUserInput(
                email="user@example.com",
                password="abc",
            )
        )

    assert str(error.value) == "password must be at least 8 characters long"
    assert error.value.issues is not None
    assert [issue.message for issue in error.value.issues] == [
        "password must be at least 8 characters long",
        "password must contain at least one uppercase letter",
        "password must contain at least one digit",
    ]
    repository.find_by_email.assert_not_called()
    repository.save.assert_not_called()
    password_hasher.hash.assert_not_called()
