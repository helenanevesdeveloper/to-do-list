"""Unit tests for the logout use case."""

from dataclasses import dataclass
from datetime import UTC, datetime

import pytest

from app.auth.application.dto.logout_input import LogoutInput
from app.auth.application.use_cases.logout import LogoutUseCase
from app.auth.domain.entities.auth_session import AuthSession
from app.shared.exceptions import (
    SessionAlreadyRevokedError,
    SessionNotFoundError,
)


@dataclass
class FakeSessionRepository:
    session: AuthSession | None = None
    revoked_calls: list[tuple[str, datetime]] | None = None

    def __post_init__(self) -> None:
        if self.revoked_calls is None:
            self.revoked_calls = []

    def find_by_id(self, session_id: str) -> AuthSession | None:
        if self.session is None:
            return None
        if self.session.id != session_id:
            return None
        return self.session

    def save(self, session: AuthSession) -> AuthSession:
        self.session = session
        return session

    def revoke(
        self,
        session_id: str,
        revoked_at: datetime,
    ) -> AuthSession | None:
        assert self.revoked_calls is not None
        self.revoked_calls.append((session_id, revoked_at))

        if self.session is None or self.session.id != session_id:
            return None

        self.session.revoked_at = revoked_at
        return self.session


def test_logout_revokes_active_session() -> None:
    repository = FakeSessionRepository(
        session=AuthSession(
            id="session-123",
            user_id="user-123",
            created_at=datetime(2026, 3, 30, 10, 0, tzinfo=UTC),
            expires_at=datetime(2026, 3, 30, 10, 15, tzinfo=UTC),
        )
    )
    use_case = LogoutUseCase(
        session_repository=repository,
        now=lambda: datetime(2026, 3, 30, 10, 5, tzinfo=UTC),
    )

    use_case.execute(LogoutInput(session_id="session-123"))

    assert repository.revoked_calls == [
        ("session-123", datetime(2026, 3, 30, 10, 5, tzinfo=UTC))
    ]
    assert repository.session is not None
    assert repository.session.revoked_at == datetime(
        2026, 3, 30, 10, 5, tzinfo=UTC
    )


def test_logout_raises_when_session_does_not_exist() -> None:
    repository = FakeSessionRepository(session=None)
    use_case = LogoutUseCase(session_repository=repository)

    with pytest.raises(SessionNotFoundError, match="session was not found"):
        use_case.execute(LogoutInput(session_id="missing-session"))

    assert repository.revoked_calls == []


def test_logout_raises_when_session_is_already_revoked() -> None:
    repository = FakeSessionRepository(
        session=AuthSession(
            id="session-123",
            user_id="user-123",
            created_at=datetime(2026, 3, 30, 10, 0, tzinfo=UTC),
            expires_at=datetime(2026, 3, 30, 10, 15, tzinfo=UTC),
            revoked_at=datetime(2026, 3, 30, 10, 3, tzinfo=UTC),
        )
    )
    use_case = LogoutUseCase(session_repository=repository)

    with pytest.raises(
        SessionAlreadyRevokedError,
        match="session is already revoked",
    ):
        use_case.execute(LogoutInput(session_id="session-123"))

    assert repository.revoked_calls == []
