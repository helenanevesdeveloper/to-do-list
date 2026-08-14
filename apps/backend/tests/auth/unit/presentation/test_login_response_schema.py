"""Unit tests for the login response serializer."""

from app.auth.presentation.serializers import LoginResponse


def test_login_response_accepts_access() -> None:
    response = LoginResponse(
        {
            "access_token": "access-token",
            "token_type": "Bearer",
            "email": "user@example.com",
        }
    )

    assert response.data == {
        "access_token": "access-token",
        "token_type": "Bearer",
        "email": "user@example.com",
    }
