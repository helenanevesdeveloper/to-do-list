"""Unit tests for the logout use case."""

from datetime import UTC, datetime
from unittest.mock import Mock

import pytest

from app.auth.application.dto.logout_input import LogoutInput
from app.auth.application.use_cases.logout import LogoutUseCase
from app.auth.domain.entities.auth_session import AuthSession
from app.shared.exceptions import (
    SessionAlreadyRevokedError,
    SessionNotFoundError,
)


def build_session_repository(session: AuthSession | None) -> Mock:
    repository = Mock()
    repository.session = session

    def find_by_id(session_id: str) -> AuthSession | None:
        if repository.session is None or repository.session.id != session_id:
            return None
        return repository.session

    def revoke(session_id: str, revoked_at: datetime) -> AuthSession | None:
        if repository.session is None or repository.session.id != session_id:
            return None

        repository.session.revoked_at = revoked_at
        return repository.session

    repository.find_by_id.side_effect = find_by_id
    repository.revoke.side_effect = revoke
    return repository


def test_logout_revokes_active_session() -> None:
    repository = build_session_repository(
        AuthSession(
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

    repository.revoke.assert_called_once_with(
        session_id="session-123",
        revoked_at=datetime(2026, 3, 30, 10, 5, tzinfo=UTC),
    )
    assert repository.session is not None
    assert repository.session.revoked_at == datetime(
        2026, 3, 30, 10, 5, tzinfo=UTC
    )


def test_logout_raises_when_session_does_not_exist() -> None:
    repository = build_session_repository(None)
    use_case = LogoutUseCase(session_repository=repository)

    with pytest.raises(SessionNotFoundError, match="session was not found"):
        use_case.execute(LogoutInput(session_id="missing-session"))

    repository.revoke.assert_not_called()


def test_logout_raises_when_session_is_already_revoked() -> None:
    repository = build_session_repository(
        AuthSession(
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

    repository.revoke.assert_not_called()
