import json

from app.auth.application.dto.authenticate_user_output import (
    AuthenticateUserOutput,
)
from app.shared.exceptions import InactiveUserError, InvalidCredentialsError
from app.auth.presentation.dependencies import set_dependency_override


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


def test_login_returns_200_and_response_body(client) -> None:
    fake_use_case = FakeAuthenticateUserUseCase(
        result=AuthenticateUserOutput(
            access_token="access-token",
            token_type="Bearer",
        )
    )
    set_dependency_override("authenticate_user_use_case", fake_use_case)

    response = client.post(
        "/api/auth/login",
        data=json.dumps(
            {
                "email": "USER@example.com",
                "password": "StrongPass1",
            }
        ),
        content_type="application/json",
    )

    assert response.status_code == 200
    assert response.json() == {
        "access_token": "access-token",
        "token_type": "Bearer",
    }
    assert fake_use_case.calls == [
        {"email": "USER@example.com", "password": "StrongPass1"}
    ]


def test_login_returns_401_for_invalid_credentials(client) -> None:
    fake_use_case = FakeAuthenticateUserUseCase(
        error=InvalidCredentialsError("invalid email or password")
    )
    set_dependency_override("authenticate_user_use_case", fake_use_case)

    response = client.post(
        "/api/auth/login",
        data=json.dumps(
            {
                "email": "user@example.com",
                "password": "WrongPass1",
            }
        ),
        content_type="application/json",
    )

    assert response.status_code == 401
    assert response.json() == {
        "detail": "invalid email or password"
    }


def test_login_returns_401_for_inactive_user(client) -> None:
    fake_use_case = FakeAuthenticateUserUseCase(
        error=InactiveUserError("user is inactive")
    )
    set_dependency_override("authenticate_user_use_case", fake_use_case)

    response = client.post(
        "/api/auth/login",
        data=json.dumps(
            {
                "email": "user@example.com",
                "password": "StrongPass1",
            }
        ),
        content_type="application/json",
    )

    assert response.status_code == 401
    assert response.json() == {"detail": "user is inactive"}


def test_login_returns_422_for_request_validation_error(client) -> None:
    fake_use_case = FakeAuthenticateUserUseCase(
        result=AuthenticateUserOutput(
            access_token="unused-token",
            token_type="Bearer",
        )
    )
    set_dependency_override("authenticate_user_use_case", fake_use_case)

    response = client.post(
        "/api/auth/login",
        data=json.dumps(
            {
                "email": "invalid-email",
                "password": "StrongPass1",
            }
        ),
        content_type="application/json",
    )

    assert response.status_code == 422
    assert response.json()["detail"][0]["loc"] == ["body", "email"]
    assert fake_use_case.calls == []
