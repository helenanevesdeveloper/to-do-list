from app.auth.application.dto.authenticate_user_input import (
    AuthenticateUserInput,
)


def test_authenticate_user_input_stores_email_and_password() -> None:
    dto = AuthenticateUserInput(
        email="user@example.com",
        password="StrongPass1",
    )

    assert dto.email == "user@example.com"
    assert dto.password == "StrongPass1"
