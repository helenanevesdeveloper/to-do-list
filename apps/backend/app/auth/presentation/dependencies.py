"""Dependency resolution helpers for the auth presentation layer.

This module keeps API views decoupled from direct container wiring while still
allowing lightweight test overrides. In production, each getter resolves the
requested dependency from ``build_container()``. In tests, callers may register
an override by name so the view receives a fake use case or adapter instead of
the real implementation.
"""

from typing import Any

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

_OVERRIDES: dict[str, Any] = {}


def clear_dependency_overrides() -> None:
    """Remove all test-time dependency overrides."""

    _OVERRIDES.clear()


def set_dependency_override(name: str, value: Any) -> None:
    """Register a replacement dependency for tests.

    Args:
        name: Logical dependency name used by the corresponding getter.
        value: Concrete fake/stub instance, or a callable returning one.
    """

    _OVERRIDES[name] = value


def get_register_user_use_case() -> RegisterUserUseCase:
    """Resolve the register-user use case for the current request path."""

    return _resolve(
        "register_user_use_case",
        lambda: build_container().register_user_use_case,
    )


def get_authenticate_user_use_case() -> AuthenticateUserUseCase:
    """Resolve the authenticate-user use case for the current request path."""

    return _resolve(
        "authenticate_user_use_case",
        lambda: build_container().authenticate_user_use_case,
    )


def get_logout_use_case() -> LogoutUseCase:
    """Resolve the logout use case for the current request path."""

    return _resolve("logout_use_case", lambda: build_container().logout_use_case)


def get_access_token_decoder() -> AccessTokenDecoder:
    """Resolve the JWT access-token decoder used by authenticated endpoints."""

    return _resolve(
        "access_token_decoder",
        lambda: build_container().access_token_decoder,
    )


def get_user_repository() -> PostgresUserRepository:
    """Resolve the user repository used by JWT-backed DRF authentication."""

    return _resolve(
        "user_repository",
        lambda: build_container().user_repository,
    )


def _resolve(name: str, factory) -> Any:
    """Return a test override when present, otherwise build the real dependency."""

    if name not in _OVERRIDES:
        return factory()

    value = _OVERRIDES[name]
    return value() if callable(value) else value
