from dataclasses import dataclass

import jwt
from rest_framework.authentication import BaseAuthentication, get_authorization_header
from rest_framework.exceptions import AuthenticationFailed

from app.auth.application.contracts import AccessTokenDecoder
from app.auth.domain.entities import User
from app.auth.infrastructure.repositories.postgres_user_repository import (
    PostgresUserRepository,
)
from app.container import build_container


@dataclass(slots=True, frozen=True)
class JwtAuthContext:
    user_id: str
    session_id: str
    access_token: str


@dataclass(slots=True, frozen=True)
class AuthenticatedUser:
    domain_user: User

    @property
    def id(self) -> str:
        return self.domain_user.id

    @property
    def pk(self) -> str:
        return self.domain_user.id

    @property
    def email(self) -> str:
        return str(self.domain_user.email)

    @property
    def is_active(self) -> bool:
        return self.domain_user.is_active

    @property
    def is_authenticated(self) -> bool:
        return True

    @property
    def is_anonymous(self) -> bool:
        return False

    def __str__(self) -> str:
        return self.email


class JwtAuthentication(BaseAuthentication):
    keyword = "Bearer"

    def __init__(
        self,
        *,
        decoder: AccessTokenDecoder | None = None,
        user_repository: PostgresUserRepository | None = None,
    ) -> None:
        self._decoder = decoder
        self._user_repository = user_repository

    def authenticate(
        self,
        request,
    ) -> tuple[AuthenticatedUser, JwtAuthContext] | None:
        auth_header = get_authorization_header(request).split()
        if not auth_header:
            return None

        scheme = auth_header[0].decode("ascii", errors="ignore")
        if scheme.lower() != self.keyword.lower():
            return None

        if len(auth_header) != 2:
            raise AuthenticationFailed("invalid access token")

        token = auth_header[1].decode("utf-8")
        decoder = self._decoder or build_container().access_token_decoder

        try:
            user_id = decoder.get_user_id(token)
            session_id = decoder.get_session_id(token)
        except (ValueError, jwt.InvalidTokenError) as exc:
            raise AuthenticationFailed("invalid access token") from exc

        user_repository = self._user_repository or build_container().user_repository
        domain_user = user_repository.find_by_id(user_id)
        if domain_user is None:
            raise AuthenticationFailed("user is not authenticated")
        if not domain_user.is_active:
            raise AuthenticationFailed("user is inactive")

        return (
            AuthenticatedUser(domain_user=domain_user),
            JwtAuthContext(
                user_id=user_id,
                session_id=session_id,
                access_token=token,
            ),
        )

    def authenticate_header(self, request) -> str:
        return self.keyword
