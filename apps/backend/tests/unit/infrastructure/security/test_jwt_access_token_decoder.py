from datetime import UTC, datetime

import jwt
import pytest

from app.infrastructure.security.jwt_access_token_decoder import (
    JwtAccessTokenDecoder,
)
from app.infrastructure.security.jwt_access_token_issuer import (
    JwtAccessTokenIssuer,
)


def test_jwt_access_token_decoder_returns_session_id_from_valid_token() -> None:
    issued_at = datetime.now(UTC)
    issuer = JwtAccessTokenIssuer(
        secret="super-secret-key",
        issuer="todo-list-backend",
        audience="todo-list-frontend",
        expires_in_seconds=900,
        now=lambda: issued_at,
    )
    decoder = JwtAccessTokenDecoder(
        secret="super-secret-key",
        issuer="todo-list-backend",
        audience="todo-list-frontend",
    )

    token = issuer.issue("user-123", "session-456")

    session_id = decoder.get_session_id(token)

    assert session_id == "session-456"


def test_jwt_access_token_decoder_returns_user_id_from_valid_token() -> None:
    issued_at = datetime.now(UTC)
    issuer = JwtAccessTokenIssuer(
        secret="super-secret-key",
        issuer="todo-list-backend",
        audience="todo-list-frontend",
        expires_in_seconds=900,
        now=lambda: issued_at,
    )
    decoder = JwtAccessTokenDecoder(
        secret="super-secret-key",
        issuer="todo-list-backend",
        audience="todo-list-frontend",
    )

    token = issuer.issue("user-123", "session-456")

    user_id = decoder.get_user_id(token)

    assert user_id == "user-123"


def test_jwt_access_token_decoder_raises_for_token_without_sid() -> None:
    issued_at = datetime.now(UTC)
    decoder = JwtAccessTokenDecoder(
        secret="super-secret-key",
        issuer="todo-list-backend",
        audience="todo-list-frontend",
    )
    token = jwt.encode(
        {
            "sub": "user-123",
            "iss": "todo-list-backend",
            "aud": "todo-list-frontend",
            "iat": int(issued_at.timestamp()),
            "exp": int(issued_at.timestamp()) + 900,
        },
        "super-secret-key",
        algorithm="HS256",
        headers={"typ": "JWT"},
    )

    with pytest.raises(ValueError, match="valid sid"):
        decoder.get_session_id(token)


def test_jwt_access_token_decoder_raises_for_token_without_sub() -> None:
    issued_at = datetime.now(UTC)
    decoder = JwtAccessTokenDecoder(
        secret="super-secret-key",
        issuer="todo-list-backend",
        audience="todo-list-frontend",
    )
    token = jwt.encode(
        {
            "sid": "session-456",
            "iss": "todo-list-backend",
            "aud": "todo-list-frontend",
            "iat": int(issued_at.timestamp()),
            "exp": int(issued_at.timestamp()) + 900,
        },
        "super-secret-key",
        algorithm="HS256",
        headers={"typ": "JWT"},
    )

    with pytest.raises(ValueError, match="valid sub"):
        decoder.get_user_id(token)
