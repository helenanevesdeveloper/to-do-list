"""Unit tests for the authenticate-user output DTO."""

from app.auth.application.dto.authenticate_user_output import (
    AuthenticateUserOutput,
)


def test_authenticate_user_output_stores_tokens() -> None:
    dto = AuthenticateUserOutput(
        access_token="access-token",
        token_type="Bearer",
    )

    assert dto.access_token == "access-token"
    assert dto.token_type == "Bearer"
