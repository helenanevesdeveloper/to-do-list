"""Unit tests for the register-user API view."""

from unittest.mock import Mock

from app.auth.application.dto.register_user_input import RegisterUserInput
from app.auth.presentation import views
from app.shared.exceptions import UserAlreadyExistsError


def test_register_user_returns_conflict_when_email_already_exists(
    client, monkeypatch
) -> None:
    use_case = Mock()
    use_case.execute.side_effect = UserAlreadyExistsError(
        "user with this email already exists"
    )
    monkeypatch.setattr(views, "get_register_user_use_case", lambda: use_case)

    response = client.post(
        "/api/auth/register",
        data={
            "email": "user@example.com",
            "password": "StrongPass1",
        },
    )

    assert response.status_code == 409
    assert response.json() == {
        "detail": {
            "code": "user_already_exists",
            "message": "user with this email already exists",
        }
    }
    use_case.execute.assert_called_once_with(
        RegisterUserInput(
            email="user@example.com",
            password="StrongPass1",
        )
    )
