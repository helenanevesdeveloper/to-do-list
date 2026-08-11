from app.auth.presentation.serializers import LoginResponse


def test_login_response_accepts_access() -> None:
    response = LoginResponse(
        {
            "access_token": "access-token",
            "token_type": "Bearer",
        }
    )

    assert response.data == {
        "access_token": "access-token",
        "token_type": "Bearer",
    }
