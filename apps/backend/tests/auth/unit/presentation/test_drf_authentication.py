"""Unit tests for the DRF JWT authentication adapter."""

from dataclasses import dataclass
from datetime import UTC, datetime

import pytest
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.test import APIRequestFactory

from app.auth.domain.entities import User
from app.auth.domain.value_objects import Email
from app.auth.presentation.drf_authentication import JwtAuthentication


@dataclass
class FakeAccessTokenDecoder:
    user_id: str = "user-123"
    session_id: str = "session-456"
    error: Exception | None = None
    tokens: list[str] | None = None

    def __post_init__(self) -> None:
        if self.tokens is None:
            self.tokens = []

    def get_user_id(self, token: str) -> str:
        assert self.tokens is not None
        self.tokens.append(token)
        if self.error is not None:
            raise self.error
        return self.user_id

    def get_session_id(self, token: str) -> str:
        assert self.tokens is not None
        self.tokens.append(token)
        if self.error is not None:
            raise self.error
        return self.session_id


@dataclass
class FakeUserRepository:
    user: User | None = None
    looked_up_user_ids: list[str] | None = None

    def __post_init__(self) -> None:
        if self.looked_up_user_ids is None:
            self.looked_up_user_ids = []

    def find_by_id(self, user_id: str) -> User | None:
        assert self.looked_up_user_ids is not None
        self.looked_up_user_ids.append(user_id)
        return self.user

    def find_by_email(self, email: Email) -> User | None:
        return None

    def save(self, user: User) -> User:
        return user


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
    decoder = FakeAccessTokenDecoder(
        user_id="user-123",
        session_id="session-456",
    )
    repository = FakeUserRepository(
        user=User(
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
    assert decoder.tokens == ["valid-access-token", "valid-access-token"]
    assert repository.looked_up_user_ids == ["user-123"]


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
    decoder = FakeAccessTokenDecoder(error=ValueError("bad token"))
    authentication = JwtAuthentication(
        decoder=decoder,
        user_repository=FakeUserRepository(),
    )

    with pytest.raises(AuthenticationFailed, match="invalid access token"):
        authentication.authenticate(request)


def test_raises_when_token_user_cannot_be_found() -> None:
    request = APIRequestFactory().get(
        "/api/tasks/",
        HTTP_AUTHORIZATION="Bearer valid-access-token",
    )
    decoder = FakeAccessTokenDecoder(user_id="user-404")
    repository = FakeUserRepository(user=None)
    authentication = JwtAuthentication(
        decoder=decoder,
        user_repository=repository,
    )

    with pytest.raises(AuthenticationFailed, match="user is not authenticated"):
        authentication.authenticate(request)

    assert repository.looked_up_user_ids == ["user-404"]


def test_raises_when_token_user_is_inactive() -> None:
    request = APIRequestFactory().get(
        "/api/tasks/",
        HTTP_AUTHORIZATION="Bearer valid-access-token",
    )
    decoder = FakeAccessTokenDecoder()
    repository = FakeUserRepository(
        user=User(
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
