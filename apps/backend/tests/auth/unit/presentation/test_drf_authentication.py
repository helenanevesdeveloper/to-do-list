"""Unit tests for the DRF JWT authentication adapter."""

from datetime import UTC, datetime
from unittest.mock import Mock

import pytest
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.test import APIRequestFactory

from app.auth.domain.entities import User
from app.auth.domain.value_objects import Email
from app.auth.presentation.drf_authentication import JwtAuthentication


def build_access_token_decoder(
    *,
    user_id: str = "user-123",
    session_id: str = "session-456",
    error: Exception | None = None,
) -> Mock:
    decoder = Mock()

    def get_user_id(token: str) -> str:
        if error is not None:
            raise error
        return user_id

    def get_session_id(token: str) -> str:
        if error is not None:
            raise error
        return session_id

    decoder.get_user_id.side_effect = get_user_id
    decoder.get_session_id.side_effect = get_session_id
    return decoder


def build_user_repository(user: User | None = None) -> Mock:
    repository = Mock()
    repository.find_by_id.return_value = user
    return repository


def test_returns_none_when_authorization_header_is_missing() -> None:
    request = APIRequestFactory().get("/api/tasks/")
    authentication = JwtAuthentication()

    result = authentication.authenticate(request)

    assert result is None


def test_returns_none_when_authorization_scheme_is_not_bearer() -> None:
    request = APIRequestFactory().get(
        "/api/tasks/",
        HTTP_AUTHORIZATION="Basic abc123",
    )
    authentication = JwtAuthentication()

    result = authentication.authenticate(request)

    assert result is None


def test_returns_authenticated_user_and_auth_context_for_valid_token() -> None:
    request = APIRequestFactory().get(
        "/api/tasks/",
        HTTP_AUTHORIZATION="Bearer valid-access-token",
    )
    decoder = build_access_token_decoder(
        user_id="user-123",
        session_id="session-456",
    )
    repository = build_user_repository(
        User(
            id="user-123",
            email=Email("user@example.com"),
            password_hash="stored-hash",
            created_at=datetime(2026, 3, 4, 10, 30, tzinfo=UTC),
        )
    )
    authentication = JwtAuthentication(
        decoder=decoder,
        user_repository=repository,
    )

    authenticated_user, auth_context = authentication.authenticate(request) or (
        None,
        None,
    )

    assert authenticated_user is not None
    assert authenticated_user.id == "user-123"
    assert authenticated_user.pk == "user-123"
    assert authenticated_user.email == "user@example.com"
    assert authenticated_user.is_active is True
    assert authenticated_user.is_authenticated is True
    assert authenticated_user.is_anonymous is False
    assert auth_context is not None
    assert auth_context.user_id == "user-123"
    assert auth_context.session_id == "session-456"
    assert auth_context.access_token == "valid-access-token"
    decoder.get_user_id.assert_called_once_with("valid-access-token")
    decoder.get_session_id.assert_called_once_with("valid-access-token")
    repository.find_by_id.assert_called_once_with("user-123")


def test_raises_when_bearer_token_is_missing() -> None:
    request = APIRequestFactory().get(
        "/api/tasks/",
        HTTP_AUTHORIZATION="Bearer",
    )
    authentication = JwtAuthentication()

    with pytest.raises(AuthenticationFailed, match="invalid access token"):
        authentication.authenticate(request)


def test_raises_when_token_is_invalid() -> None:
    request = APIRequestFactory().get(
        "/api/tasks/",
        HTTP_AUTHORIZATION="Bearer invalid-access-token",
    )
    decoder = build_access_token_decoder(error=ValueError("bad token"))
    authentication = JwtAuthentication(
        decoder=decoder,
        user_repository=build_user_repository(),
    )

    with pytest.raises(AuthenticationFailed, match="invalid access token"):
        authentication.authenticate(request)


def test_raises_when_token_user_cannot_be_found() -> None:
    request = APIRequestFactory().get(
        "/api/tasks/",
        HTTP_AUTHORIZATION="Bearer valid-access-token",
    )
    decoder = build_access_token_decoder(user_id="user-404")
    repository = build_user_repository(None)
    authentication = JwtAuthentication(
        decoder=decoder,
        user_repository=repository,
    )

    with pytest.raises(AuthenticationFailed, match="user is not authenticated"):
        authentication.authenticate(request)

    repository.find_by_id.assert_called_once_with("user-404")


def test_raises_when_token_user_is_inactive() -> None:
    request = APIRequestFactory().get(
        "/api/tasks/",
        HTTP_AUTHORIZATION="Bearer valid-access-token",
    )
    decoder = build_access_token_decoder()
    repository = build_user_repository(
        User(
            id="user-123",
            email=Email("user@example.com"),
            password_hash="stored-hash",
            created_at=datetime(2026, 3, 4, 10, 30, tzinfo=UTC),
            is_active=False,
        )
    )
    authentication = JwtAuthentication(
        decoder=decoder,
        user_repository=repository,
    )

    with pytest.raises(AuthenticationFailed, match="user is inactive"):
        authentication.authenticate(request)
