from app.auth.presentation.dependencies import set_dependency_override


class FakeLogoutUseCase:
    def __init__(self, *, error: Exception | None = None) -> None:
        self.error = error
        self.calls: list[dict[str, str]] = []

    def execute(self, input_dto: object) -> None:
        self.calls.append({"session_id": getattr(input_dto, "session_id")})

        if self.error is not None:
            raise self.error


class FakeAccessTokenDecoder:
    def __init__(
        self,
        *,
        user_id: str = "user-123",
        session_id: str = "session-123",
        error: Exception | None = None,
    ) -> None:
        self.user_id = user_id
        self.session_id = session_id
        self.error = error
        self.tokens: list[str] = []

    def get_user_id(self, token: str) -> str:
        self.tokens.append(token)
        if self.error is not None:
            raise self.error
        return self.user_id

    def get_session_id(self, token: str) -> str:
        self.tokens.append(token)
        if self.error is not None:
            raise self.error
        return self.session_id


def test_logout_returns_204_and_revokes_current_session(client) -> None:
    fake_use_case = FakeLogoutUseCase()
    fake_decoder = FakeAccessTokenDecoder(session_id="session-123")
    set_dependency_override("logout_use_case", fake_use_case)
    set_dependency_override("access_token_decoder", fake_decoder)

    response = client.post(
        "/api/auth/logout",
        headers={"Authorization": "Bearer valid-access-token"},
    )

    assert response.status_code == 204
    assert response.content == b""
    assert fake_decoder.tokens == [
        "valid-access-token",
        "valid-access-token",
    ]
    assert fake_use_case.calls == [{"session_id": "session-123"}]


def test_logout_returns_401_when_user_is_not_authenticated(client) -> None:
    fake_use_case = FakeLogoutUseCase()
    set_dependency_override("logout_use_case", fake_use_case)

    response = client.post("/api/auth/logout")

    assert response.status_code == 401
    assert response.json() == {"detail": "user is not authenticated"}
    assert fake_use_case.calls == []


def test_logout_returns_401_when_access_token_is_invalid(client) -> None:
    fake_use_case = FakeLogoutUseCase()
    fake_decoder = FakeAccessTokenDecoder(error=ValueError("bad token"))
    set_dependency_override("logout_use_case", fake_use_case)
    set_dependency_override("access_token_decoder", fake_decoder)

    response = client.post(
        "/api/auth/logout",
        headers={"Authorization": "Bearer invalid-access-token"},
    )

    assert response.status_code == 401
    assert response.json() == {"detail": "invalid access token"}
    assert fake_decoder.tokens == ["invalid-access-token"]
    assert fake_use_case.calls == []
