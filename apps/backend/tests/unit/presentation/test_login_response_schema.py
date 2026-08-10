from app.presentation.schemas.auth import LoginResponse


def test_login_response_accepts_access() -> None:
    response = LoginResponse(
        access_token="access-token",
        token_type="Bearer",
    )

    assert response.model_dump() == {
        "access_token": "access-token",
        "token_type": "Bearer",
    }
