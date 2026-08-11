import pytest

from app.auth.presentation.serializers import LoginRequest


def test_login_request_accepts_email_and_password() -> None:
    serializer = LoginRequest(
        data={
            "email": "user@example.com",
            "password": "StrongPass1",
        }
    )

    assert serializer.is_valid()
    assert serializer.validated_data == {
        "email": "user@example.com",
        "password": "StrongPass1",
    }


def test_login_request_requires_valid_email() -> None:
    serializer = LoginRequest(
        data={
            "email": "invalid-email",
            "password": "StrongPass1",
        }
    )

    assert not serializer.is_valid()
    assert "email" in serializer.errors


def test_login_request_requires_password() -> None:
    serializer = LoginRequest(data={"email": "user@example.com"})

    assert not serializer.is_valid()
    assert "password" in serializer.errors
