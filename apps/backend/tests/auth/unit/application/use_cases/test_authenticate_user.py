"""Unit tests for the authenticate-user use case."""

from dataclasses import dataclass
from datetime import UTC, datetime

import pytest

from app.auth.application.dto.authenticate_user_input import (
    AuthenticateUserInput,
)
from app.auth.application.use_cases.authenticate_user import (
    AuthenticateUserUseCase,
)
from app.auth.domain.entities.auth_session import AuthSession
from app.auth.domain.entities.user import User
from app.shared.exceptions import InactiveUserError, InvalidCredentialsError
from app.auth.domain.value_objects.email import Email


@dataclass
class FakeUserRepository:
    user: User | None = None
    last_email_lookup: Email | None = None

    def find_by_id(self, user_id: str) -> User | None:
        return None

    def find_by_email(self, email: Email) -> User | None:
        self.last_email_lookup = email
        return self.user

    def save(self, user: User) -> User:
        return user


@dataclass
class FakePasswordHasher:
    verify_result: bool = True
    calls: list[tuple[str, str]] | None = None

    def __post_init__(self) -> None:
        if self.calls is None:
            self.calls = []

    def hash(self, password: str) -> str:
        return f"hashed::{password}"

    def verify(self, password: str, encoded_hash: str) -> bool:
        assert self.calls is not None
        self.calls.append((password, encoded_hash))
        return self.verify_result


@dataclass
class FakeSessionRepository:
    saved_sessions: list[AuthSession] | None = None

    def __post_init__(self) -> None:
        if self.saved_sessions is None:
            self.saved_sessions = []

    def find_by_id(self, session_id: str) -> AuthSession | None:
        assert self.saved_sessions is not None
        for session in self.saved_sessions:
            if session.id == session_id:
                return session
        return None

    def save(self, session: AuthSession) -> AuthSession:
        assert self.saved_sessions is not None
        self.saved_sessions.append(session)
        return session

    def revoke(
        self,
        session_id: str,
        revoked_at: datetime,
    ) -> AuthSession | None:
        return None


@dataclass
class FakeAccessTokenIssuer:
    issued_tokens: list[tuple[str, str]] | None = None
    token: str = "access-token"

    def __post_init__(self) -> None:
        if self.issued_tokens is None:
            self.issued_tokens = []

    def issue(self, subject: str, session_id: str) -> str:
        assert self.issued_tokens is not None
        self.issued_tokens.append((subject, session_id))
        return self.token


def test_authenticates_user_successfully() -> None:
    repository = FakeUserRepository(
        user=User(
            id="user-123",
            email=Email("user@example.com"),
            password_hash="stored-hash",
            created_at=datetime(2026, 3, 4, 10, 30, tzinfo=UTC),
        )
    )
    password_hasher = FakePasswordHasher(verify_result=True)
    session_repository = FakeSessionRepository()
    access_token_issuer = FakeAccessTokenIssuer(token="access-token")
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

    assert repository.last_email_lookup == Email("user@example.com")
    assert password_hasher.calls == [("StrongPass1", "stored-hash")]
    assert access_token_issuer.issued_tokens == [("user-123", "session-123")]
    assert session_repository.saved_sessions == [
        AuthSession(
            id="session-123",
            user_id="user-123",
            created_at=datetime(2026, 3, 4, 11, 0, tzinfo=UTC),
            expires_at=datetime(2026, 3, 4, 11, 15, tzinfo=UTC),
        )
    ]
    assert result.access_token == "access-token"
    assert result.token_type == "Bearer"


def test_raises_for_unknown_email() -> None:
    repository = FakeUserRepository(user=None)
    password_hasher = FakePasswordHasher()
    session_repository = FakeSessionRepository()
    access_token_issuer = FakeAccessTokenIssuer(token="unused-token")
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

    assert password_hasher.calls == []
    assert session_repository.saved_sessions == []
    assert access_token_issuer.issued_tokens == []


def test_raises_for_invalid_password() -> None:
    repository = FakeUserRepository(
        user=User(
            id="user-123",
            email=Email("user@example.com"),
            password_hash="stored-hash",
            created_at=datetime(2026, 3, 4, 10, 30, tzinfo=UTC),
        )
    )
    password_hasher = FakePasswordHasher(verify_result=False)
    session_repository = FakeSessionRepository()
    access_token_issuer = FakeAccessTokenIssuer(token="unused-token")
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

    assert password_hasher.calls == [("WrongPass1", "stored-hash")]
    assert session_repository.saved_sessions == []
    assert access_token_issuer.issued_tokens == []


def test_raises_for_inactive_user() -> None:
    repository = FakeUserRepository(
        user=User(
            id="user-123",
            email=Email("user@example.com"),
            password_hash="stored-hash",
            created_at=datetime(2026, 3, 4, 10, 30, tzinfo=UTC),
            is_active=False,
        )
    )
    password_hasher = FakePasswordHasher(verify_result=True)
    session_repository = FakeSessionRepository()
    access_token_issuer = FakeAccessTokenIssuer(token="unused-token")
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

    assert password_hasher.calls == [("StrongPass1", "stored-hash")]
    assert session_repository.saved_sessions == []
    assert access_token_issuer.issued_tokens == []
