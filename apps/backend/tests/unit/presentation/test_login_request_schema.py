import pytest
from pydantic import ValidationError

from app.presentation.schemas.auth import LoginRequest


def test_login_request_accepts_email_and_password() -> None:
    payload = LoginRequest(
        email="user@example.com",
        password="StrongPass1",
    )

    assert str(payload.email) == "user@example.com"
    assert payload.password == "StrongPass1"


def test_login_request_requires_valid_email() -> None:
    with pytest.raises(ValidationError) as error:
        LoginRequest(
            email="invalid-email",
            password="StrongPass1",
        )

    assert error.value.errors()[0]["loc"] == ("email",)


def test_login_request_requires_password() -> None:
    with pytest.raises(ValidationError) as error:
        LoginRequest.model_validate({"email": "user@example.com"})

    assert error.value.errors()[0]["loc"] == ("password",)
