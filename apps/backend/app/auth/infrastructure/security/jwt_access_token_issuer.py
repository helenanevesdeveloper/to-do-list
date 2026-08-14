from collections.abc import Callable
from dataclasses import dataclass, field
from datetime import UTC, datetime, timedelta

import jwt

from app.auth.application.contracts import AccessTokenIssuer


def _default_now() -> datetime:
    return datetime.now(UTC)


@dataclass(slots=True, frozen=True)
class JwtAccessTokenIssuer(AccessTokenIssuer):
    secret: str
    issuer: str
    audience: str
    expires_in_seconds: int
    now: Callable[[], datetime] = field(default=_default_now)

    def issue(self, subject: str, session_id: str) -> str:
        issued_at = self.now()
        expires_at = issued_at + timedelta(seconds=self.expires_in_seconds)

        payload = {
            "sub": subject,
            "sid": session_id,
            "iss": self.issuer,
            "aud": self.audience,
            "iat": int(issued_at.timestamp()),
            "exp": int(expires_at.timestamp()),
        }

        return jwt.encode(
            payload,
            self.secret,
            algorithm="HS256",
            headers={"typ": "JWT"},
        )
