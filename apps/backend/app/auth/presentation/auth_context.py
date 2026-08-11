from dataclasses import dataclass

import jwt
from rest_framework.exceptions import APIException

from app.auth.application.ports import AccessTokenDecoder
from app.container import build_container


@dataclass(slots=True, frozen=True)
class CurrentAuthContext:
    user_id: str
    session_id: str
    access_token: str


class UnauthorizedError(APIException):
    status_code = 401
    default_code = "authentication_failed"


def get_access_token_decoder() -> AccessTokenDecoder:
    return build_container().access_token_decoder


def resolve_current_auth_context(
    authorization_header: str | None,
    *,
    decoder: AccessTokenDecoder | None = None,
) -> CurrentAuthContext:
    if authorization_header is None or not authorization_header.strip():
        raise UnauthorizedError("user is not authenticated")

    scheme, _, token = authorization_header.partition(" ")
    if scheme != "Bearer" or not token:
        raise UnauthorizedError("invalid access token")

    token_decoder = decoder or get_access_token_decoder()

    try:
        return CurrentAuthContext(
            user_id=token_decoder.get_user_id(token),
            session_id=token_decoder.get_session_id(token),
            access_token=token,
        )
    except (ValueError, jwt.InvalidTokenError) as exc:
        raise UnauthorizedError("invalid access token") from exc
