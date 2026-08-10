from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient

from app.application.dto.authenticate_user_output import AuthenticateUserOutput
from app.domain.exceptions import InactiveUserError, InvalidCredentialsError
from app.presentation.controllers.auth_controller import (
    get_authenticate_user_use_case,
)
from main import app


class FakeAuthenticateUserUseCase:
    def __init__(
        self,
        *,
        result: AuthenticateUserOutput | None = None,
        error: Exception | None = None,
    ) -> None:
        self.result = result
        self.error = error
        self.calls: list[dict[str, str]] = []

    def execute(self, input_dto: object) -> AuthenticateUserOutput:
        self.calls.append(
            {
                "email": getattr(input_dto, "email"),
                "password": getattr(input_dto, "password"),
            }
        )

        if self.error is not None:
            raise self.error
        if self.result is None:
            raise AssertionError("test fake requires a result or error")

        return self.result


@pytest.fixture
def client() -> Iterator[TestClient]:
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


def test_login_returns_200_and_response_body(client: TestClient) -> None:
    fake_use_case = FakeAuthenticateUserUseCase(
        result=AuthenticateUserOutput(
            access_token="access-token",
            token_type="Bearer",
        )
    )
    app.dependency_overrides[get_authenticate_user_use_case] = (
        lambda: fake_use_case
    )

    response = client.post(
        "/login",
        json={
            "email": "USER@example.com",
            "password": "StrongPass1",
        },
    )

    assert response.status_code == 200
    assert response.json() == {
        "access_token": "access-token",
        "token_type": "Bearer",
    }
    assert fake_use_case.calls == [
        {"email": "USER@example.com", "password": "StrongPass1"}
    ]


def test_login_returns_401_for_invalid_credentials(
    client: TestClient,
) -> None:
    fake_use_case = FakeAuthenticateUserUseCase(
        error=InvalidCredentialsError("invalid email or password")
    )
    app.dependency_overrides[get_authenticate_user_use_case] = (
        lambda: fake_use_case
    )

    response = client.post(
        "/login",
        json={
            "email": "user@example.com",
            "password": "WrongPass1",
        },
    )

    assert response.status_code == 401
    assert response.json() == {
        "detail": "invalid email or password"
    }


def test_login_returns_401_for_inactive_user(client: TestClient) -> None:
    fake_use_case = FakeAuthenticateUserUseCase(
        error=InactiveUserError("user is inactive")
    )
    app.dependency_overrides[get_authenticate_user_use_case] = (
        lambda: fake_use_case
    )

    response = client.post(
        "/login",
        json={
            "email": "user@example.com",
            "password": "StrongPass1",
        },
    )

    assert response.status_code == 401
    assert response.json() == {"detail": "user is inactive"}


def test_login_returns_422_for_request_validation_error(
    client: TestClient,
) -> None:
    fake_use_case = FakeAuthenticateUserUseCase(
        result=AuthenticateUserOutput(
            access_token="unused-token",
            token_type="Bearer",
        )
    )
    app.dependency_overrides[get_authenticate_user_use_case] = (
        lambda: fake_use_case
    )

    response = client.post(
        "/login",
        json={
            "email": "invalid-email",
            "password": "StrongPass1",
        },
    )

    assert response.status_code == 422
    assert response.json()["detail"][0]["loc"] == ["body", "email"]
    assert fake_use_case.calls == []
