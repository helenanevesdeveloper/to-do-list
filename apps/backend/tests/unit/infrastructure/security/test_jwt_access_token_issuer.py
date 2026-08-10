from datetime import UTC, datetime

import jwt

from app.infrastructure.security.jwt_access_token_issuer import (
    JwtAccessTokenIssuer,
)


def test_jwt_access_token_issuer_generates_hs256_token_with_expected_claims() -> None:
    issuer = JwtAccessTokenIssuer(
        secret="super-secret-key",
        issuer="dropbox-backend",
        audience="dropbox-frontend",
        expires_in_seconds=900,
        now=lambda: datetime(2026, 3, 24, 12, 0, tzinfo=UTC),
    )

    token = issuer.issue("user-123", "session-456")
    header = jwt.get_unverified_header(token)
    payload = jwt.decode(
        token,
        "super-secret-key",
        algorithms=["HS256"],
        issuer="dropbox-backend",
        audience="dropbox-frontend",
        options={"verify_exp": False},
    )

    assert header == {"alg": "HS256", "typ": "JWT"}
    assert payload == {
        "aud": "dropbox-frontend",
        "exp": 1774354500,
        "iat": 1774353600,
        "iss": "dropbox-backend",
        "sid": "session-456",
        "sub": "user-123",
    }
