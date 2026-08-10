from app.application.dto.logout_input import LogoutInput


def test_logout_input_stores_session_id() -> None:
    dto = LogoutInput(session_id="session-123")

    assert dto.session_id == "session-123"
