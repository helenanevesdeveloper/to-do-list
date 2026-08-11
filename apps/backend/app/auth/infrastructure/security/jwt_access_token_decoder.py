from dataclasses import dataclass

import jwt

from app.auth.application.ports.access_token_decoder import AccessTokenDecoder
from app.shared.validation import require_non_empty_string


@dataclass(slots=True, frozen=True)
class JwtAccessTokenDecoder(AccessTokenDecoder):
    secret: str
    issuer: str
    audience: str

    def get_user_id(self, token: str) -> str:
        payload = self._decode(token)
        user_id = payload.get("sub")
        return require_non_empty_string(
            user_id,
            field_name="sub",
            error_type=ValueError,
            message="token does not contain a valid sub",
        )

    def get_session_id(self, token: str) -> str:
        payload = self._decode(token)
        session_id = payload.get("sid")
        return require_non_empty_string(
            session_id,
            field_name="sid",
            error_type=ValueError,
            message="token does not contain a valid sid",
        )

    def _decode(self, token: str) -> dict[str, object]:
        return jwt.decode(
            token,
            self.secret,
            algorithms=["HS256"],
            issuer=self.issuer,
            audience=self.audience,
        )
