"""API tests for the register endpoint."""

import json

from app.auth.application.dto.register_user_output import RegisterUserOutput
from app.shared.exceptions import (
    UserAlreadyExistsError,
    ValidationIssue,
    WeakPasswordError,
)
from app.auth.presentation.dependencies import set_dependency_override


class FakeRegisterUserUseCase:
    def __init__(
        self,
        *,
        result: RegisterUserOutput | None = None,
        error: Exception | None = None,
    ) -> None:
        self.result = result
        self.error = error
        self.calls: list[dict[str, str]] = []

    def execute(self, input_dto: object) -> RegisterUserOutput:
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


def test_register_returns_201_and_response_body(client) -> None:
    fake_use_case = FakeRegisterUserUseCase(
        result=RegisterUserOutput(
            id="user-123",
            email="user@example.com",
            created_at="2026-03-04T10:30:00+00:00",
            is_active=True,
        )
    )
    set_dependency_override("register_user_use_case", fake_use_case)

    response = client.post(
        "/api/auth/register",
        data=json.dumps(
            {
                "email": "USER@example.com",
                "password": "StrongPass1",
            }
        ),
        content_type="application/json",
    )

    assert response.status_code == 201
    assert response.json() == {
        "id": "user-123",
        "email": "user@example.com",
        "created_at": "2026-03-04T10:30:00+00:00",
        "is_active": True,
    }
    assert fake_use_case.calls == [
        {"email": "USER@example.com", "password": "StrongPass1"}
    ]


def test_register_returns_409_when_user_already_exists(client) -> None:
    fake_use_case = FakeRegisterUserUseCase(
        error=UserAlreadyExistsError("user with this email already exists")
    )
    set_dependency_override("register_user_use_case", fake_use_case)

    response = client.post(
        "/api/auth/register",
        data=json.dumps(
            {
                "email": "user@example.com",
                "password": "StrongPass1",
            }
        ),
        content_type="application/json",
    )

    assert response.status_code == 409
    assert response.json() == {
        "detail": "user with this email already exists"
    }


def test_register_returns_400_for_domain_validation_error(client) -> None:
    fake_use_case = FakeRegisterUserUseCase(
        error=WeakPasswordError(
            [
                ValidationIssue(
                    field="password",
                    message="password must be at least 8 characters long",
                ),
                ValidationIssue(
                    field="password",
                    message="password must contain at least one uppercase letter",
                ),
            ]
        )
    )
    set_dependency_override("register_user_use_case", fake_use_case)

    response = client.post(
        "/api/auth/register",
        data=json.dumps(
            {
                "email": "user@example.com",
                "password": "Abc123",
            }
        ),
        content_type="application/json",
    )

    assert response.status_code == 400
    assert response.json() == {
        "detail": [
            {
                "field": "password",
                "message": "password must be at least 8 characters long",
            },
            {
                "field": "password",
                "message": "password must contain at least one uppercase letter",
            },
        ]
    }


def test_register_returns_422_for_request_validation_error(client) -> None:
    fake_use_case = FakeRegisterUserUseCase(
        result=RegisterUserOutput(
            id="unused",
            email="unused@example.com",
            created_at="2026-03-04T10:30:00+00:00",
            is_active=True,
        )
    )
    set_dependency_override("register_user_use_case", fake_use_case)

    response = client.post(
        "/api/auth/register",
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
