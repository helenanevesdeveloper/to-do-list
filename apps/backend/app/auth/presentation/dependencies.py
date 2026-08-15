"""Dependency resolution helpers for the auth presentation layer."""

from app.auth.application.contracts import AccessTokenDecoder
from app.auth.application.use_cases import (
    AuthenticateUserUseCase,
    LogoutUseCase,
    RegisterUserUseCase,
)
from app.auth.infrastructure.repositories.postgres_user_repository import (
    PostgresUserRepository,
)
from app.container import build_container


def get_register_user_use_case() -> RegisterUserUseCase:
    """Resolve the register-user use case for the current request path."""

    return build_container().register_user_use_case


def get_authenticate_user_use_case() -> AuthenticateUserUseCase:
    """Resolve the authenticate-user use case for the current request path."""

    return build_container().authenticate_user_use_case


def get_logout_use_case() -> LogoutUseCase:
    """Resolve the logout use case for the current request path."""

    return build_container().logout_use_case


def get_access_token_decoder() -> AccessTokenDecoder:
    """Resolve the JWT access-token decoder used by authenticated endpoints."""

    return build_container().access_token_decoder


def get_user_repository() -> PostgresUserRepository:
    """Resolve the user repository used by JWT-backed DRF authentication."""

    return build_container().user_repository
