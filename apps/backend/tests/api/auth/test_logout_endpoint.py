from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient

from app.presentation.auth_context import get_access_token_decoder
from app.presentation.controllers.auth_controller import (
    get_logout_use_case,
)
from main import app


class FakeLogoutUseCase:
    def __init__(self, *, error: Exception | None = None) -> None:
        self.error = error
        self.calls: list[dict[str, str]] = []

    def execute(self, input_dto: object) -> None:
        self.calls.append({"session_id": getattr(input_dto, "session_id")})

        if self.error is not None:
            raise self.error


class FakeAccessTokenDecoder:
    def __init__(
        self,
        *,
        user_id: str = "user-123",
        session_id: str = "session-123",
        error: Exception | None = None,
    ) -> None:
        self.user_id = user_id
        self.session_id = session_id
        self.error = error
        self.tokens: list[str] = []

    def get_user_id(self, token: str) -> str:
        self.tokens.append(token)
        if self.error is not None:
            raise self.error
        return self.user_id

    def get_session_id(self, token: str) -> str:
        self.tokens.append(token)
        if self.error is not None:
            raise self.error
        return self.session_id


@pytest.fixture
def client() -> Iterator[TestClient]:
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


def test_logout_returns_204_and_revokes_current_session(
    client: TestClient,
) -> None:
    fake_use_case = FakeLogoutUseCase()
    fake_decoder = FakeAccessTokenDecoder(session_id="session-123")
    app.dependency_overrides[get_logout_use_case] = lambda: fake_use_case
    app.dependency_overrides[get_access_token_decoder] = (
        lambda: fake_decoder
    )

    response = client.post(
        "/logout",
        headers={"Authorization": "Bearer valid-access-token"},
    )

    assert response.status_code == 204
    assert response.content == b""
    assert fake_decoder.tokens == [
        "valid-access-token",
        "valid-access-token",
    ]
    assert fake_use_case.calls == [{"session_id": "session-123"}]


def test_logout_returns_401_when_user_is_not_authenticated(
    client: TestClient,
) -> None:
    fake_use_case = FakeLogoutUseCase()
    app.dependency_overrides[get_logout_use_case] = lambda: fake_use_case

    response = client.post("/logout")

    assert response.status_code == 401
    assert response.json() == {"detail": "user is not authenticated"}
    assert fake_use_case.calls == []


def test_logout_returns_401_when_access_token_is_invalid(
    client: TestClient,
) -> None:
    fake_use_case = FakeLogoutUseCase()
    fake_decoder = FakeAccessTokenDecoder(error=ValueError("bad token"))
    app.dependency_overrides[get_logout_use_case] = lambda: fake_use_case
    app.dependency_overrides[get_access_token_decoder] = (
        lambda: fake_decoder
    )

    response = client.post(
        "/logout",
        headers={"Authorization": "Bearer invalid-access-token"},
    )

    assert response.status_code == 401
    assert response.json() == {"detail": "invalid access token"}
    assert fake_decoder.tokens == ["invalid-access-token"]
    assert fake_use_case.calls == []
