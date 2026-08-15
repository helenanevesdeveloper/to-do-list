"""Unit tests for the authenticate-user use case."""

from datetime import UTC, datetime
from unittest.mock import Mock

import pytest

from app.auth.application.dto.authenticate_user_input import (
    AuthenticateUserInput,
)
from app.auth.application.use_cases.authenticate_user import (
    AuthenticateUserUseCase,
)
from app.auth.domain.entities.auth_session import AuthSession
from app.auth.domain.entities.user import User
from app.auth.domain.value_objects.email import Email
from app.shared.exceptions import InactiveUserError, InvalidCredentialsError


def build_user_repository(user: User | None) -> Mock:
    repository = Mock()
    repository.find_by_email.return_value = user
    return repository


def build_password_hasher(*, verify_result: bool = True) -> Mock:
    password_hasher = Mock()
    password_hasher.verify.return_value = verify_result
    return password_hasher


def build_session_repository() -> Mock:
    repository = Mock()
    repository.save.side_effect = lambda session: session
    return repository


def build_access_token_issuer(*, token: str = "access-token") -> Mock:
    issuer = Mock()
    issuer.issue.return_value = token
    return issuer


def test_authenticates_user_successfully() -> None:
    repository = build_user_repository(
        User(
            id="user-123",
            email=Email("user@example.com"),
            password_hash="stored-hash",
            created_at=datetime(2026, 3, 4, 10, 30, tzinfo=UTC),
        )
    )
    password_hasher = build_password_hasher(verify_result=True)
    session_repository = build_session_repository()
    access_token_issuer = build_access_token_issuer(token="access-token")
    use_case = AuthenticateUserUseCase(
        user_repository=repository,
        session_repository=session_repository,
        password_hasher=password_hasher,
        access_token_issuer=access_token_issuer,
        access_token_expires_seconds=900,
        generate_session_id=lambda: "session-123",
        now=lambda: datetime(2026, 3, 4, 11, 0, tzinfo=UTC),
    )

    result = use_case.execute(
        AuthenticateUserInput(
            email=" USER@example.com ",
            password="StrongPass1",
        )
    )

    repository.find_by_email.assert_called_once_with(Email("user@example.com"))
    password_hasher.verify.assert_called_once_with("StrongPass1", "stored-hash")
    access_token_issuer.issue.assert_called_once_with("user-123", "session-123")
    assert session_repository.save.call_args.args == (
        AuthSession(
            id="session-123",
            user_id="user-123",
            created_at=datetime(2026, 3, 4, 11, 0, tzinfo=UTC),
            expires_at=datetime(2026, 3, 4, 11, 15, tzinfo=UTC),
        ),
    )
    assert result.access_token == "access-token"
    assert result.token_type == "Bearer"
    assert result.email == "user@example.com"


def test_raises_for_unknown_email() -> None:
    repository = build_user_repository(None)
    password_hasher = build_password_hasher()
    session_repository = build_session_repository()
    access_token_issuer = build_access_token_issuer(token="unused-token")
    use_case = AuthenticateUserUseCase(
        user_repository=repository,
        session_repository=session_repository,
        password_hasher=password_hasher,
        access_token_issuer=access_token_issuer,
    )

    with pytest.raises(
        InvalidCredentialsError, match="invalid email or password"
    ):
        use_case.execute(
            AuthenticateUserInput(
                email="user@example.com",
                password="StrongPass1",
            )
        )

    password_hasher.verify.assert_not_called()
    session_repository.save.assert_not_called()
    access_token_issuer.issue.assert_not_called()


def test_raises_for_invalid_password() -> None:
    repository = build_user_repository(
        User(
            id="user-123",
            email=Email("user@example.com"),
            password_hash="stored-hash",
            created_at=datetime(2026, 3, 4, 10, 30, tzinfo=UTC),
        )
    )
    password_hasher = build_password_hasher(verify_result=False)
    session_repository = build_session_repository()
    access_token_issuer = build_access_token_issuer(token="unused-token")
    use_case = AuthenticateUserUseCase(
        user_repository=repository,
        session_repository=session_repository,
        password_hasher=password_hasher,
        access_token_issuer=access_token_issuer,
    )

    with pytest.raises(
        InvalidCredentialsError, match="invalid email or password"
    ):
        use_case.execute(
            AuthenticateUserInput(
                email="user@example.com",
                password="WrongPass1",
            )
        )

    password_hasher.verify.assert_called_once_with("WrongPass1", "stored-hash")
    session_repository.save.assert_not_called()
    access_token_issuer.issue.assert_not_called()


def test_raises_for_inactive_user() -> None:
    repository = build_user_repository(
        User(
            id="user-123",
            email=Email("user@example.com"),
            password_hash="stored-hash",
            created_at=datetime(2026, 3, 4, 10, 30, tzinfo=UTC),
            is_active=False,
        )
    )
    password_hasher = build_password_hasher(verify_result=True)
    session_repository = build_session_repository()
    access_token_issuer = build_access_token_issuer(token="unused-token")
    use_case = AuthenticateUserUseCase(
        user_repository=repository,
        session_repository=session_repository,
        password_hasher=password_hasher,
        access_token_issuer=access_token_issuer,
    )

    with pytest.raises(InactiveUserError, match="user is inactive"):
        use_case.execute(
            AuthenticateUserInput(
                email="user@example.com",
                password="StrongPass1",
            )
        )

    password_hasher.verify.assert_called_once_with("StrongPass1", "stored-hash")
    session_repository.save.assert_not_called()
    access_token_issuer.issue.assert_not_called()
