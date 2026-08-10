from dataclasses import dataclass

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.application.ports.access_token_decoder import AccessTokenDecoder
from app.container import build_container

bearer_auth = HTTPBearer(auto_error=False)


@dataclass(slots=True, frozen=True)
class CurrentAuthContext:
    user_id: str
    session_id: str
    access_token: str


def get_access_token_decoder() -> AccessTokenDecoder:
    return build_container().access_token_decoder


def get_current_auth_context(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_auth),
    decoder: AccessTokenDecoder = Depends(get_access_token_decoder),
) -> CurrentAuthContext:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="user is not authenticated",
        )

    try:
        return CurrentAuthContext(
            user_id=decoder.get_user_id(credentials.credentials),
            session_id=decoder.get_session_id(credentials.credentials),
            access_token=credentials.credentials,
        )
    except (ValueError, jwt.InvalidTokenError) as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="invalid access token",
        ) from exc
